<script>
    import { createEventDispatcher } from 'svelte';

    export let onCheck = () => {};
    export let text;

    const dispatch = createEventDispatcher();
</script>
<style>
	/* The switch - the box around the slider */
	.switch {
		position: relative;
		display: inline-block;
		width: 45px;
		height: 24px;
	}

	/* Hide default HTML checkbox */
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* The slider */
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: .4s;
		transition: .4s;
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 20px;
		width: 20px;
		left: 2px;
		bottom: 2px;
		background-color: white;
		-webkit-transition: .4s;
		transition: .4s;
	}

	input:checked + .slider {
		background-color: rgb(125, 184, 233);
	}

	input:focus + .slider {
		box-shadow: 0 0 1px rgb(125, 184, 233);
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(20px);
		-ms-transform: translateX(20px);
		transform: translateX(20px);
	}
	/* Rounded sliders */
	.slider.round {
        border-radius: 34px;
	}

	.slider.round:before {
        border-radius: 50%;
	}
    td {
        padding: 2px;
    }
</style>
<table>
    <tbody>
        <tr>
            <td>
                <label class="switch">
                    <input id={`switch_${text}`} type="checkbox" on:change={ () => { dispatch('check', this.checked) } }>
                    <span class="slider round"></span>
                </label>
            </td>
            <td><label for={`switch_${text}`}><p>{ text }</p></label></td>
        </tr>
    </tbody>
</table>