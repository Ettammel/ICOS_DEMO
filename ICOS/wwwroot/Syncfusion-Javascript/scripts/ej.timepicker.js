/*!
*  filename: ej.timepicker.js
*  version : 15.3.0.33
*  Copyright Syncfusion Inc. 2001 - 2016. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
*/


window.ej = window.Syncfusion = window.Syncfusion || {};


(function ($, ej, undefined) {
    'use strict';

    ej.version = "15.3.0.33";

    ej.consts = {
        NamespaceJoin: '-'
    };
    ej.TextAlign = {
        Center: 'center',
        Justify: 'justify',
        Left: 'left',
        Right: 'right'
    };
    ej.Orientation = { Horizontal: "horizontal", Vertical: "vertical" };

    ej.serverTimezoneOffset = 0;

    ej.persistStateVersion = null;

    ej.locales = ej.locales || [];

    if (!Object.prototype.hasOwnProperty) {
        Object.prototype.hasOwnProperty = function (obj, prop) {
            return obj[prop] !== undefined;
        };
    }

    //to support toISOString() in IE8
    if (!Date.prototype.toISOString) {
        (function () {
            function pad(number) {
                var r = String(number);
                if (r.length === 1) {
                    r = '0' + r;
                }
                return r;
            }
            Date.prototype.toISOString = function () {
                return this.getUTCFullYear()
                    + '-' + pad(this.getUTCMonth() + 1)
                    + '-' + pad(this.getUTCDate())
                    + 'T' + pad(this.getUTCHours())
                    + ':' + pad(this.getUTCMinutes())
                    + ':' + pad(this.getUTCSeconds())
                    + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5)
                    + 'Z';
            };
        }());
    }

    String.format = function () {
        var source = arguments[0];
        for (var i = 0; i < arguments.length - 1; i++)
            source = source.replace(new RegExp("\\{" + i + "\\}", "gm"), arguments[i + 1]);

        source = source.replace(/\{[0-9]\}/g, "");
        return source;
    };

    jQuery.uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];

        return {
            browser: match[1] || "",
            version: match[2] || "0"
        };
    };
    // Function to create new class
    ej.defineClass = function (className, constructor, proto, replace) {
        /// <summary>Creates the javascript class with given namespace & class name & constructor etc</summary>
        /// <param name="className" type="String">class name prefixed with namespace</param>
        /// <param name="constructor" type="Function">constructor function</param>
        /// <param name="proto" type="Object">prototype for the class</param>
        /// <param name="replace" type="Boolean">[Optional]Replace existing class if exists</param>
        /// <returns type="Function">returns the class function</returns>
        if (!className || !proto) return undefined;

        var parts = className.split(".");

        // Object creation
        var obj = window, i = 0;
        for (; i < parts.length - 1; i++) {

            if (ej.isNullOrUndefined(obj[parts[i]]))
                obj[parts[i]] = {};

            obj = obj[parts[i]];
        }

        if (replace || ej.isNullOrUndefined(obj[parts[i]])) {

            //constructor
            constructor = typeof constructor === "function" ? constructor : function () {
            };

            obj[parts[i]] = constructor;

            // prototype
            obj[parts[i]].prototype = proto;
        }

        return obj[parts[i]];
    };

    ej.util = {
        getNameSpace: function (className) {
            /// <summary>Internal function, this will create namespace for plugins using class name</summary>
            /// <param name="className" type="String"></param>
            /// <returns type="String"></returns>
            var splits = className.toLowerCase().split(".");
            splits[0] === "ej" && (splits[0] = "e");

            return splits.join(ej.consts.NamespaceJoin);
        },

        getObject: function (nameSpace, from) {
            if (!from || !nameSpace) return undefined;

            var value = from, splits = nameSpace.split('.');

            for (var i = 0; i < splits.length; i++) {

                if (ej.util.isNullOrUndefined(value)) break;

                value = value[splits[i]];
            }

            return value;
        },

        createObject: function (nameSpace, value, initIn) {
            var splits = nameSpace.split('.'), start = initIn || window, from = start, i, t, length = splits.length;

            for (i = 0; i < length; i++) {
                t = splits[i];
                if (i + 1 == length)
                    from[t] = value;
                else if (ej.isNullOrUndefined(from[t]))
                    from[t] = {};

                from = from[t];
            }

            return start;
        },

        isNullOrUndefined: function (value) {
            /// <summary>Util to check null or undefined</summary>
            /// <param name="value" type="Object"></param>
            /// <returns type="Boolean"></returns>
            return value === undefined || value === null;
        },
        print: function (element, printWin) {
            var $div = ej.buildTag('div')
            var elementClone = element.clone();
            $div.append(elementClone);
            if (!printWin)
                var printWin = window.open('', 'print', "height=452,width=1024,tabbar=no");
            printWin.document.write('<!DOCTYPE html>');
            var links = $('head').find('link').add("style");
            if (ej.browserInfo().name === "msie") {
                var a = ""
                links.each(function (index, obj) {
                    if (obj.tagName == "LINK")
                        $(obj).attr('href', obj.href);
                    a += obj.outerHTML;
                });
                printWin.document.write('<html><head></head><body>' + a + $div[0].innerHTML + '</body></html>');
            }
            else {
                var a = ""
                printWin.document.write('<html><head>')
                links.each(function (index, obj) {
                    if (obj.tagName == "LINK")
                        $(obj).attr('href', obj.href);
                    a += obj.outerHTML;
                });
                printWin.document.writeln(a + '</head><body>')
                printWin.document.writeln($div[0].innerHTML + '</body></html>')
            }
            printWin.document.close();
            printWin.focus();
            setTimeout(function () {
                if (!ej.isNullOrUndefined(printWin.window)) {
                    printWin.print();
                    setTimeout(function () { printWin.close() }, 1000);
                }
            }, 1000);
        },
        ieClearRemover: function (element) {
            var searchBoxHeight = $(element).height();
            element.style.paddingTop = parseFloat(searchBoxHeight / 2) + "px";
            element.style.paddingBottom = parseFloat(searchBoxHeight / 2) + "px";
            element.style.height = "1px";
            element.style.lineHeight = "1px";
        },
        //To send ajax request
        sendAjaxRequest: function (ajaxOptions) {
            $.ajax({
                type: ajaxOptions.type,
                cache: ajaxOptions.cache,
                url: ajaxOptions.url,
                dataType: ajaxOptions.dataType,
                data: ajaxOptions.data,
                contentType: ajaxOptions.contentType,
                async: ajaxOptions.async,
                success: ajaxOptions.successHandler,
                error: ajaxOptions.errorHandler,
                beforeSend: ajaxOptions.beforeSendHandler,
                complete: ajaxOptions.completeHandler
            });
        },

        buildTag: function (tag, innerHtml, styles, attrs) {
            /// <summary>Helper to build jQuery element</summary>
            /// <param name="tag" type="String">tagName#id.cssClass</param>
            /// <param name="innerHtml" type="String"></param>
            /// <param name="styles" type="Object">A set of key/value pairs that configure styles</param>
            /// <param name="attrs" type="Object">A set of key/value pairs that configure attributes</param>
            /// <returns type="jQuery"></returns>
            var tagName = /^[a-z]*[0-9a-z]+/ig.exec(tag)[0];

            var id = /#([_a-z]+[-_0-9a-z]+)/ig.exec(tag);
            id = id ? id[id.length - 1] : undefined;

            var className = /\.([a-z]+[-_0-9a-z ]+)/ig.exec(tag);
            className = className ? className[className.length - 1] : undefined;

            return $(document.createElement(tagName))
                .attr(id ? { "id": id } : {})
                .addClass(className || "")
                .css(styles || {})
                .attr(attrs || {})
                .html(innerHtml || "");
        },
        _preventDefaultException: function (el, exceptions) {
            if (el) {
                for (var i in exceptions) {
                    if (exceptions[i].test(el[i])) {
                        return true;
                    }
                }
            }

            return false;
        },

        //Gets the maximum z-index in the document
        getMaxZindex: function () {
            var maxZ = 1;
            maxZ = Math.max.apply(null, $.map($('body *'), function (e, n) {
                if ($(e).css('position') == 'absolute' || $(e).css('position') == 'fixed')
                    return parseInt($(e).css('z-index')) || 1;
            })
            );
            if (maxZ == undefined || maxZ == null)
                maxZ = 1;
            return maxZ;
        },

        //To prevent default actions for the element
        blockDefaultActions: function (e) {
            e.cancelBubble = true;
            e.returnValue = false;
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
        },

        //To get dimensions of the element when its hidden
        getDimension: function (element, method) {
            var value;
            var $hidden = $(element).parents().andSelf().filter(':hidden');
            if ($hidden) {
                var prop = { visibility: 'hidden', display: 'block' };
                var tmp = [];
                $hidden.each(function () {
                    var temp = {}, name;
                    for (name in prop) {
                        temp[name] = this.style[name];
                        this.style[name] = prop[name];
                    }
                    tmp.push(temp);
                });
                value = /(outer)/g.test(method) ?
                $(element)[method](true) :
               $(element)[method]();

                $hidden.each(function (i) {
                    var temp = tmp[i], name;
                    for (name in prop) {
                        this.style[name] = temp[name];
                    }
                });
            }
            return value;
        },
        //Get triggers when transition End
        transitionEndEvent: function () {
            var transitionEnd = {
                '': 'transitionend',
                'webkit': 'webkitTransitionEnd',
                'Moz': 'transitionend',
                'O': 'otransitionend',
                'ms': 'MSTransitionEnd'
            };

            return transitionEnd[ej.userAgent()];
        },
        //Get triggers when transition End
        animationEndEvent: function () {
            var animationEnd = {
                '': 'animationend',
                'webkit': 'webkitAnimationEnd',
                'Moz': 'animationend',
                'O': 'webkitAnimationEnd',
                'ms': 'animationend'
            };

            return animationEnd[ej.userAgent()];
        },
        //To return the start event to bind for element
        startEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? "touchstart" : "mousedown";
        },
        //To return end event to bind for element
        endEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? "touchend" : "mouseup"
        },
        //To return move event to bind for element
        moveEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? ($.support.hasPointer && !ej.isMobile()) ? "ejtouchmove" : "touchmove" : "mousemove";
        },
        //To return cancel event to bind for element
        cancelEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? "touchcancel" : "mousecancel";
        },
        //To return tap event to bind for element
        tapEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? "tap" : "click";
        },
        //To return tap hold event to bind for element
        tapHoldEvent: function () {
            return (ej.isTouchDevice() || $.support.hasPointer) ? "taphold" : "click";
        },
        //To check whether its Device
        isDevice: function () {
            if (ej.getBooleanVal($('head'), 'data-ej-forceset', false))
                return ej.getBooleanVal($('head'), 'data-ej-device', this._device());
            else
                return this._device();
        },
        //To check whether its portrait or landscape mode
        isPortrait: function () {
            var elem = document.documentElement;
            return (elem) && ((elem.clientWidth / elem.clientHeight) < 1.1);
        },
        //To check whether its in lower resolution
        isLowerResolution: function () {
            return ((window.innerWidth <= 640 && ej.isPortrait() && ej.isDevice()) || (window.innerWidth <= 800 && !ej.isDevice()) || (window.innerWidth <= 800 && !ej.isPortrait() && ej.isWindows() && ej.isDevice()) || ej.isMobile());
        },
        //To check whether its iOS web view
        isIOSWebView: function () {
            return (/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent));
        },
        //To check whether its Android web view
        isAndroidWebView: function () {
            return (!(typeof (Android) === "undefined"));
        },
        //To check whether its windows web view
        isWindowsWebView: function () {
            return location.href.indexOf("x-wmapp") != -1;
        },
        _device: function () {
            return (/Android|BlackBerry|iPhone|iPad|iPod|IEMobile|kindle|windows\sce|palm|smartphone|iemobile|mobile|pad|xoom|sch-i800|playbook/i.test(navigator.userAgent.toLowerCase()));
        },
        //To check whether its Mobile
        isMobile: function () {
            return ((/iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(navigator.userAgent.toLowerCase()) && /mobile/i.test(navigator.userAgent.toLowerCase()))) || (ej.getBooleanVal($('head'), 'data-ej-mobile', false) === true);
        },
        //To check whether its Tablet
        isTablet: function () {
            return (/ipad|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent.toLowerCase())) || (ej.getBooleanVal($('head'), 'data-ej-tablet', false) === true) || (!ej.isMobile() && ej.isDevice());
        },
        //To check whether its Touch Device
        isTouchDevice: function () {
            return (('ontouchstart' in window || (window.navigator.msPointerEnabled && ej.isMobile())) && this.isDevice());
        },
        //To get the outerHTML string for object
        getClearString: function (string) {
            return $.trim(string.replace(/\s+/g, " ").replace(/(\r\n|\n|\r)/gm, "").replace(new RegExp("\>[\n\t ]+\<", "g"), "><"));
        },
        //Get the attribute value with boolean type of element
        getBooleanVal: function (ele, val, option) {
            /// <summary>Util to get the property from data attributes</summary>
            /// <param name="ele" type="Object"></param>
            /// <param name="val" type="String"></param>
            /// <param name="option" type="GenericType"></param>
            /// <returns type="GenericType"></returns>
            var value = $(ele).attr(val);
            if (value != null)
                return value.toLowerCase() == "true";
            else
                return option;
        },
        //Gets the Skew class based on the element current position
        _getSkewClass: function (item, pageX, pageY) {
            var itemwidth = item.width();
            var itemheight = item.height();
            var leftOffset = item.offset().left;
            var rightOffset = item.offset().left + itemwidth;
            var topOffset = item.offset().top;
            var bottomOffset = item.offset().top + itemheight;
            var widthoffset = itemwidth * 0.3;
            var heightoffset = itemheight * 0.3;
            if (pageX < leftOffset + widthoffset && pageY < topOffset + heightoffset)
                return "e-m-skew-topleft";
            if (pageX > rightOffset - widthoffset && pageY < topOffset + heightoffset)
                return "e-m-skew-topright";
            if (pageX > rightOffset - widthoffset && pageY > bottomOffset - heightoffset)
                return "e-m-skew-bottomright";
            if (pageX < leftOffset + widthoffset && pageY > bottomOffset - heightoffset)
                return "e-m-skew-bottomleft";
            if (pageX > leftOffset + widthoffset && pageY < topOffset + heightoffset && pageX < rightOffset - widthoffset)
                return "e-m-skew-top";
            if (pageX < leftOffset + widthoffset)
                return "e-m-skew-left";
            if (pageX > rightOffset - widthoffset)
                return "e-m-skew-right";
            if (pageY > bottomOffset - heightoffset)
                return "e-m-skew-bottom";
            return "e-m-skew-center";
        },
        //Removes the added Skew class on the element
        _removeSkewClass: function (element) {
            $(element).removeClass("e-m-skew-top e-m-skew-bottom e-m-skew-left e-m-skew-right e-m-skew-topleft e-m-skew-topright e-m-skew-bottomleft e-m-skew-bottomright e-m-skew-center e-skew-top e-skew-bottom e-skew-left e-skew-right e-skew-topleft e-skew-topright e-skew-bottomleft e-skew-bottomright e-skew-center");
        },
        //Object.keys  method to support all the browser including IE8.
        _getObjectKeys: function (obj) {
            var i, keys = [];
            obj = Object.prototype.toString.call(obj) === Object.prototype.toString() ? obj : {};
            if (!Object.keys) {
                for (i in obj) {
                    if (obj.hasOwnProperty(i))
                        keys.push(i);
                }
                return keys;
            }
            if (Object.keys)
                return Object.keys(obj);
        },
        _touchStartPoints: function (evt, object) {
            if (evt) {
                var point = evt.touches ? evt.touches[0] : evt;
                object._distX = 0;
                object._distY = 0;
                object._moved = false;
                object._pointX = point.pageX;
                object._pointY = point.pageY;
            }
        },
        _isTouchMoved: function (evt, object) {
            if (evt) {
                var point = evt.touches ? evt.touches[0] : evt,
                deltaX = point.pageX - object._pointX,
                deltaY = point.pageY - object._pointY,
                timestamp = Date.now(),
                newX, newY,
                absDistX, absDistY;
                object._pointX = point.pageX;
                object._pointY = point.pageY;
                object._distX += deltaX;
                object._distY += deltaY;
                absDistX = Math.abs(object._distX);
                absDistY = Math.abs(object._distY);
                return !(absDistX < 5 && absDistY < 5);
            }
        },
        //To bind events for element
        listenEvents: function (selectors, eventTypes, handlers, remove, pluginObj, disableMouse) {
            for (var i = 0; i < selectors.length; i++) {
                ej.listenTouchEvent(selectors[i], eventTypes[i], handlers[i], remove, pluginObj, disableMouse);
            }
        },
        //To bind touch events for element
        listenTouchEvent: function (selector, eventType, handler, remove, pluginObj, disableMouse) {
            var event = remove ? "removeEventListener" : "addEventListener";
            var jqueryEvent = remove ? "off" : "on";
            var elements = $(selector);
            for (var i = 0; i < elements.length; i++) {
                var element = elements[i];
                switch (eventType) {
                    case "touchstart":
                        ej._bindEvent(element, event, eventType, handler, "mousedown", "MSPointerDown", "pointerdown", disableMouse);
                        break;
                    case "touchmove":
                        ej._bindEvent(element, event, eventType, handler, "mousemove", "MSPointerMove", "pointermove", disableMouse);
                        break;
                    case "touchend":
                        ej._bindEvent(element, event, eventType, handler, "mouseup", "MSPointerUp", "pointerup", disableMouse);
                        break;
                    case "touchcancel":
                        ej._bindEvent(element, event, eventType, handler, "mousecancel", "MSPointerCancel", "pointercancel", disableMouse);
                        break;
                    case "tap": case "taphold": case "ejtouchmove": case "click":
                        $(element)[jqueryEvent](eventType, handler);
                        break;
                    default:
                        if (ej.browserInfo().name == "msie" && ej.browserInfo().version < 9)
                            pluginObj["_on"]($(element), eventType, handler);
                        else
                            element[event](eventType, handler, true);
                        break;
                }
            }
        },
        //To bind events for element
        _bindEvent: function (element, event, eventType, handler, mouseEvent, pointerEvent, ie11pointerEvent, disableMouse) {
            if ($.support.hasPointer)
                element[event](window.navigator.pointerEnabled ? ie11pointerEvent : pointerEvent, handler, true);
            else
                element[event](eventType, handler, true);
        },
        _browser: function () {
            return (/webkit/i).test(navigator.appVersion) ? 'webkit' : (/firefox/i).test(navigator.userAgent) ? 'Moz' : (/trident/i).test(navigator.userAgent) ? 'ms' : 'opera' in window ? 'O' : '';
        },
        styles: document.createElement('div').style,
        /**
       * To get the userAgent Name     
       * @example             
       * &lt;script&gt;
       *       ej.userAgent();//return user agent name
       * &lt;/script&gt         
       * @memberof AppView
       * @instance
       */
        userAgent: function () {
            var agents = 'webkitT,t,MozT,msT,OT'.split(','),
            t,
            i = 0,
            l = agents.length;

            for (; i < l; i++) {
                t = agents[i] + 'ransform';
                if (t in ej.styles) {
                    return agents[i].substr(0, agents[i].length - 1);
                }
            }

            return false;
        },
        addPrefix: function (style) {
            if (ej.userAgent() === '') return style;

            style = style.charAt(0).toUpperCase() + style.substr(1);
            return ej.userAgent() + style;
        },
        //To Prevent Default Exception

        //To destroy the mobile widgets
        destroyWidgets: function (element) {
            var dataEl = $(element).find("[data-role *= ejm]");
            dataEl.each(function (index, element) {
                var $element = $(element);
                var plugin = $element.data("ejWidgets");
                if (plugin)
                    $element[plugin]("destroy");
            });
        },
        //Get the attribute value of element
        getAttrVal: function (ele, val, option) {
            /// <summary>Util to get the property from data attributes</summary>
            /// <param name="ele" type="Object"></param>
            /// <param name="val" type="String"></param>
            /// <param name="option" type="GenericType"></param>
            /// <returns type="GenericType"></returns>
            var value = $(ele).attr(val);
            if (value != null)
                return value;
            else
                return option;
        },

        // Get the offset value of element
        getOffset: function (ele) {
            var pos = {};
            var offsetObj = ele.offset() || { left: 0, top: 0 };
            $.extend(true, pos, offsetObj);
            if ($("body").css("position") != "static") {
                var bodyPos = $("body").offset();
                pos.left -= bodyPos.left;
                pos.top -= bodyPos.top;
            }
            return pos;
        },

        // Z-index calculation for the element
        getZindexPartial: function (element, popupEle) {
            if (!ej.isNullOrUndefined(element) && element.length > 0) {
                var parents = element.parents(), bodyEle;
                bodyEle = $('body').children();
                if (!ej.isNullOrUndefined(element) && element.length > 0)
                    bodyEle.splice(bodyEle.index(popupEle), 1);
                $(bodyEle).each(function (i, ele) { parents.push(ele); });

                var maxZ = Math.max.apply(maxZ, $.map(parents, function (e, n) {
                    if ($(e).css('position') != 'static') return parseInt($(e).css('z-index')) || 1;
                }));
                if (!maxZ || maxZ < 10000) maxZ = 10000;
                else maxZ += 1;
                return maxZ;
            }
        },

        isValidAttr: function (element, attribute) {
            var element = $(element)[0];
            if (typeof element[attribute] != "undefined")
                return true;
            else {
                var _isValid = false;
                $.each(element, function (key) {
                    if (key.toLowerCase() == attribute.toLowerCase()) {
                        _isValid = true;
                        return false;
                    }
                });
            }
            return _isValid;
        }

    };

    $.extend(ej, ej.util);

    // base class for all ej widgets. It will automatically inhertied
    ej.widgetBase = {
        droppables: { 'default': [] },
        resizables: { 'default': [] },

        _renderEjTemplate: function (selector, data, index, prop, ngTemplateType) {
            var type = null;
            if (typeof selector === "object" || selector.startsWith("#") || selector.startsWith("."))
                type = $(selector).attr("type");
            if (type) {
                type = type.toLowerCase();
                if (ej.template[type])
                    return ej.template[type](this, selector, data, index, prop);
            }
            // For ejGrid Angular2 Template Support
            else if (!ej.isNullOrUndefined(ngTemplateType))
                 return ej.template['text/x-'+ ngTemplateType](this, selector, data, index, prop);
            return ej.template.render(this, selector, data, index, prop);
        },

        destroy: function () {

            if (this._trigger("destroy"))
                return;

            if (this.model.enablePersistence) {
                this.persistState();
                $(window).off("unload", this._persistHandler);
            }

            try {
                this._destroy();
            } catch (e) { }

            var arr = this.element.data("ejWidgets") || [];
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] == this.pluginName) {
                    arr.splice(i, 1);
                }
            }
            if (!arr.length)
                this.element.removeData("ejWidgets");

            while (this._events) {
                var item = this._events.pop(), args = [];

                if (!item)
                    break;

                for (var i = 0; i < item[1].length; i++)
                    if (!$.isPlainObject(item[1][i]))
                        args.push(item[1][i]);

                $.fn.off.apply(item[0], args);
            }

            this._events = null;

            this.element
                .removeClass(ej.util.getNameSpace(this.sfType))
                .removeClass("e-js")
                .removeData(this.pluginName);

            this.element = null;
            this.model = null;
        },

        _on: function (element) {
            if (!this._events)
                this._events = [];
            var args = [].splice.call(arguments, 1, arguments.length - 1);

            var handler = {}, i = args.length;
            while (handler && typeof handler !== "function") {
                handler = args[--i];
            }

            args[i] = ej.proxy(args[i], this);

            this._events.push([element, args, handler, args[i]]);

            $.fn.on.apply(element, args);

            return this;
        },

        _off: function (element, eventName, selector, handlerObject) {
            var e = this._events, temp;
            if (!e || !e.length)
                return this;
            if (typeof selector == "function") {
                temp = handlerObject;
                handlerObject = selector;
                selector = temp;
            }
            var t = (eventName.match(/\S+/g) || [""]);
            for (var i = 0; i < e.length; i++) {
                var arg = e[i],
                r = arg[0].length && (!handlerObject || arg[2] === handlerObject) && (arg[1][0] === eventName || t[0]) && (!selector || arg[1][1] === selector) && $.inArray(element[0], arg[0]) > -1;
                if (r) {
                    $.fn.off.apply(element, handlerObject ? [eventName, selector, arg[3]] : [eventName, selector]);
                    e.splice(i, 1);
                    break;
                }
            }

            return this;
        },

        // Client side events wire-up / trigger helper.
        _trigger: function (eventName, eventProp) {
            var fn = null, returnValue, args, clientProp = {};
            $.extend(clientProp, eventProp)

            if (eventName in this.model)
                fn = this.model[eventName];

            if (fn) {
                if (typeof fn === "string") {
                    fn = ej.util.getObject(fn, window);
                }

                if ($.isFunction(fn)) {

                    args = ej.event(eventName, this.model, eventProp);

                    var scopeFn = this.model["_applyScope"];

                    returnValue = fn.call(this, args);

                    scopeFn && scopeFn.call();

                    // sending changes back - deep copy option should not be enabled for this $.extend 
                    if (eventProp) $.extend(eventProp, args);

                    if (args.cancel || !ej.isNullOrUndefined(returnValue))
                        return returnValue === false || args.cancel;
                }
            }

            var isPropDefined = Boolean(eventProp);
            eventProp = eventProp || {};
            eventProp.originalEventType = eventName;
            eventProp.type = this.pluginName + eventName;

            args = $.Event(eventProp.type, ej.event(eventProp.type, this.model, eventProp));

            this.element && this.element.trigger(args);

            // sending changes back - deep copy option should not be enabled for this $.extend 
            if (isPropDefined) $.extend(eventProp, args);

            if (ej.isOnWebForms && args.cancel == false && this.model.serverEvents && this.model.serverEvents.length)
                ej.raiseWebFormsServerEvents(eventName, eventProp, clientProp);

            return args.cancel;
        },

        setModel: function (options, forceSet) {
            // check for whether to apply values are not. if _setModel function is defined in child,
            //  this will call that function and validate it using return value

            if (this._trigger("modelChange", { "changes": options }))
                return;

            for (var prop in options) {
                if (!forceSet) {
                    if (this.model[prop] === options[prop]) {
                        delete options[prop];
                        continue;
                    }
                    if ($.isPlainObject(options[prop])) {
                        iterateAndRemoveProps(this.model[prop], options[prop]);
                        if ($.isEmptyObject(options[prop])) {
                            delete options[prop];
                            continue;
                        }
                    }
                }

                if (this.dataTypes) {
                    var returnValue = this._isValidModelValue(prop, this.dataTypes, options);
                    if (returnValue !== true)
                        throw "setModel - Invalid input for property :" + prop + " - " + returnValue;
                }
                if (this.model.notifyOnEachPropertyChanges && this.model[prop] !== options[prop]) {
                    var arg = {
                        oldValue: this.model[prop],
                        newValue: options[prop]
                    };

                    options[prop] = this._trigger(prop + "Change", arg) ? this.model[prop] : arg.newValue;
                }
            }
            if ($.isEmptyObject(options))
                return;

            if (this._setFirst) {
                var ds = options.dataSource;
                if (ds) delete options.dataSource;

                $.extend(true, this.model, options);
                if (ds) {
                    this.model.dataSource = (ds instanceof Array) ? ds.slice() : ds;
                    options["dataSource"] = this.model.dataSource;
                }
                !this._setModel || this._setModel(options);

            } else if (!this._setModel || this._setModel(options) !== false) {
                $.extend(true, this.model, options);
            }
            if ("enablePersistence" in options) {
                this._setState(options.enablePersistence);
            }
        },
        option: function (prop, value, forceSet) {
            if (!prop)
                return this.model;

            if ($.isPlainObject(prop))
                return this.setModel(prop, forceSet);

            if (typeof prop === "string") {
                prop = prop.replace(/^model\./, "");
                var oldValue = ej.getObject(prop, this.model);

                if (value === undefined && !forceSet)
                    return oldValue;

                if (prop === "enablePersistence")
                    return this._setState(value);

                if (forceSet && value === ej.extensions.modelGUID) {
                    return this._setModel(ej.createObject(prop, ej.getObject(prop, this.model), {}));
                }

                if (forceSet || ej.getObject(prop, this.model) !== value)
                    return this.setModel(ej.createObject(prop, value, {}), forceSet);
            }
            return undefined;
        },

        _isValidModelValue: function (prop, types, options) {
            var value = types[prop], option = options[prop], returnValue;

            if (!value)
                return true;

            if (typeof value === "string") {
                if (value == "enum") {
                    options[prop] = option ? option.toString().toLowerCase() : option;
                    value = "string";
                }

                if (value === "array") {
                    if (Object.prototype.toString.call(option) === '[object Array]')
                        return true;
                }
                else if (value === "data") {
                    return true;
                }
                else if (value === "parent") {
                    return true;
                }
                else if (typeof option === value)
                    return true;

                return "Expected type - " + value;
            }

            if (option instanceof Array) {
                for (var i = 0; i < option.length; i++) {
                    returnValue = this._isValidModelValue(prop, types, option[i]);
                    if (returnValue !== true) {
                        return " [" + i + "] - " + returnValue;
                    }
                }
                return true;
            }

            for (var innerProp in option) {
                returnValue = this._isValidModelValue(innerProp, value, option);
                if (returnValue !== true)
                    return innerProp + " : " + returnValue;
            }

            return true;
        },

        _returnFn: function (obj, propName) {
            if (propName.indexOf('.') != -1) {
                this._returnFn(obj[propName.split('.')[0]], propName.split('.').slice(1).join('.'));
            }
            else
                obj[propName] = obj[propName].call(obj.propName);
        },

        _removeCircularRef: function (obj) {
            var seen = [];
            function detect(obj, key, parent) {
                if (typeof obj != 'object') { return; }
                if (!Array.prototype.indexOf) {
                    Array.prototype.indexOf = function (val) {
                        return jQuery.inArray(val, this);
                    };
                }
                if (seen.indexOf(obj) >= 0) {
                    delete parent[key];
                    return;
                }
                seen.push(obj);
                for (var k in obj) { //dive on the object's children
                    if (obj.hasOwnProperty(k)) { detect(obj[k], k, obj); }
                }
                seen.pop();
                return;
            }
            detect(obj, 'obj', null);
            return obj;
        },

        stringify: function (model, removeCircular) {
            var observables = this.observables;
            for (var k = 0; k < observables.length; k++) {
                var val = ej.getObject(observables[k], model);
                if (!ej.isNullOrUndefined(val) && typeof (val) === "function")
                    this._returnFn(model, observables[k]);
            }
            if (removeCircular) model = this._removeCircularRef(model);
            return JSON.stringify(model);
        },

        _setState: function (val) {
            if (val === true) {
                this._persistHandler = ej.proxy(this.persistState, this);
                $(window).on("unload", this._persistHandler);
            } else {
                this.deleteState();
                $(window).off("unload", this._persistHandler);
            }
        },

        _removeProp: function (obj, propName) {
            if (!ej.isNullOrUndefined(obj)) {
                if (propName.indexOf('.') != -1) {
                    this._removeProp(obj[propName.split('.')[0]], propName.split('.').slice(1).join('.'));
                }
                else
                    delete obj[propName];
            }
        },

        persistState: function () {
            var model;

            if (this._ignoreOnPersist) {
                model = copyObject({}, this.model);
                for (var i = 0; i < this._ignoreOnPersist.length; i++) {
                    this._removeProp(model, this._ignoreOnPersist[i]);
                }
                model.ignoreOnPersist = this._ignoreOnPersist;
            } else if (this._addToPersist) {
                model = {};
                for (var i = 0; i < this._addToPersist.length; i++) {
                    ej.createObject(this._addToPersist[i], ej.getObject(this._addToPersist[i], this.model), model);
                }
                model.addToPersist = this._addToPersist;
            } else {
                model = copyObject({}, this.model);
            }

            if (this._persistState) {
                model.customPersists = {};
                this._persistState(model.customPersists);
            }

            if (window.localStorage) {
                if (!ej.isNullOrUndefined(ej.persistStateVersion) && window.localStorage.getItem("persistKey") == null)
                    window.localStorage.setItem("persistKey", ej.persistStateVersion);
                window.localStorage.setItem("$ej$" + this.pluginName + this._id, JSON.stringify(model));
            }
            else if (document.cookie) {
                if (!ej.isNullOrUndefined(ej.persistStateVersion) && ej.cookie.get("persistKey") == null)
                    ej.cookie.set("persistKey", ej.persistStateVersion);
                ej.cookie.set("$ej$" + this.pluginName + this._id, model);
            }
        },

        deleteState: function () {
            if (window.localStorage)
                window.localStorage.removeItem("$ej$" + this.pluginName + this._id);
            else if (document.cookie)
                ej.cookie.set("$ej$" + this.pluginName + this._id, model, new Date());
        },

        restoreState: function (silent) {
            var value = null;
            if (window.localStorage)
                value = window.localStorage.getItem("$ej$" + this.pluginName + this._id);
            else if (document.cookie)
                value = ej.cookie.get("$ej$" + this.pluginName + this._id);

            if (value) {
                var model = JSON.parse(value);

                if (this._restoreState) {
                    this._restoreState(model.customPersists);
                    delete model.customPersists;
                }

                if (ej.isNullOrUndefined(model) === false)
                    if (!ej.isNullOrUndefined(model.ignoreOnPersist)) {
                        this._ignoreOnPersist = model.ignoreOnPersist;
                        delete model.ignoreOnPersist;
                    } else if (!ej.isNullOrUndefined(model.addToPersist)) {
                        this._addToPersist = model.addToPersist;
                        delete model.addToPersist;
                    }
            }
            if (!ej.isNullOrUndefined(model) && !ej.isNullOrUndefined(this._ignoreOnPersist)) {
                for (var i in this._ignoreOnPersist) {
                    if (this._ignoreOnPersist[i].indexOf('.') !== -1)
                        ej.createObject(this._ignoreOnPersist[i], ej.getObject(this._ignoreOnPersist[i], this.model), model);
                    else
                        model[this._ignoreOnPersist[i]] = this.model[this._ignoreOnPersist[i]];
                }
                this.model = model;
            }
            else
                this.model = $.extend(true, this.model, model);

            if (!silent && value && this._setModel)
                this._setModel(this.model);
        },

        //to prevent persistence
        ignoreOnPersist: function (properties) {
            var collection = [];
            if (typeof (properties) == "object")
                collection = properties;
            else if (typeof (properties) == 'string')
                collection.push(properties);
            if (this._addToPersist === undefined) {
                this._ignoreOnPersist = this._ignoreOnPersist || [];
                for (var i = 0; i < collection.length; i++) {
                    this._ignoreOnPersist.push(collection[i]);
                }
            } else {
                for (var i = 0; i < collection.length; i++) {
                    var index = this._addToPersist.indexOf(collection[i]);
                    this._addToPersist.splice(index, 1);
                }
            }
        },

        //to maintain persistence
        addToPersist: function (properties) {
            var collection = [];
            if (typeof (properties) == "object")
                collection = properties;
            else if (typeof (properties) == 'string')
                collection.push(properties);
            if (this._addToPersist === undefined) {
                this._ignoreOnPersist = this._ignoreOnPersist || [];
                for (var i = 0; i < collection.length; i++) {
                    var index = this._ignoreOnPersist.indexOf(collection[i]);
                    this._ignoreOnPersist.splice(index, 1);
                }
            } else {
                for (var i = 0; i < collection.length; i++) {
                    if ($.inArray(collection[i], this._addToPersist) === -1)
                        this._addToPersist.push(collection[i]);
                }
            }
        },

        // Get formatted text 
        formatting: function (formatstring, str, locale) {
            formatstring = formatstring.replace(/%280/g, "\"").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
            locale = ej.preferredCulture(locale) ? locale : "en-US";
            var s = formatstring;
            var frontHtmlidx, FrontHtml, RearHtml, lastidxval;
            frontHtmlidx = formatstring.split("{0:");
            lastidxval = formatstring.split("}");
            FrontHtml = frontHtmlidx[0];
            RearHtml = lastidxval[1];
            if (typeof (str) == "string" && $.isNumeric(str))
                str = Number(str);
            if (formatstring.indexOf("{0:") != -1) {
                var toformat = new RegExp("\\{0(:([^\\}]+))?\\}", "gm");
                var formatVal = toformat.exec(formatstring);
                if (formatVal != null && str != null) {
                    if (FrontHtml != null && RearHtml != null)
                        str = FrontHtml + ej.format(str, formatVal[2], locale) + RearHtml;
                    else
                        str = ej.format(str, formatVal[2], locale);
                } else if (str != null)
                    str = str;
                else
                    str = "";
                return str;
            } else if (s.startsWith("{") && !s.startsWith("{0:")) {
                var fVal = s.split(""), str = (str || "") + "", strSplt = str.split(""), formats = /[0aA\*CN<>\?]/gm;
                for (var f = 0, f, val = 0; f < fVal.length; f++)
                    fVal[f] = formats.test(fVal[f]) ? "{" + val++ + "}" : fVal[f];
                return String.format.apply(String, [fVal.join("")].concat(strSplt)).replace('{', '').replace('}', '');
            } else if (this.data != null && this.data.Value == null) {
                $.each(this.data, function (dataIndex, dataValue) {
                    s = s.replace(new RegExp('\\{' + dataIndex + '\\}', 'gm'), dataValue);
                });
                return s;
            } else {
                return this.data.Value;
            }
        },
    };

    ej.WidgetBase = function () {
    }

    var iterateAndRemoveProps = function (source, target) {
        for (var prop in source) {
            if (source[prop] === target[prop])
                delete target[prop];
            if ($.isPlainObject(target[prop]) && $.isPlainObject(source[prop]))
                iterateAndRemoveProps(source[prop], target[prop]);
        }
    }

    ej.widget = function (pluginName, className, proto) {
        /// <summary>Widget helper for developers, this set have predefined function to jQuery plug-ins</summary>
        /// <param name="pluginName" type="String">the plugin name that will be added in jquery.fn</param>
        /// <param name="className" type="String">the class name for your plugin, this will help create default cssClas</param>
        /// <param name="proto" type="Object">prototype for of the plug-in</param>

        if (typeof pluginName === "object") {
            proto = className;
            for (var prop in pluginName) {
                var name = pluginName[prop];

                if (name instanceof Array) {
                    proto._rootCSS = name[1];
                    name = name[0];
                }

                ej.widget(prop, name, proto);

                if (pluginName[prop] instanceof Array)
                    proto._rootCSS = "";
            }

            return;
        }

        var nameSpace = proto._rootCSS || ej.getNameSpace(className);

        proto = ej.defineClass(className, function (element, options) {

            this.sfType = className;
            this.pluginName = pluginName;
            this.instance = pInstance;

            if (ej.isNullOrUndefined(this._setFirst))
                this._setFirst = true;

            this["ob.values"] = {};

            $.extend(this, ej.widgetBase);

            if (this.dataTypes) {
                for (var property in options) {
                    var returnValue = this._isValidModelValue(property, this.dataTypes, options);
                    if (returnValue !== true)
                        throw "setModel - Invalid input for property :" + property + " - " + returnValue;
                }
            }

            var arr = (element.data("ejWidgets") || []);
            arr.push(pluginName);
            element.data("ejWidgets", arr);

            for (var i = 0; ej.widget.observables && this.observables && i < this.observables.length; i++) {
                var t = ej.getObject(this.observables[i], options);
                if (t) ej.createObject(this.observables[i], ej.widget.observables.register(t, this.observables[i], this, element), options);
            }

            this.element = element.jquery ? element : $(element);
            this.model = copyObject(true, {}, proto.prototype.defaults, options);
            this.model.keyConfigs = copyObject(this.keyConfigs);

            this.element.addClass(nameSpace + " e-js").data(pluginName, this);

            this._id = element[0].id;

            if (this.model.enablePersistence) {
                if (window.localStorage && !ej.isNullOrUndefined(ej.persistStateVersion) && window.localStorage.getItem("persistKey") != ej.persistStateVersion) {
                    for (var i in window.localStorage) {
                        if (i.indexOf("$ej$") != -1) {
                            window.localStorage.removeItem(i); //removing the previously stored plugin item from local storage
							window.localStorage.setItem("persistKey", ej.persistStateVersion);
						}				
                    }
                }
                else if (document.cookie && !ej.isNullOrUndefined(ej.persistStateVersion) && ej.cookie.get("persistKey") != ej.persistStateVersion) {
                    var splits = document.cookie.split(/; */);
                    for (var k in splits) {
                        if (k.indexOf("$ej$") != -1) {
                            ej.cookie.set(k.split("=")[0], model, new Date()); //removing the previously stored plugin item from local storage
							ej.cookie.set("persistKey", ej.persistStateVersion);
						}		
                    }
                }
                this._persistHandler = ej.proxy(this.persistState, this);
                $(window).on("unload", this._persistHandler);
                this.restoreState(true);
            }

            this._init(options);

            if (typeof this.model.keyConfigs === "object" && !(this.model.keyConfigs instanceof Array)) {
                var requiresEvt = false;
                if (this.model.keyConfigs.focus)
                    this.element.attr("accesskey", this.model.keyConfigs.focus);

                for (var keyProps in this.model.keyConfigs) {
                    if (keyProps !== "focus") {
                        requiresEvt = true;
                        break;
                    }
                }

                if (requiresEvt && this._keyPressed) {
                    var el = element, evt = "keydown";

                    if (this.keySettings) {
                        el = this.keySettings.getElement ? this.keySettings.getElement() || el : el;
                        evt = this.keySettings.event || evt;
                    }

                    this._on(el, evt, function (e) {
                        if (!this.model.keyConfigs) return;

                        var action = keyFn.getActionFromCode(this.model.keyConfigs, e.which, e.ctrlKey, e.shiftKey, e.altKey);
                        var arg = {
                            code: e.which,
                            ctrl: e.ctrlKey,
                            alt: e.altKey,
                            shift: e.shiftKey
                        };
                        if (!action) return;

                        if (this._keyPressed(action, e.target, arg, e) === false)
                            e.preventDefault();
                    });
                }
            }
            this._trigger("create");
        }, proto);

        $.fn[pluginName] = function (options) {
            var opt = options, args;
            for (var i = 0; i < this.length; i++) {

                var $this = $(this[i]),
                    pluginObj = $this.data(pluginName),
                    isAlreadyExists = pluginObj && $this.hasClass(nameSpace),
                    obj = null;

                if (this.length > 0 && $.isPlainObject(opt))
                    options = ej.copyObject({}, opt);

                // ----- plug-in creation/init
                if (!isAlreadyExists) {
                    if (proto.prototype._requiresID === true && !$(this[i]).attr("id")) {
                        $this.attr("id", getUid("ejControl_"));
                    }
                    if (!options || typeof options === "object") {
                        if (proto.prototype.defaults && !ej.isNullOrUndefined(ej.setCulture) && "locale" in proto.prototype.defaults && pluginName != "ejChart") {
                            if (options && !("locale" in options)) options.locale = ej.setCulture().name;
                            else if (ej.isNullOrUndefined(options)) {
                                options = {}; options.locale = ej.setCulture().name;
                            }
                        }
                        new proto($this, options);
                    }
                    else {
                        throwError(pluginName + ": methods/properties can be accessed only after plugin creation");
                    }
                    continue;
                }

                if (!options) continue;

                args = [].slice.call(arguments, 1);

                if (this.length > 0 && args[0] && opt === "option" && $.isPlainObject(args[0])) {
                    args[0] = ej.copyObject({}, args[0]);
                }

                // --- Function/property set/access
                if ($.isPlainObject(options)) {
                    // setModel using JSON object
                    pluginObj.setModel(options);
                }

                    // function/property name starts with "_" is private so ignore it.
                else if (options.indexOf('_') !== 0
                    && !ej.isNullOrUndefined(obj = ej.getObject(options, pluginObj))
                    || options.indexOf("model.") === 0) {

                    if (!obj || !$.isFunction(obj)) {

                        // if property is accessed, then break the jquery chain
                        if (arguments.length == 1)
                            return obj;

                        //setModel using string input
                        pluginObj.option(options, arguments[1]);

                        continue;
                    }

                    var value = obj.apply(pluginObj, args);

                    // If function call returns any value, then break the jquery chain
                    if (value !== undefined)
                        return value;

                } else {
                    throwError(className + ": function/property - " + options + " does not exist");
                }
            }
            if (pluginName.indexOf("ejm") != -1)
                ej.widget.registerInstance($this, pluginName, className, proto.prototype);
            // maintaining jquery chain
            return this;
        };

        ej.widget.register(pluginName, className, proto.prototype);
        ej.loadLocale(pluginName);
    };

    ej.loadLocale = function (pluginName) {
        var i, len, locales = ej.locales;
        for (i = 0, len = locales.length; i < len; i++)
            $.fn["Locale_" + locales[i]](pluginName);
    };


    $.extend(ej.widget, (function () {
        var _widgets = {}, _registeredInstances = [],

        register = function (pluginName, className, prototype) {
            if (!ej.isNullOrUndefined(_widgets[pluginName]))
                throwError("ej.widget : The widget named " + pluginName + " is trying to register twice.");

            _widgets[pluginName] = { name: pluginName, className: className, proto: prototype };

            ej.widget.extensions && ej.widget.extensions.registerWidget(pluginName);
        },
        registerInstance = function (element, pluginName, className, prototype) {
            _registeredInstances.push({ element: element, pluginName: pluginName, className: className, proto: prototype });
        }

        return {
            register: register,
            registerInstance: registerInstance,
            registeredWidgets: _widgets,
            registeredInstances: _registeredInstances
        };

    })());

    ej.widget.destroyAll = function (elements) {
        if (!elements || !elements.length) return;

        for (var i = 0; i < elements.length; i++) {
            var data = elements.eq(i).data(), wds = data["ejWidgets"];
            if (wds && wds.length) {
                for (var j = 0; j < wds.length; j++) {
                    if (data[wds[j]] && data[wds[j]].destroy)
                        data[wds[j]].destroy();
                }
            }
        }
    };

    ej.cookie = {
        get: function (name) {
            var value = RegExp(name + "=([^;]+)").exec(document.cookie);

            if (value && value.length > 1)
                return value[1];

            return undefined;
        },
        set: function (name, value, expiryDate) {
            if (typeof value === "object")
                value = JSON.stringify(value);

            value = escape(value) + ((expiryDate == null) ? "" : "; expires=" + expiryDate.toUTCString());
            document.cookie = name + "=" + value;
        }
    };

    var keyFn = {
        getActionFromCode: function (keyConfigs, keyCode, isCtrl, isShift, isAlt) {
            isCtrl = isCtrl || false;
            isShift = isShift || false;
            isAlt = isAlt || false;

            for (var keys in keyConfigs) {
                if (keys === "focus") continue;

                var key = keyFn.getKeyObject(keyConfigs[keys]);
                for (var i = 0; i < key.length; i++) {
                    if (keyCode === key[i].code && isCtrl == key[i].isCtrl && isShift == key[i].isShift && isAlt == key[i].isAlt)
                        return keys;
                }
            }
            return null;
        },
        getKeyObject: function (key) {
            var res = {
                isCtrl: false,
                isShift: false,
                isAlt: false
            };
            var tempRes = $.extend(true, {}, res);
            var $key = key.split(","), $res = [];
            for (var i = 0; i < $key.length; i++) {
                var rslt = null;
                if ($key[i].indexOf("+") != -1) {
                    var k = $key[i].split("+");
                    for (var j = 0; j < k.length; j++) {
                        rslt = keyFn.getResult($.trim(k[j]), res);
                    }
                }
                else {
                    rslt = keyFn.getResult($.trim($key[i]), $.extend(true, {}, tempRes));
                }
                $res.push(rslt);
            }
            return $res;
        },
        getResult: function (key, res) {
            if (key === "ctrl")
                res.isCtrl = true;
            else if (key === "shift")
                res.isShift = true;
            else if (key === "alt")
                res.isAlt = true;
            else res.code = parseInt(key, 10);
            return res;
        }
    };

    ej.getScrollableParents = function (element) {
        return $(element).parentsUntil("html").filter(function () {
            return $(this).css("overflow") != "visible";
        }).add($(window));
    }
    ej.browserInfo = function () {
        var browser = {}, clientInfo = [],
        browserClients = {
            opera: /(opera|opr)(?:.*version|)[ \/]([\w.]+)/i, edge: /(edge)(?:.*version|)[ \/]([\w.]+)/i, webkit: /(chrome)[ \/]([\w.]+)/i, safari: /(webkit)[ \/]([\w.]+)/i, msie: /(msie|trident) ([\w.]+)/i, mozilla: /(mozilla)(?:.*? rv:([\w.]+)|)/i
        };
        for (var client in browserClients) {
            if (browserClients.hasOwnProperty(client)) {
                clientInfo = navigator.userAgent.match(browserClients[client]);
                if (clientInfo) {
                    browser.name = clientInfo[1].toLowerCase() == "opr" ? "opera" : clientInfo[1].toLowerCase();
                    browser.version = clientInfo[2];
                    browser.culture = {};
                    browser.culture.name = browser.culture.language = navigator.language || navigator.userLanguage;
                    if (typeof (ej.globalize) != 'undefined') {
                        var oldCulture = ej.preferredCulture().name;
                        var culture = (navigator.language || navigator.userLanguage) ? ej.preferredCulture(navigator.language || navigator.userLanguage) : ej.preferredCulture("en-US");
                        for (var i = 0; (navigator.languages) && i < navigator.languages.length; i++) {
                            culture = ej.preferredCulture(navigator.languages[i]);
                            if (culture.language == navigator.languages[i])
                                break;
                        }
                        ej.preferredCulture(oldCulture);
                        $.extend(true, browser.culture, culture);
                    }
                    if (!!navigator.userAgent.match(/Trident\/7\./)) {
                        browser.name = "msie";
                    }
                    break;
                }
            }
        }
        browser.isMSPointerEnabled = (browser.name == 'msie') && browser.version > 9 && window.navigator.msPointerEnabled;
        browser.pointerEnabled = window.navigator.pointerEnabled;
        return browser;
    };
    ej.eventType = {
        mouseDown: "mousedown touchstart",
        mouseMove: "mousemove touchmove",
        mouseUp: "mouseup touchend",
        mouseLeave: "mouseleave touchcancel",
        click: "click touchend"
    };

    ej.event = function (type, data, eventProp) {

        var e = $.extend(eventProp || {},
            {
                "type": type,
                "model": data,
                "cancel": false
            });

        return e;
    };

    ej.proxy = function (fn, context, arg) {
        if (!fn || typeof fn !== "function")
            return null;

        if ('on' in fn && context)
            return arg ? fn.on(context, arg) : fn.on(context);

        return function () {
            var args = arg ? [arg] : []; args.push.apply(args, arguments);
            return fn.apply(context || this, args);
        };
    };

    ej.hasStyle = function (prop) {
        var style = document.documentElement.style;

        if (prop in style) return true;

        var prefixs = ['ms', 'Moz', 'Webkit', 'O', 'Khtml'];

        prop = prop[0].toUpperCase() + prop.slice(1);

        for (var i = 0; i < prefixs.length; i++) {
            if (prefixs[i] + prop in style)
                return true;
        }

        return false;
    };

    Array.prototype.indexOf = Array.prototype.indexOf || function (searchElement) {
        var len = this.length;

        if (len === 0) return -1;

        for (var i = 0; i < len; i++) {
            if (i in this && this[i] === searchElement)
                return i;
        }
        return -1;
    };

    String.prototype.startsWith = String.prototype.startsWith || function (key) {
        return this.slice(0, key.length) === key;
    };
    var copyObject = ej.copyObject = function (isDeepCopy, target) {
        var start = 2, current, source;
        if (typeof isDeepCopy !== "boolean") {
            start = 1;
        }
        var objects = [].slice.call(arguments, start);
        if (start === 1) {
            target = isDeepCopy;
            isDeepCopy = undefined;
        }

        for (var i = 0; i < objects.length; i++) {
            for (var prop in objects[i]) {
                current = target[prop], source = objects[i][prop];

                if (source === undefined || current === source || objects[i] === source || target === source)
                    continue;
                if (source instanceof Array) {
                    if (i === 0 && isDeepCopy) {
                        target[prop] = new Array();
                        for (var j = 0; j < source.length; j++) {
                            copyObject(true, target[prop], source);
                        }
                    }
                    else
                        target[prop] = source.slice();
                }
                else if (ej.isPlainObject(source)) {
                    target[prop] = current || {};
                    if (isDeepCopy)
                        copyObject(isDeepCopy, target[prop], source);
                    else
                        copyObject(target[prop], source);
                } else
                    target[prop] = source;
            }
        }
        return target;
    };
    var pInstance = function () {
        return this;
    }

    var _uid = 0;
    var getUid = function (prefix) {
        return prefix + _uid++;
    }

    ej.template = {};

    ej.template.render = ej.template["text/x-jsrender"] = function (self, selector, data, index, prop) {
        if (selector.slice(0, 1) !== "#")
            selector = ["<div>", selector, "</div>"].join("");
        var property = { prop: prop, index: index };
        return $(selector).render(data, property);
    }

    ej.isPlainObject = function (obj) {
        if (!obj) return false;
        if (ej.DataManager !== undefined && obj instanceof ej.DataManager) return false;
        if (typeof obj !== "object" || obj.nodeType || jQuery.isWindow(obj)) return false;
        try {
            if (obj.constructor &&
                !obj.constructor.prototype.hasOwnProperty("isPrototypeOf")) {
                return false;
            }
        } catch (e) {
            return false;
        }

        var key, ownLast = ej.support.isOwnLast;
        for (key in obj) {
            if (ownLast) break;
        }

        return key === undefined || obj.hasOwnProperty(key);
    };
    var getValueFn = false;
    ej.util.valueFunction = function (prop) {
        return function (value, getObservable) {
            var val = ej.getObject(prop, this.model);

            if (getValueFn === false)
                getValueFn = ej.getObject("observables.getValue", ej.widget);

            if (value === undefined) {
                if (!ej.isNullOrUndefined(getValueFn)) {
                    return getValueFn(val, getObservable);
                }
                return typeof val === "function" ? val.call(this) : val;
            }

            if (typeof val === "function") {
                this["ob.values"][prop] = value;
                val.call(this, value);
            }
            else
                ej.createObject(prop, value, this.model);
        }
    };
    ej.util.getVal = function (val) {
        if (typeof val === "function")
            return val();
        return val;
    };
    ej.support = {
        isOwnLast: function () {
            var fn = function () { this.a = 1; };
            fn.prototype.b = 1;

            for (var p in new fn()) {
                return p === "b";
            }
        }(),
        outerHTML: function () {
            return document.createElement("div").outerHTML !== undefined;
        }()
    };

    var throwError = ej.throwError = function (er) {
        try {
            throw new Error(er);
        } catch (e) {
            throw e.message + "\n" + e.stack;
        }
    };

    ej.getRandomValue = function (min, max) {
        if (min === undefined || max === undefined)
            return ej.throwError("Min and Max values are required for generating a random number");

        var rand;
        if ("crypto" in window && "getRandomValues" in crypto) {
            var arr = new Uint16Array(1);
            window.crypto.getRandomValues(arr);
            rand = arr[0] % (max - min) + min;
        }
        else rand = Math.random() * (max - min) + min;
        return rand | 0;
    }

    ej.extensions = {};
    ej.extensions.modelGUID = "{0B1051BA-1CCB-42C2-A3B5-635389B92A50}";
})(window.jQuery, window.Syncfusion);
(function () {
    $.fn.addEleAttrs = function (json) {
        var $this = $(this);
        $.each(json, function (i, attr) {
            if (attr && attr.specified) {
                $this.attr(attr.name, attr.value);
            }
        });

    };
    $.fn.removeEleAttrs = function (regex) {
        return this.each(function () {
            var $this = $(this),
                names = [],
                attrs = $(this.attributes).clone();
            $.each(attrs, function (i, attr) {
                if (attr && attr.specified && regex.test(attr.name)) {
                    $this.removeAttr(attr.name);
                }
            });
        });
    };
    $.fn.attrNotStartsWith = function (regex) {
        var proxy = this;
        var attributes = [], attrs;
        this.each(function () {
            attrs = $(this.attributes).clone();
        });
        for (i = 0; i < attrs.length; i++) {
            if (attrs[i] && attrs[i].specified && regex.test(attrs[i].name)) {
                continue
            }
            else
                attributes.push(attrs[i])
        }
        return attributes;

    }
    $.fn.removeEleEmptyAttrs = function () {
        return this.each(function () {
            var $this = $(this),
                names = [],
                attrs = $(this.attributes).clone();
            $.each(attrs, function (i, attr) {
                if (attr && attr.specified && attr.value === "") {
                    $this.removeAttr(attr.name);
                }
            });
        });
    };
    $.extend($.support, {
        has3d: ej.addPrefix('perspective') in ej.styles,
        hasTouch: 'ontouchstart' in window,
        hasPointer: navigator.msPointerEnabled,
        hasTransform: ej.userAgent() !== false,
        pushstate: "pushState" in history &&
        "replaceState" in history,
        hasTransition: ej.addPrefix('transition') in ej.styles
    });
    //Ensuring elements having attribute starts with 'ejm-' 
    $.extend($.expr[':'], {
        attrNotStartsWith: function (element, index, match) {
            var i, attrs = element.attributes;
            for (i = 0; i < attrs.length; i++) {
                if (attrs[i].nodeName.indexOf(match[3]) === 0) {
                    return false;
                }
            }
            return true;
        }
    });
    //addBack() is supported from Jquery >1.8 and andSelf() supports later version< 1.8. support for both the method is provided by extending the JQuery function.
    var oldSelf = $.fn.andSelf || $.fn.addBack;
    $.fn.andSelf = $.fn.addBack = function () {
        return oldSelf.apply(this, arguments);
    };
})();;
;
(function($, undefined){
    
ej.globalize = {};
ej.cultures = {};

ej.cultures['default'] = ej.cultures['en-US'] = $.extend(true, {
    name: 'en-US',
    englishName: "English",
    nativeName: "English",
    language: 'en',
    isRTL: false,
    numberFormat: {
        pattern: ["-n"],
        decimals: 2,
        ',': ",",
        '.': ".",
        groupSizes: [3],
        '+': "+",
        '-': "-",
        percent: {
            pattern: ["-n %", "n %"],
            decimals: 2,
            groupSizes: [3],
            ',': ",",
            '.': ".",
            symbol: '%'
        },
        currency: {
            pattern: ["($n)", "$n"],
            decimals: 2,
            groupSizes: [3],
            ',': ",",
            '.': ".",
            symbol: '$'
        }
    },
    calendars: {
    	standard: {
	        '/': '/',
	        ':': ':',
	        firstDay: 0,
			week:{
			name:"Week",
			nameAbbr:"Wek",
			nameShort:"Wk"
			},
	        days: {
	            names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
	            namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	            namesShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
	        },
	        months: {
	            names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
	            namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""]
	        },
	        AM: ['AM', 'am', 'AM'],
	        PM: ['PM', 'pm', 'PM'],
            twoDigitYearMax: 2029,
	        patterns: {
                d: "M/d/yyyy",
                D: "dddd, MMMM dd, yyyy",
                t: "h:mm tt",
                T: "h:mm:ss tt",
                f: "dddd, MMMM dd, yyyy h:mm tt",
                F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                M: "MMMM dd",
                Y: "yyyy MMMM",
                S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss"

	        }
    	}
    }
}, ej.cultures['en-US']);

ej.cultures['en-US'].calendar = ej.cultures['en-US'].calendar || ej.cultures['en-US'].calendars.standard; 



// *************************************** Numbers ***************************************
var regexTrim = /^\s+|\s+$/g,
    regexInfinity = /^[+-]?infinity$/i,
    regexHex = /^0x[a-f0-9]+$/i,
    regexParseFloat = /^[+-]?\d*\.?\d*(e[+-]?\d+)?$/;

function patternStartsWith(value, pattern) {
    return value.indexOf( pattern ) === 0;
}

function patternEndsWith(value, pattern) {
    return value.substr( value.length - pattern.length ) === pattern;
}

function trim(value) {
    return (value+"").replace( regexTrim, "" );
}

function truncate(value){
    if(isNaN(value))
        return NaN;
    
    return Math[value < 0 ? "ceil" : "floor"](value);
}

function padWithZero(str, count, left) {
    for (var l = str.length; l < count; l++) {
        str = (left ? ('0' + str) : (str + '0'));
    }
    return str;
}

function parseNumberWithNegativePattern(value, nf, negativePattern) {
    var neg = nf["-"],
        pos = nf["+"],
        ret;
    switch (negativePattern) {
        case "n -":
            neg = ' ' + neg;
            pos = ' ' + pos;
            // fall through
        case "n-":
            if ( patternEndsWith( value, neg ) ) {
                ret = [ '-', value.substr( 0, value.length - neg.length ) ];
            }
            else if ( patternEndsWith( value, pos ) ) {
                ret = [ '+', value.substr( 0, value.length - pos.length ) ];
            }
            break;
        case "- n":
            neg += ' ';
            pos += ' ';
            // fall through
        case "-n":
            if ( patternStartsWith( value, neg ) ) {
                ret = [ '-', value.substr( neg.length ) ];
            }
            else if ( patternStartsWith(value, pos) ) {
                ret = [ '+', value.substr( pos.length ) ];
            }
            break;
        case "(n)":
            if ( patternStartsWith( value, '(' ) && patternEndsWith( value, ')' ) ) {
                ret = [ '-', value.substr( 1, value.length - 2 ) ];
            }
            break;
    }
    return ret || [ '', value ];
}

function getFullNumber(number, precision, formatInfo) {
    var groupSizes = formatInfo.groupSizes || [3],
        curSize = groupSizes[0],
        curGroupIndex = 1,
        factor = Math.pow(10, precision),
        rounded = Math.round(number * factor) / factor;
    if (!isFinite(rounded)) {
        rounded = number;
    }
    number = rounded;

    var numberString = number + "",
        right = "",
        split = numberString.split(/e/i),
        exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
    numberString = split[0];
    split = numberString.split(".");
    numberString = split[0];
    right = split.length > 1 ? split[1] : "";

    var l;
    if (exponent > 0) {
        right = padWithZero(right, exponent, false);
        numberString += right.slice(0, exponent);
        right = right.substr(exponent);
    } else if (exponent < 0) {
        exponent = -exponent;
        numberString = padWithZero(numberString, exponent + 1);
        right = numberString.slice(-exponent, numberString.length) + right;
        numberString = numberString.slice(0, -exponent);
    }

    var dot = formatInfo['.'] || '.';
    if (precision > 0) {
        right = dot +
            ((right.length > precision) ? right.slice(0, precision) : padWithZero(right, precision));
    } else {
        right = "";
    }

    var stringIndex = numberString.length - 1,
        sep = formatInfo[","] || ',',
        ret = "";

    while (stringIndex >= 0) {
        if (curSize === 0 || curSize > stringIndex) {
            return numberString.slice(0, stringIndex + 1) + (ret.length ? (sep + ret + right) : right);
        }
        ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) + (ret.length ? (sep + ret) : "");

        stringIndex -= curSize;

        if (curGroupIndex < groupSizes.length) {
            curSize = groupSizes[curGroupIndex];
            curGroupIndex++;
        }
    }
    return numberString.slice(0, stringIndex + 1) + sep + ret + right;
}

