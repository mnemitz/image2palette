<script>
	import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
	import Drawer, {AppContent, Header, Title as DrawerTitle, Scrim} from '@smui/drawer';
	import IconButton from '@smui/icon-button';
	import MediaQuery from './MediaQuery.svelte';
	import Options from './Options.svelte';
	import Activity from './activity/Activity.svelte';
	import ConfigStore from './store/ConfigStore';
	import DialogStore, {Dialogs, closeDialog, showUserError} from './store/DialogStore';
	import KitchenStore from './store/KitchenStore';
	import ExamplesDialog from './dialogs/ExamplesDialog.svelte';
	import AboutDialog from './dialogs/AboutDialog.svelte';
	import ErrorDialog from './dialogs/ErrorDialog.svelte';
	import Kitchen from '@smui/snackbar/kitchen/index';

	let modalDrawerOpen = false;
	let activeDialogComponent;
	let activeDialog;
	let dialogProps = {};
	let kitchen;

	DialogStore.subscribe((store) => {
		if (!store.activeDialog) {
			activeDialogComponent = null;
			return;
		}
		dialogProps = store.props;
		switch (store.activeDialog) {
			case Dialogs.ExampleImages:
				activeDialogComponent = ExamplesDialog;
				break;
			case Dialogs.About:
				activeDialogComponent = AboutDialog;
				break;
			case Dialogs.Error:
				activeDialogComponent = ErrorDialog;
				break;
			default:
				console.warn(`Unknown dialog key ${store.activeDialog}`);
		}
	});

	// Close drawer if input image path is set
	ConfigStore.subscribe((store) => {
		if (store.inputImagePath) {
			modalDrawerOpen = false;
		}
	});

	KitchenStore.subscribe((message) => {
		kitchen && message && kitchen.push({
			label: message,
			dismissButton: true,
			// Clear message on close
			onClose: () => KitchenStore.update(() => {}),
		});
	});

	window.onerror = (msg, url, line, col, error) => {
		showUserError({
			errorMessage: msg,
			location: `${url}:${line}:${col}`,
			errorFull: error,
		});
	}

	$: {
		if (activeDialog) {
			// close drawer when opening a dialog
			modalDrawerOpen = false;
			activeDialog.open();
		}
	}
</script>
<style>
	#main {
		display: flex;
		flex-direction: column;
		height: 100%;
	}
	#topbar-icon {
		max-height: 100%;
	}
	.drawer-container {
		position: relative;
		display: flex;
		flex-grow: 1;
		border: 1px solid rgba(0,0,0,.1);
		overflow: hidden;
		height: 100%;
	}
	.main-content {
		overflow: none;
		height: 100%;
		box-sizing: border-box;
		width: 100%;
	}
	* :global(.app-content) {
		flex: auto;
		overflow: auto;
		position: relative;
		flex-grow: 1;
	}
</style>
<div id="main" class="site-default-theme">
	<TopAppBar variant="static" prominent={false} dense={false}>
		<Row>
			<Section>
				<MediaQuery query="(max-width: 1024px)" let:matches>
					{#if matches}
						<IconButton
							id="sidemenu-toggle"
							class="material-icons"
							on:click={() => modalDrawerOpen = !modalDrawerOpen}
						>
							menu
						</IconButton>
					{/if}
				</MediaQuery>
				<img id="topbar-icon" src="colorpickerspace.svg" alt=":("/>
				<Title>Image to palette</Title>
			</Section>
			<!-- TODO: Icons on the right: source code link etc -->
			<!-- <Section align="end" toolbar>
			</Section> -->
		</Row>
	</TopAppBar>
	<div class="drawer-container">
		<MediaQuery query="(min-width: 1025px)" let:matches>
			<Drawer
				class="site-drawer"
				variant={matches? null : "modal"} 
				bind:open={modalDrawerOpen}
			>
					<Header>
						<DrawerTitle>Options</DrawerTitle>
					</Header>
					<Options/>
				</Drawer>
		</MediaQuery>
		<Scrim/>
		<AppContent>
			<main class="main-content">
				<Activity/>
			</main>
		</AppContent>
	</div>
	<div class="dialog-container">
		{#if activeDialogComponent}
			<svelte:component
				this={activeDialogComponent}
				bind:this={activeDialog}
				on:MDCDialog:closed={closeDialog}
				{...dialogProps}
			/>
		{/if}
	</div>
	<Kitchen bind:this={kitchen} dismiss$class="material-icons"/>
</div>
