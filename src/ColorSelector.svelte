<script>
import {createEventDispatcher} from 'svelte';
import ColorCard from './ColorCard.svelte';
import {deserialize8BitColor} from './util/color';

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
<style>
.container {
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
    overflow-x: hidden;
    overflow-y: scroll;
}
</style>
<div class="container">
    {#each colors as color}
        <ColorCard
            color={color}
            on:mouseover={() => dispatch('hovered', color)}
            on:change={({detail: selected}) => handleSelection(selected, color)}
            selected={selectedColors.indexOf(color) >= 0}
        />
    {/each}
</div>