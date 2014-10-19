(function ($) {
	var defaults = {
		zip: true,
		zipName: 'images.zip',
		imageNamePrefix: 'image-',
		debug: false
	};

	var elementToImage = function (element, canvas, replaceContent) {
		if (!element || !canvas) return null;

		// save original
		var original = element.outerHTML;

		// set attribute and inline all styles
		element.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
		element.style.position = 'relative';
		$(element).inlineStyleRecursive();

		// create canvas with matching size
		canvas.width = element.offsetWidth;
		canvas.height = element.offsetHeight;
		var context = canvas.getContext('2d');

		// draw images in advance
		$(element).find('img').each(function () {
			var x = $(element).offset().left - $(this).offset().left;
			var y = $(element).offset().top - $(this).offset().top;
			var width = this.offsetWidth;
			var height = this.offsetHeight;

			// create rectangle for images' background color
			var background = $(this).css('background-color') || $(this).css('background');
			if (background)
			{
				context.fillStyle = background;
				context.fillRect(x, y, width, height); 
			}

			context.drawImage(this, x, y, width, height);
			this.remove();
		});

		var data =
			'<svg xmlns="http://www.w3.org/2000/svg" width="' + canvas.width + '" height="' + canvas.height + '">' +
				'<foreignObject width="100%" height="100%">' + element.outerHTML + '</foreignObject>' +
			'</svg>';
		var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
		var url = (window.URL || window.webkitURL || window).createObjectURL(svg);

		// replace with canvas or revert to original
		if (replaceContent) {
			$(element).html(canvas);
		}
		else {
			element.outerHTML = original;
		}

		// set image source
		var image = new Image();
		image.src = url;
		image.onload = function () {
			canvas.getContext('2d').drawImage(image, 0, 0);
		};

		return image;
	};

	$.fn.convertToCanvas = function (options) {
		options = $.extend(defaults, options);

		var totalCount = this.length;
		var currentCount = 0;
		if (options.debug) console.log(totalCount + ' element(s) will be processed.');

		return this.each(function (i) {
			if (options.debug) console.log('Processing element ' + (i + 1) + '.');

			var canvas = document.createElement('canvas');
			var image = elementToImage(this, canvas, true);

			image.onload = function () {
				canvas.getContext('2d').drawImage(image, 0, 0);
				if (options.debug) console.log(++currentCount + ' element(s) has been converted to image.');
			};
		});
	};

	$.fn.downloadAsImage = function (options) {
		options = $.extend(defaults, options);

		var zip = options.zip ? new JSZip() : null;
		var totalCount = this.length;
		var currentCount = 0;
		if (options.debug) console.log(totalCount + ' element(s) will be processed.');

		return this.each(function (i) {
			if (options.debug) console.log('Processing element ' + (i + 1) + '.');

			var canvas = document.createElement('canvas');
			var filename = this.getAttribute('data-filename') || options.imageNamePrefix + (i + 1) + '.png';
			var image = elementToImage(this, canvas);

			image.onload = function () {
				canvas.getContext('2d').drawImage(image, 0, 0);

				if (options.zip) {
					var data = canvas.toDataURL();
					data = data.substr(data.indexOf(',') + 1);

					zip.file(filename, data, { base64:true });
					currentCount++;

					// check if all images have been added to zip
					if (currentCount == totalCount)
					{
						var content = zip.generate({type: 'blob'});
						saveAs(content, options.zipName);
					}
				}
				else {
					canvas.toBlob(function(blob) {
						saveAs(blob, filename);
					});
					currentCount++;
				}

				if (options.debug) console.log(currentCount + ' element(s) has been converted to image.');
			};
		});
	};

	$.fn.inlineStyleRecursive = function (rootElement) {
		return this.each(function () {
			if (!this) return;

			rootElement = rootElement || this;

			var i;
			var win = document.defaultView || window;
			var style;
			var styleNode = [];

			// modern browsers
			if (win.getComputedStyle) {
				style = win.getComputedStyle(this, '');
				for (i = 0; i < style.length; i++) {
					styleNode.push(style[i] + ':' + style.getPropertyValue(style[i]));
				}
			}
			// internet explorer
			else if (this.currentStyle) {
				style = this.currentStyle;
				for (var name in currentStyle) {
					styleNode.push(name + ':' + currentStyle[name]);
				}
			}
			// ancient browser
			else {
				style = this.style;
				for (i = 0; i < style.length; i++) {
					styleNode.push(style[i] + ':' + style[style[i]]);
				}
			}

			// apply styles as inline style
			this.style.cssText = styleNode.join(';');

			// convert positions to absolute
			if (this != rootElement)
			{
				this.style.top = $(rootElement).offset().top - $(this).offset().top;
				this.style.left = $(rootElement).offset().left - $(this).offset().left;
				this.style.position = 'absolute';
			}

			// recursive
			$(this).children().each(function () {
				$(this).inlineStyleRecursive(rootElement);
			});
		});
	};
}(jQuery));