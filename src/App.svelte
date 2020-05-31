<script>
	import { Color } from 'three';
	import Polytope from './Polytope.svelte';
	import ImageInput from './ImageInput.svelte';
	import ColorList from './ColorList.svelte';
	import SliderCheck from './SliderCheck.svelte';
	import AppColor from './util/color';
	import { createColorLookupMap, getDistinctColors } from './App';
	import { Graph } from './util/graph';
	import TopAppBar, {Row, Section, Title} from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';

	export let title = 'Colors';
	$: {
		document.title = title;
	}
	export let colorsToImagePixel = new Map();
	let imgSrc;
	let highlightedColor;
	let showAxes;
	let showMST;
	let vertexColorGraph = new Graph();
	
	let prominent = false;
	let dense = false;
	let secondaryColor = false;
</script>
<div id="main">
      <TopAppBar variant="static" {prominent} {dense} color={secondaryColor ? 'secondary' : 'primary'}>
        <Row>
          <Section>
            <IconButton class="material-icons">menu</IconButton>
            <Title>Static</Title>
          </Section>
          <Section align="end" toolbar>
            <IconButton class="material-icons" aria-label="Download">file_download</IconButton>
            <IconButton class="material-icons" aria-label="Print this page">print</IconButton>
            <IconButton class="material-icons" aria-label="Bookmark this page">bookmark</IconButton>
          </Section>
        </Row>
      </TopAppBar>
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