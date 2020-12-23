<script>
    import Dialog, {Title, Content, Actions} from '@smui/dialog';
    import Button from '@smui/button';

    let dialog;
    // TODO how can we forward this implicitly?
	export function open() {
		dialog.open();
    }

    export let errorMessage;
    export let errorFull;
</script>
<style>
    .error-dialog {
        padding: 10px;
    }
</style>
<Dialog class="error-dialog" bind:this={dialog} on:MDCDialog:closed>
    <Title>{errorMessage}</Title>
    <Content>
        <code>{errorFull}</code>
    </Content>
    <Actions>
        <Button on:click={dialog.close}>Close</Button>
    </Actions>
</Dialog>