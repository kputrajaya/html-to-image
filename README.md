HTML-to-Image.js
================

A jQuery plugin that allows downloading HTML elements as (zipped) image files. Images downloaded are in PNG format and they do support transparency.


Implementation
--------------

This plugin embeds the HTML element to an SVG object, then draw it to HTML5 canvas element. Image data is obtained afterwards using `canvas.toDataUrl()` method.


Requirements
------------

- [jQuery](http://jquery.com/download/)
- [FileSaver.js](https://github.com/eligrey/FileSaver.js/)
- [JSZip.js](http://stuk.github.io/jszip/) (if you choose to download the images as zip, which is true by default)


Simple Usage
------------

	$('.download').downloadAsImage();

This is the simplest usage to download HTML elements as images.


Advanced Usage
--------------

You can pass optional parameter when downloading elements as images. Written below is the **default** options.

	var options = {
		zip: true, // download images as zip file
		zipName: 'images.zip', // filename for output zip file
		imageNamePrefix: 'image-', // each image name, will be followed with number (1 .. n)
		debug: false // if set to true, log will be written in console
	};

	$('.download').downloadAsImage(options);

You can also set individual filename for each image by giving each element `data-filename` attribute.

	<div data-filename="text.png"></div>

The element above will be downloaded as `text.png` as specified. Note that the attribute will override the existing naming convention (`imageNamePrefix{number}.png`).


Important Note
--------------

- This plugin hasn't been tested thoroughly as this was created for a specific personal use.
- SVG doesn't seem to support adding `<img>` to `<foreignObject>`, so currently they're being processed separately: drawn to canvas one-by-one then removing it. Expect problems if converted element contains any `<img>` tags.


Feedback
--------

Any feedback would be very appreciated, kindly send an email to [freakperzon@yahoo.com](mailto:freakperzon@yahoo.com) and I'll respond to it ASAP.