<script>
    import {createEventDispatcher} from 'svelte';
    import Platform from '../Platform.svelte';
    import IconButton from '@smui/icon-button';
    import {isDark} from '../lib/color';

    export let color;
    $: style = `background-color: rgb(${[color.r, color.g, color.b]});`;

    const dispatch = createEventDispatcher();
</script>
<style>
	.palette-color {
		flex-grow: 1;
		max-width: 100px;
		/* When the dark mode is activated on the palette, don't affect the color */
		filter: inherit; 
	}
	.palette-color:active {
		z-index: 1;
	}

	.palette-color:first-child {
		border-radius: 10px 0px 0px 10px;
	}

	.palette-color:last-child {
		border-radius: 0px 10px 10px 0px;
	}
	.palette-color:only-child {
		border-radius: 10px;
    }
    .palette-color > .palette-color-contents {
        display: none;
    }
    .palette-color:hover > .palette-color-contents {
        display: flex;
    }
</style>
<div
    class="palette-color"
    style={style}
>
    <div class="palette-color-contents">
        <Platform let:hasTouch>
            {#if !hasTouch}
                <IconButton
                    class={`material-icons ${isDark(color) ? ' inverted' : ''}`}
                    on:click={() => dispatch('remove')}
                    style="font-size: 32px;"
                >
                    cancel
                </IconButton>
            {/if}
        </Platform>
    </div>
</div>