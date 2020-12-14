import { writable } from 'svelte/store';

export const Dialogs = {
    About: 'about',
    ExampleImages: 'exampleImages',
};

const DialogStore = writable({
    activeDialog: null,
});

export function openDialog(activeDialog) {
    DialogStore.update(() => ({activeDialog}));
}

export function closeDialog() {
    console.warn('closing dialog');
    DialogStore.update(() => ({activeDialog: null}));
}

export default DialogStore;