/*! jQuery FlexModal - v2.0.0
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

    // Module Namespace
    var NAMESPACE = 'flexModal';

    /**
     * Configuration
     * @see https://github.com/floriancapelle/jquery-flex-modal/blob/master/README.md for configuration details
     */
    var defaults = {
        triggerSelector: '[data-modal-target]',
        triggerTargetKey: 'modalTarget',
        modalOptions: {
            closeBtnMarkup: '<button class="flex-modal-item__close" type="button">x</button>',
            autoCloseOthers: true,
            closeOnOverlayClick: true,
            closeOnEscKey: true
        }
    };

    // Private state
    var $root;
    var CLASS_MODAL_ITEM_HIDDEN = 'flex-modal-hide';
    var CLASS_MODAL_ITEM = 'flex-modal-item';
    var CLASS_MODAL_ITEM_MODIFIER_READY = 'flex-modal-item--ready';
    var CLASS_MODAL_ITEM_MODIFIER_VISIBLE = 'flex-modal-item--visible';
    var CLASS_MODAL_ITEM_CONTENT = 'flex-modal-item__content';
    var CLASS_MODAL_ITEM_CONTENT_INNER = 'flex-modal-item__content-inner';
    var CLASS_MODAL_ITEM_CLOSE = 'flex-modal-item__close';
    var MODAL_ITEM_TPL = '<article class="flex-modal-item"><div class="flex-modal-item__content"><div class="flex-modal-item__content-inner"></div></div></article>';

    $(function() {
        // create wrapper and append to configured element
        var $body = $('body');
        $root = $('<aside class="flex-modal"></aside>');

        // append wrapper to body
        $body.append($root);

        // trigger event handling
        // open target modal on click on a trigger
        $body.on('click.' + NAMESPACE, function( event ) {
            var $trigger = $(event.target);
            var modalId;

            if ( !$trigger.is(defaults.triggerSelector) ) return;

            if ( typeof defaults.triggerTargetKey === 'function' ) {
                modalId = defaults.triggerTargetKey().call($trigger, event);
            } else {
                modalId = $trigger.data(defaults.triggerTargetKey);
            }

            moduleApi.open(modalId);
        });

        // esc key handling
        $(document).on('keydown.' + NAMESPACE, function( event ) {
            if ( event.keyCode !== 27 ) return;

            // close all visible modals if the escape key has been pressed
            $root.children('.' + CLASS_MODAL_ITEM_MODIFIER_VISIBLE).each(function() {
                var $modal = $(this);

                // close modal if the option is set correctly
                if ( $modal.data('options').closeOnEscKey === true ) {
                    moduleApi.close($modal.attr('id'));
                }
            });
        });

        // modal item event handling
        $root.on('click.' + NAMESPACE, function( event ) {
            var $evtTarget = $(event.target);

            // close modal on click on overlay
            if ( $evtTarget.hasClass(CLASS_MODAL_ITEM) ) {
                if ( $evtTarget.data('options').closeOnOverlayClick !== true ) return;
                moduleApi.close($evtTarget.attr('id'));
            }
            // close modal on click on close btn
            else if ( $evtTarget.hasClass(CLASS_MODAL_ITEM_CLOSE) || $evtTarget.closest('.' + CLASS_MODAL_ITEM_CLOSE).length ) {
                moduleApi.close($evtTarget.closest('.' + CLASS_MODAL_ITEM).attr('id'));
            }
        });

        // expose public api as soon as the document is ready
        $.flexModal = moduleApi;
    });

    /**
     * Module api
     */
    var moduleApi = {

        /**
         * Add a modal by appending the source modal content to a new modal item.
         * @param {string} modalId - modal id like '#modal', will be used as jQuery selector
         * @param {{}|function} [options] - additional options or callback
         * @property {function} options.afterInit - callback to run when modal has been initialized, 'this' will be the modal element
         * @property {{}} options.modalOptions - custom options for this modal only
         * @returns {boolean} - whether the initialization was successful or not
         */
        add: function( modalId, options ) {
            modalId = modalId || '';
            modalId = sanitizeId(modalId);
            if ( $.isFunction(options) ) {
                options = {
                    cb: options
                };
            } else {
                options = options || {};
            }

            var $sourceModal = $('#'+ modalId);
            if ( !$sourceModal.length ) return false;

            var modalContent = $sourceModal.html();
            if ( modalContent === undefined ) return false;

            // create a new modal item
            var $newModal = $(MODAL_ITEM_TPL);
            var $newModalContent = $newModal.children('.' + CLASS_MODAL_ITEM_CONTENT);
            // merge options with defaults and options on the source modal tag if defined
            // like: data-close-btn-markup="false" => closeBtnMarkup: false
            var modalOptions = $.extend(true, {}, defaults.modalOptions, $sourceModal.data(), options.modalOptions);

            // set id and options for later use
            $newModal.attr('id', modalId);
            $newModal.data('options', modalOptions);
            // append the source markup to the new item content
            $newModalContent.children('.' + CLASS_MODAL_ITEM_CONTENT_INNER).append(modalContent);

            if ( modalOptions.closeBtnMarkup ) {
                $newModalContent.append($(modalOptions.closeBtnMarkup));
            }
            // copy all classes from target modal to new modal item
            // except the hide class
            $newModal.addClass($sourceModal.attr('class').replace(CLASS_MODAL_ITEM_HIDDEN, ''));

            $sourceModal.remove();
            $root.append($newModal);
            if ( $.isFunction(options.cb) ) {
                options.cb.call($newModal[0], this);
            }

            return true;
        },

        /**
         * Open a modal
         * @param {string} modalId - with or without leading hash supported
         * @returns {{}}
         */
        open: function( modalId ) {
            modalId = modalId || '';
            modalId = sanitizeId(modalId);

            var self = this;
            var $modal = $root.children('#' + modalId);
            // if the modal is not initialized yet, do it and open it afterwards
            if ( !$modal.length ) {
                if ( moduleApi.add(modalId) === true ) {
                    moduleApi.open(modalId);
                }
                return this;
            }

            var options = $modal.data('options');

            if ( options.autoCloseOthers === true ) {
                // close every child modal that's visible
                $root.children('.' + CLASS_MODAL_ITEM_MODIFIER_VISIBLE).each(function() {
                    moduleApi.close($(this).attr('id'));
                });
            }

            // wait for transitionend event to remove the ready class
            $modal.on('transitionend.open.' + NAMESPACE + ' webkitTransitionEnd.open.' + NAMESPACE, function( event ) {
                if ( !$modal.is(event.target) ) return;

                $modal.trigger('afterOpen.' + NAMESPACE, self);
                $modal.off('.open.' + NAMESPACE);
            });

            $modal.addClass(CLASS_MODAL_ITEM_MODIFIER_READY);
            // force layout, to enable css transitions
            $modal.width();
            $modal.addClass(CLASS_MODAL_ITEM_MODIFIER_VISIBLE);
            $modal.trigger('open.' + NAMESPACE, this);

            return this;
        },

        /**
         * Close and remove a modal or all modals if no modal id has been supplied
         * @param {string} [modalId] - with or without leading hash supported
         * @returns {{}}
         */
        close: function( modalId ) {
            var self = this;
            var $modal;

            if ( modalId === undefined ) {
                $modal = $root.children();
            } else {
                modalId = sanitizeId(modalId);

                $modal = $root.children('#' + modalId);
                if ( !$modal.length ) return this;
            }

            // wait for transitionend event to remove the ready class
            $modal.on('transitionend.close.' + NAMESPACE + ' webkitTransitionEnd.close.' + NAMESPACE, function( event ) {
                if ( !$modal.is(event.target) ) return;

                $modal.removeClass(CLASS_MODAL_ITEM_MODIFIER_READY);
                $modal.trigger('afterClose.' + NAMESPACE, self);
                $modal.off('.close.' + NAMESPACE);
            });

            $modal.removeClass(CLASS_MODAL_ITEM_MODIFIER_VISIBLE);
            $modal.trigger('close.' + NAMESPACE, this);

            return this;
        }
    };

    /**
     * Return a string without the leading hash character if existing
     * @param {string} id
     * @returns {string}
     */
    function sanitizeId( id ) {
        return id.slice(0, 1) === '#' ? id.slice(1) : id;
    }

}));