function formatNumberToCulture(value, format, culture) {
    if (!format || format === 'i') {
        return culture.name.length ? value.toLocaleString() : value.toString();
    }
    format = format || "D";

    var nf = culture.numberFormat,
        number = Math.abs(value),
        precision = -1,
        pattern;

    if (format.length > 1) precision = parseInt(format.slice(1), 10);

    var current = format.charAt(0).toUpperCase(),
        formatInfo;

    switch (current) {
        case 'D':
            pattern = 'n';
            number = truncate(number);
            if (precision !== -1) {
                number = padWithZero("" + number, precision, true);
            }
            if (value < 0) number = -number;
            break;
        case 'N':
            formatInfo = nf;
            formatInfo.pattern = formatInfo.pattern || ['-n'];
            // fall through
        case 'C':
            formatInfo = formatInfo || nf.currency;
            formatInfo.pattern = formatInfo.pattern || ['-$n', '$n'];
            // fall through
        case 'P':
            formatInfo = formatInfo || nf.percent;
            formatInfo.pattern = formatInfo.pattern || ['-n %', 'n %'];
            pattern = value < 0 ? (formatInfo.pattern[0] || "-n") : (formatInfo.pattern[1] || "n");
            if (precision === -1) precision = formatInfo.decimals;
            number = getFullNumber(number * (current === "P" ? 100 : 1), precision, formatInfo);
            break;
        default:
            throw "Bad number format specifier: " + current;
    }

    return matchNumberToPattern(number, pattern, nf);
}



