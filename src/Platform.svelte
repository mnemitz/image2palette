<script>
	import { onMount } from "svelte";
	let hasTouch = false;

	onMount(() => {
		hasTouch = ('ontouchstart' in document.documentElement);
	});

</script>
<slot {hasTouch} />
