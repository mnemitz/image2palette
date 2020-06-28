<script>
import { createEventDispatcher, onMount } from 'svelte';
import Card, { Content } from '@smui/card';
import Checkbox from '@smui/checkbox';
import FormField from '@smui/form-field';
import { serialize8BitColor } from './util/color';
import { padLeft } from './util/util';

const dispatch = createEventDispatcher();
export let r,g,b;

const showLight = r <= 200 && g <= 200 && b <= 200;
const colorText = padLeft(serialize8BitColor(r,g,b).toString(16), 6);
let selected = false;

</script>
<style>
#container {
    margin: 5px;
    max-height: 60px;
    height: 100%;
}
#container span {
    color: transparent;
    text-transform: uppercase;
    font-weight: bold;
    line-height: 40px;
}
#container:hover .light {
    color: white;
}
#container:hover .dark {
    color: black;
}
#content {
    height: 100%;
    display: grid;
    grid-template-columns: 25% 50% 25%;
}
</style>
<div
    id="container"
    on:mouseover={() => dispatch('mouseover')}
>
<!-- TODO: this doesnt need to be a card really
    If we can use the mdc elevation stuff 
 -->
    <!-- <Card style="height: 100%; padding-vertical: 10px;" > -->
    <Card
        style={`background-color: rgb(${[r,g,b]});`}
    >
        <div id="content">
            <FormField>
                <Checkbox bind:checked={selected}/>
                <span slot="label" class={`text ${showLight ? 'light' : 'dark'}`}>
                    {colorText}
                </span>
            </FormField>
        </div>
    </Card>
</div>