function matchNumberToPattern(number, pattern, nf){
    var patternParts = /n|\$|-|%/g,
        ret = "";
    for (;;) {
        var index = patternParts.lastIndex,
            ar = patternParts.exec(pattern);

        ret += pattern.slice(index, ar ? ar.index : pattern.length);

        if (!ar) {
            break;
        }

        switch (ar[0]) {
            case "n":
                ret += number;
                break;
            case "$":
                ret += nf.currency.symbol || "$";
                break;
            case "-":
                // don't make 0 negative
                if (/[1-9]/.test(number)) {
                    ret += nf["-"] || "-";
                }
                break;
            case "%":
                ret += nf.percent.symbol || "%";
                break;
        }
    }

    return ret;
}

function parseValue(value, culture, radix ) {
		// make radix optional
    if (typeof radix === "string") {
        culture = radix;
        radix = 10;
    }
    culture = ej.globalize.findCulture(culture);
    var ret = NaN, nf = culture.numberFormat, npattern = culture.numberFormat.pattern[0];
    value = value.replace(/ /g, '');
    if (value.indexOf(culture.numberFormat.currency.symbol) > -1) {
        // remove currency symbol
        value = value.replace(culture.numberFormat.currency.symbol || "$", "");
        // replace decimal seperator
        value = value.replace(culture.numberFormat.currency["."] || ".", culture.numberFormat["."] || ".");
        // pattern of the currency
        npattern = trim(culture.numberFormat.currency.pattern[0].replace("$", ""));
    } else if (value.indexOf(culture.numberFormat.percent.symbol) > -1) {
        // remove percentage symbol
        value = value.replace(culture.numberFormat.percent.symbol || "%", "");
        // replace decimal seperator
        value = value.replace(culture.numberFormat.percent["."] || ".", culture.numberFormat["."] || ".");
        // pattern of the percent
        npattern = trim(culture.numberFormat.percent.pattern[0].replace("%", ""));
    }

    // trim leading and trailing whitespace
    value = trim( value );

    // allow infinity or hexidecimal
    if (regexInfinity.test(value)) {
        ret = parseFloat(value, "" ,radix);
    }
    else if (regexHex.test(value)) {
        ret = parseInt(value, 16);
    }
    else {
        var signInfo = parseNumberWithNegativePattern( value, nf, npattern ),
            sign = signInfo[0],
            num = signInfo[1];
        // determine sign and number
        if ( sign === "" && nf.pattern[0] !== "-n" ) {
            signInfo = parseNumberWithNegativePattern( value, nf, "-n" );
            sign = signInfo[0];
            num = signInfo[1];
        }
        sign = sign || "+";
        // determine exponent and number
        var exponent,
            intAndFraction,
            exponentPos = num.indexOf( 'e' );
        if ( exponentPos < 0 ) exponentPos = num.indexOf( 'E' );
        if ( exponentPos < 0 ) {
            intAndFraction = num;
            exponent = null;
        }
        else {
            intAndFraction = num.substr( 0, exponentPos );
            exponent = num.substr( exponentPos + 1 );
        }
        // determine decimal position
        var integer,
            fraction,
            decSep = nf['.'] || '.',
            decimalPos = intAndFraction.indexOf( decSep );
        if ( decimalPos < 0 ) {
            integer = intAndFraction;
            fraction = null;
        }
        else {
            integer = intAndFraction.substr( 0, decimalPos );
            fraction = intAndFraction.substr( decimalPos + decSep.length );
        }
        // handle groups (e.g. 1,000,000)
        var groupSep = nf[","] || ",";
        integer = integer.split(groupSep).join('');
        var altGroupSep = groupSep.replace(/\u00A0/g, " ");
        if ( groupSep !== altGroupSep ) {
            integer = integer.split(altGroupSep).join('');
        }
        // build a natively parsable number string
        var p = sign + integer;
        if ( fraction !== null ) {
            p += '.' + fraction;
        }
        if ( exponent !== null ) {
            // exponent itself may have a number patternd
            var expSignInfo = parseNumberWithNegativePattern( exponent, nf, npattern );
            p += 'e' + (expSignInfo[0] || "+") + expSignInfo[1];
        }
        if ( !radix && regexParseFloat.test( p ) ) {
            ret = parseFloat( p );
        }
		else if(radix)
			ret = parseInt(p, radix);
    }
    return ret;
}

// *************************************** Dates ***************************************

var dateFormat = {
    DAY_OF_WEEK_THREE_LETTER : "ddd",
    DAY_OF_WEEK_FULL_NAME : "dddd",
    DAY_OF_MONTH_SINGLE_DIGIT : "d",
    DAY_OF_MONTH_DOUBLE_DIGIT : "dd",
    MONTH_THREE_LETTER : "MMM",
    MONTH_FULL_NAME : "MMMM",
    MONTH_SINGLE_DIGIT : "M",
    MONTH_DOUBLE_DIGIT : "MM",
    YEAR_SINGLE_DIGIT : "y",
    YEAR_DOUBLE_DIGIT : "yy",
    YEAR_FULL : "yyyy",
    HOURS_SINGLE_DIGIT_12_HOUR_CLOCK : "h",
    HOURS_DOUBLE_DIGIT_12_HOUR_CLOCK : "hh",
    HOURS_SINGLE_DIGIT_24_HOUR_CLOCK : "H",
    HOURS_DOUBLE_DIGIT_24_HOUR_CLOCK : "HH",
    MINUTES_SINGLE_DIGIT : "m",
    MINUTES_DOUBLE_DIGIT : "mm",
    SECONDS_SINGLE_DIGIT : "s",
    SECONDS_DOUBLE_DIGIT : "ss",
    MERIDIAN_INDICATOR_SINGLE : "t",
    MERIDIAN_INDICATOR_FULL : "tt",
    DECISECONDS : "f",
    CENTISECONDS: "ff",
    MILLISECONDS : "fff",
    TIME_ZONE_OFFSET_SINGLE_DIGIT : "z",
    TIME_ZONE_OFFSET_DOUBLE_DIGIT : "zz",
    TIME_ZONE_OFFSET_FULL : "zzz",
    DATE_SEPARATOR : "/"
};

function valueOutOfRange(value, low, high) {
    return value < low || value > high;
}

function expandYear(cal, year) {
    // expands 2-digit year into 4 digits.
    var now = new Date();
    if ( year < 100 ) {
        var twoDigitYearMax = cal.twoDigitYearMax;
        twoDigitYearMax = typeof twoDigitYearMax === 'string' ? new Date().getFullYear() % 100 + parseInt( twoDigitYearMax, 10 ) : twoDigitYearMax;
        var curr = now.getFullYear();
        year += curr - ( curr % 100 );
        if ( year > twoDigitYearMax ) {
            year -= 100;
        }
    }
    return year;
}

function arrayIndexOf( array, item ) {
    if ( array.indexOf ) {
        return array.indexOf( item );
    }
    for ( var i = 0, length = array.length; i < length; i++ ) {
        if ( array[ i ] === item ) return i;
    }
    return -1;
}

function toUpper(value) {
    // 'he-IL' has non-breaking space in weekday names.
    return value.split( "\u00A0" ).join(' ').toUpperCase();
}

function toUpperArray(arr) {
    var results = [];
    for ( var i = 0, l = arr.length; i < l; i++ ) {
        results[i] = toUpper(arr[i]);
    }
    return results;
}

function getIndexOfDay(cal, value, abbr) {
    var ret,
        days = cal.days,
        upperDays = cal._upperDays;
    if ( !upperDays ) {
        cal._upperDays = upperDays = [
            toUpperArray( days.names ),
            toUpperArray( days.namesAbbr ),
            toUpperArray( days.namesShort )
        ];
    }
    value = toUpper( value );
    if ( abbr ) {
        ret = arrayIndexOf( upperDays[ 1 ], value );
        if ( ret === -1 ) {
            ret = arrayIndexOf( upperDays[ 2 ], value );
        }
    }
    else {
        ret = arrayIndexOf( upperDays[ 0 ], value );
    }
    return ret;
}

function getIndexOfMonth(cal, value, abbr) {
    var months = cal.months,
        monthsGen = cal.monthsGenitive || cal.months,
        upperMonths = cal._upperMonths,
        upperMonthsGen = cal._upperMonthsGen;
    if ( !upperMonths ) {
        cal._upperMonths = upperMonths = [
            toUpperArray( months.names ),
            toUpperArray( months.namesAbbr )
        ];
        cal._upperMonthsGen = upperMonthsGen = [
            toUpperArray( monthsGen.names ),
            toUpperArray( monthsGen.namesAbbr )
        ];
    }
    value = toUpper( value );
    var i = arrayIndexOf( abbr ? upperMonths[ 1 ] : upperMonths[ 0 ], value );
    if ( i < 0 ) {
        i = arrayIndexOf( abbr ? upperMonthsGen[ 1 ] : upperMonthsGen[ 0 ], value );
    }
    return i;
}

function appendMatchStringCount(preMatch, strings) {
    var quoteCount = 0,
        escaped = false;
    for ( var i = 0, il = preMatch.length; i < il; i++ ) {
        var c = preMatch.charAt( i );
        if(c == '\''){
            escaped ? strings.push( "'" ) : quoteCount++;
            escaped = false;
        } else if( c == '\\'){
            if (escaped) strings.push( "\\" );
            escaped = !escaped;
        } else {
            strings.push( c );
            escaped = false;
        }
    }
    return quoteCount;
}


function parseDayByInt(value, format, culture, cal) {
    if (!value) {
        return null;
    }
    var index = 0, valueX = 0, day = null;
    format = format.split("");
    length = format.length;
    var countDays = function (match) {
        var i = 0;
        while (format[index] === match) {
            i++;
            index++;
        }
        if (i > 0) {
            index -= 1;
        }
        return i;
    },
    getNumber = function (size) {
        var rg = new RegExp('^\\d{1,' + size + '}'),
            match = value.substr(valueX, size).match(rg);

        if (match) {
            match = match[0];
            valueX += match.length;
            return parseInt(match, 10);
        }
        return null;
    },
    getName = function (names, lower) {
        var i = 0,
            length = names.length,
            name, nameLength,
            subValue;

        for (; i < length; i++) {
            name = names[i];
            nameLength = name.length;
            subValue = value.substr(valueX, nameLength);

            if (lower) {
                subValue = subValue.toLowerCase();
            }

            if (subValue == name) {
                valueX += nameLength;
                return i + 1;
            }
        }
        return null;
    },
     lowerArray = function (data) {
         var index = 0,
             length = data.length,
             array = [];

         for (; index < length; index++) {
             array[index] = (data[index] + "").toLowerCase();
         }

         return array;
     },
     lowerInfo = function (localInfo) {
         var newLocalInfo = {}, property;

         for (property in localInfo) {
             newLocalInfo[property] = lowerArray(localInfo[property]);
         }

         return newLocalInfo;
     };
    for (; index < length; index++) {
        ch = format[index];
        if (ch === "d") {
            count = countDays("d");
            if (!cal._lowerDays) {
                cal._lowerDays = lowerInfo(cal.days);
            }
            day = count < 3 ? getNumber(2) : getName(cal._lowerDays[count == 3 ? "namesAbbr" : "names"], true)
        }
    }
    return day;
}


function getFullDateFormat(cal, format) {
    // expands unspecified or single character date formats into the full pattern.
    format = format || "F";
    var pattern,
        patterns = cal.patterns,
        len = format.length;
    if ( len === 1 ) {
        pattern = patterns[ format ];
        if ( !pattern ) {
            throw "Invalid date format string '" + format + "'.";
        }
        format = pattern;
    }
    else if ( len === 2  && format.charAt(0) === "%" ) {
        // %X escape format -- intended as a custom format string that is only one character, not a built-in format.
        format = format.charAt( 1 );
    }
    return format;
}

ej.globalize._getDateParseRegExp = function (cal, format) {
    // converts a format string into a regular expression with groups that
    // can be used to extract date fields from a date string.
    // check for a cached parse regex.
    var re = cal._parseRegExp;
    if ( !re ) {
        cal._parseRegExp = re = {};
    }
    else {
        var reFormat = re[ format ];
        if ( reFormat ) {
            return reFormat;
        }
    }

    // expand single digit formats, then escape regular expression characters.
    var expFormat = getFullDateFormat( cal, format ).replace( /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1" ),
        regexp = ["^"],
        groups = [],
        index = 0,
        quoteCount = 0,
        tokenRegExp = /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g,
        match;

    // iterate through each date token found.
    while ( (match = tokenRegExp.exec( expFormat )) !== null ) {
        var preMatch = expFormat.slice( index, match.index );
        index = tokenRegExp.lastIndex;

        // don't replace any matches that occur inside a string literal.
        quoteCount += appendMatchStringCount( preMatch, regexp );
        if ( quoteCount % 2 ) {
            regexp.push( match[ 0 ] );
            continue;
        }

        // add a regex group for the token.
        var m = match[ 0 ],
            len = m.length,
            add;
            
        switch ( m ) {
            case dateFormat.DAY_OF_WEEK_THREE_LETTER: case dateFormat.DAY_OF_WEEK_FULL_NAME:
            case dateFormat.MONTH_FULL_NAME: case dateFormat.MONTH_THREE_LETTER:
                add = "(\\D+)";
                break;
            case dateFormat.MERIDIAN_INDICATOR_FULL: case dateFormat.MERIDIAN_INDICATOR_SINGLE:
                add = "(\\D*)";
                break;
            case dateFormat.YEAR_FULL:
            case dateFormat.MILLISECONDS:
            case dateFormat.CENTISECONDS:
            case dateFormat.DECISECONDS:
                add = "(\\d{" + len + "})";
                break;
            case dateFormat.DAY_OF_MONTH_DOUBLE_DIGIT: case dateFormat.DAY_OF_MONTH_SINGLE_DIGIT:
            case dateFormat.MONTH_DOUBLE_DIGIT: case dateFormat.MONTH_SINGLE_DIGIT:
            case dateFormat.YEAR_DOUBLE_DIGIT: case dateFormat.YEAR_SINGLE_DIGIT:
            case dateFormat.HOURS_DOUBLE_DIGIT_24_HOUR_CLOCK: case dateFormat.HOURS_SINGLE_DIGIT_24_HOUR_CLOCK:
            case dateFormat.HOURS_DOUBLE_DIGIT_12_HOUR_CLOCK: case dateFormat.HOURS_SINGLE_DIGIT_12_HOUR_CLOCK:
            case dateFormat.MINUTES_DOUBLE_DIGIT: case dateFormat.MINUTES_SINGLE_DIGIT:
            case dateFormat.SECONDS_DOUBLE_DIGIT: case dateFormat.SECONDS_SINGLE_DIGIT:
                add = "(\\d\\d?)";
                break;
            case dateFormat.TIME_ZONE_OFFSET_FULL:
                add = "([+-]?\\d\\d?:\\d{2})";
                break;
            case dateFormat.TIME_ZONE_OFFSET_DOUBLE_DIGIT: case dateFormat.TIME_ZONE_OFFSET_SINGLE_DIGIT:
                add = "([+-]?\\d\\d?)";
                break;
            case dateFormat.DATE_SEPARATOR:
                add = "(\\" + cal["/"] + ")";
                break;
            default:
                throw "Invalid date format pattern '" + m + "'.";
                break;
        }
        if ( add ) {
            regexp.push( add );
        }
        groups.push( match[ 0 ] );
    }
    appendMatchStringCount( expFormat.slice( index ), regexp );
    regexp.push( "$" );

    // allow whitespace to differ when matching formats.
    var regexpStr = regexp.join( '' ).replace( /\s+/g, "\\s+" ),
        parseRegExp = {'regExp': regexpStr, 'groups': groups};

    // cache the regex for this format.
    return re[ format ] = parseRegExp;
}

function getParsedDate(value, format, culture) {
    // try to parse the date string by matching against the format string
    // while using the specified culture for date field names.
    value = trim( value );
    format = trim(format);
    var cal = culture.calendar,
        // convert date formats into regular expressions with groupings.
        parseInfo = ej.globalize._getDateParseRegExp(cal, format),
        match = new RegExp(parseInfo.regExp).exec(value);
    if (match === null) {
        return null;
    }
    // found a date format that matches the input.
    var groups = parseInfo.groups,
        year = null, month = null, date = null, weekDay = null,
        hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null,
        pmHour = false;
    // iterate the format groups to extract and set the date fields.
    for ( var j = 0, jl = groups.length; j < jl; j++ ) {
        var matchGroup = match[ j + 1 ];
        if ( matchGroup ) {
            var current = groups[ j ],
                clength = current.length,
                matchInt = parseInt( matchGroup, 10 );
            
            switch ( current ) {
                case dateFormat.DAY_OF_MONTH_DOUBLE_DIGIT: case dateFormat.DAY_OF_MONTH_SINGLE_DIGIT:
                    date = matchInt;
                    if ( valueOutOfRange( date, 1, 31 ) ) return null;
                    break;
                case dateFormat.MONTH_THREE_LETTER:
                case dateFormat.MONTH_FULL_NAME:
                    month = getIndexOfMonth( cal, matchGroup, clength === 3 );
                    if ( valueOutOfRange( month, 0, 11 ) ) return null;
                    break;
                case dateFormat.MONTH_SINGLE_DIGIT: case dateFormat.MONTH_DOUBLE_DIGIT:
                    month = matchInt - 1;
                    if ( valueOutOfRange( month, 0, 11 ) ) return null;
                    break;
                case dateFormat.YEAR_SINGLE_DIGIT: case dateFormat.YEAR_DOUBLE_DIGIT:
                case dateFormat.YEAR_FULL:
                    year = clength < 4 ? expandYear( cal, matchInt ) : matchInt;
                    if ( valueOutOfRange( year, 0, 9999 ) ) return null;
                    break;
                case dateFormat.HOURS_SINGLE_DIGIT_12_HOUR_CLOCK: case dateFormat.HOURS_DOUBLE_DIGIT_12_HOUR_CLOCK:
                    hour = matchInt;
                    if ( hour === 12 ) hour = 0;
                    if ( valueOutOfRange( hour, 0, 11 ) ) return null;
                    break;
                case dateFormat.HOURS_SINGLE_DIGIT_24_HOUR_CLOCK: case dateFormat.HOURS_DOUBLE_DIGIT_24_HOUR_CLOCK:
                    hour = matchInt;
                    if ( valueOutOfRange( hour, 0, 23 ) ) return null;
                    break;
                case dateFormat.MINUTES_SINGLE_DIGIT: case dateFormat.MINUTES_DOUBLE_DIGIT:
                    min = matchInt;
                    if ( valueOutOfRange( min, 0, 59 ) ) return null;
                    break;
                case dateFormat.SECONDS_SINGLE_DIGIT: case dateFormat.SECONDS_DOUBLE_DIGIT:
                    sec = matchInt;
                    if ( valueOutOfRange( sec, 0, 59 ) ) return null;
                    break;
                case dateFormat.MERIDIAN_INDICATOR_FULL: case dateFormat.MERIDIAN_INDICATOR_SINGLE:
                    pmHour = cal.PM && ( matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2] );
                    if ( !pmHour && ( !cal.AM || (matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2]) ) ) return null;
                    break;
                case dateFormat.DECISECONDS:
                case dateFormat.CENTISECONDS:
                case dateFormat.MILLISECONDS:
                    msec = matchInt * Math.pow( 10, 3-clength );
                    if ( valueOutOfRange( msec, 0, 999 ) ) return null;
                    break;
                case dateFormat.DAY_OF_WEEK_THREE_LETTER:
                    date = parseDayByInt(value, format, culture, cal);
                    break;
                case dateFormat.DAY_OF_WEEK_FULL_NAME:
                     getIndexOfDay( cal, matchGroup, clength === 3 );
                    if ( valueOutOfRange( weekDay, 0, 6 ) ) return null;
                    break;
                case dateFormat.TIME_ZONE_OFFSET_FULL:
                    var offsets = matchGroup.split( /:/ );
                    if ( offsets.length !== 2 ) return null;

                    hourOffset = parseInt( offsets[ 0 ], 10 );
                    if ( valueOutOfRange( hourOffset, -12, 13 ) ) return null;
                    
                    var minOffset = parseInt( offsets[ 1 ], 10 );
                    if ( valueOutOfRange( minOffset, 0, 59 ) ) return null;
                    
                    tzMinOffset = (hourOffset * 60) + (patternStartsWith( matchGroup, '-' ) ? -minOffset : minOffset);
                    break;
                case dateFormat.TIME_ZONE_OFFSET_SINGLE_DIGIT: case dateFormat.TIME_ZONE_OFFSET_DOUBLE_DIGIT:
                    // Time zone offset in +/- hours.
                    hourOffset = matchInt;
                    if ( valueOutOfRange( hourOffset, -12, 13 ) ) return null;
                    tzMinOffset = hourOffset * 60;
                    break;
            }
        }
    }
    var result = new Date(), defaultYear, convert = cal.convert;
    defaultYear = convert ? convert.fromGregorian( result )[ 0 ] : result.getFullYear();
    if ( year === null ) {
        year = defaultYear;
    }
    
    // set default day and month to 1 and January, so if unspecified, these are the defaults
    // instead of the current day/month.
    if ( month === null ) {
        month = 0;
    }
    if ( date === null ) {
        date = 1;
    }
    // now have year, month, and date, but in the culture's calendar.
    if ( convert ) {
        result = convert.toGregorian( year, month, date );
        if ( result === null ) return null;
    }
    else {
        // have to set year, month and date together to avoid overflow based on current date.
        result.setFullYear( year, month, date );
        // check to see if date overflowed for specified month (only checked 1-31 above).
        if ( result.getDate() !== date ) return null;
        // invalid day of week.
        if ( weekDay !== null && result.getDay() !== weekDay ) {
            return null;
        }
    }
    // if pm designator token was found make sure the hours fit the 24-hour clock.
    if ( pmHour && hour < 12 ) {
        hour += 12;
    }
    result.setHours( hour, min, sec, msec );
    if ( tzMinOffset !== null ) {
        var adjustedMin = result.getMinutes() - ( tzMinOffset + result.getTimezoneOffset() );
        result.setHours( result.getHours() + parseInt( adjustedMin / 60, 10 ), adjustedMin % 60 );
    }
    return result;
}


