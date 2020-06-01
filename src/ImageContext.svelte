<script>
export let inputImagePath, showMST, showAxes;
import Polytope from './Polytope.svelte';
import { Color } from 'three';

let img;

let colors = []; // TODO calculating the colors could be async

function onImageLoad() {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    colors = getDistinctColors(canvas);
}

function* iterColors(canvas) {
    const { width, height } = canvas;
    const ctx = canvas.getContext('2d');
    const { data } = ctx.getImageData(0, 0, width, height);
    for (let i = 0; i < data.length; i += 4) {
        const [r,g,b,a] = [0,1,2,3].map(j => data[i+j]);
        yield new Color(r,g,b);
    }
}

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @returns {Set<THREE.Color>} A set of the canvas's color values
 */
function getDistinctColors(canvas) {
    const s = new Set();
    for (const color of iterColors(canvas)) {
        s.add(color);
    }
    return s;
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
</style>
<div id="outer">
    <div id="left">
        <div>
            <Polytope
                colors={colors}
                showAxes={showAxes}
                showMST={showMST}
            />
        </div>
        <div class="image-container">
            <img
                src={inputImagePath}
                alt={null}
                bind:this={img}
                on:load={onImageLoad}
            />
        </div>
    </div>
    <div id="right">
        <div>
            <p>Color list will go here</p>
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