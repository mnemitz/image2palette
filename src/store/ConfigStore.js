import { writable } from 'svelte/store';

const ConfigStore = writable({
	inputImagePath: undefined,
	showAxes: false,
	showMST: false,
	// TODO: filter on colors, formatting etc
});

export default ConfigStore;
