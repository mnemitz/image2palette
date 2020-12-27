import { writable } from 'svelte/store';

export const Dialogs = {
    About: 'about',
    ExampleImages: 'exampleImages',
    Error: 'error',
};

const DialogStore = writable({
    activeDialog: null,
    props: {},
});

export function openDialog(activeDialog, props={}) {
    DialogStore.update(() => ({activeDialog, props}));
}

export function closeDialog() {
    console.warn('closing dialog');
    DialogStore.update(() => ({activeDialog: null}));
}

export function showUserError({errorMessage, errorFull}) {
    console.error(errorMessage, errorFull);
    DialogStore.update(() => ({
        activeDialog: Dialogs.Error,
        props: {errorMessage, errorFull},
    }));
}

export default DialogStore;