function formatDateToCulture(value, format, culture) {
    var cal = culture.calendar,
        convert = cal.convert;
    if ( !format || !format.length || format === 'i' ) {
        var ret;
        if ( culture && culture.name.length ) {
            if ( convert ) {
                // non-gregorian calendar, so we cannot use built-in toLocaleString()
                ret = formatDateToCulture( value, cal.patterns.F, culture );
            }
            else {
                ret = value.toLocaleString();
            }
        }
        else {
            ret = value.toString();
        }
        return ret;
    }

    var sortable = format === "s";
        format = getFullDateFormat(cal, format);


    // Start with an empty string
    ret = [];
    var hour,
        zeros = ['0','00','000'],
        foundDay,
        checkedDay,
        dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g,
        quoteCount = 0,
        tokenRegExp = /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g,
        converted;

    function padWithZeros(num, c) {
        var r, s = num+'';
        if ( c > 1 && s.length < c ) {
            r = ( zeros[ c - 2 ] + s);
            return r.substr( r.length - c, c );
        }
        else {
            r = s;
        }
        return r;
    }

    function hasDay() {
        if ( foundDay || checkedDay ) {
            return foundDay;
        }
        foundDay = dayPartRegExp.test( format );
        checkedDay = true;
        return foundDay;
    }

    if ( !sortable && convert ) {
        converted = convert.fromGregorian( value );
    }

    for (;;) {
        // Save the current index
        var index = tokenRegExp.lastIndex,
            // Look for the next pattern
            ar = tokenRegExp.exec( format );

        // Append the text before the pattern (or the end of the string if not found)
        var preMatch = format.slice( index, ar ? ar.index : format.length );
        quoteCount += appendMatchStringCount( preMatch, ret );

        if ( !ar ) {
            break;
        }

        // do not replace any matches that occur inside a string literal.
        if ( quoteCount % 2 ) {
            ret.push( ar[ 0 ] );
            continue;
        }

        var current = ar[ 0 ],
            clength = current.length;


        switch ( current ) {
            case dateFormat.DAY_OF_WEEK_THREE_LETTER:
            case dateFormat.DAY_OF_WEEK_FULL_NAME:
                var names = (clength === 3) ? cal.days.namesAbbr : cal.days.names;
                ret.push( names[ value.getDay() ] );
                break;
            case dateFormat.DAY_OF_MONTH_SINGLE_DIGIT:
            case dateFormat.DAY_OF_MONTH_DOUBLE_DIGIT:
                foundDay = true;
                ret.push( padWithZeros( (converted ? converted[2] : value.getDate()), clength ) );
                break;
            case dateFormat.MONTH_THREE_LETTER:
            case dateFormat.MONTH_FULL_NAME:
                var part = converted ? converted[1] : value.getMonth();
                ret.push( (cal.monthsGenitive && hasDay())
                    ? cal.monthsGenitive[ clength === 3 ? "namesAbbr" : "names" ][ part ]
                    : cal.months[ clength === 3 ? "namesAbbr" : "names" ][ part ] );
                break;
            case dateFormat.MONTH_SINGLE_DIGIT:
            case dateFormat.MONTH_DOUBLE_DIGIT:
                ret.push( padWithZeros((converted ? converted[1] : value.getMonth()) + 1, clength ) );
                break;
            case dateFormat.YEAR_SINGLE_DIGIT:
            case dateFormat.YEAR_DOUBLE_DIGIT:
            case dateFormat.YEAR_FULL:
                part = converted ? converted[ 0 ] : value.getFullYear();
                if ( clength < 4 ) {
                    part = part % 100;
                }
                ret.push( padWithZeros( part, clength ) );
                break;
            case dateFormat.HOURS_SINGLE_DIGIT_12_HOUR_CLOCK:
            case dateFormat.HOURS_DOUBLE_DIGIT_12_HOUR_CLOCK:
                hour = value.getHours() % 12;
                if ( hour === 0 ) hour = 12;
                ret.push( padWithZeros( hour, clength ) );
                break;
            case dateFormat.HOURS_SINGLE_DIGIT_24_HOUR_CLOCK:
            case dateFormat.HOURS_DOUBLE_DIGIT_24_HOUR_CLOCK:
                ret.push( padWithZeros( value.getHours(), clength ) );
                break;
            case dateFormat.MINUTES_SINGLE_DIGIT:
            case dateFormat.MINUTES_DOUBLE_DIGIT:
                ret.push( padWithZeros( value.getMinutes(), clength ) );
                break;
            case dateFormat.SECONDS_SINGLE_DIGIT:
            case dateFormat.SECONDS_DOUBLE_DIGIT:
                ret.push( padWithZeros(value .getSeconds(), clength ) );
                break;
            case dateFormat.MERIDIAN_INDICATOR_SINGLE:
            case dateFormat.MERIDIAN_INDICATOR_FULL:
                part = value.getHours() < 12 ? (cal.AM ? cal.AM[0] : " ") : (cal.PM ? cal.PM[0] : " ");
                ret.push( clength === 1 ? part.charAt( 0 ) : part );
                break;
            case dateFormat.DECISECONDS:
            case dateFormat.CENTISECONDS:
            case dateFormat.MILLISECONDS:
                ret.push( padWithZeros( value.getMilliseconds(), 3 ).substr( 0, clength ) );
                break;
            case dateFormat.TIME_ZONE_OFFSET_SINGLE_DIGIT:
            case dateFormat.TIME_ZONE_OFFSET_DOUBLE_DIGIT:
                hour = value.getTimezoneOffset() / 60;
                ret.push( (hour <= 0 ? '+' : '-') + padWithZeros( Math.floor( Math.abs( hour ) ), clength ) );
                break;
            case dateFormat.TIME_ZONE_OFFSET_FULL:
                hour = value.getTimezoneOffset() / 60;
                ret.push( (hour <= 0 ? '+' : '-') + padWithZeros( Math.floor( Math.abs( hour ) ), 2 ) +
                    ":" + padWithZeros( Math.abs( value.getTimezoneOffset() % 60 ), 2 ) );
                break;
            case dateFormat.DATE_SEPARATOR:
                ret.push( cal["/"] || "/" );
                break;
            default:
                throw "Invalid date format pattern '" + current + "'.";
                break;
        }
    }
    return ret.join( '' );
}

//add new culture into ej 
ej.globalize.addCulture = function (name, culture) {
    ej.cultures[name] = $.extend(true, $.extend(true, {}, ej.cultures['default'], culture), ej.cultures[name]);
	ej.cultures[name].calendar = ej.cultures[name].calendars.standard;
}

//return the specified culture or default if not found
ej.globalize.preferredCulture = function (culture) {
    culture = (typeof culture != "undefined" && typeof culture === typeof this.cultureObject) ? culture.name : culture;
    this.cultureObject = ej.globalize.findCulture(culture);
    return this.cultureObject;
}
ej.globalize.setCulture = function (culture) {
	if (ej.isNullOrUndefined(this.globalCultureObject)) this.globalCultureObject = ej.globalize.findCulture(culture);
	culture = (typeof culture != "undefined" && typeof culture === typeof this.globalCultureObject) ? culture.name : culture;
    if (culture) this.globalCultureObject = ej.globalize.findCulture(culture);
    ej.cultures.current = this.globalCultureObject;
    return this.globalCultureObject;
}
ej.globalize.culture=function(name){
    ej.cultures.current = ej.globalize.findCulture(name);
}

//return the specified culture or current else default if not found
ej.globalize.findCulture = function (culture) {
    var cultureObject;
    if (culture) {

        if ($.isPlainObject(culture) && culture.numberFormat) {
            cultureObject = culture;
        }
        if (typeof culture === "string") {
            var cultures = ej.cultures;
            if (cultures[culture]) {
                return cultures[culture];
            }
            else {
                if (culture.indexOf("-") > -1) {
                    var cultureShortName = culture.split("-")[0];
                    if (cultures[cultureShortName]) {
                        return cultures[cultureShortName];
                    }
                }
                else {
                    var cultureArray = $.map(cultures, function (el) { return el });
                    for (var i = 0; i < cultureArray.length; i++) {
                        var shortName = cultureArray[i].name.split("-")[0];
                        if (shortName === culture) {
                            return cultureArray[i];
                        }
                    };
                }
            }
            return ej.cultures["default"];
        }
    }
    else {
        cultureObject = ej.cultures.current || ej.cultures["default"];
    }

    return cultureObject;
}
//formatting date and number based on given format
ej.globalize.format = function (value, format, culture) {
    var cultureObject =  ej.globalize.findCulture(culture);
    if (typeof(value) === 'number') {
        value = formatNumberToCulture(value, format, cultureObject);
    } else if(value instanceof Date){
    	value = formatDateToCulture(value, format, cultureObject);
    }

    return value;
}

//parsing integer takes string as input and return as number
ej.globalize.parseInt = function(value, radix, culture) {
	if(!radix)
		radix = 10;
    return Math.floor( parseValue( value, culture, radix ) );
}

//returns the ISO date string from date object
ej.globalize.getISODate = function(value) {
    if(value instanceof Date) return value.toISOString();
}

//parsing floationg poing number takes string as input and return as number
ej.globalize.parseFloat = function(value, radix, culture) {
	if (typeof radix === "string") {
        culture = radix;
        radix = 10;
    }
    return parseValue( value, culture);
}

//parsing date takes string as input and return as date object
ej.globalize.parseDate = function(value, formats, culture) {
    culture = ej.globalize.findCulture(culture);

    var date, prop, patterns;
    if ( formats ) {
        if ( typeof formats === "string" ) {
            formats = [ formats ];
        }
        if ( formats.length ) {
            for ( var i = 0, l = formats.length; i < l; i++ ) {
                var format = formats[ i ];
                if ( format ) {
                    date = getParsedDate( value, format, culture );
                    if ( date ) break;
                }
            }
        }
    }
    else {
        patterns = culture.calendar.patterns;
        for ( prop in patterns ) {
            date = getParsedDate( value, patterns[prop], culture );
            if ( date ) break;
        }
    }
    return date || null;
}

function getControlObject(obj, stringArray){
    return stringArray.length ? getControlObject(obj[stringArray[0]], stringArray.slice(1)) : obj;
}

//return localized constants as object for the given widget control and culture
ej.globalize.getLocalizedConstants = function(controlName, culture){
    var returnObject,
        controlNameArray = controlName.replace("ej.", "").split(".");
    
    returnObject = getControlObject(ej, controlNameArray);

    return ( $.extend(true, {}, returnObject.Locale['default'], returnObject.Locale[culture ? culture : this.cultureObject.name]) ) ;
}

