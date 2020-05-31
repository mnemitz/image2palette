<script>
    import { Color } from 'three';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let colors = [];
</script>
<style>
    #wrapper {
        border-radius: 3vh;
        margin: 1%;
        padding: 1%;
        background-image: linear-gradient(grey, #0f0f0f);
        border: 3px solid #0f0f0f;
        display: grid;
        height: 100%;
        grid-template-columns: repeat(6, 1fr);
        grid-auto-rows: 1fr;
    }
</style>
<div id="wrapper">
{#each colors as color}
    <ColorCell
        color={color}
        on:highlightcolor={ ({ detail: color }) => dispatch('highlightcolor', color) }
        on:select={ () => { dispatch('selectcolor', color.getHexString()) }}
    />
{/each}
</div>