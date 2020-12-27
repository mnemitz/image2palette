import ConfigStore from '../store/ConfigStore';
import {showUserError} from '../store/DialogStore';

export function getInputFile() {
    try {
        const input = document.createElement('input');
        async function onchange() {
            const inputImagePath = await getImage(this.files[0])
            ConfigStore.update((store) => ({...store, inputImagePath}));
        }

        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.onchange = onchange.bind(input);
        input.click();
    } catch (errorFull) {
        showUserError({errorMessage, errorFull})
    }
}

function getImage(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = (e) => resolve(e.target.result);
        fr.readAsDataURL(file);
        setTimeout(reject, 10000);
    });
}