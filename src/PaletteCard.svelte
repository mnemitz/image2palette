<script>
import Paper, {Title, Subtitle, Content} from '@smui/paper';
import IconButton from '@smui/icon-button';
import Palette from './Palette.svelte';
import {deserialize8BitColor} from './util/color';

export let colors = [];

$: {
    console.warn(colors);
}

</script>
<style>
.container {
    padding-top: 15px;
    padding-bottom: 15px;
    display: flex;
    width: 100%;
}
* :global(.palette-card-paper) {
    display: flex;
    flex-direction: column;
    width: 100%;
}
</style>
<div class="container">
    <Paper class="palette-card-paper">
        <Title>Palette</Title>
        <Palette bind:colors={colors}/>
        <IconButton class="material-icons" on:click={() => colors = []}>
            delete
        </IconButton>
    </Paper>
</div>