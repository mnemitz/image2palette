<script>
	import Paper, { Title } from '@smui/paper';
	import IconButton from '@smui/icon-button';
	import {dndzone} from 'svelte-dnd-action';
	import Snackbar, {Actions, Label} from '@smui/snackbar';
	import copy from '../util/copy';
	import {padLeft} from '../util/util';
	import {deserialize8BitColor} from '../util/color';

	export let colors = [];

	let toast;

	// From here downward we represent colors in order more verbosely
	let paletteColors = [];
	$: paletteColors = colors.map((color, index) => ({
		id: index,
		color,
	}));

	// Drag and drop stuff
	const flipDurationMs = 300;
	function handleConsider(e) {
		paletteColors = e.detail.items;
	}
	function handleDndFinalize(e) {
		console.log('items=', e.detail.items);
		colors = e.detail.items.map(({color}) => color);
	}

	async function copyColors() {
		await copy(...paletteColors.map(({color}) => `#${padLeft(color.toString(16), 6)}`));
		toast.open();
	}

	const backgroundColorText = (color) => `rgb(${[...Object.values(deserialize8BitColor(color))]})`;
</script>
<style>
	* :global(.palette-card-paper) {
		display: flex;
		flex-direction: column;
		padding: 0;
		height: 100%;
		width: 100%;
	}
	#header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	#button-container {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
	}
	#palette-title {
		padding: 5px;
	}
	.palette-container {
		display: flex;
		flex-direction: row;
		flex-grow: 1;
		padding: 5px;
	}
	.palette-color {
		flex-grow: 1;
		max-width: 100px;
	}

	.palette-color:active {
		z-index: 1;
	}

	.palette-color:first-child {
		border-radius: 10px 0px 0px 10px;
	}

	.palette-color:last-child {
		border-radius: 0px 10px 10px 0px;
	}
	.palette-color:only-child {
		border-radius: 10px;
	}
</style>
<div class="container">
	<Paper class="palette-card-paper">
		<div id="header">
			<div id="palette-title">
				<Title>Palette</Title>
			</div>
			<div id="button-container">
				<IconButton class="material-icons" disabled={!colors.length} on:click={copyColors}>
					content_copy
				</IconButton>
				<IconButton class="material-icons" disabled={!colors.length} on:click={() => colors = []}>
					delete
				</IconButton>
			</div>
		</div>
		<div class="palette-container" use:dndzone={{items: paletteColors, flipDurationMs}} on:consider={handleConsider} on:finalize={handleDndFinalize}>
			{#each paletteColors as item(item.id)}
				<div
					class="palette-color"
					style="background-color: {backgroundColorText(item.color)};"
				/>
			{/each}
		</div>
	</Paper>
	<Snackbar bind:this={toast}>
		<Label>Copied colors to clipboard!</Label>
		<Actions>
			<IconButton class="material-icons" title="Dismiss">close</IconButton>
		</Actions>
	</Snackbar>
</div>
