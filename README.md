# HTML to Image

jQuery plugin that converts HTML to downloadable image.

## Built With

- [Canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [jQuery](http://jquery.com/download/) (Prerequisite)
- [FileSaver.js](https://github.com/eligrey/FileSaver.js/) (Prerequisite)
- [JSZip.js](http://stuk.github.io/jszip/) (Prerequisite, if downloading as ZIP)

## Implementation

This plugin embeds the HTML element to an SVG object, then draws it into a canvas.
Image data is obtained afterwards using `canvas.toDataUrl()` method.

## Simple Usage
```
$('.download').downloadAsImage();
```
This is the simplest usage to download HTML elements as images.

## Advanced Usage

You can pass optional parameter when downloading elements as images. Written below is the **default** options.
```
var options = {
	zip: true,  // download images as zip file
	zipName: 'images.zip',  // filename for output zip file
	imageNamePrefix: 'image-',  // each image name, will be followed with number (1 - N)
	debug: false  // if set to true, debugging log will appear in console
};
$('.download').downloadAsImage(options);
```
You can also set individual filename for each image by giving each element `data-filename` attribute.
Note that said attribute will override default numbered filename.
```
<div data-filename="text.png"></div>
```

## Important Note

- This plugin hasn't been tested thoroughly as this was created for a specific personal use.
- SVG doesn't seem to support adding `<img>` to `<foreignObject>`, so currently they're being processed separately: drawn to canvas one-by-one then removing it. Expect problems if converted element contains any `<img>` tags.
