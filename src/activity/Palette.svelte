<script>
	import Paper, { Title } from '@smui/paper';
	import IconButton from '@smui/icon-button';
	import Platform from '../Platform.svelte';
	import PaletteColor from './PaletteColor.svelte';
	import Trash from './Trash.svelte';
	import {dndzone} from 'svelte-dnd-action';
	import copy from '../lib/copy';
	import {padLeft} from '../lib/util';
	import {deserialize8BitColor} from '../lib/color';
	import {toast} from '../store/KitchenStore';
	import {showUserError} from '../store/DialogStore';

	export let colors = [];

	// From here downward we represent colors in order more verbosely
	$: paletteColors = colors.map((color, index) => ({
			// id is just what we need to call it for the DnD, but really it's just index
			// TODO: enable the library feature that lets us call this something custom
			id: index, 
			color,
		}));

	let dragging = false;

	// Drag and drop stuff
	const flipDurationMs = 300;
	function handleConsider(e) {
		dragging = true;
		paletteColors = e.detail.items;
	}
	function handleDndFinalize(e) {
		dragging = false;
		colors = e.detail.items.map(({color}) => color);
	}


	async function copyColors() {
		try {
			await copy(...paletteColors.map(({color}) => `#${padLeft(color.toString(16), 6)}`));
			toast('Copied colors to clipboard!');
		} catch (errorFull) {
			showUserError({
				errorMessage: 'Error copying colors',
				errorFull,
			});
		}
	}

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
				<div>
					<IconButton class="material-icons" disabled={!colors.length} on:click={() => colors = []}>
						delete
					</IconButton>
				</div>
			</div>
		</div>
		<div
			class="palette-container"
			use:dndzone={{items: paletteColors, flipDurationMs, dropTargetStyle: {outline: 'none'}}}
			on:consider={handleConsider}
			on:finalize={handleDndFinalize}
		>
			{#each paletteColors as item (item.id)}
				<PaletteColor
					color={deserialize8BitColor(item.color)}
					on:remove={() => colors = colors.filter((_, index) => index !== item.id)}
				/>
			{/each}
		</div>
	</Paper>
	<Platform let:hasTouch>
		{#if hasTouch && dragging}
			<Trash/>
		{/if}
	</Platform>
</div>
