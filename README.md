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

Accessible via `$.flexModal`

Method | Arguments | Description
------ | -------- | -----------
add | modalId : string (e.g. '#modal-1'), options : object/function | Add/Prepare the target modal. You may supply a callback function or an object for this modal only.
open | modalId : string (e.g. '#modal-1') | Open the target modal
close | [modalId : string (e.g. '#modal-1')] | Close the target modal or all modals

### Configuration

All `modalOptions` can also be set via data-attributes on the modal element and/or with an options object in the add method.

See the demo for examples.

Key | Type | Default | Description
------ | ---- | ------- | -----------
triggerSelector | string | '[data-modal-target]' | used as filter selector in click event delegation for body
triggerTargetKey | string|function | 'modalTarget' | data object key containing modal id on trigger element. Or use function (context is trigger element and param is event object)
modalOptions.closeBtnMarkup | string | see js file | markup of the close button to be appended, false if not
modalOptions.autoCloseOthers | boolean | true | close other open modals when opening this modal
modalOptions.closeOnOverlayClick | boolean | true | close this modal when its overlay was clicked
modalOptions.closeOnEscKey | boolean | true | close this modal when the escape key was pressed

### Events

jQuery events on the modals will be fired when:
- 'close.flexModal' = a modal is closing/hiding
- 'afterClose.flexModal' = a modal has been closed/hidden
- 'open.flexModal' = a modal is opening/showing 
- 'afterOpen.flexModal' = a modal has been opened/shown

## License

[MIT License](https://github.com/floriancapelle/jquery-flex-modal/blob/master/LICENSE)

------------------

## Questions & Contribution
Please feel free to reach out to me if you have any questions, suggestions or contributions.
