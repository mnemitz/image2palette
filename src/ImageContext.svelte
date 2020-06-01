<script>
export let inputImagePath, showMST, showAxes;
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
            <p>Canvas will go here</p>
        </div>
        <div class="image-container">
            <img
                src={inputImagePath}
                alt={null}
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