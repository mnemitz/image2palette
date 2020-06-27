<script>
import { getContext, onDestroy } from 'svelte';
import { Color, Geometry, Points, PointsMaterial, Vector3 } from 'three';
import { serialize8BitColor } from '../util/color';

const { getThreeContext } = getContext('getThreeContext');
const threeContext = getThreeContext();

export let r,g,b;
export let id;
const _id = `colorpoint:${id}`;

$: {
    if (!threeContext) {
        break $;
    }
    const old = threeContext.scene.getObjectByName(_id);
    threeContext.scene.remove(old);

    if (Number.isNaN(r + g + b)) {
        break $;
    }

    const singlePointGeometry = new Geometry();
    const position = new Vector3(r,g,b);
    singlePointGeometry.vertices.push(position)

    const material = new PointsMaterial({
        size: 80.0,
        color: new Color(serialize8BitColor(r,g,b)),  
    });
    const points = new Points(singlePointGeometry, material);
    points.name = _id;
    threeContext.scene.add(points);
    threeContext.animate(position);
}

onDestroy(() => {
    const old = threeContext.scene.getObjectByName(name);
    threeContext.scene.remove(old);
});
</script>