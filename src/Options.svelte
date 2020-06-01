<script>
import { createEventDispatcher } from 'svelte';
import {AppContent, Content, Header, Title as DrawerTitle, Subtitle, Scrim} from '@smui/drawer';
import List, {Item, Text, Graphic, Separator, Subheader} from '@smui/list';
import IconButton from '@smui/icon-button';

const dispatch = createEventDispatcher();

function getInputFile() {
    const input = document.createElement('input');
    function onchange() {
        return getImage(this.files[0])
            .then((result) => dispatch('inputImagePath', result))
            .catch(console.error);
    }

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.onchange = onchange.bind(input);
    input.click();
}

export function getImage(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = (e) => resolve(e.target.result);
        fr.readAsDataURL(file);
        setTimeout(reject, 10000);
    });
}

</script>
<style>
</style>
<Content>
    <List>
        <Item on:click={getInputFile}>
            <IconButton class="material-icons">
                add_photo_alternate
            </IconButton>
            <Text>Analyze image</Text>
        </Item>
        <Item>
            <IconButton class="material-icons">
                view_module
            </IconButton>
            <Text>View examples</Text>
        </Item>
        <Item>
            <IconButton class="material-icons">
               help 
            </IconButton>
            <Text>About</Text>
        </Item>
    </List>
</Content>