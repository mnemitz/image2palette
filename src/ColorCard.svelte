<script>
import { createEventDispatcher, onMount } from 'svelte';
import Card, { Content } from '@smui/card';
import { serialize8BitColor } from './util/color';
import { padLeft } from './util/util';

const dispatch = createEventDispatcher();
export let r,g,b;
const showLight = r <= 200 && g <= 200 && b <= 200;
const colorText = padLeft(serialize8BitColor(r,g,b).toString(16), 6);

</script>
<style>
#container {
    margin: 5px;
    max-height: 60px;
}
#container span {
    color: transparent;
    text-transform: uppercase;
    font-weight: bold;
}
#container:hover .light {
    color: white;
}
#container:hover .dark {
    color: black;
}
#content {
    display: flex;
    flex-direction: column;
}
</style>
<div
    id="container"
    style={`background-color: rgb(${[r,g,b]});`}
    on:mouseover={() => dispatch('mouseover')}
>
    <Card style="height: 100%;" >
        <Content>
            <div id="content">
                <span class={showLight ? 'light' : 'dark'}>
                    {colorText}
                </span>
            </div>
        </Content>
    </Card>
</div>