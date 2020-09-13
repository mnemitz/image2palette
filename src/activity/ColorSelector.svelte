<script>
	import {createEventDispatcher} from 'svelte';
	import ColorCard from './ColorCard.svelte';
	import '../styles/colorselector.scss';

	export let colors = [];
	export let selectedColors = [];
	const dispatch = createEventDispatcher();

	function handleSelection(selected, color) {
			if (selected) {
					selectedColors = [...selectedColors, color];
			} else {
					selectedColors = selectedColors.filter(el => el !== color);
			}
	}
</script>
<div class="color-card-container">
	{#each colors as color}
		<ColorCard
			color={color}
			on:mouseover={() => dispatch('hovered', color)}
			on:change={({detail: selected}) => handleSelection(selected, color)}
			selected={selectedColors.indexOf(color) >= 0}
		/>
	{/each}
</div>
