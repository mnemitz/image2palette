import { writable } from 'svelte/store';

const KitchenStore = writable();

export function toast(message) {
    KitchenStore.update(() => (message));
}

export default KitchenStore;