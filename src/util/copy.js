export default async function copy(...colors) {
	const text = colors.join('\n');
	return await navigator.clipboard.writeText(text);
}
