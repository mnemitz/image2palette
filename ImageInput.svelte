<script>
    import {
        createEventDispatcher,
        onMount,
    } from 'svelte';
    import AppColor from './util/color';
    import { DEFAULT_IMG_SRC, getImage, drawImage, getColorGrid } from './ImageInput';

    export let imgSrc = DEFAULT_IMG_SRC;

    let img;
    const dispatch = createEventDispatcher();

    $: img && (() => {
        img.src = imgSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            dispatch('colors', getColorGrid(canvas));
        }
    })();

</script>
<style>
    .container {
        width: 20vw;
    }
    img {
        max-width: 100%;
        height: auto;
    }
    input {
        display: none;
    }
    #selectfile > label > i:hover {
        color: #fefefe;
    }
</style>
<div class="container">
    <input
        id="inputimg"
        type="file"
        accept="image/*"
        on:change={() => getImage(this.files[0])
            .then(result => dispatch('imgsrc', result))
            .catch(console.error)
        }
    >
    <img
        bind:this={img}
        alt={null}
    />
    <div id="selectfile">
        <label for="inputimg">
            <i>Select a file</i>
        </label>
    </div>
</div>