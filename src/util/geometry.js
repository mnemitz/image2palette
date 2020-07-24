import { serialize8BitColor } from './color';

export function* geometryGraphNodes(geometry) {
	const { vertices, faces } = geometry;
	const color = i => {
			const {x,y,z} = vertices[i];
			return serialize8BitColor(x,y,z);
	};
	const dist = (a,b) => vertices[a].distanceTo(vertices[b]);
	for (const {a,b,c} of faces) {
		yield {
				v: color(a),
				w: color(b),
				weight: dist(a,b),
		};
		yield {
				v: color(b),
				w: color(c),
				weight: dist(b,c),
		};
		yield {
				v: color(a),
				w: color(c),
				weight: dist(a,c),
		};
	}

}
