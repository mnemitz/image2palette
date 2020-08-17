<script>
	import PaletteColor from './PaletteColor.svelte';
	export let colors = [];
</script>
<style>
.palette-container {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
		padding: 5px;
}
</style>
<div class="palette-container">
    {#each colors as color}
			<PaletteColor color={color}/>
    {/each}
</div>
