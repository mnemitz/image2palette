<script>
	import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
	import Drawer, {AppContent, Content, Header, Title as DrawerTitle, Subtitle, Scrim} from '@smui/drawer';
	import IconButton from '@smui/icon-button';
	import List, {Item, Text, Graphic, Separator, Subheader} from '@smui/list';
	import MediaQuery from './MediaQuery.svelte';
	import Options from './Options.svelte';
	import ImageContext from './ImageContext.svelte';

	let prominent = false;
	let dense = false;
	let secondaryColor = false;
	let modalDrawerOpen = false;
	let inputImagePath;
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
	}
	.main-content {
		overflow: none;
		/* padding: 16px; */
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
	<div id="top-app-bar-container">
		<TopAppBar variant="static" {prominent} {dense} color={secondaryColor ? 'secondary' : 'primary'}>
			<Row>
				<Section>
					<MediaQuery query="(max-width: 599px)" let:matches>
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
					<Title>Pick some colors!</Title>
				</Section>
				<!-- TODO: Icons on the right: source code link etc -->
				<!-- <Section align="end" toolbar>
				</Section> -->
			</Row>
		</TopAppBar>
	</div>
	<div class="drawer-container">
		<MediaQuery query="(min-width: 600px)" let:matches>
			{#if matches}
				<Drawer class="site-drawer">
					<Header>
						<DrawerTitle>Options</DrawerTitle>
					</Header>
					<Options
						on:inputImagePath={({detail: path }) => inputImagePath = path}
					/>
				</Drawer>
			{:else}
				<Drawer variant="modal" bind:open={modalDrawerOpen}>
					<Header>
						<DrawerTitle>Options (mobile)</DrawerTitle>
					</Header>
					<Options
						on:inputImagePath={({detail: path }) => inputImagePath = path}
					/>
				</Drawer>
			{/if}
		</MediaQuery>
		<Scrim/>
		<AppContent>
			<main class="main-content">
				<ImageContext
					inputImagePath={inputImagePath}
				/>
			</main>
		</AppContent>
	</div>
</div>
