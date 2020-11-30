<script>
	// three components
	import ThreeScene from '../three-components/ThreeScene.svelte';
	import ColoredWireFrame from '../three-components/ColoredWireFrame.svelte';
	import AxesHelper from '../three-components/AxesHelper.svelte';
	import ColorPoint from '../three-components/ColorPoint.svelte';

	// DOM components
	import ImageCard from './ImageCard.svelte';
	import Spinner from 'svelte-spinner';
	import ColorSelector from './ColorSelector.svelte';
	import Palette from './Palette.svelte';

	import { Vector3 } from 'three';
	import { ConvexGeometry } from 'three-examples';

	import { Graph } from '../util/graph';
	import { geometryGraphNodes } from '../util/geometry';
	import { serialize8BitColor, deserialize8BitColor } from '../util/color';

	import '../styles/activity.scss';
	import PlaceholderImageCard from './PlaceholderImageCard.svelte';

	import ConfigStore from '../store/ConfigStore.js';

	let inputImagePath, showAxes;

	ConfigStore.subscribe((config) => {
		inputImagePath = config.inputImagePath;
		showAxes = config.showAxes;
	});

	let distinctColorsP;
	let convexGeometryP;
	let graphP;

	let hoveredColor;
	let selectedColors = [];

	$: {
		if (!inputImagePath) {
			break $;
		}
		// create off-document img element
		// use it to draw to an off-document canvas,
		// discern the distinct colors etc.
		const img = new Image();
		img.src = inputImagePath;

		img && img.decode()
			.then(() => onImageLoad(img))
			.catch((err) => {
				console.error('error decoding image', err);
			})
	}

	function onImageLoad(img) {
		selectedColors = [];
		distinctColorsP = drawInputImageToCanvas(img).then(getDistinctColors);
		convexGeometryP = distinctColorsP.then(getConvexGeometry);
		graphP = convexGeometryP.then((geometry) => new Graph(geometryGraphNodes(geometry)))
	}

	function drawInputImageToCanvas(img) {
		return new Promise((resolve) => {
			const canvas = document.createElement('canvas');
			canvas.width = img.naturalWidth;
			canvas.height = img.naturalHeight;
			const ctx = canvas.getContext('2d');
			ctx.drawImage(img, 0, 0);
			// Breathing room for the image to render first
			// How to break this up to avoid this lock?
			setTimeout(() => resolve(canvas), 1000);
		});
	}
	/**
	 * 
	 * @param {HTMLCanvasElement} canvas 
	 * @returns {Promise<Array<THREE.Color>>} A set of the canvas's color values
	 */
	function getDistinctColors(canvas) {
		return new Promise(resolve => {
			const s = new Set();
			const { width, height } = canvas;
			const ctx = canvas.getContext('2d');
			const { data } = ctx.getImageData(0, 0, width, height);
			for (let i = 0; i < data.length; i += 4) {
				const [r,g,b] = [0,1,2].map(j => data[i+j]);
				s.add(serialize8BitColor(r,g,b));
			}
			resolve(Array.from(s, deserialize8BitColor));
		});
	}

	/**
	 * 
	 * @param {Array<THREE.Color>} canvas 
	 * @returns {THREE.Geometry}
	 */
	function getConvexGeometry(colors) {
			const vectors = colors.map(({ r, g, b }) => new Vector3(r,g,b));
			return new ConvexGeometry(vectors);
	}
</script>
<style>
	.spinner-container {
		position: absolute;
		top: 10%;
		left: 10%;
		display: flex;
		justify-content: center;
		align-items: center;
		pointer-events: none;
	}
	#image-card-container {
		height: 100%;
	}
	.red {
		background-color: red;
		width: 150px;
		height: 100px;
	}
	.blue {
		background-color: blue;
		height: 100%;
	}
</style>
<div class="activity">
	<div>
		<div class="container">
			<div class="red"/>
		</div>
		<div class="container flexgrow">
			<div class="blue"/>
		</div>
	</div>
	<div>
		{#await graphP}
			<Spinner color="white"/>
		{:then graph}
			<ColorSelector
				colors={graph && Array.from(graph.vertices())}
				bind:selectedColors={selectedColors}
				on:hovered={({detail: color}) => hoveredColor = color}
			/>
		{/await}
		<div class="blue"/>
	</div>
</div>

