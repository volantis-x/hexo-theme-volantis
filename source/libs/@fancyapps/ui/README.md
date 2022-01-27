# Fancyapps UI

Collection of task-oriented components that will make you more productive. Packed full of features that you and your clients will love.

Full docs with examples: https://fancyapps.com/docs/ui/quick-start/.

## Installation

### NPM

Use either `npm` or `yarn` as follows:

```bash
npm install @fancyapps/ui
// or
yarn add  @fancyapps/ui
```

Import one or more components:

```jsx
import { Fancybox, Carousel, Panzoom } from "@fancyapps/ui";
```

Import the appropriate CSS file, example:

```jsx
import "@fancyapps/ui/dist/fancybox.css";
```

### CDN

A pre-bundled scripts that contain components are available on [CDN](https://www.jsdelivr.com/package/npm/@fancyapps/ui?path=dist).

> **_NOTE:_** Because Fancybox is build on top of both Carousel and Panzoom components, you only have to include `fancybox.umd.js` and all 3 components will be available through the `window` object.

```html
<script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js"></script>
```

Or use ES6 import:

```html
<script type="module">
  import { Fancybox } from "https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.esm.js";
</script>
```

Remember to include the appropriate CSS file, example:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.css" />
```

## Usage

### Fancybox

There are two ways to use Fancybox.

#### Declarative

Add a `data-fancybox` attribute to any element to enable Fancybox. Galleries are created by adding the same attribute `data-fancybox` value to multiple elements. Use `data-src` or `href` attribute to specify the source of the content. Add a `data-caption` attribute if you want to show a caption under the content.

```jsx
<a href="https://lipsum.app/id/1/1024x768" data-fancybox="gallery" data-caption="Optional caption">
  Image
</a>
```

```jsx
<a href="http://media.w3.org/2010/05/sintel/trailer.mp4" data-fancybox>
  Video
</a>
```

```jsx
<a
  href="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d10500.902039411158!2d2.2913514905137315!3d48.85391001859112!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1slv!2slv!4v1622011463926!5m2!1slv!2slv"
  data-fancybox
  data-type="iframe"
  data-preload="false"
  data-width="640"
  data-height="480"
>
  Iframe
</a>
```

```jsx
<button data-fancybox data-src="#dialog-content">
  HTML element
</button>

<div id="dialog-content" style="display:none;">
  <h2>Hello, world!</h2>
  <p>
    <input type="text" value="See if changes remain after closing the dialog" />
  </p>
</div>
```

Customize options:

```js
Fancybox.bind("[data-fancybox]", {
  // Your options go here
});
```

#### Programmatic

```js
// Image gallery
var gallery = [
  {
    src: "https://lipsum.app/id/2/800x600",
    thumb: "https://lipsum.app/id/2/80x80",
    caption: "First image",
  },
  {
    src: "https://lipsum.app/id/3/800x600",
    thumb: "https://lipsum.app/id/3/80x80",
    caption: "Second image",
  },
  {
    src: "https://lipsum.app/id/4/800x600",
    thumb: "https://lipsum.app/id/4/80x80",
    caption: "Third image",
  },
];

Fancybox.show(gallery, {
  // Your options go here
});

// HTML element
Fancybox.show([{ src: "#dialog-content", type: "inline" }]);

// A copy of HTML element
Fancybox.show([{ src: "#dialog-content", type: "clone" }]);

// Any HTML content
Fancybox.show([{ src: "<p>Lorem ipsum dolor sit amet.</p>", type: "html" }]);
```

### Carousel

Add HTML markup

```html
<div id="myCarousel" class="carousel">
  <div class="carousel__slide">1</div>
  <div class="carousel__slide">2</div>
  <div class="carousel__slide">3</div>
</div>
```

Initialise Carousel

```js
const myCarousel = new Carousel(document.querySelector("#myCarousel"), {
  // Your options go here
});
```

Optionally, use CSS to customize container, navigation elements and slides

```css
.carousel {
  color: #170724;

  --carousel-button-bg: #fff;
  --carousel-button-shadow: 0 2px 1px -1px rgb(0 0 0 / 20%), 0 1px 1px 0 rgb(0 0 0 / 14%), 0 1px 3px 0 rgb(0 0 0 / 12%);

  --carousel-button-svg-width: 20px;
  --carousel-button-svg-height: 20px;
  --carousel-button-svg-stroke-width: 2.5;
}

.carousel__slide {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 80%;
  height: 160px;
  margin-right: 6px;

  background-color: #eee;
  border-radius: 6px;
}
```

### Panzoom

Add HTML markup

```html
<div id="myPanzoom" class="panzoom">
  <img class="panzoom__content" src="https://lipsum.app/id/3/2000x1500" alt="" />
</div>
```

Initialise Panzoom

```js
const myPanzoom = new Panzoom(document.querySelector("#myPanzoom"), {
  // Your options go here
});
```

Optionally, use CSS to customize container

```css
.panzoom {
  width: 400px;
  height: 300px;
}
```

## License

This is commercial software. See [LICENSE.md](LICENSE.md) for more info.
