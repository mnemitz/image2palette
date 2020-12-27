import ConfigStore from '../store/ConfigStore';

// onchange listener, to be bound to input element
async function onchange() {
    const inputImagePath = await getImage(this.files[0])
    ConfigStore.update((store) => ({...store, inputImagePath}));
}

export function getInputFile() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.onchange = onchange.bind(input);
    input.click();
}

function getImage(file) {
    return new Promise((resolve, reject) => {
        try {
            const fr = new FileReader();
            fr.onload = (e) => resolve(e.target.result);
            fr.readAsDataURL(file);
            setTimeout(reject, 10000);
        } catch (e) {
            reject(e)
        }
    });
}