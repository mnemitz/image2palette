<script>
// three components
import ThreeScene from './three-components/ThreeScene.svelte';
import ColoredWireFrame from './three-components/ColoredWireFrame.svelte';
import AxesHelper from './three-components/AxesHelper.svelte';
import ColorPoint from './three-components/ColorPoint.svelte';

// DOM components
import Checkbox from '@smui/checkbox';
import FormField from '@smui/form-field';
import Spinner from 'svelte-spinner';
import ColorCard from './ColorCard.svelte';

import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { Graph } from './util/graph';
import { serialize8BitColor, deserialize8BitColor } from './util/color';
import { Color, Vector3 } from 'three';

export let inputImagePath;
let showAxes = false;
let showMST = false;

// THERE'S A LOT OF STATE HERE
// this should be broken up into more separate components that can dispatch events and such
let distinctColors;
let convexGeometry;
let graph;
let selectedColor;

function onImageLoad({target: img}) {
    distinctColors = drawInputImageToCanvas(img).then(getDistinctColors);
    convexGeometry = distinctColors.then(getConvexGeometry);
    graph = convexGeometry.then(getGraph)
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
</script>
<style>
    #outer {
        display: grid;
        grid-template-columns: 50% 50%;
        grid-template-rows: 100%;
        background-color: darkgrey;
        height: 100%;
        max-height: 100%;
    }
    #left {
        display: grid;
        grid-template-rows: 50% 50%;
        height: 100%;
        max-height: 100%;
    }
    #right {
        height: 100%;
        max-height: 100%;
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
        background-color: rgba(255,255,255,0.7);
    }
    #color-selector-container {
        display: grid;
        grid-template-columns: 25% 25% 25% 25%;
        height: 100%;
        overflow-x: hidden;
        overflow-y: scroll;
        /* TODO get some padding within the scroller */
    }
</style>
<div id="outer">
    <div id="left">
        <div class="canvas-container">
            <div class="floaty mdc-typography--body2">
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
                <ColorPoint
                    id="selected"
                    {...selectedColor}
                />
            </ThreeScene>
        </div>
        <div class="image-container">
            {#if !inputImagePath}
                <p>No image selected!</p>
            {:else}
            <!-- TODO add image info section here somewhere -->
                <img
                    id="input-img"
                    src={inputImagePath}
                    alt={null}
                    on:load={onImageLoad}
                />
            {/if}
        </div>
    </div>
    <div id="right">
        <div id="color-selector-container">
            {#await graph}
                <Spinner color="white"/>
            {:then _graph}
                {#if graph}
                    {#each Array.from(_graph.vertices(), deserialize8BitColor) as {r,g,b}}
                        <ColorCard
                            {...{r,g,b}}
                            on:mouseover={() => selectedColor = {r,g,b}}
                        />
                    {/each}
                {/if}
            {/await}
        </div>
    </div>
</div>