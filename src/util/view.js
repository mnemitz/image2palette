import {
    PerspectiveCamera,
    Vector3,
    WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three-orbitcontrols-ts';

export const INITIAL_CAMERA_POSITION = new Vector3(500, 500, 500);

const View = (function(){
    function View(canvas) {
        this._renderer = fullCanvasRenderer(canvas);
    
        const { width, height } = canvas
        this._camera = initCamera(width, height, INITIAL_CAMERA_POSITION);
        this._orbitControls = initOrbitControls(this._camera, this._renderer);
        this._rotationCenter = new Vector3(0,0,0);
        this.nextCameraPosition = INITIAL_CAMERA_POSITION;

    }
    Object.assign(View.prototype, {
        moveTo: function(v) {
            const {x,y,z} = v;
            this.nextCameraPosition = {x,y,z};
        },
        render: function(scene) {
            const {
                _renderer,
                _camera,
                _orbitControls,
                nextCameraPosition,
            } = this;
            const transition = vectorFade(_camera.position, nextCameraPosition, 50);
            let lastFrame;
            (function loop() {
                lastFrame = requestAnimationFrame(loop);
                const { value, done } = transition.next();
                if (done) {
                    cancelAnimationFrame(lastFrame);
                    return;
                }
                const { x, y, z } = value;
                _camera.position.x = x;
                _camera.position.y = y;
                _camera.position.z = z;
                _orbitControls.update();
                _renderer.render(scene, _camera);
            })();
        },
        setOrbitTarget: function({x,y,z}, radius) {
            this._orbitControls.target = new Vector3(x,y,z);
            this._orbitControls.update();
            this._orbitControls.minDistance = 5*radius;
            this._rotationRadius = radius;
        },
    });
    return View;
})();

function fullCanvasRenderer(canvas) {
    const renderer = new WebGLRenderer({ canvas, antialias: true });
    const { clientWidth, clientHeight } = canvas;
    renderer.setSize(clientWidth, clientHeight);
    return renderer;
}

function initCamera(width, height, {x=0,y=0,z=0}) {
    const camera = new PerspectiveCamera(
        15,
        width / height,
        0.00001,
        1000,
    );
    camera.position.x = x;
    camera.position.y = y;
    camera.position.z = z;
    return camera;
}

function initOrbitControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.minDistance = 0.001;
    controls.maxDistance = Infinity;
    controls.maxPolarAngle = 2*Math.PI;
    controls.maxAzimuthAngle = 2*Math.PI;
    controls.update();
    return controls;
}


export function* vectorFade({x:x0,y:y0,z:z0}, {x:x1,y:y1,z:z1}, steps=5) {
    const dx = (x1-x0) / steps;
    const dy = (y1-y0) / steps;
    const dz = (z1-z0) / steps;
    for(let i = 0; i < steps; i++) {
        x0 += dx;
        y0 += dy;
        z0 += dz;
        yield {
            x: x0,
            y: y0,
            z: z0,
        };
    }
}
export default View;