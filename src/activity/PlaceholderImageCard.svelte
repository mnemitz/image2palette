<script>
	import ImageCard from './ImageCard.svelte';
	import { getInputFile } from '../lib/inputImage';
</script>
<ImageCard src="example_images/placeholder.png" on:click={getInputFile}>
	<span>No image selected!</span>
</ImageCard>

