<script>
    import { Color } from 'three';
    // A color tree either is a single value, or a mapping
    // { ...keys: ...(other trees) }
    // the value is either a primitive hex string
    // or an object mapping hex strings to other objects
    export let colors;
    let n = 1;
    $: n = colors.size;
    const backgroundColor = c => `background-color: #${new Color(c).getHexString()};`;
    const style = c => backgroundColor(c).concat(`height: ${100 / n}%;`);
</script>
<style>
    /* ul {
        list-style: none;
    } */
    .wrapper {
        /* display: table; */
        height: 100%;
        width: 100%;
    }
    div {
        height: 100%;
    }
    ul {
        list-style: none;
    }
    .child {
        margin-left: 1px;
        margin-top: 1px;
        height: 100%;
        width: 100%;
    }
</style>
<div class="wrapper">
    {#each [...colors] as [color, children]}
        <div style={backgroundColor(color)}>
            <div class="child">
                <svelte:self colors={children}/>
            </div>
        </div>
    {/each}
</div>