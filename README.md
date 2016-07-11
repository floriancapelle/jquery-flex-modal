# tinyLayer
tinyLayer is a lightweight jQuery plugin for fully customizable basic notifications, modals, popups or any feature alike.

Open a layer by clicking any element you want which has a custom attribute containing the id of the target layer.

- Layer CSS & HTML is fully customizable
- Layer is positioned with CSS only by using flex
- Simple API with just an open & close method
- Requires jQuery 1.8+
- Browser Support: Evergreen browsers & IE9+

## Demo

Open the index.html for examples.

## Install

Download latest release and place the following css and js files in the corresponding directories.

Add a link to the css file in your `<head>`:
```html
<link rel="stylesheet" href="css/jquery.tiny-layer.css"/>
```

Then, before your closing ```<body>``` tag add:
```html
<script src="js/jquery.tiny-layer.js"></script>
```

*Make sure to check and maybe edit the paths to fit your file structure.*

## Usage

See the demo page for examples.

### API

Namespace is `$.tinyLayer`

Method | Arguments | Description
------ | -------- | -----------
open | layerId : string (e.g. '#layer-1') | open the target layer
close | [layerId : string (e.g. '#layer-1')] | close the target layer or all layers

### Configuration

Modify `$.tinyLayer.config` to change the configuration anytime.

All `layerOptions` can also be set via data-attributes on the layer element.
See the demo for examples.

Key | Type | Default | Description
------ | ---- | ------- | -----------
triggerSelector | string | '[data-layer-target]' | used as filter selector in click event delegation for body
triggerTargetKey | string|function | 'layerTarget' | data object key containing layer id on trigger element. Or use function (context is trigger element and param is event object)
layerItemClass | string | 'tiny-layer-item' | -
layerItemContentClass | string | 'tiny-layer-item__content' | -
layerItemCloseClass | string | 'tiny-layer-item__close' | -
layerItemTpl | string | see js file | used to create layer items with jQuery
visibilityToggleClass | string | 'is-visible' | css class for open and close handling
layerOptions.closeBtnMarkup | string | see js file | markup of the close button to be appended, false if not
layerOptions.autoCloseOthers | boolean | true | close other open layers when opening this layer
layerOptions.closeOnOverlayClick | boolean | true | close this layer when its overlay was clicked
layerOptions.closeOnEscKey | boolean | true | close this layer when the escape key was pressed
layerOptions.onCreate | function | no-op | callback, fires after layer item creation
layerOptions.onOpen | function | no-op | callback, fires when the layer item has been opened
layerOptions.onClose | function | no-op | callback, fires when the layer item is being closed 

## License

[MIT License](https://github.com/floriancapelle/jquery-tiny-layer/blob/master/LICENSE)

------------------

## Questions & Contribution
Please feel free to reach out to me if you have any questions, suggestions or contributions.
