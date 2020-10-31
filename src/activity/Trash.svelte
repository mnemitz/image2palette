<script>
	import '../styles/trash.scss';
	import {fly} from 'svelte/transition';
	import {dndzone} from 'svelte-dnd-action';
	import {deserialize8BitColor, isDark} from '../util/color';
	let trashItems = [];
	$: color = (trashItems[0] && trashItems[0].color)
		? deserialize8BitColor(trashItems[0].color)
		: {r: 128, g: 128, b: 128}

	$: backgroundColorStyle = `background-color: rgb(${[color.r, color.g, color.b]});`;
	$: showLightIcon = isDark(color);

	function handleTrashConsider(e) {
		console.log(e);
		if (navigator.vibrate) {
			navigator.vibrate(20);
		}
		trashItems = e.detail.items;
	}
	function handleTrashFinalize(e) {
		if (navigator.vibrate && e.detail.items.length) {
			// only vibrate if we're actually deleting a color
			navigator.vibrate(15);
		}
		trashItems = [];
	}
</script>
<style>
	#trash-container {
		position: absolute;
		top: 0px;
		right: 0px;
		height: 50%;
		width: 50%;
	}
	#trash-indicator {
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: center;
		top: 0px;
		right: 0px;
		width: 75%;
		height: 75%;
	}
	.inverted {
		filter: invert(100%);
		-webkit-filter: invert(100%);
	}
	#trash-indicator-icon {
		background: url('assets/mdi-delete.svg') no-repeat center center / contain;
		height: 50px;
		width: 100%;
	}
	#trash-indicator-text {
		text-align: center;
	}
	#trash {
		height: 100%;
		width: 100%;
		box-shadow: 10px 10px 10px #444444;
		border-bottom-left-radius: 100%;
	}
</style>
<div id="trash-container" transition:fly={{x: 200, duration: 200}}>
	<div id="trash-indicator" class={showLightIcon ? 'inverted' : ''}>
		<div id="trash-indicator-icon"/>
		<div id="trash-indicator-text" class="mdc-typography--subtitle1">{!trashItems.length ? 'Drag here to delete' : 'Got it!'}</div>
	</div>
	<div
		id="trash"
		use:dndzone={{items: trashItems}}
		on:consider={handleTrashConsider}
		on:finalize={handleTrashFinalize}
		style={backgroundColorStyle}
	>
		{#each trashItems as item (item.id)}
			<div>{item.id}</div>
		{/each}
	</div>
</div>