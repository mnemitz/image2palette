<script>
	import { onMount, setContext } from 'svelte';
	import { PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
	import { OrbitControls } from './three-examples/OrbitControls';

	export let cameraPosition = new Vector3(500, 500, 500);

	let canvasContainer;
	let canvas;
	let threeContext;

	onMount(() => {
		canvas.width = canvasContainer.clientWidth;
		canvas.height = canvasContainer.clientHeight;
		threeContext = new ThreeContext(canvas, cameraPosition)
	});

	setContext('getThreeContext', {
		getThreeContext: () => threeContext,
	});

	class ThreeContext {
		constructor(canvas, initialCameraPosition) {
			// Init renderer
			this.renderer = new WebGLRenderer({ canvas, antialias: true });

			// Init scene
			this.scene = new Scene();

			// Init camera
			const { x, y, z } = initialCameraPosition;
			const { width, height } = canvas;
			this.camera = new PerspectiveCamera(
					15,
					width / height,
					0.00001,
					1000,
			);
			this.camera.position.x = x;
			this.camera.position.y = y;
			this.camera.position.z = z;

			// Init orbit controls
			this.controls = new OrbitControls(this.camera, this.renderer.domElement);
			this.controls.enableZoom = true;
			this.controls.minDistance = 0.001;
			this.controls.maxDistance = Infinity;
			this.controls.maxPolarAngle = 2*Math.PI;
			this.controls.maxAzimuthAngle = 2*Math.PI;
			this.controls.update();
		}

		animate(nextCameraPosition = this.camera.position) {
			const transition = pan(this.camera.position, nextCameraPosition, 50);
			let lastFrame;
			(function loop() {
				lastFrame = requestAnimationFrame(loop.bind(this));
				const { value, done } = transition.next();
				if (done) {
					cancelAnimationFrame(lastFrame);
					return;
				}
				const { x, y, z } = value;
				this.camera.position.x = x;
				this.camera.position.y = y;
				this.camera.position.z = z;
				this.controls.update();
				this.renderer.render(this.scene, this.camera);
			}).bind(this)();
		}
	}

	function* pan({x:x0,y:y0,z:z0}, {x:x1,y:y1,z:z1}, steps=5) {
		const dx = (x1-x0) / steps;
		const dy = (y1-y0) / steps;
		const dz = (z1-z0) / steps;
		for (let i = 0; i < steps; i++) {
			x0 += dx;
			y0 += dy;
			z0 += dz;
			yield {
				x: x0,
				y: y0,
				z: z0,
			};
		}
	}
</script>
<style>
	#canvas-container {
		padding: 0;
		height: 100%;
		width: 100%;
	}
	canvas {
		height: 100%;
		width: 100%;
		border-radius: 4px;
	}
</style>
<div bind:this={canvasContainer} id="canvas-container">
	<canvas bind:this={canvas}/>
	{#if threeContext}
		<slot></slot>
	{/if}
</div>
