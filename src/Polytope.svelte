<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { AxesHelper, Geometry, Scene, LineSegments } from 'three';
    import { mapItr } from './util/util';
    import AppColor from './util/color';
    import {
        ConvexColoredPolytope,
        ColoredLineSegments,
    } from './Polytope';
    import View, { INITIAL_CAMERA_POSITION } from './util/view';
    import {
        highlightVertex,
        hideSceneObject,
        showSceneObject,
        deleteSceneObject,
    } from './util/scene';

    export let colors = [];
    export let highlightedColor;
    export let showAxes = false;
    export let showMST = false;
    const dispatch = createEventDispatcher();

    let canvas, view; // dom elements

    const scene = new Scene();
    const hide = hideSceneObject(scene);
    const show = showSceneObject(scene);

    const ready = new Promise((resolve, reject) => {
        onMount(() => {
            try {
                view = new View(canvas);
                resolve();
            }
            catch(e) {
                reject(e);
            }
        });
    });

    // On color change, draw the polytope
    $: ready.then(() => {
            if (colors.length < 3) return; // handle?
            scene.remove(scene.getObjectByName('polytope'));

            const polytope = new ConvexColoredPolytope(colors);
            scene.add(polytope);

            const graph = polytope.graph()
            dispatch('graph', graph);

            const mst = graph.MST();
            dispatch('mst', mst);

            scene.remove(scene.getObjectByName('MST'));
            const pairs = mapItr(mst.edges(), ({ src, tgt }) => [src, tgt]);
            scene.add(new ColoredLineSegments(pairs, 'MST'));

            const {
                boundingSphere: { center, radius },
            } = polytope.geometry;

            view.setOrbitTarget(center, radius);
            view.render(scene);
        })
        .catch(console.eror);

    // when a color is highlighted, highlight the vertex and move to view it
    $: ready.then(() => {
        const v = highlightVertex({ scene, color: highlightedColor });
        view.moveTo(v || INITIAL_CAMERA_POSITION);
        view.render(scene);
    })
    .catch(console.error);

    // show the axes on the canvas if enabled
    $: ready.then(() => {
        if (showAxes) {
            const axes = new AxesHelper(512);
            axes.name = 'axes';
            scene.add(axes);
        } else scene.remove(scene.getObjectByName('axes'));
        view.render(scene);
    })
    .catch(console.error);

    // show the MST instead of the full polytope
    $: ready.then(() => {
        if (showMST) hide('polytope')
        else show('polytope');
        view.render(scene);
    })
    .catch(console.error);
</script>
<canvas
    bind:this={canvas}
></canvas>