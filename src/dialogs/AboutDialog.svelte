<script>
  import Dialog, {Title, Content, Actions} from '@smui/dialog';
  import Button from '@smui/button';

  let dialog;
  // TODO how can we forward this implicitly?
	export function open() {
		dialog.open();
	}
</script>
<Dialog bind:this={dialog} on:MDCDialog:closed>
  <p>
    <a href="https://app.netlify.com/sites/colorpicker-space/deploys">
      <img
        src="https://api.netlify.com/api/v1/badges/62d4d8a3-f08c-44e2-9dd2-c52bce696517/deploy-status"
        alt="Netlify Status" />
    </a>
  </p>
  <h1 id="color-picker-space">Color picker space</h1>
  <p>Pick your own color palettes from any image!</p>
  <h2 id="what-it-does">What it does</h2>
  <p>
    Given any input image, this application generates colors which are
    characteristic to that image. You can then pick from these images to create
    your own beautiful color schemes.
  </p>
  <h2 id="how-it-works">How it works</h2>
  <p>
    Many images contain hundreds of thousand of distinct colors. If we want to
    extract colors from images to create beautiful, balanced color schemes, we
    have to be smart about selection.
  </p>
  <p>
    Ranking the distinct colors by frequency can produce nice results, but it
    misses out on key information about the overall distribution. If we want to
    see an image&#39;s characteristic colors, we want to somehow capture the
    full color range of an image.
  </p>
  <p>
    With that goal in mind, the selection of colors in this app is based on the
    <em>convex hull</em>
    of the image colors. In other words, if each color in the image is plotted
    in 3D space (where red, green, and blue color channels are the respective
    axes), then the set of colors returned determines a polytope within which
    all of the other color points are contained. This polytope is visible within
    the page, and can be explored by hovering over the resulting colors,
    allowing the user to get a feel for the &quot;shape&quot; of the image, when
    seen from color space.
  </p>
  <table>
    <thead>
      <tr>
        <th style="text-align:center">Image</th>
        <th style="text-align:center">Convex colors</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="text-align:center">
          <img src="/dist/example_images/starry_night.jpg" alt="Starry Night" />
        </td>
        <td style="text-align:center">
          <img src="/.github/images/polytope.png" alt="Polytope" />
        </td>
      </tr>
    </tbody>
  </table>
  <p>
    Moreover, this polytope can also be thought of as a graph, allowing us to
    potentially generate color schemes based on graph traversal algorithms.
  </p>
  <h2 id="other-technical-details">Other technical details</h2>
  <p>
    The site runs entirely offline, and was made with Svelte with some heavy
    lifting for the 3D rendering done by ThreeJS. It&#39;s my first big Svelte
    project, but I was drawn to Svelte as opposed big frameworks like Vue or
    React because ThreeJS is relatively heavy, and not having an extra runtime
    for DOM stuff simplifies things a lot.
  </p>
  <p>
    Svelte&#39;s context API mixes quite nicely with ThreeJS too. With some
    pretty simple logic, it is possible to create Svelte components which
    effectively render inside a ThreeJS controlled canvas (see
    <code>src/three-components/ThreeScene.svelte</code>
    ).
  </p>
  <Actions>
    <Button on:click={dialog.close}>Close</Button>
  </Actions>
</Dialog>
