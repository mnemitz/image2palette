// Tree shaking for ThreeJS is annoyingly complicated
// Decided to just make this module to export only what we need

export { WebGLRenderer } from '../node_modules/three/src/renderers/WebGLRenderer.js';


export { Scene } from '../node_modules/three/src/scenes/Scene.js';

export { PerspectiveCamera } from '../node_modules/three/src/cameras/PerspectiveCamera.js';

export { Vector2 } from '../node_modules/three/src/math/Vector2.js';

export { Vector3 } from '../node_modules/three/src/math/Vector3.js';

export { Line3 } from '../node_modules/three/src/math/Line3.js';

export { Plane } from '../node_modules/three/src/math/Plane.js';

export { Triangle } from '../node_modules/three/src/math/Triangle.js';

export { Geometry } from '../node_modules/three/src/core/Geometry.js';

export { BufferGeometry } from '../node_modules/three/src/core/BufferGeometry.js';

export { Float32BufferAttribute } from '../node_modules/three/src/core/BufferAttribute';

export { MOUSE, TOUCH } from '../node_modules/three/src/constants';

export { Quaternion } from '../node_modules/three/src/math/Quaternion.js';

export { Spherical } from '../node_modules/three/src/math/Spherical.js';

export { EventDispatcher } from '../node_modules/three/src/core/EventDispatcher.js';

export { MeshBasicMaterial } from '../node_modules/three/src/materials/MeshBasicMaterial';

export { Mesh } from '../node_modules/three/src/objects/Mesh.js';

// This is brought in from legacy, don't want to risk loading the whole module
export const VertexColors = 2;

export { Color } from '../node_modules/three/src/math/Color.js';

export { AxesHelper } from '../node_modules/three/src/helpers/AxesHelper.js';

export { PointsMaterial } from '../node_modules/three/src/materials/PointsMaterial'

export { Points } from '../node_modules/three/src/objects/Points.js';
