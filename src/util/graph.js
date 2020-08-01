import { filterIter, decrCompare } from './util';
import { UnionFind } from './unionfind';

export class Graph {
    /**
     * 
     * @param {THREE.Geometry} geometry 
     */
    constructor(iter) {
        this.adjList = new Map();
		if (!iter) {
			return;
		}
        for (const { v , w, weight } of iter) {
            this.addEdge(v, w, weight);
        }
    }
    addEdge(v, w, weight) {
        if (!this.adjList.get(v)) this.adjList.set(v, new Map());
        if (!this.adjList.get(w)) this.adjList.set(w, new Map());
        this.adjList.get(v).set(w, weight);
        this.adjList.get(w).set(v, weight);

        // set the min vertex value, for default representations
        const minVertex = Math.min(v,w);
        if (!this.minVertex || this.minVertex > minVertex) this.minVertex = minVertex;
    }
    adj(x) {
        if (!this.adjList.has(x)) throw new Error(`${x} is not a vertex in this graph`);
        return this.adjList.get(x);
    }
    *adjNodes(x) {
        for (let [target] of this.adj(x)) {
            yield target;
        }
    }
    degree(x) {
        return this.adj(x).size;
    }
    vertexCount() {
        return this.adjList.size;
    }
    vertices() {
        return this.adjList.keys();
    }
    verticesByDegree() {
        return Array.from(this.vertices())
            .sort((v1, v2) => decrCompare(this.degree(v1), this.degree(v2)));
    }
    *edges() {
        const { adjList } = this;
        for (let [src, adjSrc] of adjList) {
            for (let [tgt, weight] of adjSrc) {
                yield { src, tgt, weight };
            }
        }
    }
    edgesByWeight() {
        return Array.from(this.edges())
            .sort(({ weight: w0 }, { weight: w1 }) =>
                (w0 < w1) ? -1 :
                (w0 > w1) ? 1 :
                0
            )
            .filter((_, i) => i % 2 == 0); // remove duplicate edges since the graph is directed
    }
    /**
     * Use Kruskal's algorithm to compute the MST for the graph
     * Returns the result as a subgraph
     */
    MST() {
        const mst = new Graph();
        const subTrees = new UnionFind();

        for (const vertex of this.vertices()) {
            subTrees.add(vertex);
        }

        for (const { src, tgt , weight} of this.edgesByWeight()) {
            if (subTrees.connected(src, tgt)) {
                continue;
            }
            mst.addEdge(src , tgt,weight);
            subTrees.union(src, tgt);
        }
        return mst;
    }
    DFSTree(v=this.minVertex, visited=new Set(), parent=null) {
        if (!v) return new Map();
        if (visited.has(v)) throw new Error(`Graph contains cycle, vertex ${v} was visited twice`);
        visited.add(v);
        const level = new Map();

        // get all adjacent nodes besides immediate parent
        const children = filterIter(this.adjNodes(v), node => node != parent);
        const DFSTree = this.DFSTree.bind(this);

        // recursively get each child's descendant map
        // then merge them into a single map for this level
        const descendants = (function*(){
            for (let child of children) {
                yield* DFSTree(child, visited, v);
            }
        })()
        level.set(v, new Map(descendants));
        return level;
    }
    // vertex cover approximation (best known apparently)
    approxMinVertexCover() {
        const c = new Set();
        for (let { src, tgt } of this.edges()) {
            if (c.has(src) || c.has(tgt)) continue;
            c.add(src);
            c.add(tgt);
        }
        return c;
    }
}
