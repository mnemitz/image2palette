<script>
export let inputImagePath, showMST, showAxes;
import ThreeScene from './ThreeScene.svelte';
import ColorSelector from './ColorSelector.svelte';
import { Color } from 'three';
import Spinner from 'svelte-spinner';
import Cube from './Cube.svelte';

let distinctColors;
let graph;

function onImageLoad({target: img}) {
    distinctColors = drawInputImageToCanvas(img)
        .then(canvas => getDistinctColors(canvas))
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

function serialize8BitColor(r,g,b) {
    return (r << 16) + (g << 8) + b;
}

function deserialize8BitColor(c) {
    const [r,g,b] = [
        (c & 0xff0000) >> 16,
        (c & 0x00ff00) >> 8,
        (c & 0x0000ff),
    ];
    return { r, g, b };
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
 * @returns {Promise<Graph>} A set of the canvas's color values
 */
function getConvexGraph() {
    // TODO
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
    }

    img {
        height: 100%;
        width: 100%;
    }

    .image-container {
        padding: 10px;
    }

    /* .spinner-container {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    } */
    /* #color-selectors-container {
        display: grid;
        grid-template-columns: 20% 20% 20% 20% 20%;
        overflow: scroll;
    } */
</style>
<div id="outer">
    <div id="left">
        <!-- <div class="image-container">
            {#await distinctColors}
                <div class="spinner-container">
                    <Spinner/>
                </div>
            {:then colors}
                <Polytope
                    colors={colors}
                    showAxes={showAxes}
                    showMST={showMST}
                    on:graph={(g) => graph = g}
                />
            {/await}
        </div> -->
        <div>
            <ThreeScene>
                <Cube/>
            </ThreeScene>
        </div>
        <div class="image-container">
            {#if !inputImagePath}
                <p>No image selected!</p>
            {:else}
            <img
                src={inputImagePath}
                alt={null}
                on:load={onImageLoad}
            />
            {/if}
        </div>
    </div>
        <!-- <div class="polytope-container">
            <Polytope
                colors={getDistinctColors(colorsToImagePixel)}
                highlightedColor={highlightedColor}
                showAxes={showAxes}
                showMST={showMST}
                on:graph={ ({ detail: graph }) => vertexColorGraph = graph }
            />
        </div> -->
</div>