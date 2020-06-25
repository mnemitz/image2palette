<script>
import ThreeScene from './ThreeScene.svelte';
import ColorSelector from './ColorSelector.svelte';
import { Color, Vector3 } from 'three';
import Spinner from 'svelte-spinner';
import ColoredWireFrame from './ColoredWireFrame.svelte';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { Graph } from './util/graph';
import { serialize8BitColor, deserialize8BitColor } from './util/color';
import Checkbox from '@smui/checkbox';
import FormField from '@smui/form-field';
import AxesHelper from './AxesHelper.svelte';

export let inputImagePath;
let showAxes = false;
let showMST = false;

let distinctColors;
let convexGeometry;
let graph;

function onImageLoad({target: img}) {
    distinctColors = drawInputImageToCanvas(img).then(getDistinctColors);
    convexGeometry = distinctColors.then(getConvexGeometry);
    // graph = convexGeometry.then(getGraph)
}

function drawInputImageToCanvas(img) {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        // Breathing room for the image to render first
        // How to break this up to avoid this lock?
        setTimeout(() => resolve(canvas), 1000);
    });
}
/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @returns {Promise<Array<THREE.Color>>} A set of the canvas's color values
 */
function getDistinctColors(canvas) {
    return new Promise(resolve => {
        const s = new Set();
        const { width, height } = canvas;
        const ctx = canvas.getContext('2d');
        const { data } = ctx.getImageData(0, 0, width, height);
        for (let i = 0; i < data.length; i += 4) {
            const [r,g,b,a] = [0,1,2,3].map(j => data[i+j]);
            s.add(serialize8BitColor(r,g,b));
        }
        resolve(Array.from(s, deserialize8BitColor));
    });
}

/**
 * 
 * @param {Array<THREE.Color>} canvas 
 * @returns {THREE.Geometry}
 */
function getConvexGeometry(colors) {
    const vectors = colors.map(({ r, g, b }) => new Vector3(r,g,b));
    return new ConvexGeometry(vectors);
}

function getGraph(geometry) {
    const g = new Graph();
    const { faces, vertices } = geometry;

    const color = i => {
        const {x,y,z} = vertices[i];
        return serialize8BitColor(x,y,z);
    };
    const dist = (a,b) => vertices[a].distanceTo(vertices[b]);

    faces.forEach(({a,b,c}) => {
        g.addEdge(color(a), color(b), dist(a,b));
        g.addEdge(color(b), color(c), dist(b,c));
        g.addEdge(color(a), color(c), dist(a,c));
    });
    return g;
}

// TODO better name
function threeSetupTeardown(element) {
    console.log(element);
    return {
        destroy() {
            console.log('destroyed!');
        }
    };
}
</script>
<style>
    #outer {
        display: grid;
        grid-template-columns: 50% 50%;
        background-color: darkgrey;
        height: 100%;
    }
    #left {
        display: grid;
        grid-template-rows: 50% 50%;
        height: 100%;
    }

    img {
        height: 100%;
        width: 100%;
    }

    .image-container {
        padding: 10px;
    }
    #input-img {
        max-width: 75%;
        max-height: 75%;
        width: auto;
        height: auto;
    }

    .spinner-container {
        position: absolute;
        top: 20%;
        left: 20%;
        display: flex;
        justify-content: center;
        align-items: center;
        pointer-events: none;
    }
    .floaty {
        padding: 5px;
        position: absolute;
        /* TODO: use material theme here */
        background-color: rgba(255,255,255,0.7);
    }
</style>
<div id="outer">
    <div id="left">
        <div class="canvas-container">
            <div class="floaty">
                <FormField>
                    <Checkbox bind:checked={showAxes}/>
                    <span slot="label">Show axes</span>
                </FormField>
                <FormField>
                    <Checkbox bind:checked={showMST}/>
                    <span slot="label">Show MST</span>
                </FormField>
            </div>
            <ThreeScene>
                {#if showAxes}
                    <AxesHelper magnitude={512}/>
                {/if}
                {#await convexGeometry}
                    <div class="spinner-container">
                        <Spinner
                            thickness={3}
                            color="white"
                            size={150}
                        />
                    </div>
                {:then geometry}
                    <ColoredWireFrame
                        geometry={geometry}
                    />
                {/await}
            </ThreeScene>
        </div>
        <div class="image-container">
            {#if !inputImagePath}
                <p>No image selected!</p>
            {:else}
                <img
                    id="input-img"
                    src={inputImagePath}
                    alt={null}
                    on:load={onImageLoad}
                />
            {/if}
        </div>
    </div>
</div>