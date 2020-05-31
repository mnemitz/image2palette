import AppColor from './util/color';
/**
 * 
 * @param {Array[Array[3]]} imageColorGrid
 * @returns {Map} hex color string to list of pixel coordinates containing that color
 */
export function createColorLookupMap(imageColorGrid) {
    const imageColorCoords = new Map();
    imageColorGrid.forEach((row, i) => {
        row.forEach((color, j) => {
            const hs = color.toHexString()
            if (!imageColorCoords.has(hs)) {
                imageColorCoords.set(hs, []);
            }
            imageColorCoords.get(hs).push([i,j]);
        });
    })
    return imageColorCoords;
}

/**
 * 
 * @param {Map} imageColorCoords
 * @returns Array of colors derived from the keys of the map
 */
export function getDistinctColors(imageColorCoords) {
    return Array.from(imageColorCoords.keys()).map(cs => new AppColor(cs))
}
