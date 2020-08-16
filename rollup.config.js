import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import analyze from 'rollup-plugin-analyzer';
import alias from '@rollup/plugin-alias';

const production = !!process.env.ROLLUP_PROD;

module.exports = {
	input: 'src/index.js',
	output: {
		file: 'dist/bundle.js',
		format: 'iife',
		name: 'app'
	},
	treeshake: {
		moduleSideEffects: false
	},
	plugins: [
		alias({
			entries: [
				{
					find: 'three',
					replacement: __dirname+'/node_modules/three/src/Three',
				},
			],
		}),
		svelte({
			emitCss: false,
		}),
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/'),
		}),
		commonjs(),
		postcss({
			extract: true,
			minimize: true,
			extensions: ['.scss', '.sass'],
			use: [
				['sass', {
					includePaths: [
						'./src/theme',
						'./node_modules'
					],
				}],
			],
		}),
		production && terser(),
		production && analyze(),
	],
	watch: {
		clearScreen: false
	},
};
