/*! jQuery FlexModal - v0.2.1
 * https://github.com/floriancapelle/jquery-flex-modal
 * Licensed MIT
 */
(function ( root, factory ) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(jQuery);
    }
}(this, function ( $ ) {
    'use strict';

    // Public API
    var api = {};

    /* Configuration
     * @see https://github.com/floriancapelle/jquery-flex-modal/blob/master/README.md for configuration details
     */
    var conf = {
        triggerSelector: '[data-modal-target]',
        triggerTargetKey: 'modalTarget',
        visibilityToggleClass: 'flex-modal-item--visible',
        modalOptions: {
            closeBtnMarkup: '<button class="flex-modal-item__close" type="button">x</button>',
            autoCloseOthers: true,
            closeOnOverlayClick: true,
            closeOnEscKey: true
        }
    };
    var $root;
    var EVENT_NS = 'flexModal';
    var CLASS_MODAL_ITEM_HIDDEN = 'flex-modal-hide';
    var CLASS_MODAL_ITEM = 'flex-modal-item';
    var CLASS_MODAL_ITEM_MODIFIER_READY = 'flex-modal-item--ready';
    var CLASS_MODAL_ITEM_CONTENT = 'flex-modal-item__content';
    var CLASS_MODAL_ITEM_CLOSE = 'flex-modal-item__close';
    var MODAL_ITEM_TPL = '<article class="flex-modal-item"><div class="flex-modal-item__content"></div></article>';

    /**
     * Initialize the plugin
     * @returns {{}}
     */
    function init() {
        // create wrapper and append to configured element
        var $body = $('body');
        $root = $('<aside class="flex-modal"></aside>');

        // append wrapper to body
        $body.append($root);

        // trigger event handling
        // open target modal on click on a trigger
        $body.on('click.' + EVENT_NS, function( event ) {
            var $trigger = $(event.target);
            var modalId;

            if ( !$trigger.is(conf.triggerSelector) ) return;

            if ( typeof conf.triggerTargetKey === 'function' ) {
                modalId = conf.triggerTargetKey().call($trigger, event);
            } else {
                modalId = $trigger.data(conf.triggerTargetKey);
            }

            open(modalId);
        });

        // esc key handling
        $(document).on('keydown.' + EVENT_NS, function( event ) {
            if ( event.keyCode !== 27 ) return;

            // close all visible modals if the escape key has been pressed
            $root.children('.' + conf.visibilityToggleClass).each(function() {
                var $modal = $(this);

                // close modal if the option is set correctly
                if ( $modal.data('options').closeOnEscKey === true ) {
                    close($modal.attr('id'));
                }
            });
        });

        // modal item event handling
        $root.on('click.' + EVENT_NS, function( event ) {
            var $evtTarget = $(event.target);

            // close modal on click on overlay
            if ( $evtTarget.hasClass(CLASS_MODAL_ITEM) ) {
                if ( $evtTarget.data('options').closeOnOverlayClick !== true ) return;
                close($evtTarget.attr('id'));
            }
            // close modal on click on close btn
            else if ( $evtTarget.hasClass(CLASS_MODAL_ITEM_CLOSE) || $evtTarget.closest('.' + CLASS_MODAL_ITEM_CLOSE).length ) {
                close($evtTarget.closest('.' + CLASS_MODAL_ITEM).attr('id'));
            }
        });
    }

    /**
     * Add a modal by appending the source modal content to a new modal item.
     * Fire callback after the modal has been initialized, if supplied.
     * @param {string} modalId - modal id like '#modal', will be used as jQuery selector
     * @param {function} [cb] - callback to run when modal has been initialized, 'this' will be modal
     * @returns {boolean} - whether the initialization was successful or not
     */
    function addModal( modalId, cb ) {
        modalId = modalId || '';
        modalId = sanitizeId(modalId);

        var $sourceModal = $('#'+ modalId);
        if ( !$sourceModal.length ) return false;

        var modalContent = $sourceModal.html();
        if ( modalContent === undefined ) return false;

        // create a new modal item
        var $newModal = $(MODAL_ITEM_TPL);
        var $newModalContent = $newModal.children('.' + CLASS_MODAL_ITEM_CONTENT);
        // merge options with defaults and options on the source modal tag if defined
        // like: data-close-btn-markup="false" => closeBtnMarkup: false
        var options = $.extend(true, {}, conf.modalOptions, $sourceModal.data());

        // set id and options for later use
        $newModal.attr('id', modalId);
        $newModal.data('options', options);
        // append the source markup to the new item content
        $newModalContent.append(modalContent);

        if ( options.closeBtnMarkup ) {
            $newModalContent.append($(options.closeBtnMarkup));
        }
        // copy all classes from target modal to new modal item
        // except the hide class
        $newModal.addClass($sourceModal.attr('class').replace(CLASS_MODAL_ITEM_HIDDEN, ''));

        $sourceModal.remove();
        $root.append($newModal);
        if ( cb ) {
            cb.call($newModal[0], api);
        }

        return true;
    }

    /**
     * open a modal
     * @param {string} modalId - with or without leading hash supported
     * @returns {{}}
     */
    function open( modalId ) {
        modalId = modalId || '';
        modalId = sanitizeId(modalId);

        var $modal = $root.children('#' + modalId);
        // if the modal is not initialized yet, do it and open it afterwards
        if ( !$modal.length ) {
            if ( addModal(modalId) === true ) {
                open(modalId);
            }
            return api;
        }

        var options = $modal.data('options');

        if ( options.autoCloseOthers === true ) {
            // close every child modal that's visible
            $root.children('.' + conf.visibilityToggleClass).each(function() {
                close($(this).attr('id'));
            });
        }

        $modal.addClass(CLASS_MODAL_ITEM_MODIFIER_READY);
        // force layout, to enable css transitions
        $modal.width();
        $modal.addClass(conf.visibilityToggleClass);
        $modal.trigger('open.' + EVENT_NS, api);

        return api;
    }

    /**
     * Close and remove a modal or all modals if no modal id has been supplied
     * @param {string} [modalId]
     * @returns {{}}
     */
    function close( modalId ) {
        var $modal;

        if ( modalId === undefined ) {
            $modal = $root.children();
        } else {
            modalId = sanitizeId(modalId);

            $modal = $root.children('#' + modalId);
            if ( !$modal.length ) return api;
        }

        // wait for transitionend event to remove the ready class
        $modal.on('transitionend.close.' + EVENT_NS + ' webkitTransitionEnd.close.' + EVENT_NS, function( event ) {
            if ( !$modal.is(event.target) ) return;

            $modal.removeClass(CLASS_MODAL_ITEM_MODIFIER_READY);
            $modal.off('.close.' + EVENT_NS);
        });

        $modal.removeClass(conf.visibilityToggleClass);
        $modal.trigger('close.' + EVENT_NS, api);

        return api;
    }

    function sanitizeId( id ) {
        return id.slice(0, 1) === '#' ? id.slice(1) : id;
    }


    $.extend(api, {
        config: conf,
        add: addModal,
        open: open,
        close: close
    });

    $(function() {
        init();

        // expose public api as soon as the document is ready
        $.flexModal = api;
    });
}));
