import { writable } from 'svelte/store';

const TrashStore = writable({
    colorToDelete: undefined,
});

export default TrashStore;
