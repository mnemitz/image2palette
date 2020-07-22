import { Color, Vector3 } from 'three';

export function padLeft(s, n) {
    const padSize = n - s.length;
    if (padSize > 0) {
        return '0'.repeat(padSize).concat(s);
    }
    return s.toString();
}
export function makeCubePoints(n) {
    if (isNaN(n)) {
        throw new Error('Input must be a number, or parseable as a number');
    }
    if (n <= 0) throw new Error('Cube size must be positive');
    return [0,1,2,3,4,5,6,7].map(x =>
        padLeft(x.toString(2), 3).split('').map(x => parseInt(x == 1 ? n : x))
    );
}

export function randomPoints(setPoints) {
    const numPoints = 4;
    const max = 255;
    const points = [];
    for(let i = 0; i < numPoints; i++) {
        points.push([
            Math.floor(Math.random()*max),
            Math.floor(Math.random()*max),
            Math.floor(Math.random()*max)
        ]);
    }
    setPoints(points);
}

export function vectorEquality(a,b) {
    if (a.length != b.length) return false;
    for (let i=0; i<a.length; i++) {
        if (a[i] != b[i]) return false;
    }
    return true;
}

export function max(a,b) {
    if (a >= b) return a;
    return b;
}

export function min(a,b) {
    if (a <= b) return a;
    return b;
}

export function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
         const key = keyGetter(item);
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });
    return map;
}

/**
 * 
 * @param {Iterator} itr 
 * @param {(x: string | number) => boolean} satisfies 
 */
export function* filterIter(itr, needle) {
    const satisfies = typeof needle === 'function' ? needle : (el) => el === needle;
    for (let thing of itr) {
        if (satisfies(thing)) yield thing;
    }
}

export function mapDeepEqual(m1, m2) {
    if (m1.size != m2.size) return false;
    for (let [key, val1] of m1) {
        if (!m2.has(key)) return false;
        const val2 = m2.get(key);
        if (isMap(val1) && isMap(val2)) return mapDeepEqual(val1, val2);
        else if (val1 != val2) return false;
    }
    return true;
}

const isMap = m => m.constructor.name == 'Map';

export function incrCompare(a,b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

export function decrCompare(a,b) {
    return -1*incrCompare(a,b);
}

export function cloneNestedMap(m) {
    const n = new Map();
    for (let [key, val] of m) {
        if (isMap(val)) n.set(key, cloneNestedMap(val))
        else n.set(key, val);
    }
    return n;
}

export function compose(...fns) {
    return (...args) => {
        for (let fn in fns) {
            args = fn(...args);
        }
        return args;
    }
}