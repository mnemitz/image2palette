<script>
	import PaletteColor from './PaletteColor.svelte';
	export let colors = [];
</script>
<style>
.palette-container {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
}
</style>
<div class="palette-container">
    {#each colors as color}
        <!-- <div class="palette-color" style={backgroundColor(color)}/> -->
        <PaletteColor color={color}/>
    {/each}
</div>
