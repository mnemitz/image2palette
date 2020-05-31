import { groupBy } from './util';

/**
 * Creates a union find datastructure
 * Elements must be hashable types for consistency
 */
export class UnionFind {
    constructor() {
        this.nComponents = 0;
        this.roots = new Map(); // map elements to their dominiating nodes (eventual roots)
        this.sizes = new Map(); // map elements to size of their group
    }
    amortize() {
        this.elements().forEach(x => this.find(x)); // flatten the tree
    }
    contains(x) {
        return this.roots.has(x);
    }
    elements() {
        return this.roots.keys();
    }
    add(...els) {
        [...els].forEach(el => {
            if (this.contains(el)) return;
            this.roots.set(el, el);
            this.sizes.set(el, 1);
            this.nComponents++;
        });
    }

    // given an element, return its ultimate parent
    find(x) {
        if (!this.contains(x)) throw new Error(`${x} is not an element`);
        const { roots } = this;
        let p = x;

        // path compression: each find flattens the path
        for (let q; (q = roots.get(p)) && p != q; p = q) {
            roots.set(p, roots.get(q));
        }
        return p;
    }
    connected(x,y) {
        return this.find(x) == this.find(y);
    }
    union(x,y) {
        // add x and y if they don't already exist
        [x,y].forEach(e => !this.contains(e) && this.add(e));

        // get each's dominating node
        const xroot = this.find(x);
        const yroot = this.find(y);
        if (xroot == yroot) return; // return if already united

        const { roots, sizes } = this;
        const nWithX = sizes.get(xroot);
        const nWithY = sizes.get(yroot);

        if (nWithX < nWithY) {
            roots.set(xroot, yroot);
            sizes.set(yroot, nWithX + nWithY);
        } else {
            roots.set(yroot, xroot);
            sizes.set(xroot, nWithX + nWithY);
        }

        this.nComponents--;
    }
    component(x) {
        if (!this.contains(x)) throw new Error(`${x} is not an element`);
        const xroot = this.find(x);
        const elements = this.elements();
        const find = this.find.bind(this); // because we lose 'this' in the iterator
        return Array.from(function*() {
            for (let el of elements) {
                if (find(el) === xroot) yield el;
            }
        }());
    }
    components() {
        // TODO
    }
}