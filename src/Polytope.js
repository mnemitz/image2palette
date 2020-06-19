import {
    Color,
    Geometry,
    Mesh,
    MeshBasicMaterial,
    VertexColors,
    Vector3,
    Points,
    PointsMaterial,
    AxesHelper,
    LineSegments,
    LineBasicMaterial,
    BufferGeometry,
    Scene,
    Float32BufferAttribute,
} from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry';
import { colorTo256Vector3, vec3to256Color } from './util/util';
import { Graph } from './util/graph';

class ConvexColoredGeometry extends ConvexGeometry {
    /**
     * 
     * @param {Array<THREE.Color>} colors 
     */
    constructor(colors) {
        const vectors = colors.map(({ r, g, b }) => new Vector3(r,g,b));
        super(vectors);

        // give geometry it's center point property (by bounding sphere)
        this.computeBoundingSphere();

        // update face colors
        this.elementsNeedUpdate = true;
        this.colorsNeedUpdate = true;

        for (let face of this.faces) {
            const { a, b, c } = face;
            [a,b,c].forEach((vertexIndex, i) => {
                const { x, y, z } = this.vertices[vertexIndex];
                face.vertexColors[i] = new Color(`rgb(${[x,y,z]})`);
            });
        }
    }

    toGraph() {
        const graph = new Graph();
        const { faces, vertices: geomVertices } = this;
        const color = i => vec3to256Color(geomVertices[i]).getHex();
        
        const dist = (a,b) => geomVertices[a].distanceTo(geomVertices[b]);
        faces.forEach(({a,b,c}) => {
            graph.addEdge(color(a), color(b), dist(a,b));
            graph.addEdge(color(b), color(c), dist(b,c));
            graph.addEdge(color(a), color(c), dist(a,c));
        });
        return graph;
    }
}


export class ConvexColoredPolytope extends Mesh {
    /**
     * 
     * @param {Array<THREE.Color>} colors 
     */
    constructor(colors) {
        const geometry = new ConvexColoredGeometry(colors);
        const material = new MeshBasicMaterial({
            vertexColors: VertexColors,
            wireframe: true,
        });
        super(geometry, material);
        this.name = 'polytope'; // identifier for the scene
    }
    graph() {
        return this.geometry.toGraph();
    }
}


export class ColoredLineSegments extends LineSegments {
    /**
     * 
     * @param {Array<Array<number[2]>} pairs 
     */
    constructor(pairs, name) {
        const vertices = [], colors = [];

        for (const [src, tgt] of pairs) {
            colors.push(
                ...new Color(src).toArray(),
                ...new Color(tgt).toArray(),
            );
            vertices.push(
                ...colorTo256Vector3(src).toArray(),
                ...colorTo256Vector3(tgt).toArray(),
            );
        }

        const geometry = new BufferGeometry();
        geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) );

        const material = new LineBasicMaterial({ vertexColors: VertexColors });
        super(geometry, material);
        if (name) this.name = name;
    }
}
