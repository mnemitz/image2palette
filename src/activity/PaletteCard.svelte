<script>
	import Paper, { Title } from '@smui/paper';
	import IconButton from '@smui/icon-button';
	import Palette from './Palette.svelte';

	export let colors = [];
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
</style>
<div class="container">
	<Paper class="palette-card-paper">
		<div id="header">
			<div id="palette-title">
				<Title>Palette</Title>
			</div>
			<div id="button-container">
				<IconButton class="material-icons" on:click={() => colors = []}>
					delete
				</IconButton>
			</div>
		</div>
		<Palette bind:colors={colors}/>
	</Paper>
</div>
