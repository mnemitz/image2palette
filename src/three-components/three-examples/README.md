# Extra Three JS modules (from examples)

*TL;DR Including these ThreeJS things in source keeps the bundle size down*

Ordinarily, the modules here would be imported directly from `three/examples/jsm`. However, Three JS does not appear to be set up internally in a way that allows for easy tree-shaking. The modules in `three/examples/jsm` virtually all import Three JS like so:

```js
	import {Vector3} from '../../build/three.module';

// or worse...

	import * as THREE from 'three';
```
Both these declarations bring the entire module into the bundle because it is a namespaced library, so the individual imports cannot be separated feasibly with conventional tree shaking.

The current (hopefully temporary) solution is to simply include the `OrbitControls` and `ConvexGeometry` modules here, adjusting them to use the aliased `'three'` dependency, thus avoiding bringing in the whole bundle.
