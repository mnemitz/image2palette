import { expect, assert } from 'chai';
import { makeCubePoints, padLeft, mapDeepEqual, cloneNestedMap } from '../../src/util/util';

// TODO: figure out how to lint the tests
describe('Utility function tests', () => {
	describe('Pad Left', () => {
		describe('When passing a number', () => {
			it('Should return a string representation of it, padded to the left by 3', () => {
				expect(padLeft('0', 3)).to.be.eq('000');
				expect(padLeft('1', 3)).to.be.eq('001');
			});
		});
	});
	describe('Make cube coordinates', () => {
		describe('When passing a non-number value', () => {
			it('should throw an error', () => {
				expect(() => makeCubePoints('egsd')).to.throw();
			});
		});
		describe('When passing a number', () => {
			it('should return the coordinates of a cube that size', () => {
				expect(makeCubePoints(1)).to.be.eql([
					[0,0,0],
					[0,0,1],
					[0,1,0],
					[0,1,1],
					[1,0,0],
					[1,0,1],
					[1,1,0],
					[1,1,1],
				]);
				expect(makeCubePoints(123)).to.be.eql([
					[0,0,0],
					[0,0,123],
					[0,123,0],
					[0,123,123],
					[123,0,0],
					[123,0,123],
					[123,123,0],
					[123,123,123],
				]);
			});
		});
	});
	describe('map deep equal', () => {
		it('should determine a map as equal to itself', () => {
			const m = new Map();
			m.set(1,2);
			assert(mapDeepEqual(m,m));
		});
		it('should determine two identical maps equal', () => {
			const m1 = new Map();
			const m2 = new Map();
			const m3 = new Map();
			m3.set('foo', 'bar');

			m1.set(1,2);
			m2.set(1,2);
			m1.set('otherMap', m3);
			m2.set('otherMap', m3);

			assert(mapDeepEqual(m1, m2));
		});
	});
	describe('clone nested map', () => {
		const m = new Map();
		m.set(1, new Map([[2,3]]));
		m.set(4,5);
		let copy;
		beforeEach(() => {
			copy = cloneNestedMap(m);
		});

		it('the clone should be deep equal to the original', () => {
			assert(mapDeepEqual(m, copy));
		});

		it('should not mutate the original when a nested map is mutated', () => {
			copy.get(1).set(3,4);
			assert(!mapDeepEqual(m, copy));
		});
	});
});
