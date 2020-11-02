<script>
	import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
	import Drawer, {AppContent, Header, Title as DrawerTitle, Scrim} from '@smui/drawer';
	import IconButton from '@smui/icon-button';
	import MediaQuery from './MediaQuery.svelte';
	import Options from './Options.svelte';
	import Activity from './activity/Activity.svelte';

	let prominent = false;
	let dense = false;
	let secondaryColor = false;
	let modalDrawerOpen = false;
	let inputImagePath;

	function setViewportUnits() {
		// We execute the same script as before
		const vh = window.innerHeight * 0.01;
		const vw = window.innerWidth * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
		document.documentElement.style.setProperty('--vw', `${vw}px`);
	}
	// We listen to the resize event
	window.addEventListener('resize', setViewportUnits);
	setViewportUnits();
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
					<Title>Pick some colors!</Title>
				</Section>
				<!-- TODO: Icons on the right: source code link etc -->
				<!-- <Section align="end" toolbar>
				</Section> -->
			</Row>
		</TopAppBar>
	</div>
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
					<Options
						on:inputImagePath={({detail: path }) => inputImagePath = path}
					/>
				</Drawer>
		</MediaQuery>
		<Scrim/>
		<AppContent>
			<main class="main-content">
				<Activity
					inputImagePath={inputImagePath}
				/>
			</main>
		</AppContent>
	</div>
</div>
