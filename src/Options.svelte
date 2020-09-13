<script>
	import { Content } from '@smui/drawer';
	import List, { Item, Text } from '@smui/list';
	import IconButton from '@smui/icon-button';
	import ExamplesDialog from './dialogs/ExamplesDialog.svelte';
	import ConfigStore from './store/ConfigStore.js';

	let examplesDialog;
</script>
<script context="module">
	export function getInputFile() {
		const input = document.createElement('input');
		async function onchange() {
			const inputImagePath = await getImage(this.files[0])
			ConfigStore.update((store) => ({...store, inputImagePath}));
		}

		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.onchange = onchange.bind(input);
		input.click();
	}

	function getImage(file) {
		return new Promise((resolve, reject) => {
			const fr = new FileReader();
			fr.onload = (e) => resolve(e.target.result);
			fr.readAsDataURL(file);
			setTimeout(reject, 10000);
		});
	}
</script>
<Content>
	<List>
		<Item on:click={getInputFile}>
			<IconButton class="material-icons">
				add_photo_alternate
			</IconButton>
			<Text>Analyze image</Text>
		</Item>
		<Item on:click={examplesDialog.open}>
			<IconButton class="material-icons">
				view_module
			</IconButton>
			<Text>View examples</Text>
		</Item>
		<Item>
			<IconButton class="material-icons">
				help 
			</IconButton>
			<Text>About</Text>
		</Item>
	</List>
		<ExamplesDialog
			bind:this={examplesDialog}
			on:selectedImage={({detail: inputImagePath}) => ConfigStore.update((store) => ({...store, inputImagePath}))}
		/>
</Content>
