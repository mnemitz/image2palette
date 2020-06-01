import AppColor from './util/color';

export function getImage(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = (e) => resolve(e.target.result);
        fr.readAsDataURL(file);
        setTimeout(reject, 10000);
    });
}

// /**
//  *
//  * @param {string} imageSrc
//  * @param {HTMLCanvasElement} canvas
//  */
// export function drawImage(imageSrc, canvas) {
//     const img = new Image();
//     img.src = imageSrc;
//     const loadImage = new Promise((resolve) => { img.onload = resolve });
//     canvas.height = 150;
//     canvas.width = 300; // major hack, the size will change after
//     return loadImage.then(() => {
//         // if the image is taller than it is wide,
//         // we want to limit the width to whatever it should be to keep the aspect ratio the same
//         // same deal if it's wider, for the height
//         const imageAspect = img.width / img.height;
//         if (imageAspect < 1)
//             canvas.width = canvas.height * imageAspect
//         else
//             canvas.height = canvas.width / imageAspect;
//         return pica.resize(img, canvas, {
//             unsharpAmount: 80,
//             unsharpRadius: 0.6,
//             unsharpThreshold: 255,
//         });
//     });
// }

/**
 * 
 * @param {HTMLCanvasElement} canvas 
 * @returns {Array[Array<AppColor>[3]]} A grid of the canvas's color values
 */
export function getColorGrid(canvas) {
    const { width, height } = canvas;
    const ctx = canvas.getContext('2d');
    const { data } = ctx.getImageData(0, 0, width, height);
    const colorGrid = [];
    for (let i = 0; i < width; i++) {
        colorGrid.push([]);
    }
    for (let i = 0; i < data.length; i += 4) {
        const [r,g,b,a] = [0,1,2,3].map(j => data[i+j]);
        colorGrid[(i/4) % width].push(new AppColor([r,g,b]));
    }
    return colorGrid;
}

export const DEFAULT_IMG_SRC = 'images/starry_night.jpg';