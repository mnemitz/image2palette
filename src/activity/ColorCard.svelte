<script>
	import { createEventDispatcher} from 'svelte';
	import Card, { PrimaryAction } from '@smui/card';
	import Checkbox from '@smui/checkbox';
	import { deserialize8BitColor } from '../util/color';
	import { padLeft } from '../util/util';

	const dispatch = createEventDispatcher();
	export let color;
	export let selected = false;

	const colorText = `#${padLeft(color.toString(16), 6)}`;
	// could probably acheive this without deserialization
	const {r,g,b} = deserialize8BitColor(color);
	const showLight = r <= 200 && g <= 200 && b <= 200;
</script>
<style>
#container {
	margin: 5px;
	max-height: 60px;
	height: 100%;
}
#container span {
	color: transparent;
	text-transform: uppercase;
	font-weight: bold;
	line-height: 40px;
	text-align: center;
}
#container:hover .light {
	color: white;
}
#container:hover .dark {
	color: black;
}
#content {
	height: 100%;
	display: grid;
	grid-template-columns: 25% 50% 25%;
}
</style>
<div
	id="container"
	on:mouseover={() => dispatch('mouseover')}
	class="checkbox-inverted"
>
	<Card style={`background-color: ${colorText}`}>
		<PrimaryAction ripple on:click={() => dispatch('change', !selected)}>
			<div id="content" class="mdc-typography--button">
				<Checkbox bind:checked={selected}/>
				<span class={`text ${showLight ? 'light' : 'dark'}`}>
					{colorText}
				</span>
			</div>
		</PrimaryAction>
	</Card>
</div>
