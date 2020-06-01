<script>
	// import { Color } from 'three';
	// import Polytope from './Polytope.svelte';
	// import ImageInput from './ImageInput.svelte';
	// import ColorList from './ColorList.svelte';
	// import AppColor from './util/color';
	// import { createColorLookupMap, getDistinctColors } from './App';
	// import { Graph } from './util/graph';
	// export let colorsToImagePixel = new Map();
	
	// let imgSrc;
	// let showAxes;
	// let showMST;
	// let vertexColorGraph = new Graph();

	import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
	import Drawer, {AppContent, Content, Header, Title as DrawerTitle, Subtitle, Scrim} from '@smui/drawer';
	import IconButton from '@smui/icon-button';
	import List, {Item, Text, Graphic, Separator, Subheader} from '@smui/list';
	import MediaQuery from './MediaQuery.svelte';
	import Options from './Options.svelte';
	import ImageContext from './ImageContext.svelte';

	export let title = 'Colors';
	$: {
		document.title = title;
	}
	
	let prominent = false;
	let dense = false;
	let secondaryColor = false;

	let modalDrawerOpen = false;

	// state relating to image context
	let inputImagePath = 'No image selected!';
	let showMST = false;
	let showAxes = true;

	$: console.warn(inputImagePath);
</script>
<style>
	#activity {
		display: grid;
		grid-template-rows: 50% 50%;
		height: 80vh;
	}
	.drawer-container {
		position: relative;
		display: flex;
		height: 80vh;
		border: 1px solid rgba(0,0,0,.1);
		overflow: hidden;
		z-index: 0;
	}
	.main-content {
		overflow: auto;
		padding: 16px;
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
<div id="main">
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
				<Title>Convex colors</Title>
			</Section>
			<!-- TODO: Icons on the right: source code link etc -->
			<!-- <Section align="end" toolbar>
			</Section> -->
		</Row>
	</TopAppBar>
	<div id="activity">
		<div class="drawer-container">
			<MediaQuery query="(min-width: 600px)" let:matches>
				{#if matches}
					<Drawer>
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
						showMST={showMST}
						showAxes={showAxes}
					/>
				</main>
			</AppContent>
		</div>
	</div>
</div>
<!-- <div id="main">
	<header>
		<h1>Convex colors</h1>
	</header>
	<div id="image-container">
		<ImageInput
			imgSrc={imgSrc}
			on:imgsrc={ ({ detail: _imgSrc }) => { imgSrc = _imgSrc }}
			on:colors={
				({ detail: newColorGrid }) => {
					colorsToImagePixel = createColorLookupMap(newColorGrid);
				}
			}
		/>
	</div>
	<div id="container">
		<div id="top">
			<div class="polytope-container">
				<Polytope
					colors={getDistinctColors(colorsToImagePixel)}
					highlightedColor={highlightedColor}
					showAxes={showAxes}
					showMST={showMST}
					on:graph={ ({ detail: graph }) => vertexColorGraph = graph }
				/>
			</div>
		</div>
		<div id="bottom">
			<ColorList
				colors={Array.from(vertexColorGraph.approxMinVertexCover()).sort()}
				on:highlightcolor={ ({ detail: color }) =>
					highlightedColor = color && new Color(color)
				}
			/>
		</div>
	</div>
</div> -->