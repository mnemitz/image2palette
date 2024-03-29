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

	import { Graph } from '../lib/graph';
	import { geometryGraphNodes } from '../lib/geometry';
	import { serialize8BitColor, deserialize8BitColor } from '../lib/color';

	import '../styles/activity.scss';
	import PlaceholderImageCard from './PlaceholderImageCard.svelte';

	import ConfigStore from '../store/ConfigStore';
	import {showUserError} from '../store/DialogStore';

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
			.catch((errorFull) => showUserError({
				errorMessage: 'Error decoding image',
				errorFull,
			}))
	}
	async function onImageLoad(img) {
		selectedColors = [];
		distinctColorsP = drawInputImageToCanvas(img)
			.then(getDistinctColors)
			.catch((errorFull) => {
				showUserError({
					errorMessage: 'Error loading image',
					errorFull,
				})
			});
		convexGeometryP = distinctColorsP.then(getConvexGeometry);
		graphP = convexGeometryP
			.then((geometry) => new Graph(geometryGraphNodes(geometry)))
			.catch((errorFull) => {
				showUserError({
					errorMessage: 'Error creating geometry',
					errorFull,
				})
			});
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
</style>
<div class="activity">
	<div>
		<div class="container">
			{#if !inputImagePath}
				<PlaceholderImageCard/>
			{:else}
				<div id="image-card-container">
					<ImageCard src={inputImagePath}>
						<strong>Distinct&nbsp;colors: </strong>
						{#await distinctColorsP}
							...
						{:then distinctColors}
							{#if distinctColors}
								<span>
									{distinctColors.length}
								</span>
							{/if}
						{/await}
						<strong>Convex&nbsp;colors: </strong>
						{#await graphP}
							...
						{:then graph}
							{#if graph}
								<span>
									{graph.vertexCount()}
								</span>
							{/if}
						{/await}
					</ImageCard>
				</div>
			{/if}
		</div>
		<div class="container flexgrow">
			<ThreeScene>
				{#if showAxes}
					<AxesHelper magnitude={512}/>
				{/if}
				{#await convexGeometryP}
					<div class="spinner-container">
						<Spinner
							thickness={3}
							color="white"
							size={150}
						/>
					</div>
				{:then geometry}
					<ColoredWireFrame
						geometry={geometry}
					/>
				{/await}
				<ColorPoint
					id="hovered"
					color={hoveredColor}
				/>
			</ThreeScene>
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
		<Palette bind:colors={selectedColors}/>
	</div>
</div>

