<script>
import { getContext } from 'svelte';
const { getThreeContext } = getContext('getThreeContext');
const threeContext = getThreeContext();

export let position;
export let id;

const _id = `colorpoint:${id}`;

$: {
    if (!threeContext) {
        break $;
    }
    const old = threeContext.scene.getObjectByName(id);
    threeContext.scene.remove(old);

    const singlePointGeometry = new Geometry();
    singlePointGeometry.vertices.push(position)

    const {x,y,z} = position;
    const hexColor = `#${serialize8BitColor(x,y,z).toString(16)}`;

    const material = new PointsMaterial({
        size: 80.0,
        color: hexColor,  
    });
    const points = new Points(singlePointGeometry, material);
    threeContext.scene.add(points);
    threeContext.animate(position);
}
</script>