import { UnionFind } from '../../src/util/unionfind';
import { expect } from 'chai';

describe('unionfind', () => {
	describe('adding components', () => {
		it('should create a separate component for each initial item', () => {
			const uf = new UnionFind();
			uf.add(1,2,3);
			expect(uf.nComponents).to.eql(3);
			expect(uf.contains(1)).to.eql(true);
			expect(uf.contains(2)).to.eql(true);
			expect(uf.contains(3)).to.eql(true);
			expect(uf.contains(4)).to.eql(false);

			expect(uf.find(1)).to.eql(1);
			expect(uf.find(2)).to.eql(2);
			expect(uf.find(3)).to.eql(3);
			expect(() => uf.find(4)).to.throw;
		});
		it('should give correct components after unions', () => {
			const uf = new UnionFind();
			uf.add(1,2,3,4,5,6);
			uf.union(1,3);
			expect(uf.nComponents).to.eql(5);
			expect(uf.component(1)).to.eql([1,3]);

			uf.union(2,4);
			expect(uf.nComponents).to.eql(4);
			expect(uf.component(2)).to.eql(uf.component(4));

			uf.union(1,2);
			expect(uf.nComponents).to.eql(3);
			expect(uf.component(1)).to.eql([1,2,3,4]);
			expect(uf.component(5)).to.eql([5]);
			expect(uf.component(6)).to.eql([6]);
		});
	});
});
