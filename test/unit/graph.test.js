import { Vector3, BoxGeometry } from 'three';
import { Graph } from '../../src/lib/graph';
import { mapDeepEqual } from '../../src/lib/util';
import { geometryGraphNodes } from '../../src/lib/geometry';

import { expect, assert } from 'chai';

describe('Graph', () => {
	describe('basic operations', () => {
		it('should add edges and compute vertex degrees accurately', () => {
			const graph = new Graph();
			graph.addEdge(1,2,6);
			graph.addEdge(2,3,6);
			graph.addEdge(3,1,6);

			expect(graph.degree(1)).to.eql(2);
			expect(graph.degree(2)).to.eql(2);
			expect(graph.degree(3)).to.eql(2);

			for (let v of [1,2,3]) {
				for (let [ target, weight ] of graph.adj(v)) {
					expect(weight).to.eql(6);
					switch(v) {
						case 1: expect(target).to.oneOf([2,3]); break;
						case 2: expect(target).to.oneOf([1,3]); break;
						case 3: expect(target).to.oneOf([1,2]); break;
					}
				}
			}
		});
		it('should iterate edges by weight', () => {
			const graph = new Graph();
			const edges = [
				[1,2,3],
				[2,3,4],
				[3,4,5],
				[3,5,2],
			];
			edges.forEach(([v,w,weight]) => graph.addEdge(v,w,weight));

			// ensure its sorted
			let lastWeight, count = 0;
			graph.edgesByWeight().forEach(({ weight }) => {
				if (!lastWeight) lastWeight = weight;
				assert(weight >= lastWeight);
				lastWeight = weight;
				count++;
			});
			expect(count).to.eql(4);
		});
	});
	describe('from geometry', () => {
		describe('single face', () => {
			const geometry = {
				vertices: [
					new Vector3(0,0,0),
					new Vector3(0,0,1),
					new Vector3(0,1,0),
				],
				faces: [ { a:2, b:0, c:1 } ],
			};
			const graph = new Graph(geometryGraphNodes(geometry));

			it('should have 3 vertices', () => {
				expect(graph.vertexCount()).to.eql(3);
			});

			it('should have each vertex connected to 2 others', () => {
				for (let v of graph.vertices()) {
					expect(graph.adj(v).size).to.eql(2);
				}
			});
		});
		describe('overlapping faces (cube)', () => {
			const cube = new BoxGeometry(1,1,1);
			cube.translate(0.5, 0.5, 0.5);
			const graph = new Graph(geometryGraphNodes(cube));

			it('should have 8 vertices', () => {
				expect(graph.vertexCount()).to.eql(8);
			});

		});
	});
	describe('DFS Tree', () => {
		describe('No cycles', () => {
			const graph = new Graph();
			graph.addEdge(1,2,1);
			graph.addEdge(2,3,1);
			graph.addEdge(2,4,1);
			graph.addEdge(3,5,1);

			describe('No argument', () => {
				it('should default to the minimum vertex value', () => {
					const noArgs = graph.DFSTree();
					const withArg = graph.DFSTree(1);
					assert(mapDeepEqual(noArgs, withArg));
				});
			});

			it('should create a nested map based on depth first search', () => {
				const tree = graph.DFSTree(1);
				expect(tree.get(1).size).to.eql(1);
				expect(Array.from(tree.get(1).keys())).to.eql([2]);
				expect(tree.get(1).get(2).size).to.eql(2);
			});
		});
		describe('With cycles', () => {
			it('should throw an error', () => {
				const graph = new Graph();
				graph.addEdge(1,2,1);
				graph.addEdge(2,3,1);
				graph.addEdge(2,4,1);
				graph.addEdge(3,1,1);

				expect(() => graph.DFSTree(1)).throws(`Graph contains cycle, vertex 1 was visited twice`);
				expect(() => graph.DFSTree(2)).throws(`Graph contains cycle, vertex 2 was visited twice`);
			});
		});
		describe('MST', () => {
			describe('empty graph', () => {
				it('should produce an empty graph MST', () => {
					const mst = new Graph().MST();
					expect(mst.vertexCount()).to.eql(0);
				});
			});
			describe('standard example', () => {
				// going by this example http://lcm.csa.iisc.ernet.in/dsa/node181.html
				const graph = new Graph();

				graph.addEdge(1,2,6);
				graph.addEdge(1,3,1);
				graph.addEdge(1,4,5);

				graph.addEdge(2,5,3);
				graph.addEdge(2,3,5);

				graph.addEdge(3,4,5);
				graph.addEdge(3,5,6);
				graph.addEdge(3,6,4);

				graph.addEdge(4,6,2);

				graph.addEdge(5,6,6);

				const mst = graph.MST();

				it('should generate an MST graph with the same number of vertices', () => {
					expect(mst.vertexCount()).to.eql(graph.vertexCount());
				});

				it('should be serializable to a tree (i.e. no cycles)', () => {
					mst.DFSTree(1); // should not throw error
				});

				it('should have the right edges', () => {
					expect(Array.from(mst.adj(1))).to.eql([[3,1]]);
					expect(Array.from(mst.adj(2))).to.eql([[5,3], [3,5]]);
					expect(Array.from(mst.adj(3))).to.eql([[1,1], [6,4], [2,5]]);
					expect(Array.from(mst.adj(4))).to.eql([[6,2]]);
					expect(Array.from(mst.adj(5))).to.eql([[2,3]]);
					expect(Array.from(mst.adj(6))).to.eql([[4,2], [3,4]]);
				});
			});
		});
	});
	describe('verticesByDegree', () => {
		it('should return an array of the graph\'s vertices sorted by degree', () => {
			const g = new Graph();
			// vertex 1, degree 3
			g.addEdge(1,2,1)
			g.addEdge(1,3,1)
			g.addEdge(1,4,1)

			// vertex 2, degree 5
			g.addEdge(2,3,1);
			g.addEdge(2,4,1);
			g.addEdge(2,5,1);
			g.addEdge(2,6,1);

			// vertex 3, degree 3
			g.addEdge(3,4,1);

			// vertex 4 degree 4
			g.addEdge(4,5,1);

			// vertex 5 degree 2
			// vertex 6 degree 1

			expect(g.degree(1)).to.eq(3);
			expect(g.degree(2)).to.eq(5);
			expect(g.degree(3)).to.eq(3);
			expect(g.degree(4)).to.eq(4);
			expect(g.degree(5)).to.eq(2);
			expect(g.degree(6)).to.eq(1);

			expect(g.verticesByDegree()).to.eql([2,4,1,3,5,6]);
		});
	});
});
