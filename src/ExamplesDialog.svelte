<Dialog bind:this={dialog} class="dialog">
	<Title>
		Examples
	</Title>
	<Content>
		<ImageList class="image-list" withTextProtection>
			{#each images as {filename, title}}
				<Item on:click={() => selectImage(filename)}>
					<ImageAspectContainer>
						<Image component={Div} style="background-image: url({filename})"/>
					</ImageAspectContainer>
						<Supporting>
							<Label>{title}</Label>
						</Supporting>
				</Item>
			{/each}
		</ImageList>
	</Content>
</Dialog>
<script>
	import {createEventDispatcher} from 'svelte';
	import Dialog, {Title, Content} from '@smui/dialog';
	import ImageList, {Item, ImageAspectContainer, Image, Supporting, Label} from '@smui/image-list';
	import Div from '@smui/common/Div.svelte';
	import './imagelist.scss';

	let dialog;

	const dispatch = createEventDispatcher();

	const images = [
		{
			filename: 'interior_colors.jpg',
			title: 'Colors in a room',
		},
		{
			filename: 'bouquet_white_background.jpg',
			title: 'A bouquet',
		},
		{
			filename: 'starry_night.jpg',
			title: 'Starry night',
		},
		{
			filename: 'chameleon.jpg',
			title: 'Chameleon friend',
		},
		{
			filename: 'colorful_bird.jpg',
			title: 'Bird say what?',
		},
		{
			filename: 'colorful_crayons.jpg',
			title: 'Vibrant colors',
		},
	]
	.map(({filename, title}) => ({
		filename: `example_images/${filename}`,
		title,
	}));

	export function open() {
		dialog.open();
	}

	function selectImage(filename) {
		dispatch('selectedImage', filename);
		dialog.close();
	}
</script>
