# flexModal
[![license](https://img.shields.io/github/license/floriancapelle/jquery-flex-modal.svg?style=flat-square&maxAge=3600)](https://github.com/floriancapelle/jquery-flex-modal/blob/master/LICENSE)
[![GitHub release](https://img.shields.io/github/release/floriancapelle/jquery-flex-modal.svg?style=flat-square&maxAge=3600)](https://github.com/floriancapelle/jquery-flex-modal/releases)
[![Code Climate](https://codeclimate.com/github/floriancapelle/jquery-flex-modal/badges/gpa.svg)](https://codeclimate.com/github/floriancapelle/jquery-flex-modal)


flexModal is a lightweight jQuery plugin for fully customizable basic notifications, modals, popups or any feature alike.

Open a modal by clicking any element you want which has a custom attribute containing the id of the target modal.

- Modal is positioned with flexbox
- CSS & HTML is fully customizable
- Super simple API and configuration
- No inline styles, plain CSS
- Requires jQuery 2+
- Browser Support: Evergreen browsers & IE9+

## Demo

![jQuery FlexModal Demo](https://raw.githubusercontent.com/floriancapelle/jquery-flex-modal/master/demo.gif)

## Install

Download latest release and place the following css and js files in the proper directories.

Add a link to the css file in your `<head>`:
```html
<link rel="stylesheet" href="css/jquery.flex-modal.css"/>
```

Then, before your closing ```<body>``` tag add:
```html
<script src="js/jquery.flex-modal.js"></script>
```

*Make sure to check and maybe edit the paths to fit your file structure.*

## Usage

See the index.html for examples.

### API

Namespace is `$.flexModal`

Method | Arguments | Description
------ | -------- | -----------
open | modalId : string (e.g. '#modal-1') | open the target modal
close | [modalId : string (e.g. '#modal-1')] | close the target modal or all modals

### Configuration

Modify `$.flexModal.config` to change the configuration anytime.

All `modalOptions` can also be set via data-attributes on the modal element.
See the demo for examples.

Key | Type | Default | Description
------ | ---- | ------- | -----------
triggerSelector | string | '[data-modal-target]' | used as filter selector in click event delegation for body
triggerTargetKey | string|function | 'modalTarget' | data object key containing modal id on trigger element. Or use function (context is trigger element and param is event object)
modalItemClass | string | 'flex-modal-item' | -
modalItemContentClass | string | 'flex-modal-item__content' | -
modalItemCloseClass | string | 'flex-modal-item__close' | -
modalItemTpl | string | see js file | used to create modal items with jQuery
visibilityToggleClass | string | 'is-visible' | css class for open and close handling
modalOptions.closeBtnMarkup | string | see js file | markup of the close button to be appended, false if not
modalOptions.autoCloseOthers | boolean | true | close other open modals when opening this modal
modalOptions.closeOnOverlayClick | boolean | true | close this modal when its overlay was clicked
modalOptions.closeOnEscKey | boolean | true | close this modal when the escape key was pressed
modalOptions.onCreate | function | no-op | callback, fires after modal item creation
modalOptions.onOpen | function | no-op | callback, fires when the modal item has been opened
modalOptions.onClose | function | no-op | callback, fires when the modal item is being closed 

## License

[MIT License](https://github.com/floriancapelle/jquery-flex-modal/blob/master/LICENSE)

------------------

## Questions & Contribution
Please feel free to reach out to me if you have any questions, suggestions or contributions.
