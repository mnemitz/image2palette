/**
 * @param {Number} r red channel
 * @param {Number} g green channel
 * @param {Number} b blue channel
 * @returns {Number} a 24 bit representation of the color
 */
export function serialize8BitColor(r,g,b) {
	return (r << 16) + (g << 8) + b;
}

/**
 * @param {Number} c 24 bit representation of color (rgb channels)
 * @returns {Number} destructured rgb representation
 */
export function deserialize8BitColor(c) {
	const [r,g,b] = [
		(c & 0xff0000) >> 16,
		(c & 0x00ff00) >> 8,
		(c & 0x0000ff),
	];
	return { r, g, b };
}

export function isDark({r,g,b}) {
	return r < 128 && g < 128 && b < 128;
}