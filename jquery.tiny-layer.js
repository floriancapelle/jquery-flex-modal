/*! jQuery Tiny Layer - v1.0.0
 * https://github.com/floriancapelle/jquery-tiny-layer
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
     * @see https://github.com/floriancapelle/jquery-tiny-layer/blob/master/README.md for configuration details
     */
    var conf = {
        triggerSelector: '[data-layer-target]',
        triggerTargetKey: 'layerTarget',
        layerItemClass: 'tiny-layer-item',
        layerItemContentClass: 'tiny-layer-item__content',
        layerItemCloseClass: 'tiny-layer-item__close',
        layerItemTpl: '<article class="tiny-layer-item"><div class="tiny-layer-item__content"></div></article>',
        visibilityToggleClass: 'tiny-layer-item--visible',
        layerOptions: {
            closeBtnMarkup: '<button class="tiny-layer-item__close" type="button">x</button>',
            autoCloseOthers: true,
            closeOnOverlayClick: true,
            closeOnEscKey: true,
            onCreate: function() {},
            onOpen: function() {},
            onClose: function() {}
        }
    };
    var $root;
    var EVENT_NS = '.tinyLayer';
    var CLASS_MODIFIER_HIDDEN = 'tiny-layer-hide';

    /**
     * Initialize the component
     * @returns {{}}
     */
    function init() {
        // create wrapper and append to configured element
        var $body = $('body');
        $root = $('<aside class="tiny-layer"></aside>');

        // append wrapper to body
        $body.append($root);

        // trigger event handling
        // open target layer on click on a trigger
        $body.on('click' + EVENT_NS, function( event ) {
            var $trigger = $(event.target);
            var layerId;

            if ( !$trigger.is(conf.triggerSelector) ) return;

            if ( typeof conf.triggerTargetKey === 'function' ) {
                layerId = conf.triggerTargetKey().call($trigger, event);
            } else {
                layerId = $trigger.data(conf.triggerTargetKey);
            }

            // stop if the layer already has been added
            if ( getLayerInRoot(layerId).length ) return;

            initLayer(layerId);
            open(layerId);
        });

        // esc key handling
        $(document).on('keydown' + EVENT_NS, function( event ) {
            if ( event.keyCode !== 27 ) return;

            // close all visible layers if the escape key has been pressed
            $root.children('.' + conf.visibilityToggleClass).each(function() {
                var $layer = $(this);

                // close layer if the option is set correctly
                if ( $layer.data('options').closeOnEscKey === true ) {
                    close($layer.data('id'));
                }
            });
        });

        // layer item event handling
        $root.on('click' + EVENT_NS, function( event ) {
            var $evtTarget = $(event.target);

            // close layer on click on overlay
            if ( $evtTarget.hasClass(conf.layerItemClass) ) {
                if ( $evtTarget.data('options').closeOnOverlayClick !== true ) return;
                close($evtTarget.data('id'));
            }
            // close layer on click on close btn
            else if ( $evtTarget.hasClass(conf.layerItemCloseClass) || $evtTarget.closest('.' + conf.layerItemCloseClass).length ) {
                close($evtTarget.closest('.' + conf.layerItemClass).data('id'));
            }
        });
    }

    /**
     * Initialize a layer by copying the source layer content and appending it to a new layer
     * @param layerId - layer id like '#layer', will be used as jQuery selector
     * @returns {boolean} - whether the initialization was successful or not
     */
    function initLayer( layerId ) {
        if ( !layerId ) return false;

        var $sourceLayer = $(layerId);
        if ( !$sourceLayer || !$sourceLayer.length ) return false;

        var layerContent = $sourceLayer.html();
        if ( typeof layerContent === 'undefined' ) return false;

        // create a new layer item
        var $newLayer = $(conf.layerItemTpl);
        var $newLayerContent = $newLayer.children('.' + conf.layerItemContentClass);
        // merge options with defaults and options on the source layer tag if defined
        // like: data-close-btn-markup="false" => closeBtnMarkup: false
        var options = $.extend(true, {}, conf.layerOptions, $sourceLayer.data());

        // set id and options for later use
        $newLayer.data('id', layerId);
        $newLayer.data('options', options);
        // append the source markup to the new item content
        $newLayerContent.append(layerContent);

        if ( options.closeBtnMarkup ) {
            $newLayerContent.append($(options.closeBtnMarkup));
        }
        // copy all classes from target layer to new layer item
        // except the hide class
        $newLayer.addClass($sourceLayer.attr('class').replace(CLASS_MODIFIER_HIDDEN, ''));

        $root.append($newLayer);
        options.onCreate.call($newLayer, api);

        return true;
    }

    /**
     * open a layer
     * @param {string} layerId
     * @returns {{}}
     */
    function open( layerId ) {
        layerId = layerId || '';

        var $layer = getLayerInRoot(layerId);
        // if the layer is not initialized yet, do it and open it afterwards
        if ( !$layer || !$layer.length ) {
            if ( initLayer(layerId) === true ) {
                open(layerId);
            }
            return api;
        }

        var options = $layer.data('options');

        if ( options.autoCloseOthers === true ) {
            // close every child layer that's visible
            $root.children(conf.visibilityToggleClass).each(function() {
                close($(this).data('id'));
            });
        }

        // force layout, to enable css transitions
        $layer.width();
        $layer.addClass(conf.visibilityToggleClass);
        options.onOpen.call($layer, api);

        return api;
    }

    /**
     * Close and remove a layer or all layers if no layer id has been supplied
     * @param {string} [layerId]
     * @returns {{}}
     */
    function close( layerId ) {
        var $layer;

        if ( layerId ) {
            $layer = getLayerInRoot(layerId);
            if ( !$layer.length ) return api;
        } else {
            $layer = $root.children();
        }

        var options = $layer.data('options');

        // wait for transitionend event to remove the layer
        $layer.on('transitionend' + EVENT_NS + ' webkitTransitionEnd' + EVENT_NS, function( event ) {
            if ( !$layer.is(event.target) ) return;
            $layer.remove();
        });
        $layer.removeClass(conf.visibilityToggleClass);
        options.onClose.call($layer, api);

        return api;
    }

    /**
     * Get layer element by id in wrapper, match layerId with data property
     * @param {string} layerId
     * @returns {*|HTMLElement}
     */
    function getLayerInRoot( layerId ) {
        var $layer = $();

        $root.children().each(function() {
            if ( $(this).data('id') === layerId ) {
                $layer = $(this);
                return false;
            }
        });

        return $layer;
    }


    $.extend(api, {
        config: conf,
        open: open,
        close: close
    });

    $(function() {
        init();

        // expose public api as soon as the document is ready
        $.tinyLayer = api;
    });
}));
