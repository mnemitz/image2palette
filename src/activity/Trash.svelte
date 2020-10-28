<script>
	import {dndzone} from 'svelte-dnd-action';
	import {deserialize8BitColor} from '../util/color';
	let trashItems = [];

	function backgroundColor({color} = {}) {
		if (!color) {
			return `background-color: grey;`;
		}
		const {r,g,b} = deserialize8BitColor(color);
		return `background-color: rgb(${[r,g,b]});`;
	}

	function handleTrashConsider(e) {
		console.log(e);
		if (navigator.vibrate) {
			navigator.vibrate(500);
		}
		trashItems = e.detail.items;
	}
	function handleTrashFinalize() {
		if (navigator.vibrate) {
			navigator.vibrate(200);
		}
		trashItems = [];
	}
</script>
<style>
	#trash {
		position: absolute;
		top: 0px;
		right: 0px;
		height: 50%;
		width: 50%;
		box-shadow: 10px 10px 10px #444444;
		border-bottom-left-radius: 100%;
	}
</style>
<div
	id="trash"
	use:dndzone={{items: trashItems}}
	on:consider={handleTrashConsider}
	on:finalize={handleTrashFinalize}
	style={backgroundColor(trashItems[0])}
>
	{#each trashItems as item (item.id)}
		<p>{item.id}</p>
	{/each}
</div>
