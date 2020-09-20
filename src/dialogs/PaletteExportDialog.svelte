<script>
	import Dialog, {Title} from '@smui/dialog';

	let dialog;

	export function open() {
		dialog.open();
	}
</script>
<Dialog bind:this={dialog}>
	<Title>
		Export colors
	</Title>
</Dialog>