$.extend(ej, ej.globalize);

}(jQuery));;
/**
* @fileOverview Plugin to craete a Timepicker with the Html input element
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejTimePicker", "ej.TimePicker", {

        element: null,

        model: null,
        validTags: ["input"],
        _addToPersist: ["value"],
        _rootCSS: "e-timepicker",
        _setFirst: false,
        type: "editor",
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions'],
            requireFormatters: true
        },
        _requiresID: true,

        defaults: {

            cssClass: "",

            timeFormat: "",

            value: null,

            enableAnimation: true,

            locale: "en-US",

            htmlAttributes: {},

            readOnly: false,

            showPopupButton: true,

            enableStrictMode: false,

            interval: 30,

            hourInterval: 1,

            minutesInterval: 1,

            secondsInterval: 1,

            height: "",

            width: "",

            minTime: "12:00 AM",

            maxTime: "11:59 PM",

            showRoundedCorner: false,

            enableRTL: false,

            popupHeight: "191px",

            popupWidth: "auto",

            enabled: true,

            enablePersistence: false,

            disableTimeRanges: null,

            validationRules: null,

            validationMessages: null,

            focusIn: null,

            focusOut: null,

            beforeChange: null,

            change: null,

            select: null,

            create: null,

            destroy: null,

            beforeOpen: null,

            open: null,

            close: null
        },


        dataTypes: {
            timeFormat: "string",
            minTime: "string",
            maxTime: "string",
            readOnly: "boolean",
            interval: "number",
            showPopupButton: "boolean",
            locale: "string",
            hourInterval: "number",
            minutesInterval: "number",
            secondsInterval: "number",
            enabled: "boolean",
            enablePersistence: "boolean",
            enableAnimation: "boolean",
            enableStrictMode: "boolean",
            disableTimeRanges: "data",
            htmlAttributes: "data",
            validationRules: "data",
            validationMessages: "data",
        },

        observables: ["value"],

        enable: function () {
            if (!this.model.enabled) {
                this.element[0].disabled = false;
                this.element.prop("disabled", false);
                this.model.enabled = true;
                this.wrapper.removeClass('e-disable');
                this.element.removeClass("e-disable").attr("aria-disabled", false);
                if (this.model.showPopupButton) {
                    this.timeIcon.removeClass("e-disable").attr("aria-disabled", false);
                    if (this.popupList) this.popupList.removeClass("e-disable").attr("aria-disabled", false);
                }
                if (this._isIE8) this.timeIcon.children().removeClass("e-disable");
            }
        },


        disable: function () {
            if (this.model.enabled) {
                this.element[0].disabled = true;
                this.model.enabled = false;
                this.element.attr("disabled", "disabled");
                this.wrapper.addClass('e-disable');
                this.element.addClass("e-disable").attr("aria-disabled", true);
                if (this.model.showPopupButton) {
                    this.timeIcon.addClass("e-disable").attr("aria-disabled", true);
                    if (this.popupList) this.popupList.addClass("e-disable").attr("aria-disabled", true);
                }
                if (this._isIE8) this.timeIcon.children().addClass("e-disable");
                this._hideResult();
            }
        },


        getValue: function () {
            return this.element.val();
        },


        setCurrentTime: function () {
            if (!this.model.readOnly) this._setMask();
        },

        show: function () {
            (!this.showDropdown && !this._getInternalEvents) && this._showResult();
        },

        hide: function () {
            (this.showDropdown) && this._hideResult();
        },


        _ISORegex: function () {
            this._tokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g,
            // complex case for iso 8601 regex only
            this._extISORegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/,
            this._basicISORegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?/,
            this._numberRegex = {
                2: /\d\d?/,
                4: /^\d{4}/,
                "z": /Z|[+-]\d\d(?::?\d\d)?/gi,
                "t": /T/,
                "-": /\-/,
                ":": /:/
            };
            this._zeroRegex = /Z|[+-]\d\d(?::?\d\d)?/;
            this._dates = [
                ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
                ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
                ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
                ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
                ['YYYY-DDD', /\d{4}-\d{3}/],
                ['YYYY-MM', /\d{4}-\d\d/, false],
                ['YYYYYYMMDD', /[+-]\d{10}/],
                ['YYYYMMDD', /\d{8}/],
                // YYYYMM is NOT allowed by the standard
                ['GGGG[W]WWE', /\d{4}W\d{3}/],
                ['GGGG[W]WW', /\d{4}W\d{2}/, false],
                ['YYYYDDD', /\d{7}/]
            ];

            // iso time formats and regexes
            this._times = [
                ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
                ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
                ['HH:mm:ss', /\d\d:\d\d:\d\d/],
                ['HH:mm', /\d\d:\d\d/],
                ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
                ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
                ['HHmmss', /\d\d\d\d\d\d/],
                ['HHmm', /\d\d\d\d/],
                ['HH', /\d\d/]
            ];
        },

        _timeFormat: function (format) {
            if (!format)
                format = ej.preferredCulture(this.model.locale).calendars.standard.patterns.t;
            var validatedformat = this._validateTimeFormat(format);
            if (validatedformat) {
                this.model.timeFormat = validatedformat;
                // Only change the format when model is not null.   
                this.model.minTime = ej.format(this._createObject(this._minTimeObj), this.model.timeFormat, this.model.locale);
                this.model.maxTime = ej.format(this._createObject(this._maxTimeObj), this.model.timeFormat, this.model.locale);

                if (this.model.value) {
                    this._setModelOption = true;
                    this.model.value = this._localizeTime(this.model.value);
                    this.element.val(this.model.value);
                }
                else {
                    this._setModelOption = false;
                    var timeValue = this._localizeTime(this.element.val());
                    if (timeValue && this._checkMinMax(timeValue)) {
                        this.model.value = timeValue;
                        this.element.val(timeValue);
                    }
                }
            }
            return validatedformat;
        },

        _getTimeFormat: function () {
            if (this._prevTimeFormat)
                this.model.timeFormat = ej.preferredCulture(this.model.locale).calendar.patterns.t || "h:mm tt";
            this.seperator = this._getSeperator();
        },

        _changeSkin: function (skin) {
            this.wrapper.removeClass(this.model.cssClass).addClass(skin);
            if (this.popupList) this.popupList.removeClass(this.model.cssClass).addClass(skin);
        },

        _localize: function (culture) {
            var currentTime = this._createObject(this.model.value, true);
            this.model.locale = culture;
            this._getTimeFormat();

            this.model.minTime = ej.format(this._createObject(this._minTimeObj), this.model.timeFormat, this.model.locale);
            this.model.maxTime = ej.format(this._createObject(this._maxTimeObj), this.model.timeFormat, this.model.locale);

            if (currentTime) {
                this.model.value = this._localizeTime(currentTime);
                this.element.val(this.model.value);
            }
            else {
                currentTime = this._localizeTime(this.element.val());
                if (currentTime && this._checkMinMax(currentTime)) {
                    this.model.value = currentTime;
                    this.element.val(currentTime);
                }
            }
            this._getAmPm();
        },
        _setLocalize: function (culture) {
            var culture = ej.preferredCulture(culture);
            if (culture) {
                this.model.locale = culture.name == "en" ? "en-US" : culture.name;
                if (!ej.isNullOrUndefined(this._options) && (ej.isNullOrUndefined(this._options.timeFormat) || (!this._options.timeFormat)))
                    this.model.timeFormat = ej.preferredCulture(this.model.locale).calendars.standard.patterns.t;
                    this._prevTimeFormat = (ej.isNullOrUndefined(this._options.timeFormat)||this._options.timeFormat=="") ? true : false;
            }
        },
        _updateInput: function () {
            if (ej.isNullOrUndefined(this._options)) return;
            var value = this._localizeTime(this._options.value);
            if (!ej.isNullOrUndefined(value))
                if (typeof value === "string" && this.model.enableStrictMode && !this.model.value) {
                    this.element.val(this._options.value);
                    this.isValidState = (this.element.val() == "") ? true : false;
                    this._checkErrorClass();
                }
        },
        _createMinMaxObj: function () {
            // create minTime object
            this._minTimeObj = this._createObject(this.model.minTime);
            if (!this._minTimeObj)
                this.model.minTime = ej.format(this._createObject(new Date().setHours(0, 0, 0, 0)), this.model.timeFormat, this.model.locale);

            // create maxTime object
            this._maxTimeObj = this._createObject(this.model.maxTime);
            if (!this._maxTimeObj)
                this.model.maxTime = ej.format(this._createObject(new Date().setHours(23, 59, 59, 59)), this.model.timeFormat, this.model.locale);
        },
        _setMinMax: function () {
            var minVal = new Date().setHours(0, 0, 0, 0);
            var maxval = new Date().setHours(23, 59, 59, 59);
            if (!ej.isNullOrUndefined(this._options) && ej.isNullOrUndefined(this._options.minTime))
                this.model.minTime = ej.format(this._createObject(minVal), this.model.timeFormat, this.model.locale);
            if (!ej.isNullOrUndefined(this._options) && ej.isNullOrUndefined(this._options.maxTime))
                this.model.maxTime = ej.format(this._createObject(maxval), this.model.timeFormat, this.model.locale);
            this._createMinMaxObj();
        },
        _init: function (options) {
            this._options = options;
            this._cloneElement = this.element.clone();
            this._ISORegex();
            if (!this.element.is("input") || (this.element.attr('type') && this.element.attr('type') != "text")) return false;
            this._initialize();
            this._render();
            this._wireEvents();
            if (options && options.value != undefined && options.value != this.element.val()) {
                this._trigger("_change", { value: this.element.val() });
            }
            this._updateInput();
            this._updateTextbox();
            if (this.model.validationRules != null) {
                this._initTimeValidator();
                this._setTimeValidation();
            }

        },
        _updateTextbox: function () {
            if (this._options === undefined || (this._options.value === undefined && !this.model.value))
                this._setTime(this._localizeTime(this.model.minTime));
        },

        _setMinMaxTime: function (prev, options) {
            if (!ej.isNullOrUndefined(options["minTime"]) && $.trim(options["minTime"]) && this._isValid(options["minTime"])) {
                this.model.minTime = options["minTime"];
                this._minTimeObj = this._createObject(this.model.minTime);
                this._validateTimes();
            }
            if (!ej.isNullOrUndefined(options["maxTime"]) && $.trim(options["maxTime"]) && this._isValid(options["maxTime"])) {
                this.model.maxTime = options["maxTime"];
                this._maxTimeObj = this._createObject(this.model.maxTime);
                this._validateTimes();
            }

            this._validateMinMax();
            this._createMinMaxObj();
            if (!ej.isNullOrUndefined(options["minTime"])) options["minTime"] = this.model.minTime;
            if (!ej.isNullOrUndefined(options["maxTime"])) options["maxTime"] = this.model.maxTime;
            if (!this._checkMinMax(this.model.value)) {
                if (!this.model.enableStrictMode) {
                    if (this.model.minTime && !this._compareTime(this.model.value, this.model.minTime, true))
                        this.model.value = this.model.minTime;
                    if (this.model.maxTime && !this._compareTime(this.model.maxTime, this.model.value, true))
                        this.model.value = this.model.maxTime;
                }
                else {
                    this.isValidState = false;
                    this.model.value = null;
                }
            }
            if (prev !== this.model.value && this._isValid(this.model.value, true))
                this.element.val(this.model.value);
        },
        _setModel: function (options) {
            var change = false, prev = this.model.value;
            if (ej.isNullOrUndefined(this.popupList)) this._renderDropdown();
            for (var option in options) {
                switch (option) {
                    case "timeFormat":
                        var prevTime = this._createObject(this.model.value);
                        this._preTimeformat = this.model.timeFormat;
                        var newFormat = this._timeFormat(options[option]);
                        options[option] = this.model.timeFormat;
                        if (newFormat)
                            this.seperator = this._getSeperator();
                        var currentTime = this._createObject(this.model.value);
                        change = (+prevTime === +currentTime) ? false : true;
                        break;
                    case "locale":
                        var prevTime = this._createObject(this.model.value);
                        this._localize(options[option]);
                        this.model.minTime = ej.format(this._createObject(this._minTimeObj), this.model.timeFormat, this.model.locale);
                        this.model.maxTime = ej.format(this._createObject(this._maxTimeObj), this.model.timeFormat, this.model.locale);
                        var currentTime = this._createObject(this.model.value);
                        change = (+prevTime === +currentTime) ? false : true;
                        break;
                    case "interval":
                        this.model.interval = options[option];
                        break;
                    case "cssClass": this._changeSkin(options[option]); break;
                    case "showRoundedCorner": this._setRoundedCorner(options[option]); break;
                    case "enableRTL": this._setRtl(options[option]); break;
                    case "height":
                        this._setHeight(options[option]); break;
                    case "width":
                        this.wrapper.width(options[option]);
                        this._setListWidth();
                        break;
                    case "value":
                        if (ej.isPlainObject(options[option])) options[option] = null;
                        this.model.value = ej.format(this._createObject(options[option], true), this.model.timeFormat, this.model.locale);
                        this._ensureValue();
                        this._enableMask();
                        if (this.model.enableStrictMode && !this._isValid(options[option], true)) {
                            var tval = this._isValid(options[option]) ? this._localizeTime(options[option]) : options[option];
                            this.element.val(tval);
                        }
                        options[option] = this.model.value;
                        change = true;
                        break;
                    case "enableStrictMode":
                        this.model.enableStrictMode = options[option];
                        break;
                    case "validationRules":
                        if (this.model.validationRules != null) {
                            this.element.rules('remove');
                            this.model.validationMessages = null;
                        }
                        this.model.validationRules = options[option];
                        if (this.model.validationRules != null) {
                            this._initTimeValidator();
                            this._setTimeValidation();
                        }
                        break;
                    case "validationMessages":
                        this.model.validationMessages = options[option];
                        if (this.model.validationRules != null && this.model.validationMessages != null) {
                            this._initTimeValidator();
                            this._setTimeValidation();
                        }
                        break;
                    case "popupHeight": this.model.popupHeight = options[option]; this._setListHeight(); break;
                    case "popupWidth": this.model.popupWidth = options[option]; this._setListWidth(); break;
                    case "enabled": if (options[option]) this.enable(); else this.disable(); break;
                    case "htmlAttributes": this._addAttr(options[option]); break;
                    case "disableTimeRanges":
                        this.model.disableTimeRanges = options[option];
                        this._initStartEnd();
                        this.model.value = ej.format(this._createObject(this.element.val(), true), this.model.timeFormat, this.model.locale);
                        this._ensureValue();
                        this._enableMask();
                        if (this.model.enableStrictMode && !this._isValid(this.element.val(), true))
                            this.element.val(this.element.val());
                        change = true;
                }
            }
            if (!ej.isNullOrUndefined(options["minTime"]) || !ej.isNullOrUndefined(options["maxTime"])) {
                this._setMinMaxTime(prev, options);
                change = true;
            }
            if (!ej.isNullOrUndefined(options["showPopupButton"]))
                this._showButton(options[option]);
            else if (this.model.showPopupButton && (newFormat || !ej.isNullOrUndefined(options["minTime"]) || !ej.isNullOrUndefined(options["maxTime"]) ||
                   !ej.isNullOrUndefined(options["locale"]) || !ej.isNullOrUndefined(options["interval"]) || !ej.isNullOrUndefined(options["disableTimeRanges"]))) {
                this._reRenderDropdown();
            }
            if (change) {
                this._raiseChangeEvent(prev, true);
                options["value"] = this.model.value;
            }
            this._checkErrorClass();
        },


        _destroy: function () {
            this.element.insertAfter(this.wrapper);
            this.wrapper.remove();
            this.element.removeClass("e-input").removeAttr("ondragstart draggable aria-atomic aria-live aria-readonly").val(this.element.attr("value"));
            if (!this._cloneElement.attr('name')) this.element.removeAttr('name');
            if (this.popupList) this.popupList.remove();
        },

        _initialize: function () {
            this.target = this.element[0];
            this.timeIcon = null;
            this._disabledItems = [];
            this.popupList = null;
            this.focused = false;
            this.start = 0;
            this.end = 0;
            this.min = null;
            this.max = null;
            this.incomplete = false;
            this.downPosition = 0;
            this._setLocalize(this.model.locale);
            this._setMinMax();
            this._getAmPm();
            this.showDropdown = false;
            this._activeItem = 0;
            this.isValidState = true;
            this._manualFocus = false;
            this._isIE7 = this._checkIE7();
            this._initStartEnd();
            if (ej.isNullOrUndefined(this.model.value) && this.element[0].value != "")
                this.model.value = this.element[0].value;
            this._isIE8 = (ej.browserInfo().name == "msie") && (ej.browserInfo().version == "8.0") ? true : false;
            // _getInternalEvents is used when TimePicker used as a subcontrol of DateTimePicker 
            this._getInternalEvents = false;
            this._dateTimeInternal = false;
            if (!this.model.timeFormat) this._getTimeFormat();
            else this.seperator = this._getSeperator();
        },

        _render: function () {
            this._renderWrapper();
            this._setDimentions();
            this._renderTimeIcon();
            this._validateTimes();
            this._createMinMaxObj();
            this._addAttr(this.model.htmlAttributes);
            this._checkProperties();
            this._enableMask();
            this._checkErrorClass();
            this.element.attr({ 'aria-atomic': 'true', 'aria-live': 'assertive', "aria-readonly": this.model.readOnly, "value": this.model.value });
            (ej.isNullOrUndefined(this.model.value)) ? this.wrapper.addClass('e-valid') : this.wrapper.removeClass('e-valid');
        },

        _renderWrapper: function () {
            this.element.addClass("e-input").attr({'tabindex':'0','role':'combobox','aria-expanded':'false'});
            this.wrapper = ej.buildTag("span.e-timewidget e-widget " + this.model.cssClass + "#" + this.target.id + "_timewidget").insertAfter(this.element);
            this.wrapper.attr("style", this.element.attr("style"));
            this.element.removeAttr('style');
            if (!ej.isTouchDevice()) this.wrapper.addClass('e-ntouch');
            this.container = ej.buildTag("span.e-in-wrap e-box").append(this.element);
            this.wrapper.append(this.container);
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                var keyName = key.toLowerCase();
                if (keyName == "class") proxy.wrapper.addClass(value);
                else if (keyName == "disabled" && value == "disabled") proxy.disable();
                else if (keyName == "readOnly" && value == "readOnly") proxy.model.readOnly = true;
                else if (keyName == "style" || keyName == "id") proxy.wrapper.attr(key, value);
                else if (ej.isValidAttr(proxy.element[0], key)) proxy.element.attr(key, value);
                else proxy.wrapper.attr(key, value);

            });
        },
        _initTimeValidator: function () {
            (!this.element.closest("form").data("validator")) && this.element.closest("form").validate();
        },
        _setTimeValidation: function () {
            this.element.rules("add", this.model.validationRules);
            var validator = this.element.closest("form").data("validator");
            validator = validator ? validator : this.element.closest("form").validate();
            name = this.element.attr("name");
            validator.settings.messages[name] = {};
            for (var ruleName in this.model.validationRules) {
                var message = null;
                if (!ej.isNullOrUndefined(this.model.validationRules[ruleName])) {
                    if (!ej.isNullOrUndefined(this.model.validationRules["messages"] && this.model.validationRules["messages"][ruleName]))
                        message = this.model.validationRules["messages"][ruleName];
                    else {
                        validator.settings.messages[name][ruleName] = $.validator.messages[ruleName];
                        for (var msgName in this.model.validationMessages)
                            ruleName == msgName ? (message = this.model.validationMessages[ruleName]) : "";
                    }
                    validator.settings.messages[name][ruleName] = message != null ? message : $.validator.messages[ruleName];
                }
            }
        },
        _renderTimeIcon: function () {
            if (this.model.showPopupButton) {
                this.timeIcon = ej.buildTag("span.e-select").attr({ 'role': 'button', 'aria-label': 'select' });
                var icon = ej.buildTag("span.e-icon e-clock").attr('role', 'presentation');
                if (this._isIE8) {
                    this.timeIcon.attr("unselectable", "on");
                    icon.attr("unselectable", "on");
                }
                this.timeIcon.append(icon);
                this.container.append(this.timeIcon).addClass("e-padding");
                this._on(this.timeIcon, "mousedown", this._timeIconClick);
            }

        },
        _elementClick: function (e) {
            if (!this.showDropdown) this._showResult();
        },
        _renderDropdown: function () {
            var oldWrapper = $("#" + this.element[0].id + "_popup").get(0);
            if (oldWrapper)
                $(oldWrapper).remove();
            if (!this.model.showPopupButton || this.popupList) return false;
            this.popupList = ej.buildTag("div.e-time-popup e-popup e-widget e-box " + this.model.cssClass + "#" + this.target.id + "_popup", "", {}, { 'tabindex': 0, 'role':'listbox'});
            if (!ej.isTouchDevice()) this.popupList.addClass('e-ntouch');
            this.popup = this.popupList;
            this.ul = ej.buildTag("ul.e-ul");
            if (this._isIE8)
                this.ul.attr("unselectable", "on");
            var scrollDiv = ej.buildTag("div").append(this.ul);
            $('body').append(this.popupList.append(scrollDiv));
            this._renderLiTags();
            this._setListHeight();
            this._setListWidth();
            this.popupList.ejScroller({ height: this.popupList.height(), width: 0, scrollerSize: 20 });
            this.scrollerObj = this.popupList.ejScroller("instance");
            this.popupList.css("display", "none");
            this._listSize = this.ul.find("li").length;
        },
        _renderLiTags: function () {
            this._disabledItems = [];
            var start, end, timeVal, interval = this.model.interval * 60000;
            // Maintain the min and max time as object;
            var disableTime = (!ej.isNullOrUndefined(this.model.disableTimeRanges) && this.model.disableTimeRanges.length > 0) ? true : false;
            start = this._minTimeObj;
            end = this._maxTimeObj;
            var i = 0;
            while (this._compareTime(end, start, true)) {
                timeVal = this._localizeTime(start);
                var litag = $(document.createElement('li'));
                litag[0].appendChild(document.createTextNode(timeVal));
                if (this._isIE8) litag.attr("unselectable", "on");
                if (disableTime) {
                    if (this._ensureTimeRange(timeVal)) {
                        litag.addClass('e-disable');
                        this._disabledItems.push(i);
                    }
                    else {
                        litag.removeClass('e-disable');
                    }
                }
                this.ul[0].appendChild(litag[0]);
                start = new Date(start).getTime() + interval;
                i++;
            }

            var liTags = this.ul.find("li");
            if (!ej.isTouchDevice()) {
                this._on(liTags, "mouseenter", $.proxy(this._OnMouseEnter, this));
                this._on(liTags, "mouseleave", $.proxy(this._OnMouseLeave, this));
            }
            this._on(liTags, "click", $.proxy(this._OnMouseClick, this));
            if (this.model.showPopupButton || !ej.isNullOrUndefined(this.popupList))
                this.ul.find("li").attr({ 'tabindex': -1, 'aria-selected': false,'role':'option' });
        },
        _ensureTimeRange: function (value) {
            if (!ej.isNullOrUndefined(this.model.disableTimeRanges)) {
                var timeVal = this._makeDateTimeObj(value);
                for (var i = 0; i < this.model.disableTimeRanges.length; i++) {
                    if (+timeVal >= +this._makeDateTimeObj(this.model.disableTimeRanges[i].startTime) && +timeVal <= +this._makeDateTimeObj(this.model.disableTimeRanges[i].endTime))
                        return true;
                }
            }
            return false;
        },
        _initStartEnd: function () {
            this._startTime = [];
            this._endTime = [];
            if (!ej.isNullOrUndefined(this.model.disableTimeRanges)) {
                for (var i = 0; i < this.model.disableTimeRanges.length; i++) {
                    this._startTime[i] = this._makeDateTimeObj(this.model.disableTimeRanges[i].startTime);
                    this._endTime[i] = this._makeDateTimeObj(this.model.disableTimeRanges[i].endTime);
                }
            }
        },
        _makeDateTimeObj: function (value) {
            if (typeof value === "string") {
                var dateFormat = ej.preferredCulture(this.model.locale).calendar.patterns.d;
                var dateValue = ej.format(new Date("1/1/2000"), dateFormat, this.model.locale);
                var obj = ej.parseDate(dateValue + " " + value, dateFormat + " " + this.model.timeFormat, this.model.locale);
                if (!obj) {
                    var isJSONString = new Date(value);
                    if (!isNaN(Date.parse(isJSONString)) && !ej.isNullOrUndefined(value))
                        return this._setEmptyDate(value);
                    else
                        obj = new Date("1/1/2000 " + value);
                }
                return obj;
            }
            else if (value instanceof Date)
                return this._setEmptyDate(value);
            else return null;
        },
        _reRenderDropdown: function () {
            this.ul.empty();
            this._renderLiTags();
            this._refreshScroller();
            this._changeActiveEle();
        },
        _refreshScroller: function () {
            var flag = this.popupList.css("display") == "none" ? true : false;
            this.popupList.css("height", "auto");
            this.popupList.find(".e-content, .e-vscroll").removeAttr("style");
            this.popupList.find(".e-vscroll div").removeAttr("style");

            if (flag) this.popupList.css("display", "block");
            this.scrollerObj.model.height = this.popupList.height();
            this.scrollerObj.model.scrollTop = 0;
            this.scrollerObj.refresh();
            if (this._isIE8) {
                $("#" + this.scrollerObj._id).children('.e-vscroll').children().attr("unselectable", "on");
                $("#" + this.scrollerObj._id).find('.e-vhandle').attr("unselectable", "on");
            }
            if (flag) this.popupList.css("display", "none");
        },

        _setListWidth: function () {
            if (this.popupList) {
                var width = this.model.popupWidth;
                if (width && width != "auto") this.popupList.css({ "width": width });
                else this.popupList.css({ "width": this.wrapper.width() });
            }
            if (this.scrollerObj) {
                this._refreshScroller();
                this._updateScrollTop();
            }
        },
        _setListHeight: function () {
            if (this.popupList) this.popupList.css({ "max-height": this.model.popupHeight || "191px" });
            if (this.scrollerObj) {
                this._refreshScroller();
                this._updateScrollTop();
            }
        },
        _updateScrollTop: function () {
            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop() });
        },
        _refreshPopup: function () {
            if (this.model.popupWidth == "auto") this.popupList.css({ "width": this.wrapper.width() });
            this._setListPosition();
            this._refreshScroller();
        },

        _setListPosition: function () {
            var elementObj = this.wrapper, pos = this._getOffset(elementObj), winWidth,
            winBottomHeight = $(document).scrollTop() + $(window).height() - (pos.top + $(elementObj).outerHeight()),
            winTopHeight = pos.top - $(document).scrollTop(),
            popupHeight = this.popupList.outerHeight(),
            popupWidth = this.popupList.outerWidth(),
            left = pos.left,
            totalHeight = elementObj.outerHeight(),
            border = (totalHeight - elementObj.height()) / 2,
            maxZ = this._getZindexPartial(), popupmargin = 3,
            topPos = ((popupHeight < winBottomHeight || popupHeight > winTopHeight) ? pos.top + totalHeight + popupmargin : pos.top - popupHeight - popupmargin) - border;
            winWidth = $(document).scrollLeft() + $(window).width() - left;
            if (this.model.enableRTL || popupWidth > winWidth && (popupWidth < left + elementObj.outerWidth())) left -= this.popupList.outerWidth() - elementObj.outerWidth();
            this.popupList.css({
                "left": left + "px",
                "top": topPos + "px",
                "z-index": maxZ
            });
        },

        _getOffset: function (ele) {
            return ej.util.getOffset(ele);
        },

        _getZindexPartial: function () {
            return ej.util.getZindexPartial(this.element, this.popupList);
        },

        _enableMask: function () {
            var flag = false;
            if ((this.model.minTime && this._compareTime(this.model.minTime, this.model.value)) ||
                this.model.maxTime && this._compareTime(this.model.value, this.model.maxTime))
                this.isValidState = false;
            else this.isValidState = true;
            this._setTime(this.model.value);
            (ej.isNullOrUndefined(this.model.value)) ? this.wrapper.removeClass('e-valid') : this.wrapper.addClass('e-valid');
            if (this._getInternalEvents && !this.isValidState) this._trigger("outOfRange");
            this._changeActiveEle();
            this._preVal = this.element.val();
        },
        _setTime: function (time) {
            var modifiedTime = this._localizeTime(time);
            this.element.val(modifiedTime);
            if (this.model.enableStrictMode) {
                this.model.value = (this._compareTime(this.model.value, this.model.minTime) && this._compareTime(this.model.maxTime, this.model.value)) ? modifiedTime : null;
            } else {
                this.model.value = modifiedTime;
            }
        },
        _timeFromISO: function (date) {
            var result = this._extISORegex.exec(date) || this._basicISORegex.exec(date), dateFormat = '', timeFormat = '', zeroFormat = '', format;
            if (result) {
                for (var i = 0; i < this._dates.length; i++) {
                    if (this._dates[i][1].exec(result[1])) {
                        dateFormat = this._dates[i][0];
                        break;
                    }
                }
                if (result[3]) {
                    for (var k = 0; k < this._times.length; k++) {
                        if (this._times[k][1].exec(result[3])) {
                            // result[2] should be 'T' (time) or space
                            timeFormat = (result[2] || ' ') + this._times[k][0];
                            break;
                        }
                    }
                }
                if (result[4]) if (this._zeroRegex.exec(result[4])) zeroFormat = 'Z';
                format = dateFormat + timeFormat + zeroFormat;
                var token = format.match(this._tokens), input, val = [], literal, char;
                for (var j = 0; j < token.length; j++) {
                    var str = token[j];
                    literal = this._checkLiteral(token[j]);
                    var rg = this._numberRegex[literal ? token[j].toLowerCase() : str.length] || new RegExp('^\\d{1,' + str.length + '}');
                    input = date.match(rg);
                    if (input) {
                        if (date.substr(0, date.indexOf(input)) >= 0 && !literal) token[j].indexOf('M') >= 0 ? val.push(parseInt(input[0]) - 1) : val.push(parseInt(input[0]));
                        date = date.slice(date.indexOf(input[0]) + input[0].length);
                    }
                }
                //if you want to get the value in UTC format use the "new Date(Date.UTC.apply(null, val)"
                //return the date object value as exact as given input value
                //new Date(year, month, day, hour, minute, seconds);
                return result[4] == "Z" ? new Date(Date.UTC.apply(null, val)) : new Date(val[0], val[1], val[2], val[3], val[4], val[5]);
            }
            else {
                return new Date(date + "");
            }
        },
        _checkLiteral: function (str) {
            char = str.toLowerCase();
            return (char == 't' || char == 'z' || char == ':' || char == '-') ? true : false;
        },
        _setMask: function () {
            this.model.value = new Date();
            this._enableMask();
        },

        _validateTimes: function () {
            var validatedformat = this._validateTimeFormat(this.model.timeFormat);
            if (validatedformat) this.model.timeFormat = validatedformat;
            else this.model.timeFormat = "h:mm tt";
            if (!this._isValid(this.model.minTime)) this.model.minTime = "12:00 AM";
            if (!this._isValid(this.model.maxTime)) this.model.maxTime = "11:59 PM";
            if (!this._isValid(this.model.value, true)) this.model.value = null;
            if (!this._checkMinMax(this.model.value) && !this.model.enableStrictMode) {
                if (this.model.minTime && !this._compareTime(this.model.value, this.model.minTime, true))
                    this.model.value = this.model.minTime;
                if (this.model.maxTime && !this._compareTime(this.model.maxTime, this.model.value, true))
                    this.model.value = this.model.maxTime;
            }
            this._validateMinMax();
        },
        _ensureValue: function () {
            if (!this._checkMinMax(this.model.value) && this._isValid(this.model.value, true)) {
                if (!this.model.enableStrictMode) {
                    if (this.model.minTime && !this._compareTime(this.model.value, this.model.minTime, true))
                        this.model.value = this.model.minTime;
                    if (this.model.maxTime && !this._compareTime(this.model.maxTime, this.model.value, true))
                        this.model.value = this.model.maxTime;
                }
                else
                    this.isValidState = false;
            }
        },
        _validateMinMax: function () {
            if (this.model.minTime && this.model.maxTime && this._compareTime(this.model.minTime, this.model.maxTime)) {
                this.model.minTime = this.model.maxTime;
            }
        },
        _checkProperties: function () {
            if (!this.model.enabled) {
                this.model.enabled = true;
                this.disable();
            }
            else if (this.model.enabled && this.element.hasClass("e-disable")) {
                this.model.enabled = false;
                this.enable();
            }
            this._addProperty();
            this._checkAttributes();
        },
        _addProperty: function () {
            this._setRtl(this.model.enableRTL);
            this._setRoundedCorner(this.model.showRoundedCorner);
        },
        _setRtl: function (boolean) {
            if (boolean) {
                this.wrapper.addClass("e-rtl");
                if (this.popupList) this.popupList.addClass("e-rtl");
            }
            else {
                this.wrapper.removeClass("e-rtl");
                if (this.popupList) this.popupList.removeClass("e-rtl");
            }
        },
        _setRoundedCorner: function (boolean) {
            if (boolean) {
                this.container.addClass("e-corner");
                if (this.popupList) this.popupList.addClass("e-corner");
            }
            else {
                this.container.removeClass("e-corner");
                if (this.popupList) this.popupList.removeClass("e-corner");
            }
        },
        _showButton: function (show) {
            this.model.showPopupButton = show;
            if (show) {
                this.container.addClass("e-padding");
                this._renderTimeIcon();
                this._renderDropdown();
                this._addProperty();
            }
            else {
                this.container.removeClass("e-padding");
                this.timeIcon.remove();
                this.popupList.remove();
                this.timeIcon = this.popupList = null;
                $(document).off("mousedown", $.proxy(this._OnDocumentClick, this));
            }
        },
        _checkAttributes: function () {
            if (!this.element.attr("name"))
                this.element.attr({ "name": this.element[0].id });
            if ('ondragstart' in document.createElement('input'))
                this.element.attr({ "ondragstart": "return false" });
            if ('draggable' in document.createElement('input'))
                this.element.attr({ "draggable": "false" });
        },

        _getAmPm: function () {
            var dateObj = new Date();
            dateObj.setHours(0);
            this.ttAM = $.trim(this._localizeMeridian(dateObj));
            dateObj.setHours(23);
            this.ttPM = $.trim(this._localizeMeridian(dateObj));
        },

        _setDimentions: function () {
            if (!this.model.height) this.model.height = this.element.attr("height"); if (!this.model.width) this.model.width = this.element.attr("width");
            this._setHeight(this.model.height);
            if (this.model.width) this.wrapper.width(this.model.width);
        },
        _setHeight: function (height) {
            if (height) this.wrapper.height(height);
            if (this._isIE7) this.element.height(this.container.height());
        },

        _validateTimeFormat: function (timeFormat) {
            var parts = timeFormat.split(" "), format = "";
            if (parts.length == 1 || parts.length == 2) {
                $(parts).each(function (i, part) {
                    format += $.trim(part) + " ";
                });
                return $.trim(format);
            }
            else return null;
        },

        _getSeperator: function () {
            var p = this._getElePlace(), formats = this.model.timeFormat.split(" ")[p.time];
            var regex = new RegExp("^[a-zA-Z0-9]+$");

            for (var i = 0; i < formats.length; i++) {
                if (!regex.test(formats.charAt(i))) return formats.charAt(i);
            }
        },

        _checkInComplete: function () {
            var pos = this._getCaretSelection(), cursor = this._getStartEnd(pos);
            var replace = "00", selected = this._getSelectedValue(cursor), category = this._getCategory(cursor);
            if (pos.end - pos.start == this.element.val().length) this._checkAll();

            if (category && category != "tt") {
                this._findCategoryPosition(category);
                if (selected == "__") {
                    if (category == "h" || category == "hh") replace = "12";
                    this._changeToDefault(replace);
                }
                else if (category.length != 1 && selected.length == 1) {
                    selected = this._changeWhole(selected);
                    this.element.val(this._replaceAt(this.target.value, this.start, this.end, selected));
                }
            }
        },
        _checkAll: function () {
            var i, p = this._getElePlace(), categories = this.model.timeFormat.split(" ")[p.time].split(this.seperator);
            for (i = 0; i < categories.length; i++) {
                this._findCategoryPosition(categories[i]);
                var selected = this._getSelectedValue({ start: this.start, end: this.end });

                if (categories[i].length != 1 && selected.length == 1) {
                    selected = this._changeWhole(selected);
                    this.element.val(this._replaceAt(this.element.val(), this.start, this.end, selected));
                }
            }
        },

        _changeToDefault: function (replace) {
            this.incomplete = true;
            var preVal = this.element[0].value
            this.element[0].value = this._replaceAt(this.target.value, this.start, this.end, replace);
            var timeValue = this._checkExceedRange(this.target.value);
            if (!!timeValue) {
                this._setTime(this.model[timeValue]);
            }
            this._setSelection(this.start, this.end);
            this._raiseChangeEvent(preVal);
        },

        _setSelection: function (start, end) {
            var element = this.element[0];

            if (element.setSelectionRange)
                element.setSelectionRange(start, end);
            else if (element.createTextRange) {
                // For lower version browsers (IE8, IE7 ...)
                element = element.createTextRange();
                element.collapse(true);
                element.moveEnd('character', end);
                element.moveStart('character', start);
                element.select();
            }
        },

        _getSelectedValue: function (cursor) {
            return this.target.value.substring(cursor.start, cursor.end);
        },

        _getMinMax: function (currPart, keydown) {
            if (currPart == "hh" || currPart == "h") {
                this.min = 1; this.max = 11;
                if (keydown) this.max = 12;
            }
            else if (currPart == "HH" || currPart == "H") {
                this.min = 0; this.max = 23;
            }
            else if (currPart == "mm" || currPart == "m" || currPart == "ss" || currPart == "s") {
                this.min = 0; this.max = 59;
            }
        },

        _focusElement: function () {
            this._manualFocus = true;
            this.element.focus();
        },
        _targetFocus: function (e) {
            this._clearRange();
            e.preventDefault();
            this.focused = true;
            this.element.on('mousewheel DOMMouseScroll', $.proxy(this._mouseWheel, this));
            this.wrapper.addClass("e-focus").removeClass("e-error").attr('aria-invalid', "false");
            if (!this._manualFocus) {
                this._findCategoryPosition(this._getLeast(false));
                this._setSelection(this.start, this.end);
            }
            this._manualFocus = false;
            this._prevTimeVal = this.element.val();
            this._raiseEvent("focusIn");
            this.wrapper.addClass('e-valid');
        },
        _targetBlur: function () {
            this.focused = false;
            this.element.off('mousewheel DOMMouseScroll', $.proxy(this._mouseWheel, this));
            this.wrapper.removeClass("e-focus");
            if (!this.model.enableStrictMode) {
                // To remove the min value mask while focusout the timepicker.
                if (this.target.value.indexOf('_') > -1) this.element.val('');
            }
            if (!this._checkMinMax(this.target.value) && this._isValid(this.target.value, true)) {
                if (!this.model.enableStrictMode) {
                    if (this.model.minTime && !this._compareTime(this._createObject(this.target.value), this.model.minTime, true))
                        this.element.val(this.model.minTime);
                    if (this.model.maxTime && !this._compareTime(this.model.maxTime, this._createObject(this.target.value), true))
                        this.element.val(this.model.maxTime);
                    if (!this._isValid(this.model.value, true))
                        this.element.val(null);
                    this.isValidState = true;
                    (ej.isNullOrUndefined(this.model.value)) ? this.wrapper.removeClass('e-valid') : this.wrapper.addClass('e-valid');
                }
                else
                    this.isValidState = false;
            }
            else this.isValidState = true;
            this._ensureValue();
            this._raiseChangeEvent();
            this._checkErrorClass();
            this._raiseEvent("focusOut");
            if (!this.model.enableStrictMode) this._checkInComplete();
            (ej.isNullOrUndefined(this.model.value)) ? this.wrapper.removeClass('e-valid') : this.wrapper.addClass('e-valid');
        },
        _clearRange: function () {
            var input = this.element[0];
            if (!isNaN(input.selectionStart)) {
                input.selectionStart = 0;
                input.selectionEnd = 0;
            }
        },
        _checkErrorClass: function () {
            if (this.isValidState) this.wrapper.removeClass("e-error").attr('aria-invalid', "false");
            else this.wrapper.addClass("e-error").attr('aria-invalid', "true");
        },

        _getCaretSelection: function () {
            var input = this.element[0], start = 0, end = 0;
            if (!isNaN(input.selectionStart)) {
                start = input.selectionStart;
                end = input.selectionEnd;
                return { start: Math.abs(start), end: Math.abs(end) };
            }
            // For lower version browsers (IE8, IE7 ...)
            var bookmark = document.selection.createRange().getBookmark();
            var selection = input.createTextRange();
            selection.moveToBookmark(bookmark);

            var before = input.createTextRange();
            before.collapse(true);
            before.setEndPoint("EndToStart", selection);
            var beforeLength = before.text.length, selLength = selection.text.length;
            return { start: beforeLength, end: beforeLength + selLength };
        },

        _mouseDownOnInput: function (e) {
            if (!this.focused && (!ej.isTouchDevice())) this._focusElement();
            this.downPosition = this._getCaretSelection();
            $(document).on("mouseup", $.proxy(this._mouseUpOnInput, this));
        },

        _mouseUpOnInput: function (e) {
            e.preventDefault();
            $(document).off("mouseup", $.proxy(this._mouseUpOnInput, this));
            var pos = this._getCaretSelection();

            if (this.incomplete) {
                this.incomplete = false;
                pos = this.downPosition;
            }
            // Select the Complete Time value using mouse.            
            if (this.target.value != this._getSelectedText()) {
                pos = this._getStartEnd(pos);
                this._setSelection(pos.start, pos.end);
            }
        },

        _getCategoryPosition: function (category) {
            var s = 0, e = 0, parts = this.target.value.split(" "), p = this._getElePlace(), sep = this.seperator, valid = false;
            var fParts = this.model.timeFormat.split(" ")[p.time].split(sep);
            var tParts = parts[p.time].split(sep);
            if (fParts.length > tParts.length) return { start: s, end: e, isValid: valid };

            if (category == "tt") {
                if (parts[p.tt] == this.ttAM || parts[p.tt] == this.ttPM) {
                    if (p.tt == 0) s = 0;
                    else s = parts[p.time].length + 1;
                    e = s + parts[p.tt].length;
                    valid = true;
                }
            }
            else {
                if (p.time == 0) s = 0;
                else s = parts[p.tt].length + 1;

                var index = fParts.indexOf(category);
                if (index != -1) {
                    for (var i = 0; i < fParts.length; i++) {
                        e = tParts[i].length + 1;
                        if (i == index) break;
                        else s += e;
                    }
                    e += s - 1;
                    valid = true;
                }
            }
            return { start: s, end: e, isValid: valid };
        },
        _getCategory: function (cursor) {
            var parts = this.model.timeFormat.split(" "), sep = this.seperator;
            var p = this._getElePlace();
            if (cursor.isTT) return parts[p.tt];
            else return parts[p.time].split(sep)[cursor.index];
        },

        _getStartEnd: function (pos) {
            var tt, sep = this.seperator;
            var value = this.element.val(), parts = value.split(" "), s = 0, e = 0, place = tt = null, i, j;

            for (j = 0; j < parts.length; j++) {
                if (parts[j] != this.ttAM && parts[j] != this.ttPM) {
                    var time = parts[j].split(sep), tempS = s, tempE = s + time[0].length;
                    for (i = 0; i < time.length; i++) {
                        e = time[i].length + s;
                        if (pos.start <= e) {
                            place = i;
                            tt = false;
                            j = parts.length;
                            break;
                        }
                        else s += time[i].length + 1;
                    }
                }
                else {
                    if (pos.start <= s + parts[j].length) {
                        e = parts[j].length + s;
                        place = 0;
                        tt = true;
                        j = parts.length;
                        break;
                    }
                    else s += parts[j].length + 1;
                }
            }
            if (place == null) s = tempS, e = tempE, place = 0, tt = false;

            return { start: s, end: e, index: place, isTT: tt };
        },

        _modifyValue: function (isIncrement) {
            if (!this._isValid(this.target.value)) return;
            if (!this.model.enableStrictMode) this._checkInComplete();
            var pos = this._getCaretSelection(), cursor;
            if (pos.start == pos.end) {
                var cate = this._getLeast(true);
                var position = this._getCategoryPosition(cate);
                cursor = this._getStartEnd(position);
            }
            else cursor = this._getStartEnd(pos);
            this.start = cursor.start; this.end = cursor.end;
            this._changeValue(cursor, isIncrement);
        },

        _keyUpOnInput: function (e) {
            e.preventDefault();
            if (this._preVal != this.element.val()) {
                this._preVal = this.element.val();
            }
        },

        _getNextCategory: function (cate, direction) {
            var categories = [], sep = this.seperator;
            var fParts = this.model.timeFormat.split(" ");
            $(fParts).each(function (i, part) {
                if (part == "tt") categories.push(part);
                else {
                    var inner = part.split(sep);
                    categories = inner.concat(categories);
                }
            });
            var index = categories.indexOf(cate), ix;
            if (index != -1) {
                if (direction) {
                    if (index == 0) ix = categories.length - 1;
                    else ix = index - 1;
                }
                else {
                    if (index == categories.length - 1) ix = 0;
                    else ix = index + 1;
                }
                return categories[ix];
            }
            return cate;
        },
        _getElePlace: function () {
            var fParts = this.model.timeFormat.split(" "), time, tt;
            if (fParts[0] == "tt") time = 1, tt = 0;
            else time = 0, tt = 1;
            return { time: time, tt: tt };
        },
        _movePosition: function (pos, direction) {
            var cursor = this._getStartEnd(pos);
            var currCate = this._getCategory(cursor);
            if (!currCate) currCate = this._getLeast(direction);
            var next = this._getNextCategory(currCate, direction);
            var cursor = this._getCategoryPosition(next);

            if (cursor.isValid) {
                this._setSelection(cursor.start, cursor.end);
            }
        },
        _findActiveIndex: function () {
            var elements = this.ul.find("li");
            var currTime = this.element.val(), firstTime = elements.first().html(), index;
            index = (this._parse(currTime) - this._parse(firstTime)) / (this.model.interval * 60000);
            index = Math.round(index);
            this._activeItem = (index == elements.length) ? index : index + 1;
            if (this._activeItem < 0 || this._activeItem > elements.length || isNaN(this._activeItem)) this._activeItem = 0;
        },
        _keyDownOnInput: function (e) {
            if (this.model.readOnly && !this._readOnlyKeys(e)) return false;
            var pos, cursor, category, key = e.keyCode;

            // _getInternalEvents is set to true when TimePicker used inside DateTimePicker control
            // in DateTimePicker control it allows Up, Down, Home, End, Tab keys only
            if (this._getInternalEvents && key != 38 && key != 40 && key != 36 && key != 35 && key != 9) return false;
            // Up, Down, Esc
            if (!this.model.enableStrictMode) {
                // Prevent type operation on popup open in state.
                if (this.showDropdown && key != 38 && key != 40 && key != 27 && !this._readOnlyKeys(e)) return false;
                else if (this.showDropdown && (key == 37 || key == 39)) e.keyCode = (key == 37) ? 38 : 40;
            }
            pos = this._getCaretSelection();
            cursor = this._getStartEnd(pos);
            category = this._getCategory(cursor);
            switch (e.keyCode) {
                case 38:
                    e.preventDefault();
                    if (!this.showDropdown) {
                        if (this._isValid(this.target.value)) this._modifyValue(true);
                    }
                    else if (this.showDropdown) {
                        e.preventDefault();
                        this._findActiveIndex();
                        prevActiveItem = this._activeItem;
                        this._activeItem = this._disableItemSelectUp(this._activeItem - 1);
                        if (this._activeItem == 0) this._activeItem = prevActiveItem;
                        this._addListHover();
                        activeItem = this._getActiveItem();
                        if (activeItem.length) this._selectTimeItem(activeItem);
                    }
                    break;
                case 40:
                    e.preventDefault();
                    if (e.altKey && this.model.showPopupButton)
                        this._showhidePopup();
                    else if (!this.showDropdown) {
                        if (this._isValid(this.target.value)) this._modifyValue(false);
                    }
                    else if (this.showDropdown) {
                        e.preventDefault();
                        this._findActiveIndex();
                        prevActiveItem = this._activeItem;
                        this._activeItem = this._disableItemSelectDown(this._activeItem);
                        if (this._activeItem < this._listSize) this._activeItem += 1;
                        else
                            this._activeItem = prevActiveItem;
                        this._addListHover();
                        this._selectTimeItem(this._getActiveItem());
                    }
                    break;
                case 37:
                    e.preventDefault();
                    if (pos.start == pos.end) this._setSelection(pos.start - 1, pos.start - 1);
                    else this._movePosition(pos, true);
                    break;
                case 39:
                    e.preventDefault();
                    if (pos.start == pos.end) this._setSelection(pos.start + 1, pos.start + 1);
                    else this._movePosition(pos, false);
                    break;

                case 36:
                    // Home key 
                    e.preventDefault();
                    if (!this.showDropdown) {
                        var homecate = this._firstlastVal(true);
                        var hPos = this._getCategoryPosition(homecate);
                        if (hPos.isValid) this._setSelection(hPos.start, hPos.end);
                    }
                    else {
                        this._activeItem = 0;
                        prevActiveItem = this._activeItem;
                        this._activeItem = this._disableItemSelectDown(this._activeItem);
                        if (this._activeItem < this._listSize) this._activeItem += 1;
                        else
                            this._activeItem = prevActiveItem;
                        this._addListHover();
                        this._selectTimeItem(this._getActiveItem());
                    }
                    break;
                case 35:
                    // End key
                    e.preventDefault();
                    if (!this.showDropdown) {
                        var endcate = this._firstlastVal(false);
                        var ePos = this._getCategoryPosition(endcate);
                        if (ePos.isValid) this._setSelection(ePos.start, ePos.end);
                    }
                    else {
                        this._activeItem = this._listSize + 1;
                        prevActiveItem = this._activeItem;
                        this._activeItem = this._disableItemSelectUp(this._activeItem - 1);
                        if (this._activeItem == 0) this._activeItem = prevActiveItem;
                        this._addListHover();
                        this._selectTimeItem(this._getActiveItem());
                    }
                    break;
                case 9:
                    if (this._getInternalEvents) break;
                    this._hideResult();
                    var flag = null;
                    if (e.shiftKey && pos.start > 0) flag = true;
                    else if (!e.shiftKey && pos.end < this.element.val().length) flag = false;
                    if (flag != null) {
                        e.preventDefault();
                        this._checkInComplete();
                        this._movePosition(pos, flag);
                    }
                    break;
                case 13:
                    if (!this.showDropdown) {
                        this._raiseChangeEvent();
                        break;
                    }
                case 27:
                    e.preventDefault();
                    this._hideResult();
                    break;
                case 8:
                case 46:
                    if (this.model.enableStrictMode) return;
                    if (this.target.value != this._getSelectedText()) {
                        e.preventDefault();
                        if (category && category != "tt") {
                            this._findCategoryPosition(category);
                            var _doBackspace = (key == 8 && pos.start != this.start), _doDelete = (key == 46 && pos.end != this.end), len;
                            len = this.end - this.start;

                            if ((pos.start != pos.end || len == 1) && (_doBackspace || _doDelete || pos.start != pos.end)) {
                                var s1 = this.start, s2 = this.end, te;
                                this.element[0].value = this._replaceAt(this.target.value, s1, s2, "__");
                                te = (s2 - s1 != 2) ? s2 + 1 : s2;
                                this._setSelection(s1, te);
                            }
                            else {
                                if (_doBackspace) {
                                    this.element[0].value = this._replaceAt(this.target.value, pos.start - 1, pos.start, "");
                                    this._setSelection(pos.start - 1, pos.start - 1);
                                }
                                else if (_doDelete) {
                                    this.element[0].value = this._replaceAt(this.target.value, pos.end, pos.end + 1, "");
                                    this._setSelection(pos.end, pos.end);
                                }
                            }
                        }

                    }
                    break;

            }

            var currSelection = this._getSelectedValue(cursor);
            var unicode = e.keyCode ? e.keyCode : e.charCode, actualkey;

            if (e.keyCode > 47 && e.keyCode < 58)
                actualkey = String.fromCharCode(unicode);
            else if (e.keyCode > 95 && e.keyCode < 106)
                actualkey = String.fromCharCode(unicode - 48);
            if (category == "tt" && ((!e.shiftKey && !e.ctrlKey && !e.altKey) && (e.keyCode > 64 && e.keyCode < 91) || (e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 95 && e.keyCode < 106))) {
                e.preventDefault();
                var ttPos = this._getCategoryPosition(category);
                this.start = ttPos.start;
                this.end = ttPos.end;
                this._changeAmPm(currSelection);
                this._raiseChangeEvent();
            }

            // Select complete text and then press time value in the textbox               
            if (this.target.value == this._getSelectedText() && (!e.shiftKey && !e.ctrlKey && !e.altKey)) {
                if (e.keyCode > 64 && e.keyCode < 91 && !this.model.enableStrictMode) e.preventDefault();
                if ((e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 95 && e.keyCode < 106)) {
                    var cursor = this._getStartEnd(pos);
                    this._setSelection(cursor.start, cursor.end);
                }
            }

            if ((!e.shiftKey && !e.ctrlKey && !e.altKey) && (e.keyCode > 47 && e.keyCode < 58) || (e.keyCode > 95 && e.keyCode < 106)) {
                if (category != "tt") {
                    this._getMinMax(category, true);
                    if (pos.start == pos.end) {
                        this._findCategoryPosition(category);
                        var newVal;
                        if (pos.start == this.start) {
                            newVal = actualkey + currSelection;
                            if (this.model.enableStrictMode == false) {
                                this._validateTimes();
                                this._targetBlur();
                            }
                            if (this.model.value == null) this.element.val(this.model.minTime);
                            var cursor = this._getStartEnd(pos);
                            this._setSelection(cursor.start, cursor.end);
                        }
                        else {
                            newVal = currSelection + actualkey;
                        }
                        if (newVal.length > 2 || !(Number(newVal) >= this.min && this.max >= Number(newVal))) {
                            !this.model.enableStrictMode && e.preventDefault();
                        }
                    }
                    else if (!(Number(actualkey) >= this.min && this.max >= Number(actualkey))) {
                        !this.model.enableStrictMode && e.preventDefault();
                    }
                }
            }
            else if (!this._allowKeyCodes(e)) {
                !this.model.enableStrictMode ? (e.keyCode == 8 || e.keyCode == 46) ? e.stopPropagation() : e.preventDefault() : e.stopPropagation();
            }
        },

        _getSelectedText: function (e) {
            if (window.getSelection) {
                var element = $('#' + this.element[0].id).get(0);
                return element.value.substring(element.selectionStart, element.selectionEnd);
            }
                // For IE
            else return document.selection.createRange().text;
        },
        _allowKeyCodes: function (e) {
            if ((e.ctrlKey && (e.keyCode == 65 || e.keyCode == 67 || e.keyCode == 90 || e.keyCode == 89))
                || e.keyCode == 9 || e.keyCode == 116 || e.keyCode == 13)
                return true;
            return false;
        },
        _readOnlyKeys: function (e) {
            if (e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37 || e.keyCode == 39 || this._allowKeyCodes(e))
                return true;
            return false;
        },

        _firstlastVal: function (initial) {
            var parts = this.model.timeFormat.split(" "), sep = this.seperator;
            if (initial) {
                if (parts[0] != "tt") return parts[0].split(sep)[0];
                return "tt";
            }
            else {
                if (parts[0] != "tt") return "tt";
                else if (parts[1]) {
                    var lastItem = parts[1].split(sep);
                    return lastItem.length ? lastItem[lastItem.length - 1] : "tt";
                }
                return "tt";
            }
        },

        _mouseWheel: function (event) {
            event.preventDefault();
            if (this.model.readOnly) return false;
            var delta, rawEvent = event.originalEvent;
            if (rawEvent.wheelDelta) {
                // IE and Opera use wheelDelta, which is a multiple of 120 (possible values -120, 0, 120).
                delta = rawEvent.wheelDelta / 120;
                // In Opera, value is negated.
                //if (Sys.Browser.agent === Sys.Browser.Opera) delta = -delta;
            }
            else if (rawEvent.detail) {
                // Firefox uses detail property, which is a multiple of 3.
                delta = -rawEvent.detail / 3;
            }
            if (delta > 0)
                this._modifyValue(true);
            else if (delta < 0)
                this._modifyValue(false);
        },

        _addListHover: function () {
            this._addSelected();
            this._updateScrollTop();
        },
        _addSelected: function () {
            this.ul.find("li").removeClass("e-active e-hover");
            var activeItem = this._getActiveItem();
            if (activeItem.length && !activeItem.hasClass('e-disable'))
                activeItem.addClass('e-active');
        },
        _disableItemSelectDown: function (current) {
            if (current == null || current < 0) current = 0;
            if (current < this._listSize) {
                if ($.inArray(current, this._disabledItems) < 0)
                    return current;
                else
                    return this._disableItemSelectDown(current + 1);
            }
            else return this._listSize;
        },

        _disableItemSelectUp: function (current) {
            current = current - 1;
            if (current == null || current < 0) current = 0;
            if (current < this._listSize) {
                if ($.inArray(current, this._disabledItems) < 0)
                    return current + 1;
                else if (current > 0)
                    return this._disableItemSelectUp(current);
            }
            return 0;
        },
        _getActiveItem: function () {
            return $(this.ul.find("li")[this._activeItem - 1]);
        },

        _timeIconClick: function (event) {
            if (ej.isNullOrUndefined(this.popupList)) {
                this._renderDropdown();
                this._addProperty();
            };
            var isRightClick = false;
            if (event.button)
                isRightClick = (event.button == 2);
            else if (event.which)
                isRightClick = (event.which == 3); //for Opera
            if (isRightClick) return;
            event.preventDefault();
            if (!this.model.enabled || this.model.readOnly || this.ul.find("li").length < 1) return false;
            this._showhidePopup();
            var len = this.element.val().length;
            if (!ej.isTouchDevice()) this._setSelection(len, len);
        },
        _showhidePopup: function () {
            if (this._getInternalEvents) return false;
            if (!this.showDropdown)
                this._showResult();
            else
                this._hideResult();
        },
        _showResult: function () {
            if (this.popupList == null) this._renderDropdown();
            this._raiseEvent("beforeOpen");
            this._refreshPopup();
            if (!this.focused && (!ej.isTouchDevice())) this._focusElement();
            if (this.model.value) this._changeActiveEle();
            else
                this.ul.find("li").removeClass("e-active");

            var proxy = this, sTop = this._vissibleAndCalculateTop();
            this.popupList.slideDown(this.model.enableAnimation ? 200 : 0, function () {
                $(document).on("mousedown", $.proxy(proxy._OnDocumentClick, proxy));
            });
            this.scrollerObj.setModel({ "scrollTop": sTop });
            this.showDropdown = true;
            this._listSize = this.ul.find("li").length;
            $(window).on("resize", $.proxy(this._OnWindowResize, this));
            this._on(ej.getScrollableParents(this.wrapper), "scroll", this._hideResult);
            this._on(ej.getScrollableParents(this.wrapper), "touchmove", this._hideResult);
            this._raiseEvent("open");
            this.wrapper.addClass("e-active");
        },
        _hideResult: function (e) {
			if ( e && (e.type == "touchmove" || e.type== "scroll")) {
				if ($(e.target).parents("#"+this.popupList[0].id).length > 0)
			   return;
			}           
			if (this.showDropdown && !this._getInternalEvents) {
			this.showDropdown = false;
			this.popupList.slideUp(this.model.enableAnimation ? 100 : 0);
			$(document).off("mousedown", $.proxy(this._OnDocumentClick, this));
			$(window).off("resize", $.proxy(this._OnWindowResize, this));
			this._off(ej.getScrollableParents(this.wrapper), "scroll", this._hideResult);
			this._off(ej.getScrollableParents(this.wrapper), "touchmove", this._hideResult);
			this._raiseEvent("close");
			this.wrapper.removeClass("e-active");
            }
        },

        _vissibleAndCalculateTop: function () {
            this.popupList.css({ "display": "block" });
            var scrollTop = this._calcScrollTop();
            this.popupList.css({ "display": "none" });
            return scrollTop;
        },
        _calcScrollTop: function () {
            var ulH = this.ul.outerHeight(), liH = this.ul.find("li").outerHeight(), index, top;
            index = this.ul.find("li.e-active").index();
            top = (liH * index) - ((this.popupList.outerHeight() - liH) / 2);
            return top;
        },
        _changeActiveEle: function () {
            if (!this.model.showPopupButton || !this.popupList) return false;
            var elements = this.ul.find("li");
            var currTime = this.element.val(), firstTime = elements.first().html(), index;
            index = (this._parse(currTime) - this._parse(firstTime)) / (this.model.interval * 60000);
            index = Math.round(index);
            this._activeItem = (index == elements.length) ? index : index + 1;
            if (this._activeItem < 0 || this._activeItem > elements.length || isNaN(this._activeItem) || this._ensureTimeRange(currTime)) this._activeItem = 0;
            this._addListHover();
        },

        _OnDocumentClick: function (e) {
            if (!$(e.target).is(this.popupList) && !$(e.target).parents(".e-time-popup").is(this.popupList) &&
                !$(e.target).is(this.wrapper) && !$(e.target).parents(".e-timewidget").is(this.wrapper)) {
                this._hideResult();
            }
            else if ($(e.target).is(this.popupList) || $(e.target).parents(".e-time-popup").is(this.popupList))
                e.preventDefault();
        },
        _OnWindowResize: function (e) {
            this._refreshPopup();
        },

        _OnMouseEnter: function (e) {
            var targetEle = e.target;
            this.ul.find("li").removeClass("e-hover");
            if (!$(targetEle).hasClass('e-disable'))
                $(targetEle).addClass("e-hover");
        },
        _OnMouseLeave: function (e) {
            if (!this._dateTimeInternal || this.model.value)
                this.ul.find("li").removeClass("e-hover");
        },
        _OnMouseClick: function (e) {
            e.preventDefault();
            if ($(e.target).hasClass('e-disable')) return;
            if (this.model.enabled && !this.model.readOnly) {
                this._activeItem = $(e.target).index() + 1;
                this.ul.find("li").attr({ 'tabindex': -1, 'aria-selected': false });
                $(e.target).attr({ 'aria-selected': true, 'tabindex': 0 });
                this._addSelected();
                this._selectTimeItem($(e.target));
            }
            this._showhidePopup();
        },
        _selectTimeItem: function (ele) {
            this._beforeChange(ele);
            var flag = this._raiseChangeEvent();
            if (flag)
                this._trigger("select", { value: this.model.value, prevTime: this._previousValue });
        },

        _findCategoryPosition: function (category) {
            if (category == "least") category = this._getLeast(true);
            var pos = this._getCategoryPosition(category);
            this.start = pos.start;
            this.end = pos.end;
        },

        _getLeast: function (lower) {
            var formats = this.model.timeFormat.split(" "), sep = this.seperator, res = null;
            $(formats).each(function (i, e) {
                if (e != "tt") {
                    var times = e.split(sep);
                    if (lower) res = times[times.length - 1];
                    else res = times[0];
                }
            });
            return res;
        },

        _changeValue: function (cursor, isIncrement) {
            var preVal = this.target.value, currValue, category = this._getCategory(cursor);
            if (!category) return false;
            this._setSelection(this.start, this.end);
            currValue = this.target.value.substring(this.start, this.end);
            if (this._checkMinMax(this.target.value)) {
                if (currValue != this.ttAM && currValue != this.ttPM) {
                    currValue = this._changeCurrentValue(currValue, category, isIncrement);
                    if (category.length != 1) currValue = this._changeWhole(currValue);
                    this._findCategoryPosition(category);
                    this.element.val(this._replaceAt(this.target.value, this.start, this.end, currValue));
                    this.end = this.start + currValue.toString().length;
                    this._setSelection(this.start, this.end);
                    if (this._ensureTimeRange(this.target.value) && this._checkMinMax(this.target.value)) {
                        var timeObject = this._createObject(this.target.value);
                        var hour = timeObject.getHours();
                        var fromTime = isIncrement ? this._startTime : this._endTime;
                        var toTime = isIncrement ? this._endTime : this._startTime;
                        if (!ej.isNullOrUndefined(this.model.disableTimeRanges)) {
                            for (i = 0; i < this.model.disableTimeRanges.length; i++) {
                                if ((fromTime[i].getHours() === hour) || ((+timeObject >= +this._startTime[i]) && +timeObject <= +this._endTime[i])) {
                                    this.target.value = this._localizeTime(toTime[i]);
                                    this._findCategoryPosition(category);
                                    this._setSelection(this.start, this.end);
                                    this._changeValue(cursor, isIncrement);
                                }
                            }
                        }
                    }
                }
                else this._changeAmPm(currValue);
            }
            else {
                var timeValue = this._checkExceedRange(this.target.value);
                this._setTime(this.model[timeValue]);
                this._findCategoryPosition(category);
                this._setSelection(this.start, this.end);
            }
            if (!this._checkMinMax(this.target.value)) {
                this.element.val(this.model.value);
                this._findCategoryPosition(category);
                this._setSelection(this.start, this.end);
            }
            else this._raiseChangeEvent();
        },

        _checkMinMax: function (value) {
            var res = this._checkExceedRange(value);
            if (res == null) res = false;
            return !res;
        },
        _checkExceedRange: function (value) {
            if (value) {
                if (this.model.minTime && !this._compareTime(value, this.model.minTime, true)) return "minTime";
                if (this.model.maxTime && !this._compareTime(this.model.maxTime, value, true)) return "maxTime";
            }
            return null;
        },

        _changeWhole: function (currValue) {
            return currValue > 9 ? "" + currValue : "0" + currValue;
        },
        _changeAmPm: function (ampm) {
            ampm = ampm == this.ttAM ? this.ttPM : this.ttAM;
            this.element.val(this._replaceAt(this.target.value, this.start, this.end, ampm));
            this._setSelection(this.start, this.end);
        },
        _changeMinute: function (isIncrement) {
            var formats = ["mm", "m"];
            var currFormat = this._getExactFormat(formats);
            if (currFormat) {
                this._findCategoryPosition(currFormat);
                var minute = Number(this.target.value.substring(this.start, this.end));
                this._getMinMax(currFormat);
                if (isIncrement) {
                    if (minute == this.max) {
                        minute = this.min;
                        this._changeHour(isIncrement);
                    }
                    else minute += 1;
                }
                else {
                    if (minute == this.min) {
                        minute = this.max;
                        this._changeHour(isIncrement);
                    }
                    else minute -= 1;
                }
                this._findCategoryPosition(currFormat);
                if (currFormat.length != 1) minute = this._changeWhole(minute);
                this.element.val(this._replaceAt(this.target.value, this.start, this.end, minute));
            }
        },
        _changeHour: function (isIncrement) {
            var formats = ["hh", "h", "HH", "H"];
            var currFormat = this._getExactFormat(formats);
            if (currFormat) {
                this._findCategoryPosition(currFormat);
                var hour = Number(this.target.value.substring(this.start, this.end));
                this._getMinMax(currFormat);
                if (isIncrement) {
                    if (hour == this.max) {
                        hour += 1;
                        this._changeMeridian();
                    }
                    else if (hour > this.max) hour = this.min;
                    else hour += 1;
                }
                else {
                    if (hour == this.min) hour = this.max + 1;
                    else if (hour > this.max) {
                        hour = this.max;
                        this._changeMeridian();
                    }
                    else hour -= 1;
                }
                this._findCategoryPosition(currFormat);
                if (currFormat.length != 1) hour = this._changeWhole(hour);
                this.element.val(this._replaceAt(this.target.value, this.start, this.end, hour));
            }
        },
        _getExactFormat: function (cate) {
            var tFormat = this.model.timeFormat;
            for (var i = 0; i < cate.length; i++) {
                if (tFormat.indexOf(cate[i]) != -1) return cate[i];
            }
            return null;
        },
        _changeMeridian: function () {
            var start = this.model.timeFormat.indexOf("tt");
            if (start != -1) {
                this._findCategoryPosition("tt");
                var meridian = this.target.value.substring(this.start, this.end);
                meridian = (meridian == this.ttAM) ? this.ttPM : this.ttAM;
                this.element.val(this._replaceAt(this.target.value, this.start, this.end, meridian));
            }
        },
        _changeCurrentValue: function (current, category, isIncrement) {
            current = Number(current);
            var c = category, step = 1, change = true;
            this._getMinMax(c);

            if (c == "hh" || c == "h" || c == "HH" || c == "H") step = this.model.hourInterval;
            else if (c == "mm" || c == "m") step = this.model.minutesInterval;
            else if (c == "ss" || c == "s") step = this.model.secondsInterval;
            if (step <= 0) return current;

            if (isIncrement) {
                if ((c == "hh" || c == "h") && current > this.max) current = this.min - 1 + step;
                else if (current < this.max) current += step;
                else {
                    change = false;
                    if (c != "hh" && c != "h") current = this.min - 1 + step;
                    else current += step;
                    this._changeAdjacent(c, isIncrement);
                }
                if ((c == "hh" || c == "h") && current == this.max + 1)
                    change && this._changeAdjacent(c, isIncrement);
                else if (current > this.max + 1) {
                    current = current - (this.max + 1);
                    change && this._changeAdjacent(c, isIncrement);
                }
                if ((c != "hh" && c != "h") && current == this.max + 1) {
                    current = this.min;
                    change && this._changeAdjacent(c, isIncrement);
                }
            }
            else {
                if ((c != "hh" && c != "h") && current > this.min) current -= step;
                else if ((c == "hh" || c == "h") && current > this.min && current <= this.max) current -= step;
                else if ((c == "hh" || c == "h") && current == this.min) current = this.max + 2 - step;
                else {
                    change = false;
                    current = this.max + 1 - step;
                    this._changeAdjacent(c, isIncrement);
                }
                if (current < this.min) {
                    current = current + (this.max + 1);
                    change && this._changeAdjacent(c, isIncrement);
                }
            }
            return current;
        },
        _changeAdjacent: function (c, isIncrement) {
            if (c == "ss" || c == "s") this._changeMinute(isIncrement);
            else if (c == "mm" || c == "m") this._changeHour(isIncrement);
            else if (c == "hh" || c == "h" || c == "HH" || c == "H") this._changeMeridian();
        },

        _valueChange: function (e) {
            this._raiseChangeEvent();
        },

        _beforeChange: function (ele) {
            if (!this._raiseEvent("beforeChange")) {
                this.element.val(ele.text());
            }
            return true;
        },

        _raiseChangeEvent: function (prev, isCode) {
            prev = (prev === undefined) ? this.model.value : prev;
            this._previousValue = prev;
            var current = !this.target.value ? null : this.target.value;
            if (prev == current) return false;
            if (this._checkMinMax(this.target.value) && this._isValid(this.target.value, this.model.enableStrictMode) || !this.target.value) this.isValidState = true;
            else this.isValidState = false;
            this.model.value = this._isValid(this.target.value, true) && this._checkMinMax(this.target.value) ? this.target.value : null;
            if (!this.model.value && !this.model.enableStrictMode) this._setTime(this.model.value);
            if (this.model.value == this._previousValue) return false;
            this._raiseEvent("change", isCode);
            this._raiseEvent("_change", isCode);
            return true;
        },
        _raiseEvent: function (name, isCode) {
            var data = { value: this.model.value, prevTime: this._previousValue };
            if (name == "change") data.isInteraction = !isCode;
            return (this._trigger(name, data));
        },
        _checkIE7: function () {
            if (navigator.appName == 'Microsoft Internet Explorer') {
                var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})"), version = -1;
                if (re.exec(navigator.userAgent) != null)
                    version = parseFloat(RegExp.$1);
                if (version >= 7 && version < 8) return true;
            }
            return false;
        },
        _replaceAt: function (mainString, from, to, replace) {
            return mainString.substring(0, from) + replace + mainString.substring(to);
        },
        _localizeTime: function (value) {
            if (value)
                return $.trim(ej.format(this._createObject(value), this.model.timeFormat, this.model.locale));
            return null;
        },
        _localizeMeridian: function (value) {
            return $.trim(ej.format(value, "tt", this.model.locale));
        },
        _compareTime: function (time1, time2, orEqual) {
            orEqual = (!orEqual) ? false : true;
            if (orEqual) return this._parse(time1) >= this._parse(time2);
            else return this._parse(time1) > this._parse(time2);
        },
        _isValid: function (time, validate) {
            time = this._createObject(time, validate);
            return time && typeof time.getTime === "function" && isFinite(time.getTime());
        },
        _parse: function (time) {
            return Date.parse(this._createObject(time));
        },
        _setEmptyDate: function (date) {
            var newDate = new Date(date);
            newDate.setDate(1);
            newDate.setMonth(0);
            newDate.setFullYear(2000);
            return newDate;
        },
        _createObject: function (value, validate) {
            var obj = null;
            if (typeof value === "string") {
                var format = this._setModelOption ? this._preTimeformat : this.model.timeFormat;
                var dateFormat = ej.preferredCulture(this.model.locale).calendar.patterns.d;
                var dateValue = ej.format(new Date("1/1/2000"), dateFormat, this.model.locale);
                obj = ej.parseDate(dateValue + " " + value, dateFormat + " " + format, this.model.locale);
                if (this._extISORegex.exec(value) || this._basicISORegex.exec(value)) this.model.value = obj = this._timeFromISO(value);
                this._setModelOption = false;
                if (!obj) {
                    var isJSONString = new Date(value);
                    if (!isNaN(Date.parse(isJSONString)) && !ej.isNullOrUndefined(value))
                        obj = this._setEmptyDate(value);
                    else
                        obj = !this._dateTimeInternal || value == "" ? null : new Date("1/1/2000 " + value);
                }
            }
            else if (typeof value === "number")
                obj = new Date(value);
            else if (value instanceof Date)
                obj = this._setEmptyDate(value);

            if (obj && !this._dateTimeInternal && validate) {
                var timeVal = this._localizeTime(obj);
                if (this._ensureTimeRange(timeVal))
                    obj = null;
            }
            return obj;
        },

        _wireEvents: function () {
            this._on(this.element, "focus", this._targetFocus);
            this._on(this.element, "blur", this._targetBlur);
            this._on(this.element, "mousedown", this._mouseDownOnInput);
            this._on(this.element, "keydown", this._keyDownOnInput);
            this._on(this.element, "keyup", this._keyUpOnInput);
        }
    });
})(jQuery, Syncfusion);;

/**
* @fileOverview Plugin to style the Html ScrollBar elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, window, undefined) {
    'use strict';

    ej.widget("ejScrollBar", "ej.ScrollBar", {
        defaults: {

            orientation: "horizontal",

            viewportSize: 0,

            height: 18,

            width: 18,

            smallChange: 57,

            largeChange: 57,

            value: 0,

            maximum: 0,

            minimum: 0,

            buttonSize: 18,

            infiniteScrolling: false
        },
        validTags: ["div"],
        type: "transclude",
        dataTypes: {
            buttonSize: "number",
            smallChange: "number",
            largeChange: "number",
        },
        observables: ["value"],
        value: ej.util.valueFunction("value"),
        _enabled: true,
        content: function () {
            if (!this._content || !this._content.length) {
                if (this.model.orientation === "horizontal") {
                    this._content = this.element.find(".e-hhandle");
                }
                else {
                    this._content = this.element.find(".e-vhandle");
                }
            }
            return this._content;
        },
        _init: function () {
            this.element.addClass("e-widget");
            this._ensureScrollers();
            this.content();
            this._setInitialValues();

        },

        _setInitialValues: function () {
            var xy = "X";
            if (this.model.orientation === ej.ScrollBar.Orientation.Horizontal) {
                this.element.addClass("e-hscrollbar");
            }
            else {
                this.element.addClass("e-vscrollbar");
                xy = "Y";
            }
            if (this.value() !== 0 || this.model.minimum !== 0) {
                if (this.value() < this.model.minimum)
                    this.value(this.model.minimum);
                this["scroll"](this.value(), "none");
            }
        },

        _ensureScrollers: function () {
            var jqVersion = $.fn.jquery, height, width;
            if (this.model.height) {
                this.element.height(this.model.height);
            }
            if (this.model.width) {
                this.element.width(this.model.width);
            }
            var d2;
            if (!this._scrollData) {
                if (this.model.orientation === "vertical") {
                    this._scrollData = this._createScroller("Height", "Y", "Top", "e-v");
                }
                else {
                    this._scrollData = this._createScroller("Width", "X", "Left", "e-h");
                }
            }
        },

        _setModel: function (option) {
            for (var prop in option) {
                if (prop === "value") {
                    if (this.value()) {
                        this.scroll(this.value(), "none");
                    }
                } else {
                    this.refresh();
                    break;
                }
            }
        },

        _createScroller: function (dimension, xy, position, css) {
            var height;
            var d = {};
            var jqVersion = $.fn.jquery;
            d.dimension = dimension;
            d.xy = xy;
            d.position = position;
            d.css = css;
            d.uDimension = dimension;

            this._calculateLayout(d);
            this._createLayout(d);
            var buttons = this[d.main].find(".e-button");

            this._off(buttons, "mousedown")
                ._on(buttons, "mousedown", { d: d, step: 1 }, this._spaceMouseDown);
            this._off(this[d.scroll], "mousedown")
                ._on(this[d.scroll], "mousedown", { d: d }, this._spaceMouseDown);
            this._off(this[d.handler], "mousedown touchstart")
                ._on(this[d.handler], "mousedown touchstart", { d: d }, this._mouseDown);

            return d;
        },
        _createLayout: function (d) {
            var divString = "<div class='" + d.css + "{0}' style='" + d.dimension + ":{1}px'>{2}</div>";
            var jqVersion = $.fn.jquery;
            var lit = {}, height;
            lit[d.dimension] = d.modelDim;

            var el = ej.buildTag(
                "div." + d.css + "scroll e-box",
                    String.format(divString, "up e-chevron-up_01 e-icon e-box e-button", d.buttonSize) +
                    String.format(divString, "handlespace", d.handleSpace,
                        String.format(divString, "handle e-box e-pinch", d.handle)) +
                    String.format(divString, "down e-chevron-down_01 e-icon e-box e-button", d.buttonSize),
                lit
            );

            this.element.append(el);
            this.element.find('.e-vhandle').addClass("e-v-line e-icon");
            this.element.find('.e-hhandle').addClass("e-h-line e-icon");
            jqVersion === "1.7.1" || jqVersion === "1.7.2" ? height = d.uDimension.toLowerCase() : height = "outer" + d.uDimension;
            this[d.handler] = this.element.find("." + d.handler);
            this[d.handler].css("transition", "none");
            this[d.scroll] = this[d.handler].parent();
            this[d.main] = this[d.scroll].parent();
            this[d.main].find(".e-button")["outer" + d.uDimension](d.buttonSize);
        },
        _calculateLayout: function (d) {
            d.scrollDim = "scroll" + d.dimension;
            d.lPosition = d.position.toLowerCase();
            d.clientXy = "page" + d.xy;
            d.scrollVal = "scroll" + d.position;
            d.scrollOneStepBy = this.model.smallChange;
            d.modelDim = this.model[(d.dimension = d.dimension.toLowerCase())];
            d.handler = d.css + "handle";
            d.buttonSize = this.model.buttonSize;
            d.main = d.css + "scroll";
            d.scroll = d.css + "ScrollSpace";
            d.handleSpace = d.modelDim - 2 * d.buttonSize;
            d.scrollable = (this.model.maximum - this.model.minimum);
            var trackLength = this.model.height;
            if (this.model.orientation === "horizontal")
                trackLength = this.model.width;
            d.handle = (this.model.viewportSize / ((this.model.maximum - this.model.minimum) + this.model.viewportSize)) * (trackLength - 2 * this.model.buttonSize);
            var check;
            !ej.isNullOrUndefined(this.model.elementHeight) && typeof this.model.elementHeight === "string" && this.model.elementHeight.indexOf("%") != -1 ? check = true : check = false;
            if (d.handle < 20 && !check) d.handle = 20;
            d.onePx = d.scrollable / (d.handleSpace - d.handle);
            d.fromScroller = false;
            d.up = true;
            d.vInterval = undefined;
        },
        _updateLayout: function (d) {
            this.element.height(this.model.height);
            this.element.width(this.model.width);
            var handle = this.element.find("." + d.css + "handle");
            var handleSpace = this.element.find("." + d.css + "handlespace");
            var size = d.dimension == "width" ? handle.css('left') : handle.css('top');
            var dimension = d.dimension == "width" ? handleSpace.outerWidth() : handleSpace.outerHeight();
            if (size !== undefined && size !== "auto") {
                if (!(dimension >= d.handle + parseFloat(size)))
                    if (this.model.enableRTL) handle.css(d.dimension === "width" ? 'left' : 'top', (parseFloat(dimension) - d.handle));
                    else handle.css(d.dimension === "width" ? 'left' : 'top', (parseFloat(dimension) - d.handle) > 0 ? (parseFloat(dimension) - d.handle) : 0);
            }
            this.element.find("." + d.css + "scroll").css(d.dimension, d.modelDim + "px")
                .find(".e-button").css(d.dimension, this.model.buttonSize).end()
                .find("." + d.css + "handlespace").css(d.dimension, d.handleSpace + "px")
                .find("." + d.css + "handle").css(d.dimension, d.handle + "px");
        },
        refresh: function () {
            this._ensureScrollers();
            if (this.value()) {
                this.scroll(this.value(), "none");
            }
            if (this._scrollData) {
                this._calculateLayout(this._scrollData);
                this._updateLayout(this._scrollData);
            }
        },

        scroll: function (pixel, source, triggerEvent, e) {
            var dS = this._scrollData;
            if (!triggerEvent) {
                if (this.model.orientation === ej.ScrollBar.Orientation.Horizontal) {
                    if (this._trigger("scroll", { source: source || "custom", scrollData: this._scrollData, scrollLeft: pixel, originalEvent: e }))
                        return;
                }
                else {
                    if (this._trigger("scroll", { source: source || "custom", scrollData: this._scrollData, scrollTop: pixel, originalEvent: e }))
                        return;
                }
            }
            if (this._scrollData) {
                if (this._scrollData.enableRTL && (e == "mousemove" || e == "touchmove") && ej.browserInfo().name != "msie")
                    this.value(-dS.scrollable + pixel);
                else {
                    if (this._scrollData.enableRTL && (e == "mousemove" || e == "touchmove") && ej.browserInfo().name == "msie") this.value(-1 * pixel);
                    else this.value(pixel);
                }
                if (this.content().length > 0) {
                    if (this.model.orientation === ej.ScrollBar.Orientation.Horizontal) {
                        var left = (this.element.find('.e-hhandlespace').width() - this.element.find('.e-hhandle').outerWidth());
                        pixel = left < ((pixel - this.model.minimum) / this._scrollData.onePx) ? left : ((pixel - this.model.minimum) / this._scrollData.onePx);
                        if (this._scrollData.enableRTL && (e == "mousemove" || e == "touchmove") && ej.browserInfo().name != "msie") {
                            pixel = left - pixel;
                            pixel > 0 ? pixel = pixel * -1 : pixel;
                        }
                        if (this._scrollData.enableRTL && (e == "mousemove" || e == "touchmove") && ej.browserInfo().name == "msie") pixel = -pixel;
                        this._scrollData.enableRTL && pixel > 0 && !this._scrollData._scrollleftflag ? pixel = 0 : pixel
                        if (this._scrollData._scrollleftflag) {

                            pixel > 0 ? pixel = pixel * -1 : pixel;
                            this.value(pixel);
                        }
                        this.content()[0].style.left = pixel + "px";
                        this._scrollData._scrollleftflag = false;
                    }
                    else {
                        var top = (this.element.find('.e-vhandlespace').height() - this.element.find('.e-vhandle').outerHeight());
                        pixel = top < ((pixel - this.model.minimum) / this._scrollData.onePx) ? top : ((pixel - this.model.minimum) / this._scrollData.onePx);
                        if (ej.browserInfo().name == "msie" && isNaN(pixel)) pixel = "";
                        this.content()[0].style.top = pixel + "px";
                    }
                }
            }
        },

        _changeTop: function (d, step, source) {
            var start, t;
            if (d.dimension === "height")
                start = this.value();
            else
                start = this.value();
            t = start + step;
            d.step = step;
            if ((d.enableRTL && step < 0) || (step > 0 && !d.enableRTL)) {
                if (d.enableRTL) {
                    if (t < this.model.maximum * -1)
                        t = this.model.maximum * -1;
                }
                else {
                    if (t > this.model.maximum)
                        t = this.model.maximum;
                }
            }
            else {
                if (d.enableRTL) {
                    if (t > this.model.minimum)
                        t = this.model.minimum;
                }
                else {
                    if (t < this.model.minimum)
                        t = this.model.minimum;
                }
            }
            if (t !== start || this.model.infiniteScrolling) {
                this["scroll"](t, source);
            }
            return t !== start;
        },

        _mouseUp: function (e) {
            if (!e.data) return;
            var d = e.data.d;
            clearInterval(d.vInterval);
            if (e.type == "touchend") $(e.target).removeClass("e-touch");
            if (e.type === "mouseup" || e.type === "touchend" || (!e.toElement && !e.relatedTarget && !e.target)) {
                this._prevY = this._d = this._data = null;
                this._off($(document), "mousemove touchmove", this._mouseMove);
                $(document).off("mouseup touchend", ej.proxy(this._mouseUp, this));
                d.fromScroller = false;
                this[d.scroll].off("mousemove");
                this[d.handler].off("mousemove").css("transition", "");
                if (e.data.source === "thumb" && !ej.isNullOrUndefined(this.model)) {
                    $.when(this.content()).done(ej.proxy(function () {
                        this._trigger("thumbEnd", { originalEvent: e, scrollData: d });
                    }, this));
                }
            }
            d.up = true;
        },


        _mouseDown: function (down) {
            if (!this._enabled) return;
            this._d = down;
            this._data = this._d.data.d,
            this._data.target = this._d.target;
            this._data.fromScroller = true;
            this[this._data.handler].css("transition", "none");
            this._on($(document), "mousemove touchmove", { d: this._data, source: "thumb" }, this._mouseMove);
            this._trigger("thumbStart", { originalEvent: this._d, scrollData: this._data });
            $(document).one("mouseup touchend", { d: this._data, source: "thumb" }, ej.proxy(this._mouseUp, this));
            if (down.type == "touchstart") $(down.target).addClass("e-touch");
        },
        _mouseCall: function (move) {
            move.type = "mouseup";
            this._mouseUp(move);
        },
        _mouseMove: function (move) {
            var value, step = 0, top = parseInt(this[this._data.handler].css(this._data.lPosition)) || 0;
            move.preventDefault();
            var skip = 1;
            if (ej.isNullOrUndefined(move.target.tagName)) {
                if ($(move.target).is(document)) {
                    this._mouseCall(move);
                    return;
                }
            }
            else if (move.target.tagName.toLowerCase() === "iframe") { this._mouseCall(move); return; }
            var pageXY = move.type == "mousemove" ? move[this._data.clientXy] : move.originalEvent.changedTouches[0][this._data.clientXy];
            if (this._prevY && pageXY !== this._prevY) {
                step = (pageXY - this._prevY);
                if (this.model.infiniteScrolling) {
                    top = top + step;
                    this._data.step = step;
                    if (this._data.enableRTL ? top > 0 : top < 0) top = 0;
                    if ((top * (this._data.enableRTL ? -1 : 1)) + this._data.handle >= this._data.handleSpace)
                        top = (this._data.handleSpace - this._data.handle) * (this._data.enableRTL ? -1 : 1);
                    value = Math.ceil(top * this._data.onePx);
                    this["scroll"](value, "thumb");
                }
                else {
                    value = step * this._data.onePx;
                    this._changeTop(this._data, value, "thumb", this._d);
                }
                this._trigger("thumbMove", { originalEvent: move, scrollData: this._data });
            }
            if (skip === 1)
                this._prevY = pageXY;
        },

        _spaceMouseDown: function (e) {
            if (!e.data || !this._enabled) return;
            var d = e.data.d;
            if (e.which !== 1 || e.target === this[d.handler][0]) return;
            var step = e.data.step ? this.model.smallChange : this.model.largeChange, hTop = e.data.top || this[d.handler].offset()[d.lPosition];
            e[d.clientXy] = e[d.clientXy] || 0;
            if (e[d.clientXy] < hTop) step *= -1;
            d.target = e.target;
            this._changeTop(d, step, step === 3 ? "track" : "button", e);
            if (e.data.step !== 1) {
                this[d.scroll].mousemove(function () {
                    d.up = true;
                });
            }
            d.up = false;
            d.vInterval = setInterval(ej.proxy(function () {
                if (step < 0 ? hTop + (step / d.onePx) < e[d.clientXy] : hTop + d.handle + (step / d.onePx) > e[d.clientXy])
                    d.up = true;
                if (d.up) {
                    clearInterval(d.vInterval);
                    return;
                }
                this._changeTop(d, step, step === 3 ? "track" : "button", e);
                e.data ? hTop = e.data.top || this[d.handler].offset()[d.lPosition] : hTop = this[d.handler].offset()[d.lPosition];
            }, this), 150);

            $(document).one("mouseup", { d: d }, ej.proxy(this._mouseUp, this));
            $(document).mouseout({ d: d }, ej.proxy(this._mouseUp, this));
        },

        _remove: function () {
            if (this.model.orientation === ej.ScrollBar.Orientation.Horizontal)
                this.element.find(".e-hscroll").remove();
            if (this.model.orientation === ej.ScrollBar.Orientation.Vertical)
                this.element.find(".e-vscroll").remove();
            this._scrollData = null;
            this._content = null;
        },

        _destroy: function () {
            this.element.remove();
        },
    });

    ej.ScrollBar.Orientation = {
        Horizontal: "horizontal",
        Vertical: "vertical"
    };
})(jQuery, Syncfusion, window);;

/**
* @fileOverview Plugin to style the Html Scroller elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/


(function ($, ej, window, undefined) {
    'use strict';

    ej.widget("ejScroller", "ej.Scroller", {
        _addToPersist: ["scrollLeft", "scrollTop"],
        defaults: {

            height: 250,

            autoHide: false,

            animationSpeed: 600,

            width: 0,

            scrollOneStepBy: 57,

            buttonSize: 18,

            scrollLeft: 0,

            scrollTop: 0,

            targetPane: null,

            scrollerSize: 18,

            enablePersistence: false,

            enableRTL: undefined,

            enableTouchScroll: true,

            enabled: true,

            create: null,

            destroy: null,

            wheelStart: null,

            wheelMove: null,

            wheelStop: null
        },
        validTags: ["div"],
        type: "transclude",

        dataTypes: {
            buttonSize: "number",
            scrollOneStepBy: "number"
        },
        observables: ["scrollTop", "scrollLeft"],
        scrollTop: ej.util.valueFunction("scrollTop"),
        scrollLeft: ej.util.valueFunction("scrollLeft"),

        keyConfigs: {
            up: "38",
            down: "40",
            left: "37",
            right: "39",
            pageUp: "33",
            pageDown: "34",
            pageLeft: "ctrl+37",
            pageRight: "ctrl+39"
        },

        content: function () {
            if (!this._content || !this._content.length || !this._content[0].offsetParent)
                this._content = this.element.children().first().addClass("e-content");

            return this._content;
        },
        _setFirst: true,
        _updateScroll: false,

        _init: function () {
            if (!ej.isNullOrUndefined(this.content()[0])) {
                this._prevScrollWidth = this.content()[0].scrollWidth, this._prevScrollHeight = this.content()[0].scrollHeight;
                this.element.addClass("e-widget");
                this.content();
                this._browser = ej.browserInfo().name;
                this._wheelStart = true;
                this._eleHeight = this.model.height;
                this._eleWidth = this.model.width;
                if (this.model.enableRTL === undefined) {
                    this.model.enableRTL = this.element.css("direction") === "rtl";
                }
                this._ensureScrollers();
                if (this.model.enableRTL) {
                    this.element.addClass("e-rtl");
                    this._rtlScrollLeftValue = this.content().scrollLeft();
                }
                this._on(this.content(), "scroll", this._scroll);
                this.model.targetPane != null && this._on(this.content().find(this.model.targetPane), "scroll", this._scroll);
                if (this.scrollLeft())
                    this._setScrollLeftValue(this.scrollLeft());
                if (this.scrollTop())
                    this.content().scrollTop(this.scrollTop());

                if (this.model.autoHide) {
                    this._autohide();
                }
                if (this.model.enabled) {
                    this.enable();
                }
                else {
                    this.disable();
                }
                this._setDimension();
                if (this._prevScrollWidth !== this.content()[0].scrollWidth || this._prevScrollHeight !== this.content()[0].scrollHeight) this.refresh();
            }
            this._addActionClass();
        },
        _addActionClass: function () {
            //e-pinch class enables the touch mode operations in IE browsers
            if (this._browser == "msie") {
                this.content().removeClass('e-pinch e-pan-x e-pan-y');
                if (this._vScrollbar && this._hScrollbar) this.content().addClass('e-pinch');
                else if (this._vScrollbar && !this._hScrollbar) this.content().addClass('e-pan-x');
                else if (this._hScrollbar && !this._vScrollbar) this.content().addClass('e-pan-y');
            }
        },
        _setDimension: function () {
            if (!ej.isNullOrUndefined(this.model.height) && typeof this.model.height === "string" && this.model.height.indexOf("%") != -1) {
                if (!this._vScroll) $(this.content()[0]).height("");
                else this.model.height = this._convertPercentageToPixel(parseInt(this._eleHeight), this.element.parent().height());
            }
            if (!ej.isNullOrUndefined(this.model.width) && typeof this.model.width === "string" && this.model.width.indexOf("%") != -1) {
                if (!this._hScroll) $(this.content()[0]).width("");
                else this.model.width = this._convertPercentageToPixel(parseInt(this._eleWidth), this.element.parent().width());
            }
        },
        _setScrollLeftValue: function (leftValue) {
            if (this.model.enableRTL) {
                if (ej.browserInfo().name == "mozilla")
                    leftValue = leftValue < 0 ? leftValue : (leftValue * -1);
                else if (!ej.isNullOrUndefined(this._rtlScrollLeftValue) && (ej.browserInfo().name == "chrome" || this._rtlScrollLeftValue > 0))
                    leftValue = leftValue < 0 ? (this._rtlScrollLeftValue + leftValue) : (this._rtlScrollLeftValue - leftValue);
                else
                    leftValue = Math.abs(leftValue);
            }
            this.content().scrollLeft(leftValue);
        },


        _ensureScrollers: function () {
            var jqVersion = $.fn.jquery, height, width;
            this.model.height = typeof this.model.height == "string" && this.model.height.indexOf("px") != -1 ? parseInt(this.model.height) : this.model.height;
            this.model.width = typeof this.model.width == "string" && this.model.width.indexOf("px") != -1 ? parseInt(this.model.width) : this.model.width;
            if (this.model.height) {
                this.element.height(this.model.height);
            }
            if (this.model.width) {
                this.element.width(this.model.width);
            }

            this._off(this.content(), "mousedown touchstart");
            if (this.content().length > 0) {
                if (this.isVScroll()) {
                    if (!this._vScrollbar) {
                        this._vScrollbar = this._createScrollbar(ej.ScrollBar.Orientation.Vertical, this.isHScroll());
                    }
                    if (this.model.enableTouchScroll)
                        this._on(this.content(), "mousedown touchstart", { d: this._vScrollbar._scrollData }, this._mouseDownOnContent);
                } else {
                    this._vScrollbar = null;
                    this.element.children(".e-vscrollbar").remove();
                }
                if (this.isHScroll()) {
                    if (!this._hScrollbar) {
                        this._hScrollbar = this._createScrollbar(ej.ScrollBar.Orientation.Horizontal, this.isVScroll());
                    }
                    if (this.model.enableTouchScroll)
                        this._on(this.content(), "mousedown touchstart", { d: this._hScrollbar._scrollData }, this._mouseDownOnContent);
                } else {
                    this._hScrollbar = null;
                    this.element.children(".e-hscrollbar").remove();
                }

                if (!this._vScrollbar && !this._hScrollbar)
                    this.content().css({ width: "auto", height: "auto" });

                if (!(this.element.find(".e-hscroll").length > 0)) {
                    if (this._vScrollbar) {
                        this.content().outerHeight(this.content().outerHeight() - 1);
                    }
                }
                jqVersion === "1.7.1" || jqVersion === "1.7.2" ? (this._contentHeight = "height", this._contentWidth = "width") : (this._contentHeight = "outerHeight", this._contentWidth = "outerWidth");
                this._hScroll = this.isHScroll(), this._vScroll = this.isVScroll();
                if (this._hScroll || this._vScroll) {
                    this.content().addClass("e-content");
                    var rect = this._exactElementDimension(this.element);
                    this._elementDimension(rect);
                    if(this.model.targetPane !== null && this.content().find(this.model.targetPane)[0] !== undefined) this.content().find(this.model.targetPane)[0].scrollLeft = this.scrollLeft();
                    if ((isNaN(this._eleWidth) && (this._eleWidth.indexOf("%") > 0)) && (isNaN(this._eleHeight) && (this._eleHeight.indexOf("%") > 0))) $(window).on('resize', $.proxy(this._resetScroller, this));
                } else
                    this.content().removeClass("e-content");
                this._setDimension();
                this._parentHeight = $(this.element).parent().height(); this._parentWidth = $(this.element).parent().width();
            }
        },
        _elementDimension:function(rect){
            this._ElementHeight = rect.height - (this["border_bottom"] + this["border_top"] + this["padding_bottom"] + this["padding_top"]);
            this.content()[this._contentHeight](this._ElementHeight - ((this._hScroll && !this.model.autoHide) ? this.model.scrollerSize :
             this.element.find(".e-hscrollbar").is(':visible') ? this.model.scrollerSize : 0));
            this._ElementWidth = rect.width - (this["border_left"] + this["border_right"] + this["padding_left"] + this["padding_right"]);
            this.content()[this._contentWidth](this._ElementWidth - ((this._vScroll && !this.model.autoHide) ? this.model.scrollerSize :
            this.element.find(".e-vscrollbar").is(':visible') ? this.model.scrollerSize : 0));
        },        
        _convertPercentageToPixel: function (ele, outer) {
            return Math.floor((ele * outer) / 100);
        },

        isHScroll: function () {
            if (!ej.isNullOrUndefined(this.model.width) && typeof this.model.width === "string" && this.model.width.indexOf("%") != -1)
                return this.content()[0].scrollWidth > this.element.width();
            else {
                if (this.model.width > 0) {
                    var $paneObject = this.content().find(this.model.targetPane);
                    if (this.model.targetPane != null && $paneObject.length)
                        return ($paneObject[0].scrollWidth + $paneObject.siblings().width()) > this.model.width;
                    else {
                        if (this.content()[0].scrollWidth > this.model.width) return true;
                        else if (this.content()[0].scrollWidth == this.model.width)
                            if (this.model.autoHide && $(this.content()[0]).find('> *').length > 0) return $(this.content()[0]).find('> *')[0].scrollWidth > $(this.content()[0]).width();
                            else if ($(this.content()[0]).find('> *').length > 0) return $(this.content()[0]).find('> *')[0].scrollWidth > this.model.width;
                        return false;
                    }
                    return false;
                }
                return false;
            }
        },

        isVScroll: function () {
            //To avoid unnecessarilly render the vertical scrollbar for 1 or 2 px difference range.
            var border = 2;
            if (!ej.isNullOrUndefined(this.model.height) && typeof this.model.height === "string" && this.model.height.indexOf("%") != -1)
                return this.content()[0].scrollHeight > this.element.outerHeight(); //this._convertPercentageToPixel(parseInt(this._eleHeight), this.element.parent().height());        
            else if (this.model.height > 0) {
                if ((this.content()[0].scrollHeight > this.model.height)) return true;
                else if (this.isHScroll()) if ((this.content()[0].scrollHeight == this.model.height || (this.content()[0].scrollHeight > this.model.height - (this.model.scrollerSize - border)))) return true;
            }
            return false;
        },
        _setModel: function (option) {
            for (var prop in option) {
                switch (prop) {
                    case "enableRTL":
                        if (option[prop]) {
                            this.element.addClass("e-rtl");
                            this._rtlScrollLeftValue = this.content().scrollLeft();
                            if (!ej.isNullOrUndefined(this._hScrollbar)) this._hScrollbar._scrollData.enableRTL = true;

                        } else {
                            this.element.removeClass("e-rtl");
                            if (!ej.isNullOrUndefined(this._hScrollbar)) this._hScrollbar._scrollData.enableRTL = false;
                        }
                        if (this._hScrollbar) {
                            this.element.find(".e-hhandle").css("left", 0);
                            this._hScrollbar.value(0);
                        }
                        break;
                    case "scrollLeft":
                        if (parseFloat(ej.util.getVal(option[prop])) < 0 || !this._hScroll) option[prop] = 0;
                        this._externalCall = true;
                        if (this._hScrollbar) option[prop] = parseFloat(ej.util.getVal(option[prop])) > this._hScrollbar._scrollData.scrollable ? this._hScrollbar._scrollData.scrollable : parseFloat(ej.util.getVal(option[prop]));
                        this._setScrollLeftValue(parseFloat(option[prop]));
                        this["scrollLeft"](option[prop]);
                        if (this._hScrollbar && !(this._hScrollbar._scrollData._scrollleftflag && this.model.enableRTL))
                            this.scrollX(option[prop], true);
                        break;
                    case "scrollTop":
                        if (this._vScrollbar) option[prop] = parseFloat(ej.util.getVal(option[prop])) > this._vScrollbar._scrollData.scrollable ? this._vScrollbar._scrollData.scrollable : parseFloat(ej.util.getVal(option[prop]));
                        if (parseFloat(option[prop]) < 0 || !this._vScroll) option[prop] = 0;
                        this._externalCall = true;
                        this.content().scrollTop(parseFloat(option[prop]));
                        this["scrollTop"](option[prop]);
                        this.scrollY(option[prop], true);
                        break;
                    case "touchScroll":
                        if (!this.model.enableTouchScroll)
                            this._off(this.content(), "mousedown touchstart");
                        else {
                            if (this._vScrollbar)
                                this._on(this.content(), "mousedown touchstart", { d: this._vScrollbar._scrollData }, this._mouseDownOnContent);
                            if (this._hScrollbar)
                                this._on(this.content(), "mousedown touchstart", { d: this._hScrollbar._scrollData }, this._mouseDownOnContent);
                        }
                        break;
                    case "scrollOneStepBy":
                        if (this._vScrollbar) {
                            this._vScrollbar._scrollData.scrollOneStepBy = option[prop];
                            this._vScrollbar.model.smallChange = option[prop];
                        }
                        if (this._hScrollbar) {
                            this._hScrollbar._scrollData.scrollOneStepBy = option[prop];
                            this._hScrollbar.model.smallChange = option[prop];
                        }
                        break;
                    case "buttonSize":
                        if (this._vScrollbar) this._vScrollbar.model.buttonSize = this.model.buttonSize;
                        if (this._hScrollbar) this._hScrollbar.model.buttonSize = this.model.buttonSize;
                        this.refresh();
                        break;
                    case "height": this._eleHeight = option[prop];
                        this.refresh();
                        break;
                    case "width": this._eleWidth = option[prop];
                        this.refresh();
                        break;
                    case "enabled":
                        if (!option[prop]) this.disable();
                        else this.enable();
                        break;
                    default:
                        this.refresh();
                }
            }
        },

        _createScrollbar: function (orientation, isOtherScroll) {
            var proxy = this;
            var id, viewportSize, width, height, maximum, value;
            var div = document.createElement("div");
            if (orientation === ej.ScrollBar.Orientation.Vertical) {
                width = this.model.scrollerSize;
                if (!ej.isNullOrUndefined(this.model.height) && typeof this.model.height === "string" && this.model.height.indexOf("%") != -1)
                    height = viewportSize = this.element.height() - (isOtherScroll ? this.model.scrollerSize : 0);
                else
                    height = viewportSize = this.model.height - (isOtherScroll ? this.model.scrollerSize : 0);
                maximum = this.content()[0]["scrollHeight"];
                value = this.scrollTop();
            }
            else {
                width = viewportSize = this.model.width - (isOtherScroll ? this.model.scrollerSize : 0);
                height = this.model.scrollerSize;
                if (!ej.isNullOrUndefined(this.model.width) && typeof this.model.width === "string" && this.model.width.indexOf("%") != -1) {
                    width = viewportSize = this.element.width() - (isOtherScroll ? this.model.scrollerSize : 0);
                    maximum = this.content()[0]["scrollWidth"];
                }
                else {
                    var $pane = this.content().find(this.model.targetPane);
                    if (this.model.targetPane != null && $pane.length)
                        maximum = $pane[0]["scrollWidth"] + $pane.parent().width() - $pane.width();
                    else
                        maximum = this.content()[0]["scrollWidth"];
                }
                value = this.scrollLeft();
            }
            if (this.element.children(".e-hscrollbar").length > 0)
                $(this.element.children(".e-hscrollbar")).before(div);
            else
                this.element.append(div);
            $(div).ejScrollBar({
                elementHeight: proxy._eleHeight,
                elementWidth: proxy._eleWidth,
                buttonSize: proxy.model.buttonSize,
                orientation: orientation,
                viewportSize: viewportSize,
                height: height,
                width: width,
                maximum: maximum - viewportSize,
                value: value,
                smallChange: this.model.scrollOneStepBy,
                largeChange: 3 * this.model.scrollOneStepBy,
                scroll: ej.proxy(this._scrollChanged, this),
                thumbEnd: ej.proxy(this._thumbEnd, this),
                thumbStart: ej.proxy(this._thumbStart, this),
                thumbMove: ej.proxy(this._thumbMove, this),
            });
            var scrollbar = $(div).ejScrollBar("instance");
            (orientation === ej.ScrollBar.Orientation.Vertical || !isOtherScroll) && this._off(this.element, this._browser == "msie" ? "wheel mousewheel" : "mousewheel DOMMouseScroll", this._mouseWheel)
                ._on(this.element, this._browser == "msie" ? "wheel mousewheel" : "mousewheel DOMMouseScroll", { d: scrollbar._scrollData }, this._mouseWheel);
            if (orientation === ej.ScrollBar.Orientation.Horizontal) {
                this._scrollXdata = scrollbar._scrollData;
            }
            else
                this._scrollYdata = scrollbar._scrollData;
            if (orientation === ej.ScrollBar.Orientation.Horizontal && this.model.enableRTL) {
                scrollbar._scrollData.enableRTL = true;
            }
            scrollbar._enabled = this.model.enabled;
            return scrollbar;
        },

        _updateScrollbar: function (orientation, isOtherScroll) {
            var scrollbar = orientation === ej.ScrollBar.Orientation.Vertical ? this._vScrollbar : this._hScrollbar;
            if (scrollbar) {
                if (orientation === ej.ScrollBar.Orientation.Vertical) {
                    scrollbar.model.width = this.model.scrollerSize;
                    scrollbar.model.height = scrollbar.model.viewportSize = this.model.height - (isOtherScroll ? this.model.scrollerSize : 0);
                    scrollbar.model.maximum = this.content()[0]["scrollHeight"] - scrollbar.model.viewportSize;
                    scrollbar.model.value = this.scrollTop();
                }
                else {
                    scrollbar.model.width = scrollbar.model.viewportSize = this.model.width - (isOtherScroll ? this.model.scrollerSize : 0);
                    scrollbar.model.height = this.model.scrollerSize;
                    scrollbar.model.maximum = ((this.model.targetPane != null && this.content().find(this.model.targetPane).length > 0) ? this.content().find(this.model.targetPane)[0]["scrollWidth"] + (this.content().width() - $(this.model.targetPane).outerWidth()) : this.content()[0]["scrollWidth"]) - scrollbar.model.viewportSize;
                    if (!this.model.enableRTL)
                        scrollbar.model.value = this.scrollLeft();
                }
            }
        },

        _autohide: function () {
            if (this.model.autoHide) {
                this.element.addClass("e-autohide");
                this._on(this.element, "mouseenter mouseleave touchstart touchend", this._scrollerHover);
                this.content().siblings(".e-scrollbar.e-js").hide();
				this._elementDimension(this._exactElementDimension(this.element));
            }
            else {
                this.element.removeClass("e-autohide");
                this._off(this.element, "mouseenter mouseleave touchstart touchend", this._scrollerHover);
                this.content().siblings(".e-scrollbar.e-js").show();
            }
        },

        _scrollChanged: function (e) {
            this._updateScroll = true;
            if (e.scrollTop !== undefined)
                this.scrollY(e.scrollTop, true, "", e.source);
            else if (e.scrollLeft !== undefined)
                this.scrollX(e.scrollLeft, true, "", e.source);
            this._updateScroll = false;
            var proxy = this;
            $.when(this.content()).done(ej.proxy(function () {
                proxy._trigger("scrollEnd", { scrollData: e });
            }));
        },
        _bindBlurEvent: function (scrollObj, e) {
            this._scrollEle = $(scrollObj).data('ejScrollBar');
            this._event = e; var proxy = this;
            this._listener = function (e) {
                this._scrollEle._off($(document), "mousemove touchmove", this._scrollEle._mouseMove);
                $(document).off("mouseup touchend", ej.proxy(this._scrollEle._mouseUp, this._scrollEle));
                this._scrollEle._prevY = null;
                this._off($(document), "mousemove touchmove", this._mouseMove);
                this._off($(document), "mouseup touchend", this._mouseUp);
                this._off($(window), "blur");
                if (this._evtData.handler === "e-vhandle") this._scrollEle._trigger("thumbEnd", { originalEvent: this._event, scrollData: this._evtData });
                else this._scrollEle._trigger("thumbEnd", { originalEvent: this._event, scrollData: this._evtData });
            };
            this._on($(window), "blur", this._listener);
        },
        _thumbStart: function (e) {
            this._evtData = e.scrollData;
            var scrollObj = e.scrollData.handler === "e-vhandle" ? this.element.find('.' + e.scrollData.handler).closest('.e-scrollbar') : this.element.find('.' + e.scrollData.handler).closest('.e-scrollbar'); var scrollObj = e.scrollData.handler === "e-vhandle" ? this.element.find('.' + e.scrollData.handler).closest('.e-scrollbar') : this.element.find('.' + e.scrollData.handler).closest('.e-scrollbar');
            this._bindBlurEvent(scrollObj, e);
            this._trigger("thumbStart", e);
        },
        _thumbMove: function (e) {
            this._trigger("thumbMove", e);
        },
        _thumbEnd: function (e) {
            this._trigger("thumbEnd", e);
            this._off($(window), "blur");
        },

        refresh: function (needRefresh) {
            if (!needRefresh)
                this.element.find(">.e-content").removeAttr("style");

            if (!ej.isNullOrUndefined(this._eleHeight) && typeof this._eleHeight === "string" && this._eleHeight.indexOf("%") != -1 && this._parentHeight != $(this.element).parent().height()) {
                var element = this._exactElementDimension(this.element.parent());
                element = element.height - (this["border_bottom"] + this["border_top"] + this["padding_bottom"] + this["padding_top"]);
                this.model.height = this._convertPercentageToPixel(parseInt(this._eleHeight), element);
            }
            if (!ej.isNullOrUndefined(this._eleWidth) && typeof this._eleWidth === "string" && this._eleWidth.indexOf("%") != -1 && this._parentWidth != $(this.element).parent().width()) {
                var element = this._exactElementDimension(this.element.parent());
                element = element.width - (this["border_left"] + this["border_right"] + this["padding_left"] + this["padding_right"]);
                this.model.width = this._convertPercentageToPixel(parseInt(this._eleWidth), element);
            }

            this._ensureScrollers();
            var scrollLeftValue = this.scrollLeft();
            if (this.model.enableRTL) {
                !this.element.hasClass("e-rtl") && this.element.addClass("e-rtl");
                this._rtlScrollLeftValue = this.content().scrollLeft();
                scrollLeftValue > 0 ? this.content().scrollLeft(scrollLeftValue) : this._setScrollLeftValue(scrollLeftValue);
            }
            else
                this.content().scrollLeft(scrollLeftValue);
            if ((this.scrollTop() && this._vScrollbar == null) || (this._vScrollbar !== null && (this._vScrollbar && this._vScrollbar._scrollData != null) && !this._vScrollbar._scrollData.skipChange))
                this.content().scrollTop(this.scrollTop());

            if (this._vScrollbar) {
                this._vScrollbar._scrollData.dimension = "Height";
                this._updateScrollbar(ej.ScrollBar.Orientation.Vertical, this._hScroll);
                this._vScroll && !this._vScrollbar._calculateLayout(this._vScrollbar._scrollData) && this._vScrollbar._updateLayout(this._vScrollbar._scrollData);
            }
            if (this._hScrollbar) {
                this._hScrollbar._scrollData.dimension = "Width";
                this._updateScrollbar(ej.ScrollBar.Orientation.Horizontal, this._vScroll);
                this._hScroll && !this._hScrollbar._calculateLayout(this._hScrollbar._scrollData) && this._hScrollbar._updateLayout(this._hScrollbar._scrollData);
            }
            if (ej.browserInfo().name == "msie" && ej.browserInfo().version == "8.0")
                this.element.find(".e-hhandle").css("left", "0px");
            else
                this.model.targetPane != null && this._on(this.content().find(this.model.targetPane), "scroll", this._scroll);
            this._addActionClass();
            this._autohide();
        },
        _exactElementDimension: function (element) {
            var rect = element.get(0).getBoundingClientRect(), direction = ["left", "right", "top", "bottom"], width, height;
            rect.width ? width = rect.width : width = rect.right - rect.left;
            rect.height ? height = rect.height : height = rect.bottom - rect.top;
            for (var i = 0; i < direction.length; i++) {
                this["border_" + direction[i]] = isNaN(parseFloat(element.css("border-" + direction[i] + "-width"))) ? 0 : parseFloat(element.css("border-" + direction[i] + "-width"));
                this["padding_" + direction[i]] = isNaN(parseFloat(element.css("padding-" + direction[i]))) ? 0 : parseFloat(element.css("padding-" + direction[i]));
            }
            return rect = { width: width, height: height };
        },
        _keyPressed: function (action, target) {
            if (!this.model.enabled) return;
            if (["input", "select", "textarea"].indexOf(target.tagName.toLowerCase()) !== -1)
                return true;

            var d, iChar;

            if (["up", "down", "pageUp", "pageDown"].indexOf(action) !== -1) {
                if (this._vScrollbar) {
                    if (ej.browserInfo().name == "msie" && this.model.allowVirtualScrolling)
                        this._content.focus();
                    d = this._vScrollbar._scrollData;
                }
                iChar = "o";
            } else if (["left", "right", "pageLeft", "pageRight"].indexOf(action) !== -1) {
                if (this._hScrollbar)
                    d = this._hScrollbar._scrollData;
                iChar = "i";
            } else return true;
            if (!d) return true;

            return !this._changeTop(d, (action.indexOf(iChar) < 0 ? -1 : 1) * (action[0] !== "p" ? 1 : 3) * d.scrollOneStepBy, "key");
        },

        scrollY: function (pixel, disableAnimation, animationSpeed, source, e) {
            var proxy = this;
            if (pixel === "") return;
            if (disableAnimation) {
                var e = { source: source || "custom", scrollData: this._vScrollbar ? this._vScrollbar._scrollData : null, scrollTop: pixel, originalEvent: e };
                pixel = e.scrollTop;
                this.scrollTop(pixel);
                if (this._trigger("scroll", e)) return;
                this.content().scrollTop(pixel);
                return;
            }
            if (ej.isNullOrUndefined(animationSpeed) || animationSpeed === "") animationSpeed = 100;
            if (this._vScrollbar) pixel = parseFloat(pixel) > this._vScrollbar._scrollData.scrollable ? this._vScrollbar._scrollData.scrollable : parseFloat(pixel)
            this.scrollTop(pixel);
            this.content().stop().animate({
                scrollTop: pixel
            }, animationSpeed, 'linear', function () {
                if (proxy._trigger("scroll", { source: source || "custom", scrollData: proxy._vScrollbar ? proxy._vScrollbar._scrollData : null, scrollTop: pixel, originalEvent: e })) return;
            })
        },

        scrollX: function (pixel, disableAnimation, animationSpeed, source, e) {
            var proxy = this;
            if (pixel === "") return;
            if (this._hScrollbar) pixel = parseFloat(pixel) > this._hScrollbar._scrollData.scrollable ? this._hScrollbar._scrollData.scrollable : parseFloat(pixel)
            this._externalCall = true;
            var browserName = ej.browserInfo().name;
            if (this.model.enableRTL && browserName != "mozilla") {
                if (pixel < 0) pixel = Math.abs(pixel);
                var content = this.model.targetPane != null ? this.content().find(this.model.targetPane)[0] : this.content()[0];
                if (e != "mousemove" && e != "touchmove" && (browserName != "msie")) if (browserName != "msie") pixel = this._hScrollbar._scrollData.scrollable - pixel;
            }
            this.scrollLeft(pixel);
            if (disableAnimation) {
                if (this._trigger("scroll", { source: source || "custom", scrollData: this._hScrollbar ? this._hScrollbar._scrollData : null, scrollLeft: pixel, originalEvent: e }))
                    return;
                if (this.model.targetPane != null && this.content().find(this.model.targetPane).length)
                    this.content().find(this.model.targetPane).scrollLeft(pixel);
                else
                    this.content().scrollLeft(pixel);
                return;
            }
            if (ej.isNullOrUndefined(animationSpeed) || animationSpeed === "") animationSpeed = 100;
            if (this.model.targetPane != null && this.content().find(this.model.targetPane).length)
                this.content().find(this.model.targetPane).stop().animate({
                    scrollLeft: pixel
                }, animationSpeed, 'linear');
            else this.content().stop().animate({
                scrollLeft: pixel
            }, animationSpeed, 'linear', function () {
                if (proxy._trigger("scroll", { source: source || "custom", scrollData: proxy._hScrollbar ? proxy._hScrollbar._scrollData : null, scrollLeft: pixel, originalEvent: e })) return;
            });
        },

        enable: function () {
            var scroller = this.element.find(".e-vscrollbar,.e-hscrollbar,.e-vscroll,.e-hscroll,.e-vhandle,.e-hhandle,.e-vscroll .e-icon,.e-hscroll .e-icon");
            if (scroller.hasClass("e-disable")) {
                scroller.removeClass("e-disable").attr({ "aria-disabled": false });
                this.model.enabled = true;
            }
            if (this._vScrollbar)
                this._vScrollbar._enabled = this.model.enabled;
            if (this._hScrollbar)
                this._hScrollbar._enabled = this.model.enabled;
        },

        disable: function () {
            var scroller = this.element.find(".e-vscrollbar,.e-hscrollbar,.e-vscroll,.e-hscroll,.e-vhandle,.e-hhandle,.e-vscroll .e-icon,.e-hscroll .e-icon");
            scroller.addClass("e-disable").attr({ "aria-disabled": true });
            this.model.enabled = false;
            if (this._vScrollbar)
                this._vScrollbar._enabled = this.model.enabled;
            if (this._hScrollbar)
                this._hScrollbar._enabled = this.model.enabled;
        },

        _changeTop: function (d, step, source, e) {
            var start = Math.ceil(this.model.targetPane != null && d.dimension != "height" ? this.content().find(this.model.targetPane)[d.scrollVal]() : this.content()[d.scrollVal]()), t;

            if (d.dimension == "height" && start == 0)
                start = this.scrollTop() != 0 ? this.scrollTop() : 0;
            t = start + step;
            if (!d.enableRTL ? t > d.scrollable : t < d.scrollable) t = Math.round(d.scrollable);
            if (!d.enableRTL ? t < 0 : t > 0) t = 0;

            if (t !== start) {
                this["scroll" + d.xy](t, true, "", source, e);
                if (d.xy === "X" && !ej.isNullOrUndefined(this._hScrollbar))
                    this._hScrollbar["scroll"](t, source, true, e);
                else if (!ej.isNullOrUndefined(this._vScrollbar))
                    this._vScrollbar["scroll"](t, source, true, e);
            }

            return t !== start;
        },

        _mouseWheel: function (e) {
            if (this._vScrollbar && e.ctrlKey)
                return;
            if (!this._vScrollbar && !e.shiftKey)
                return;
            if (!e.data || !this.model.enabled) return;
            var delta = 0, data = e.data.d, ori = e, direction;
            e = e.originalEvent;
            this._wheelStart && this._trigger("wheelStart", { originalEvent: e, scrollData: ori.data.d });
            this._wheelStart = false;
            clearTimeout($.data(this, 'timer'));
            if (this._wheelx != 1 && (e.wheelDeltaX == 0 || e.wheelDeltaY == 0))
                this._wheelx = 1;
            if (navigator.platform.indexOf("Mac") == 0 && (this._wheelx == 0)) {
                if (this._browser == "webkit" || this._browser == "chrome")
                    return true;
            }
            if (this._browser == "mozilla")
                e.axis == e.HORIZONTAL_AXIS ? data = this._scrollXdata : this._scrollYdata;
            else if (this._browser == "msie") {
                if ((e.type == "wheel")) delta = e.deltaX / 120;
                if ((e.type == "mousewheel" && e.shiftKey)) {
                    data = this._scrollXdata;
                    e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                }
            }
            else if (this._wheelx && e.wheelDeltaX != 0 && e.wheelDeltaY == 0 && this._scrollXdata)
                data = this._scrollXdata;
            if (e.wheelDeltaX == 0) this._wheelx = e.wheelDeltaX;
            if (e.wheelDelta) {
                delta = navigator.platform.indexOf("Mac") == 0 ? -e.wheelDelta / 3 : -e.wheelDelta / 120;
                if (window.opera) {
                    if (parseFloat(window.opera.version, 10) < 10)
                        delta = -delta;
                }
            } else if (e.detail) delta = e.detail / 3;
            if (!delta) return;
            if ((ori.originalEvent))
                if (ori.originalEvent.wheelDelta && ori.originalEvent.wheelDelta > 0 || ori.originalEvent.detail && ori.originalEvent.detail < 0) direction = -1;
                else direction = 1;
            if (this._changeTop(data, delta * data.scrollOneStepBy, "wheel", e)) {
                e.preventDefault ? e.preventDefault() : ori.preventDefault();
                ori.stopImmediatePropagation();
                ori.stopPropagation();
                this._trigger("wheelMove", { originalEvent: e, scrollData: ori.data.d, direction: direction });
            }
            else {
                this._trigger("scrollEnd", { originalEvent: e, scrollData: ori });
                this._wheelx = 0;
            }
            var proxy = this;
            $.data(this, 'timer', setTimeout(function () {
                proxy._wheelStart = true;
                proxy._trigger("wheelStop", { originalEvent: e, scrollData: ori.data.d, direction: direction });
            }, 250));
        },
        _contentHeightWidth: function () {
            if (this.content().siblings().css("display") == "block" && this.model.autoHide) {
                this._hScroll && this.content()[this._contentHeight](this._ElementHeight - (this.model.scrollerSize));
                this._vScroll && this.content()[this._contentWidth](this._ElementWidth - (this.model.scrollerSize));
            }
            else if (this.content().siblings().css("display") == "none" && this.model.autoHide && (this._vScroll || this._hScroll)) {
                this.content()[this._contentHeight](this._ElementHeight);
                this.content()[this._contentWidth](this._ElementWidth);
            }
        },
        _scrollerHover: function (e) {
            if (this.model.enabled) {
                if ((e.type == "mouseenter" || e.type == "touchstart") && !this.content().siblings().is(":visible")) {
                    this.content().siblings().css("display", "block");
                    this._contentHeightWidth();
                    this._ensureScrollers();
                    this._setScrollLeftValue(this.model.scrollLeft);
                    this._trigger("scrollVisible", { originalEvent: e });
                }
                else if (e.type == "mouseleave" || e.type == "touchend") {
                    this.content().siblings().hide();
                    this._contentHeightWidth();
                    this._trigger("scrollHide", { originalEvent: e });
                }
            }
        },

        _mouseUp: function (e) {
            if (!e.data) return;
            var d = e.data.d;
            if (e.type === "mouseup" || e.type === "touchend" || (!e.toElement && !e.relatedTarget)) {
                this.content().css("cursor", "default");
                this._off($(document), "mousemove touchmove");
                this._off($(document), "mouseup touchend", this._mouseUp);
                d.fromScroller = false;
                if (this._mouseMoved === true && e.data.source === "thumb" && !ej.isNullOrUndefined(this.model)) {
                    $.when(this.content()).done(ej.proxy(function () {
                        this._trigger("thumbEnd", { originalEvent: e, scrollData: d });
                    }, this));
                    this._off($(window), "blur");
                }
            }
            d.up = true;
            window.ontouchmove = null;
        },

        _mouseDownOnContent: function (down) {
            this._startX = (down.clientX != undefined) ? down.clientX : down.originalEvent.changedTouches[0].clientX;
            this._startY = (down.clientY != undefined) ? down.clientY : down.originalEvent.changedTouches[0].clientY;
            this._timeStart = down.timeStamp || Date.now();
            if (!this.model.enabled) return;
            var d = down.data.d;
            this._evtData = down.data;
            var scrollObj = d.handler === "e-vhandle" ? this.element.find('.' + d.handler).closest('.e-scrollbar') : this.element.find('.' + d.handler).closest('.e-scrollbar');
            this._bindBlurEvent(scrollObj, down);
            if (this._trigger("thumbStart", { originalEvent: down, scrollData: d }))
                return;
            if (down.which == 3 && down.button == 2) return;
            d.fromScroller = true;
            var prevY = null, skip = 1, min = 5, direction;
            this._document = $(document); this._window = $(window);
            this._mouseMove = function (move) {
                if (this._startX + this._startY != move.clientX + move.clientY) {
                    this._relDisX = ((move.clientX != undefined) ? this._startx = move.clientX : this._startx = move.originalEvent.changedTouches[0].clientX) - this._startX;
                    this._relDisY = ((move.clientY != undefined) ? this._starty = move.clientY : this._starty = move.originalEvent.changedTouches[0].clientY) - this._startY;
                    this._duration = (move.timeStamp || Date.now()) - this._timeStart;
                    this._velocityY = Math.abs(this._relDisY) / this._duration;
                    this._velocityX = Math.abs(this._relDisX) / this._duration;
                    if (!ej.isNullOrUndefined(move.target.tagName) && move.target.tagName.toLowerCase() === "iframe") {
                        move.type = "mouseup";
                        this._mouseUp(move);
                        return;
                    }
                    var pageXY = move.type == "mousemove" ? move[d.clientXy] : move.originalEvent.changedTouches[0][d.clientXy];
                    if (prevY && pageXY !== prevY) {
                        this._mouseMoved = true;
                        var diff = pageXY - prevY, sTop = this.model[d.scrollVal] - (diff);

                        if (skip == 1 && Math.abs(diff) > min) {
                            direction = d.position;
                            skip = 0;
                        }
                        if (skip == 0) prevY = pageXY;

                        if (sTop >= 0 && sTop <= d.scrollable && direction === d.position) {
                            var top = this._velocityY > 0.5 && this._duration < 50 && d.position == "Top";
                            var left = this._velocityX > 0.5 && this._duration < 50 && d.position == "Left";
                            var swipeXY = ((this._velocityY > 0.5) || (this._velocityX > 0.5)) && this._duration < 50;
                            if (swipeXY) {
                                if (top) {
                                    sTop = Math.abs(this._relDisY) + (this._duration * this._velocityY);
                                    if (this._startY > this._starty) {
                                        sTop += this.scrollTop();
                                        if (sTop > d.scrollable) sTop = d.scrollable;
                                    }
                                    else {
                                        if (sTop < this.scrollTop()) sTop = Math.abs(sTop - this.scrollTop());
                                        if (sTop > this.scrollTop())
                                            sTop = 0;
                                    }
                                    if (this.scrollTop() <= d.scrollable) this["scrollY"](sTop, false, this.model.animationSpeed, "thumb");
                                }
                                else if (left) {
                                    sTop = Math.abs(this._relDisX);
                                    if (this._startX > this._startx) {
                                        sTop += this.scrollLeft();
                                        if (sTop > d.scrollable) sTop = d.scrollable;
                                    }
                                    else {
                                        sTop -= this.scrollLeft();
                                        sTop = Math.abs(sTop);
                                        if (sTop > d.scrollable || sTop >= this.scrollLeft()) sTop = 0;
                                    }
                                    if (this.scrollLeft() <= d.scrollable) this["scrollX"](sTop, false, this.model.animationSpeed, "thumb");
                                }
                            }
                            else {
                                this["scroll" + d.xy](sTop, true, "", "thumb", move.type);
                                if (d.xy === "X")
                                    this._hScrollbar["scroll"](sTop, "thumb", true, move.type);
                                else if (!ej.isNullOrUndefined(this._vScrollbar))
                                    this._vScrollbar["scroll"](sTop, "thumb", true, move.type);
                                this.content().css("cursor", "pointer");
                                this._trigger("thumbMove", { originalEvent: move, scrollData: d });
                            }
                        }
                    }
                    window.ontouchmove = function (e) {
                        e = e || window.event;
                        if (e.preventDefault) e.preventDefault();

                        e.returnValue = false;
                    }
                    if (prevY == null) prevY = pageXY;
                    if (Math.abs(this._relDisX) > Math.abs(this._relDisY))
                        this._swipe = (this._relDisX < 0) ? "left" : "right";
                    else
                        this._swipe = (this._relDisY < 0) ? "up" : "down";
                    if (((Math.round(this._content["scrollTop"]()) == 0) && this._swipe == "down" || ((Math.ceil(this._content["scrollTop"]()) == d.scrollable || Math.ceil(this._content["scrollTop"]()) + 1 == d.scrollable) && this._swipe == "up"))) {
                        this._trigger("scrollEnd", { originalEvent: move.originalEvent, scrollData: move });
                        window.ontouchmove = null;
                    }
                }
            }
            this._on($(document), "mousemove touchmove", { d: d, source: "thumb" }, this._mouseMove);
            this._mouseMoved = false;
            this._on($(document), "mouseup touchend", { d: d, source: "thumb" }, this._mouseUp);
        },

        _scroll: function (e) {
            var dS = [this._vScrollbar ? this._vScrollbar._scrollData : null, this._hScrollbar ? this._hScrollbar._scrollData : null];

            for (var i = 0; i < 2; i++) {
                var d = dS[i];
                if (!d || d.skipChange) continue;
                if (!this._externalCall) d.dimension === "height" ? this.scrollTop(e.target[d.scrollVal]) : this.scrollLeft(e.target[d.scrollVal])
                if (this.model && this.model.targetPane != null && i == 1 && this.content().find(this.model.targetPane).length)
                    d.sTop = this.content().find(this.model.targetPane)[0][d.scrollVal];
                else d.scrollVal == "scrollTop" ? d.sTop = this.scrollTop() : d.sTop = this.scrollLeft();
                this[d.scrollVal](d.sTop);
                if (d.fromScroller) return;
                if (i === 1) {
                    var content = this.content()[0];
                    if (this._rtlScrollLeftValue && content.scrollWidth - content.clientWidth != this._rtlScrollLeftValue)
                        this._rtlScrollLeftValue = content.scrollWidth - content.clientWidth;
                    d.sTop = (this.model && ej.browserInfo().name != "mozilla" && this.model.enableRTL && !this._hScrollbar._scrollData._scrollleftflag) ? (this._rtlScrollLeftValue == 0 ? (d.sTop * -1) : (d.sTop - this._rtlScrollLeftValue)) : d.sTop;
                    this._hScrollbar["scroll"](d.sTop, "", true);
                } else
                    this._vScrollbar["scroll"](d.sTop, "", true);
                if (dS.length == 2 && i == 1 || dS.length == 1 && i == 0){
                    this._externalScroller = false;
                    this.model && this._trigger('scroll', { source: "custom", scrollData: this._hScrollbar ? this._hScrollbar._scrollData : null, scrollLeft: this.scrollLeft(), originalEvent: e });
                }
            }
        },

        _changevHandlerPosition: function (top) {
            var scrollbar = this._vScrollbar;
            if (scrollbar) {
                top = scrollbar._scrollData != null && top >= scrollbar._scrollData.scrollable ? scrollbar._scrollData.scrollable : top;
                if (scrollbar != null && top >= 0 && top <= scrollbar._scrollData.scrollable)
                    scrollbar[scrollbar._scrollData.handler].css(scrollbar._scrollData.lPosition, (top / scrollbar._scrollData.onePx) + "px");
            }
        },

        _changehHandlerPosition: function (left) {
            var scrollbar = this._hScrollbar;
            if (scrollbar) {
                left = scrollbar._scrollData != null && left >= scrollbar._scrollData.scrollable ? scrollbar._scrollData.scrollable : left;
                if (scrollbar != null && top >= 0 && left <= scrollbar._scrollData.scrollable)
                    scrollbar[scrollbar._scrollData.handler].css(scrollbar._scrollData.lPosition, (left / scrollbar._scrollData.onePx) + "px");
            }
        },

        _destroy: function () {
            this.element.css({ "width": "", "height": "" }).find(".e-vscrollbar,.e-hscrollbar").remove();
            this.content().removeClass("e-content").css({ "width": "", "height": "" });
            this.element.removeClass("e-widget");
        },
        _preventDefault: function (e) {
            e = e || window.event;
            if (e.preventDefault) e.preventDefault();

            e.returnValue = false;
        }
    });
})(jQuery, Syncfusion, window);;