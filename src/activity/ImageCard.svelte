<script>
	import Card, { Content, Media, PrimaryAction } from '@smui/card';
	export let src;
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>
<style>
	#card-container {
		width: 100%;
		height: 100%;
		display: inline-flex;
		justify-content: center;
		align-items: center;
	}
</style>
<div id="card-container">
	<Card style="width: 100%; height: 100%;">
		<PrimaryAction on:click={(e) => dispatch('click', e)}>
			<Media style={`background-image: url(${src});`} class="card-media-16x9" aspectRatio="16x9"/>
			<Content class="mdc-typography--body2">
				<slot></slot>
			</Content>
		</PrimaryAction>
	</Card>
</div>
