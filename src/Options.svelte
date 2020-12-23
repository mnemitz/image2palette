<script>
	import { Content } from '@smui/drawer';
	import List, { Item, Text } from '@smui/list';
	import IconButton from '@smui/icon-button';
	import {Dialogs, openDialog} from './store/DialogStore';
	import {getInputFile} from './lib/inputImage';
</script>
<Content>
	<List>
		<Item on:click={getInputFile}>
			<IconButton class="material-icons">
				add_photo_alternate
			</IconButton>
			<Text>Analyze image</Text>
		</Item>
		<Item on:click={() => openDialog(Dialogs.ExampleImages)}>
			<IconButton class="material-icons">
				view_module
			</IconButton>
			<Text>View examples</Text>
		</Item>
		<Item on:click={() => openDialog(Dialogs.About)}>
			<IconButton class="material-icons">
				help 
			</IconButton>
			<Text>About</Text>
		</Item>
	</List>
</Content>
