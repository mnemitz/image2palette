<script>
// three components
import ThreeScene from './three-components/ThreeScene.svelte';
import ColoredWireFrame from './three-components/ColoredWireFrame.svelte';
import AxesHelper from './three-components/AxesHelper.svelte';
import ColorPoint from './three-components/ColorPoint.svelte';

// DOM components
import Checkbox from '@smui/checkbox';
import FormField from '@smui/form-field';
import Card, { Content } from '@smui/card';
import ImageCard from './ImageCard.svelte';
import Spinner from 'svelte-spinner';
import ColorSelector from './ColorSelector.svelte';
import PaletteCard from './PaletteCard.svelte';

import { Color, Vector3 } from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';

import { filterIter } from './util/util'
import { Graph } from './util/graph';
import { serialize8BitColor, deserialize8BitColor } from './util/color';

export let inputImagePath;
let showAxes = false;
let showMST = false;

// THERE'S A LOT OF STATE HERE
// this should be broken up into more separate components that can dispatch events and such
let distinctColorsP;
let convexGeometryP;
let graphP;

let hoveredColor;
let selectedColors = [];

$: {
    if (!inputImagePath) {
        break $;
    }
    // create off-document img element
    // use it to draw to an off-document canvas,
    // discern the distinct colors etc.
    const img = new Image();
    img.src = inputImagePath;
    img && img.decode().then(() => onImageLoad(img));
}

function onImageLoad(img) {
    selectedColors = [];
    distinctColorsP = drawInputImageToCanvas(img).then(getDistinctColors);
    convexGeometryP = distinctColorsP.then(getConvexGeometry);
    graphP = convexGeometryP.then(getGraph)
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
    console.log('getting convex geom');
    const vectors = colors.map(({ r, g, b }) => new Vector3(r,g,b));
    return new ConvexGeometry(vectors);
}

function getGraph(geometry) {
    const { faces, vertices } = geometry;

    const color = i => {
        const {x,y,z} = vertices[i];
        return serialize8BitColor(x,y,z);
    };
    const dist = (a,b) => vertices[a].distanceTo(vertices[b]);
    return new Graph((function* () {
        for (const {a,b,c} of faces) {
            yield {
                v: color(a),
                w: color(b),
                weight: dist(a,b),
            };
            yield {
                v: color(b),
                w: color(c),
                weight: dist(b,c),
            };
            yield {
                v: color(a),
                w: color(c),
                weight: dist(a,c),
            };
        }
    })());
}
</script>
<style>
    #outer {
        display: grid;
        grid-template-columns: 33% 67%;
        grid-template-rows: 100%;
        height: 100%;
        max-height: 100%;
    }
    #left {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }
    #right {
        height: 100%;
        max-height: 100%;
        display: grid;
        grid-template-rows: 60% 40%;
    }
    #canvas-container {
        height: 40vh;
        margin: 10px;
    }

    .spinner-container {
        position: absolute;
        top: 10%;
        left: 10%;
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
    #image-card-container {
        margin: 10px;
    }
</style>
<div id="outer">
    <div id="left">
        <div id="canvas-container">
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
                {#await convexGeometryP}
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
                    id="hovered"
                    color={hoveredColor}
                />
            </ThreeScene>
        </div>
        <div class="image-container">
            {#if !inputImagePath}
                <p>No image selected!</p>
            {:else}
                <div id="image-card-container">
                    <ImageCard src={inputImagePath}>
                        <strong>Distinct colors: </strong>
                        {#await distinctColorsP}
                            ...
                        {:then distinctColors}
                            {#if distinctColors}
                                <span>
                                    {distinctColors.length}
                                </span>
                            {/if}
                        {/await}
                        <strong>Convex colors: </strong>
                        {#await graphP}
                            ...
                        {:then graph}
                            {#if graph}
                                <span>
                                    {graph.vertexCount()}
                                </span>
                            {/if}
                        {/await}
                    </ImageCard>
                </div>
            {/if}
        </div>
    </div>
    <div id="right">
        {#await graphP}
            <Spinner color="white"/>
        {:then graph}
            <ColorSelector
                colors={graph && Array.from(graph.vertices())}
                bind:selectedColors={selectedColors}
                on:hovered={({detail: color}) => hoveredColor = color}
            />
        {/await}
        <PaletteCard bind:colors={selectedColors}/>
    </div>
</div>