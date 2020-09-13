<script>
	import { Color, MeshBasicMaterial, Mesh, VertexColors } from 'three';
	import { getContext, onDestroy } from 'svelte';

	const { getThreeContext } = getContext('getThreeContext');
	const threeContext = getThreeContext();

	export let id;
	export let geometry;
	const name = `wireframe:${id}`;

	$: {
		const old = threeContext.scene.getObjectByName(name);
		threeContext.scene.remove(old);

		// mutate geometry without triggering svelte
		// TODO refactor this stuff to not rely on break statements
		if (!geometry) {
			break $;
		}
		const geom = geometry;
		geom.computeBoundingSphere();
		geom.elementsNeedUpdate = true;
		geom.colorsNeedUpdate = true;
		const material = new MeshBasicMaterial({
			vertexColors: VertexColors,
			wireframe: true,
		});
		const sceneObj = new Mesh(geom, material);
		sceneObj.name = name;

		for (let face of geom.faces) {
			const { a, b, c } = face;
			[a,b,c].forEach((vertexIndex, i) => {
				const { x, y, z } = geom.vertices[vertexIndex];
				face.vertexColors[i] = new Color(`rgb(${[x,y,z]})`);
			});
		}
		
		const {
			boundingSphere: { center, radius },
		} = geom;

		threeContext.scene.add(sceneObj);

		// TODO this stuff should not be run here
		threeContext.controls.target = center;
		threeContext.controls.rotationRadius = radius;
		threeContext.controls.minDistance = 5*radius;
		threeContext.controls.update();
		threeContext.animate();
	}

	onDestroy(() => {
		const old = threeContext.scene.getObjectByName(name);
		threeContext.scene.remove(old);
		threeContext.animate();
	});
</script>
