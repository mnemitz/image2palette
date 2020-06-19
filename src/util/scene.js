import { colorTo256Vector3 } from './util';
import { Geometry, Points, PointsMaterial } from 'three';

export const hideSceneObject = (scene, objName) => {
    const obj = scene.getObjectByName(objName);
    if (obj) obj.visible = false;
}

export const showSceneObject = (scene, objName) => {
    const obj = scene.getObjectByName(objName);
    if (obj) obj.visible = true;
}

export const deleteSceneObject = (scene, objName) => {
    scene.remove(scene.getObjectByName(objName));
}

export function highlightVertex({ scene, color }) {
    if (!color) return;
    // create a single point geometry with massive point size
    const vertex = colorTo256Vector3(color);

    const singlePointGeometry = new Geometry();
    singlePointGeometry.vertices.push(vertex);

    const material = new PointsMaterial({
        size: 80.0,
        color: `#${color.getHexString()}`,
    });
    const points = new Points(singlePointGeometry, material);
    scene.remove(...scene.children.filter(c => c.type === 'Points'));
    scene.add(points);
    return vertex;
}