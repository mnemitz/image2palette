<script>
import { AxesHelper } from 'three';
import { getContext, onDestroy } from 'svelte';

export let magnitude = 100;
export let id;
const _id = `axeshelper:${id}`;

const { getThreeContext } = getContext('getThreeContext');
const threeContext = getThreeContext();

const axesHelper = new AxesHelper(magnitude);
axesHelper.name = _id;

const old = threeContext.scene.getObjectByName(_id);
old && threeContext.scene.remove(old)

threeContext.scene.add(axesHelper);
threeContext.animate();

onDestroy(() => {
    threeContext.scene.remove(axesHelper)
    threeContext.animate();
});
</script>