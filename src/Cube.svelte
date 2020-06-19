<script>
// Test component for trying out the threejs interaction
import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
import { getContext } from 'svelte';

export let n;
export let color;
export let id;

const { getThreeContext } = getContext('getThreeContext');
const threeContext = getThreeContext();

const name = `cube:${id}`;

$: {
    const oldCube = threeContext.scene.getObjectByName(name);
    threeContext.scene.remove(oldCube);
    const geometry = new BoxGeometry(n,n,n);
    const material = new MeshBasicMaterial({color});
    const cube = new Mesh(geometry, material);
    cube.name = name;
    threeContext.scene.add(cube);
    threeContext.animate();
}
</script>