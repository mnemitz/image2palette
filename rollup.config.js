import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import alias from '@rollup/plugin-alias';
import visualizer from 'rollup-plugin-visualizer';

const production = !!process.env.ROLLUP_PROD;

module.exports = {
	input: 'src/index.js',
	output: {
		file: 'dist/bundle.js',
		format: 'iife',
		name: 'app'
	},
	plugins: [
		alias({
			entries: [
				{
					find: 'three',
					replacement: __dirname+'/three/index.js',
				},
				{
					find: 'three-examples',
					replacement: __dirname+'/three/examples/index.js',
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
		commonjs({
			exclude: ['node_modules/three/**'],
		}),
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
		production && visualizer(),
	],
	treeshake: {
		moduleSideEffects: false
	},
	watch: {
		clearScreen: false
	},
};
