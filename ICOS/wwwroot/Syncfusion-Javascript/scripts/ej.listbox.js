/*!
*  filename: ej.listbox.js
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
window.ej = window.Syncfusion = window.Syncfusion || {};

(function ($, ej, doc, undefined) {
    'use strict';
	
    ej.DataManager = function (dataSource, query, adaptor) {
          if (!(this instanceof ej.DataManager))
            return new ej.DataManager(dataSource, query, adaptor);

        if (!dataSource)
            dataSource = [];
        adaptor = adaptor || dataSource.adaptor;

        if (typeof (adaptor) === "string") 
            adaptor = new ej[adaptor]();
        var data = [], self = this;

        if (dataSource instanceof Array) {
            // JSON array
            data = {
                json: dataSource,
                offline: true
            };

        } else if (typeof dataSource === "object") {
            if ($.isPlainObject(dataSource)) {
                if (!dataSource.json)
                    dataSource.json = [];
                if (dataSource.table)
                    dataSource.json = this._getJsonFromElement(dataSource.table, dataSource.headerOption);
                data = {
                    url: dataSource.url,
                    insertUrl: dataSource.insertUrl,
                    removeUrl: dataSource.removeUrl,
                    updateUrl: dataSource.updateUrl,
                    crudUrl: dataSource.crudUrl,
                    batchUrl: dataSource.batchUrl,
                    json: dataSource.json,
                    headers: dataSource.headers,
                    accept: dataSource.accept,
                    data: dataSource.data,
					async : dataSource.async,
                    timeTillExpiration: dataSource.timeTillExpiration,
                    cachingPageSize: dataSource.cachingPageSize,
                    enableCaching: dataSource.enableCaching,
                    requestType: dataSource.requestType,
                    key: dataSource.key,
                    crossDomain: dataSource.crossDomain,
                    jsonp: dataSource.jsonp,
                    dataType: dataSource.dataType,
                    offline: dataSource.offline !== undefined ? dataSource.offline : dataSource.adaptor == "remoteSaveAdaptor" || dataSource.adaptor instanceof ej.remoteSaveAdaptor ? false : dataSource.url ? false : true,
                    requiresFormat: dataSource.requiresFormat
                };
            } else if (dataSource.jquery || isHtmlElement(dataSource)) {
                data = {
                    json: this._getJsonFromElement(dataSource),
                    offline: true,
                    table: dataSource
                };
            }
        } else if (typeof dataSource === "string") {
            data = {
                url: dataSource,
                offline: false,
                dataType: "json",
                json: []
            };
        }

        if (data.requiresFormat === undefined && !ej.support.cors)
            data.requiresFormat = isNull(data.crossDomain) ? true : data.crossDomain;
        if (data.dataType === undefined)
            data.dataType = "json";
        this.dataSource = data;
        this.defaultQuery = query;

        if (data.url && data.offline && !data.json.length) {
            this.isDataAvailable = false;
            this.adaptor = adaptor || new ej.ODataAdaptor();
            this.dataSource.offline = false;
            this.ready = this.executeQuery(query || ej.Query()).done(function (e) {
                self.dataSource.offline = true;
                self.isDataAvailable = true;
                data.json = e.result;
                self.adaptor = new ej.JsonAdaptor();
            });
        }
        else
            this.adaptor = data.offline ? new ej.JsonAdaptor() : new ej.ODataAdaptor();
        if (!data.jsonp && this.adaptor instanceof ej.ODataAdaptor)
            data.jsonp = "callback";
        this.adaptor = adaptor || this.adaptor;
        if (data.enableCaching)
            this.adaptor = new ej.CacheAdaptor(this.adaptor, data.timeTillExpiration, data.cachingPageSize);
        return this;
    };

    ej.DataManager.prototype = {
        setDefaultQuery: function (query) {
            this.defaultQuery = query;
        },
	
        executeQuery: function (query, done, fail, always) {
            if (typeof query === "function") {
                always = fail;
                fail = done;
                done = query;
                query = null;
            }

            if (!query)
                query = this.defaultQuery;

            if (!(query instanceof ej.Query))
                throwError("DataManager - executeQuery() : A query is required to execute");

            var deffered = $.Deferred();

            deffered.then(done, fail, always);
            var args = { query: query };

            if (!this.dataSource.offline && this.dataSource.url != undefined) {
				 var result = this.adaptor.processQuery(this, query);
                if (!ej.isNullOrUndefined(result.url))
                    this._makeRequest(result, deffered, args, query);
                else {
                    nextTick(function () {
                        args = this._getDeferedArgs(query, result, args);
                        deffered.resolveWith(this, [args]);;
                    }, this);
                }
            } else {
				if(!ej.isNullOrUndefined(this.dataSource.async) && this.dataSource.async == false)
					this._localQueryProcess(query, args, deffered);
				else{
					nextTick(function () {
						this._localQueryProcess(query, args, deffered);
					}, this);
				}
            }
            return deffered.promise();
        },
		_localQueryProcess: function(query, args, deffered){
			var res = this.executeLocal(query);
			args = this._getDeferedArgs(query, res, args);
			deffered.resolveWith(this, [args]);
		},
        _getDeferedArgs: function (query, result, args) {
            if (query._requiresCount) {
                args.result = result.result;
                args.count = result.count;
            } else
                args.result = result;
            args.getTableModel = getTableModel(query._fromTable, args.result, this);
            args.getKnockoutModel = getKnockoutModel(args.result);
            return args;
        },
	
        executeLocal: function (query) {
            if (!this.defaultQuery && !(query instanceof ej.Query))
                throwError("DataManager - executeLocal() : A query is required to execute");

            if (!this.dataSource.json)
                throwError("DataManager - executeLocal() : Json data is required to execute");

            query = query || this.defaultQuery;

            var result = this.adaptor.processQuery(this, query);

            if (query._subQuery) {
                var from = query._subQuery._fromTable, lookup = query._subQuery._lookup,
                    res = query._requiresCount ? result.result : result;

                if (lookup && lookup instanceof Array) {
                    buildHierarchy(query._subQuery._fKey, from, res, lookup, query._subQuery._key);
                }

                for (var j = 0; j < res.length; j++) {
                    if (res[j][from] instanceof Array) {
                        res[j] = $.extend({}, res[j]);
                        res[j][from] = this.adaptor.processResponse(query._subQuery.using(ej.DataManager(res[j][from].slice(0))).executeLocal(), this, query);
                    }
                }
            }

            return this.adaptor.processResponse(result, this, query);
        },

        _makeRequest: function (url, deffered, args, query) {
            var isSelector = !!query._subQuerySelector;

            var fnFail = $proxy(function (e) {
                args.error = e;
                deffered.rejectWith(this, [args]);
            }, this);

            var process = $proxy(function (data, count, xhr, request, actual, aggregates, virtualSelectRecords) {
                if (isSelector) return;

                args.xhr = xhr;
                args.count = parseInt(count, 10);
                args.result = data;
                args.request = request;
                args.aggregates = aggregates;
                args.getTableModel = getTableModel(query._fromTable, data, this);
                args.getKnockoutModel = getKnockoutModel(data);
                args.actual = actual;
                args.virtualSelectRecords = virtualSelectRecords;
                deffered.resolveWith(this, [args]);

            }, this);

            var fnQueryChild = $proxy(function (data, selector) {
                var subDeffer = $.Deferred(),
                    childArgs = { parent: args };

                query._subQuery._isChild = true;

                var subUrl = this.adaptor.processQuery(this, query._subQuery, data ? this.adaptor.processResponse(data) : selector);

                var childReq = this._makeRequest(subUrl, subDeffer, childArgs, query._subQuery);

                if(!isSelector)
                    subDeffer.then(function (subData) {
                        if (data) {
                            buildHierarchy(query._subQuery._fKey, query._subQuery._fromTable, data, subData, query._subQuery._key);
                            process(data);
                        }
                    }, fnFail);

                return childReq;
            }, this);

            var fnSuccess = proxy(function (data, status, xhr, request) {
                if (xhr.getResponseHeader("Content-Type").indexOf("xml") == -1 && ej.dateParse)
                    data = ej.parseJSON(data);
                var result = this.adaptor.processResponse(data, this, query, xhr, request), count = 0, aggregates = null;
                var virtualSelectRecords = data.virtualSelectRecords;
                if (query._requiresCount) {
                    count = result.count;
                    aggregates = result.aggregates;
                    result = result.result;
                }

                if (!query._subQuery) {
                    process(result, count, xhr, request, data, aggregates, virtualSelectRecords);
                    return;
                }

                if (!isSelector)
                    fnQueryChild(result);

            }, this);

            var req = $.extend({
                type: "GET",
                dataType: this.dataSource.dataType,
                crossDomain: this.dataSource.crossDomain,
                jsonp: this.dataSource.jsonp,
                cache: true,
                beforeSend: $proxy(this._beforeSend, this),
                processData: false,
                success: fnSuccess,
                error: fnFail
            }, url);

            if ("async" in this.dataSource)
                req.async = this.dataSource.async;

            req = $.ajax(req);

            if (isSelector) {
                var res = query._subQuerySelector.call(this, { query: query._subQuery, parent: query });

                if (res && res.length) {
                    req = $.when(req, fnQueryChild(null, res));

                    req.then(proxy(function (pData, cData, requests) {
                        var pResult = this.adaptor.processResponse(pData[0], this, query, pData[2], requests[0]), count = 0;
                        if (query._requiresCount) {
                            count = pResult.count;
                            pResult = pResult.result;
                        }
                        var cResult = this.adaptor.processResponse(cData[0], this, query._subQuery, cData[2], requests[1]), count = 0;
                        if (query._subQuery._requiresCount) {
                            count = cResult.count;
                            cResult = cResult.result;
                        }

                        buildHierarchy(query._subQuery._fKey, query._subQuery._fromTable, pResult, cResult, query._subQuery._key);
                        isSelector = false;
                        process(pResult, count, pData[2]);

                    }, this), fnFail);
                } else {
                    isSelector = false;
                }
            }

            return req;
        },

        _beforeSend: function (request, settings) {
            this.adaptor.beforeSend(this, request, settings);

            var headers = this.dataSource.headers, props;
            for (var i = 0; headers && i < headers.length; i++) {
                props = [];
                for (var prop in headers[i]) {
                    props.push(prop);
                    request.setRequestHeader(prop, headers[i][prop]);
                }
            }
        },
	
        saveChanges: function (changes, key, tableName, query) {

            if (tableName instanceof ej.Query) {
                query = tableName;
                tableName = null;
            }

            var args = {
                url: tableName,
                key: key || this.dataSource.key
            };

            var req = this.adaptor.batchRequest(this, changes, args, query);

            if (this.dataSource.offline) {
                return req;
            }

            var deff = $.Deferred();
            $.ajax($.extend({
                beforeSend: $proxy(this._beforeSend, this),
                success: proxy(function (data, status, xhr, request) {
                    deff.resolveWith(this, [this.adaptor.processResponse(data, this, null, xhr, request, changes, key)]);
                }, this),
                error: function (e) {
                    deff.rejectWith(this, [{ error: e }]);
                }
            }, req));

            return deff.promise();
        },
	
        insert: function (data, tableName, query) {           
            data = p.replacer(data);

            if (tableName instanceof ej.Query) {
                query = tableName;
                tableName = null;
            }

            var res = this.adaptor.insert(this, data, tableName, query);

            if (this.dataSource.offline) {
                return res;
            }            

            var deffer = $.Deferred();

            $.ajax($.extend({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                processData: false,
                beforeSend: $proxy(this._beforeSend, this),
                success: proxy(function (record, status, xhr, request) {
                    try {
                        if (ej.isNullOrUndefined(record))
                            record = [];
                        else
                            p.parseJson(record);
                    }
                    catch (e) {
                        record = [];
                    }
                    record = this.adaptor.processResponse(p.parseJson(record), this, null, xhr, request);
                    deffer.resolveWith(this, [{ record: record, dataManager: this }]);
                }, this),
                error: function (e) {
                    deffer.rejectWith(this, [{ error: e, dataManager: this }]);
                }
            }, res));

            return deffer.promise();
        },
	
        remove: function (keyField, value, tableName, query) {
            if (typeof value === "object")
                value = value[keyField];

            if (tableName instanceof ej.Query) {
                query = tableName;
                tableName = null;
            }

            var res = this.adaptor.remove(this, keyField, value, tableName, query);

            if (this.dataSource.offline)
                return res;          

            var deffer = $.Deferred();
            $.ajax($.extend({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                beforeSend: $proxy(this._beforeSend, this),
                success: proxy(function (record, status, xhr, request) {
                    try {
                        if (ej.isNullOrUndefined(record))
                            record = [];
                        else
                            p.parseJson(record);
                    }
                    catch (e) {
                        record = [];
                    }
                    record = this.adaptor.processResponse(p.parseJson(record), this, null, xhr, request);
                    deffer.resolveWith(this, [{ record: record, dataManager: this }]);
                }, this),
                error: function (e) {
                    deffer.rejectWith(this, [{ error: e, dataManager: this }]);
                }
            }, res));
            return deffer.promise();
        },
	
        update: function (keyField, value, tableName, query) {
            value = p.replacer(value);

            if (tableName instanceof ej.Query) {
                query = tableName;
                tableName = null;
            }

            var res = this.adaptor.update(this, keyField, value, tableName, query);

            if (this.dataSource.offline) {
                return res;
            }           

            var deffer = $.Deferred();

           $.ajax($.extend({
                contentType: "application/json; charset=utf-8",
                beforeSend: $proxy(this._beforeSend, this),
                success: proxy(function (record, status, xhr, request) {
                    try {
                        if (ej.isNullOrUndefined(record))
                            record = [];
                        else
                            p.parseJson(record);
                    }
                    catch (e) {
                        record = [];
                    }
                    record = this.adaptor.processResponse(p.parseJson(record), this, null, xhr, request);
                    deffer.resolveWith(this, [{ record: record, dataManager: this }]);
                }, this),
                error: function (e) {
                    deffer.rejectWith(this, [{ error: e, dataManager: this }]);
                }
           }, res));

           return deffer.promise();
        },

        _getJsonFromElement: function (ds) {
            if (typeof (ds) == "string")
                ds = $($(ds).html());

            ds = ds.jquery ? ds[0] : ds;

            var tagName = ds.tagName.toLowerCase();

            if (tagName !== "table")
                throwError("ej.DataManager : Unsupported htmlElement : " + tagName);

            return ej.parseTable(ds);
        }
    };

    var buildHierarchy = function (fKey, from, source, lookup, pKey) {
        var i, grp = {}, t;
        if (lookup.result) lookup = lookup.result;

        if (lookup.GROUPGUID)
            throwError("ej.DataManager: Do not have support Grouping in hierarchy");

        for (i = 0; i < lookup.length; i++) {
            var fKeyData = ej.getObject(fKey, lookup[i]);
            t = grp[fKeyData] || (grp[fKeyData] = []);

            t.push(lookup[i]);
        }

        for (i = 0; i < source.length; i++) {
            source[i][from] = grp[ej.getObject(pKey || fKey, source[i])];
        }
    };

    var oData = {
        accept: "application/json;odata=light;q=1,application/json;odata=verbose;q=0.5",
        multipartAccept: "multipart/mixed",
        batch: "$batch",
        changeSet: "--changeset_",
        batchPre: "batch_",
        contentId: "Content-Id: ",
        batchContent: "Content-Type: multipart/mixed; boundary=",
        changeSetContent: "Content-Type: application/http\nContent-Transfer-Encoding: binary ",
        batchChangeSetContentType: "Content-Type: application/json; charset=utf-8 "
    };
    var p = {
        parseJson: function (jsonText) {
            var type = typeof jsonText;
            if (type === "string") {
                jsonText = JSON.parse(jsonText, p.jsonReviver);
            } else if (jsonText instanceof Array) {
                p.iterateAndReviveArray(jsonText);
            } else if (type === "object")
                p.iterateAndReviveJson(jsonText);
            return jsonText;
        },
        iterateAndReviveArray: function (array) {
            for (var i = 0; i < array.length; i++) {
                if (typeof array[i] === "object")
                    p.iterateAndReviveJson(array[i]);
                else if (typeof array[i] === "string" && !/^[\s]*\[|^[\s]*\{|\"/g.test(array[i]))
                    array[i] = p.jsonReviver("",array[i]);
                else
                    array[i] = p.parseJson(array[i]);
            }
        },
        iterateAndReviveJson: function (json) {
            var value;

            for (var prop in json) {
                if (prop.startsWith("__"))
                    continue;

                value = json[prop];
                if (typeof value === "object") {
                    if (value instanceof Array)
                        p.iterateAndReviveArray(value);
                    else
                        p.iterateAndReviveJson(value);
                } else
                    json[prop] = p.jsonReviver(prop, value);
            }
        },
        jsonReviver: function (field, value) {
            var s = value;
            if (typeof value === "string") {
                var ms = /^\/Date\(([+-]?[0-9]+)([+-][0-9]{4})?\)\/$/.exec(value);
                if (ms)
                    return p.replacer(new Date(parseInt(ms[1])));
                else if (/^(\d{4}\-\d\d\-\d\d([tT][\d:\.]*){1})([zZ]|([+\-])(\d\d):?(\d\d))?$/.test(value)) {
                    value = p.replacer(new Date(value));
                    if (isNaN(value)) {
                        var a = s.split(/[^0-9]/);
                        value = p.replacer(new Date(a[0], a[1] - 1, a[2], a[3], a[4], a[5]));
                    }
                }
            }

            return value;
        },
        isJson: function (jsonData) {
            if(typeof jsonData[0]== "string")
                return jsonData;
            return ej.parseJSON(jsonData);
        },
        isGuid: function (value) {
            var regex = /[A-Fa-f0-9]{8}(?:-[A-Fa-f0-9]{4}){3}-[A-Fa-f0-9]{12}/i;
            var match = regex.exec(value);
            return match != null;
        },
        replacer: function (value) {

            if (ej.isPlainObject(value))
                return p.jsonReplacer(value);

            if (value instanceof Array)
                return p.arrayReplacer(value);

            if (value instanceof Date)
                return p.jsonReplacer({ val: value }).val;

            return value;
        },
        jsonReplacer: function (val) {
            var value;
            for (var prop in val) {
                value = val[prop];

                if (!(value instanceof Date))
                    continue;
                val[prop] = new Date(+value + (ej.serverTimezoneOffset * 60 * 60 * 1000));
            }

            return val;
        },
        arrayReplacer: function (val) {

            for (var i = 0; i < val.length; i++) {            
                if (ej.isPlainObject(val[i]))
                    val[i] = p.jsonReplacer(val[i]);
                else if (val[i] instanceof Date)
                    val[i] = p.jsonReplacer({ date: val[i] }).date;
            }

            return val;
        }
    };

    ej.isJSON = p.isJson;
    ej.parseJSON = p.parseJson;
    ej.dateParse = true;
    ej.isGUID = p.isGuid;
    ej.Query = function (from) {
        if (!(this instanceof ej.Query))
            return new ej.Query(from);

        this.queries = [];
        this._key = "";
        this._fKey = "";

        if (typeof from === "string")
            this._fromTable = from || "";
        else if (from && from instanceof Array)
            this._lookup = from;

        this._expands = [];
        this._sortedColumns = [];
        this._groupedColumns = [];
        this._subQuery = null;
        this._isChild = false;
        this._params = [];
        return this;
    };

    ej.Query.prototype = {
        key: function (field) {
            if (typeof field === "string")
                this._key = field;

            return this;
        },
	
        using: function (dataManager) {
            if (dataManager instanceof ej.DataManager) {
                this.dataManagar = dataManager;
                return this;
            }

            return throwError("Query - using() : 'using' function should be called with parameter of instance ej.DataManager");
        },
	
        execute: function (dataManager, done, fail, always) {
            dataManager = dataManager || this.dataManagar;

            if (dataManager && dataManager instanceof ej.DataManager)
                return dataManager.executeQuery(this, done, fail, always);

            return throwError("Query - execute() : dataManager needs to be is set using 'using' function or should be passed as argument");
        },
	
        executeLocal: function (dataManager) {
            // this does not support for URL binding
            

            dataManager = dataManager || this.dataManagar;

            if (dataManager && dataManager instanceof ej.DataManager)
                return dataManager.executeLocal(this);

            return throwError("Query - executeLocal() : dataManager needs to be is set using 'using' function or should be passed as argument");
        },
	
        clone: function () {
            var cl = new ej.Query();
            cl.queries = this.queries.slice(0);
            cl._key = this._key;
            cl._isChild = this._isChild;
            cl.dataManagar = this.dataManager;
            cl._fromTable = this._fromTable;
            cl._params = this._params.slice(0);
            cl._expands = this._expands.slice(0);
            cl._sortedColumns = this._sortedColumns.slice(0);
            cl._groupedColumns = this._groupedColumns.slice(0);
            cl._subQuerySelector = this._subQuerySelector;
            cl._subQuery = this._subQuery;
            cl._fKey = this._fKey;
            cl._requiresCount = this._requiresCount;
            return cl;
        },
	
        from: function (tableName) {
            if (typeof tableName === "string")
                this._fromTable = tableName;

            return this;
        },
	
        addParams: function (key, value) {
            if (typeof value !== "function" && !ej.isPlainObject(value))
                this._params.push({ key: key, value: value });
            else if (typeof value === "function")
                this._params.push({ key: key, fn: value });

            return this;
        },
	
        expand: function (tables) {
            if (typeof tables === "string")
                this._expands = [].slice.call(arguments, 0);
            else
                this._expands = tables.slice(0);

            return this;
        },
	
        where: function (fieldName, operator, value, ignoreCase) {
            operator = (operator || ej.FilterOperators.equal).toLowerCase();
            var predicate = null;

            if (typeof fieldName === "string")
                predicate = new ej.Predicate(fieldName, operator, value, ignoreCase);
            else if (fieldName instanceof ej.Predicate)
                predicate = fieldName;
            else
                throwError("Query - where : Invalid arguments");

            this.queries.push({
                fn: "onWhere",
                e: predicate
            });
            return this;
        },
	
        search: function (searchKey, fieldNames, operator, ignoreCase) {
            if (!fieldNames || typeof fieldNames === "boolean") {
                fieldNames = [];
                ignoreCase = fieldNames;
            } else if (typeof fieldNames === "string")
                fieldNames = [fieldNames];

            if (typeof operator === "boolean") {
                ignoreCase = operator;
                operator = null;
            }
            operator = operator || ej.FilterOperators.contains;
            if (operator.length < 3)
                operator = ej.data.operatorSymbols[operator];

            var comparer = ej.data.fnOperators[operator] || ej.data.fnOperators.processSymbols(operator);

            this.queries.push({
                fn: "onSearch",
                e: {
                    fieldNames: fieldNames,
                    operator: operator,
                    searchKey: searchKey,
                    ignoreCase: ignoreCase,
                    comparer: comparer
                }
            });
            return this;
        },
		
        sortBy: function (fieldName, comparer, isFromGroup) {
            var order = ej.sortOrder.Ascending, sorts, t;

            if (typeof fieldName === "string" && fieldName.toLowerCase().endsWith(" desc")) {
                fieldName = fieldName.replace(/ desc$/i, '');
                comparer = ej.sortOrder.Descending;
            }
            if (fieldName instanceof Array) {
                for(var i=0;i<fieldName.length;i++)
                   this.sortBy(fieldName[i],comparer,isFromGroup);
                return this;
            }
            if (typeof comparer === "boolean")
                comparer = !comparer ? ej.sortOrder.Ascending : ej.sortOrder.Descending;
            else if (typeof comparer === "function")
                order = "custom";

            if (!comparer || typeof comparer === "string") {
                order = comparer ? comparer.toLowerCase() : ej.sortOrder.Ascending;
                comparer = ej.pvt.fnSort(comparer);
            }
            if (isFromGroup) {
                sorts = filterQueries(this.queries, "onSortBy");

                for (var i = 0; i < sorts.length; i++) {
                    t = sorts[i].e.fieldName;
                    if (typeof t === "string") {
                        if (t === fieldName) return this;
                    } else if (t instanceof Array) {
                        for (var j = 0; j < t.length; j++)
                            if (t[j] === fieldName || fieldName.toLowerCase() === t[j] + " desc")
                                return this;
                    }
                }
            }

            this.queries.push({
                fn: "onSortBy",
                e: {
                    fieldName: fieldName,
                    comparer: comparer,
                    direction: order
                }
            });

            return this;
        },
		
        sortByDesc: function (fieldName) {
            return this.sortBy(fieldName, ej.sortOrder.Descending);
        },
		
        group: function (fieldName,fn) {
            this.sortBy(fieldName, null, true);

            this.queries.push({
                fn: "onGroup",
                e: {
                    fieldName: fieldName,
                    fn: fn
                }
            });
            return this;
        },
	
        page: function (pageIndex, pageSize) {
            this.queries.push({
                fn: "onPage",
                e: {
                    pageIndex: pageIndex,
                    pageSize: pageSize
                }
            });
            return this;
        },
	
        range: function (start, end) {
            if (typeof start !== "number" || typeof end !== "number")
                throwError("Query() - range : Arguments type should be a number");

            this.queries.push({
                fn: "onRange",
                e: {
                    start: start,
                    end: end
                }
            });
            return this;
        },
	

        take: function (nos) {
            if (typeof nos !== "number")
                throwError("Query() - Take : Argument type should be a number");

            this.queries.push({
                fn: "onTake",
                e: {
                    nos: nos
                }
            });
            return this;
        },
	
        skip: function (nos) {
            if (typeof nos !== "number")
                throwError("Query() - Skip : Argument type should be a number");

            this.queries.push({
                fn: "onSkip",
                e: { nos: nos }
            });
            return this;
        },
	
        select: function (fieldNames) {
            if (typeof fieldNames === "string")
                fieldNames = [].slice.call(arguments, 0);

            if (!(fieldNames instanceof Array)) {
                throwError("Query() - Select : Argument type should be String or Array");
            }

            this.queries.push({
                fn: "onSelect",
                e: { fieldNames: fieldNames }
            });
            return this;
        },
	
        hierarchy: function (query, selectorFn) {
            if (!query || !(query instanceof ej.Query))
                throwError("Query() - hierarchy : query must be instance of ej.Query");

            if (typeof selectorFn === "function")
                this._subQuerySelector = selectorFn;

            this._subQuery = query;
            return this;
        },
	
        foreignKey: function (key) {
            if (typeof key === "string")
                this._fKey = key;

            return this;
        },
	
        requiresCount: function () {
            this._requiresCount = true;

            return this;
        },
        //type - sum, avg, min, max
        aggregate: function (type, field) {
            this.queries.push({
                fn: "onAggregates",
                e: { field: field, type: type }
            });
        }
    };

    ej.Adaptor = function (ds) {
        this.dataSource = ds;
        this.pvt = {};
		this.init.apply(this, [].slice.call(arguments, 1));
    };

    ej.Adaptor.prototype = {
        options: {
            from: "table",
            requestType: "json",
            sortBy: "sorted",
            select: "select",
            skip: "skip",
            group: "group",
            take: "take",
            search: "search",
            count: "requiresCounts",
            where: "where",
            aggregates: "aggregates"
        },
        init: function () {
        },
        extend: function (overrides) {
            var fn = function (ds) {
                this.dataSource = ds;

                if (this.options)
                    this.options = $.extend({}, this.options);
				this.init.apply(this, [].slice.call(arguments, 0));

                this.pvt = {};
            };
            fn.prototype = new this.type();
            fn.prototype.type = fn;

            var base = fn.prototype.base = {};
            for (var p in overrides) {
                if (fn.prototype[p])
                    base[p] = fn.prototype[p];
            }
            $.extend(true, fn.prototype, overrides);
            return fn;
        },
        processQuery: function (dm, query) {
            // this needs to be overridden
        },
        processResponse: function (data, ds, query, xhr) {
            if (data.d)
               return data.d;
            return data;
        },
        convertToQueryString: function (req, query, dm) {
            return $.param(req);
        },
        type: ej.Adaptor
    };

    ej.UrlAdaptor = new ej.Adaptor().extend({
        processQuery: function (dm, query, hierarchyFilters) {
            var sorted = filterQueries(query.queries, "onSortBy"),
                grouped = filterQueries(query.queries, "onGroup"),
                filters = filterQueries(query.queries, "onWhere"),
                searchs = filterQueries(query.queries, "onSearch"),
                aggregates = filterQueries(query.queries, "onAggregates"),
                singles = filterQueryLists(query.queries, ["onSelect", "onPage", "onSkip", "onTake", "onRange"]),
                params = query._params,
                url = dm.dataSource.url, tmp, skip, take = null,
                op = this.options;

            var r = {
                sorted: [],
                grouped: [],
                filters: [],
                searches: [],
                aggregates: []
            };

            // calc Paging & Range
            if (singles["onPage"]) {
                tmp = singles["onPage"];
                skip = getValue(tmp.pageIndex, query);
                take = getValue(tmp.pageSize, query);
				skip = (skip - 1) * take;
            } else if (singles["onRange"]) {
                tmp = singles["onRange"];
                skip = tmp.start;
                take = tmp.end - tmp.start;
            }

            // Sorting
            for (var i = 0; i < sorted.length; i++) {
                tmp = getValue(sorted[i].e.fieldName, query);

                r.sorted.push(callAdaptorFunc(this, "onEachSort", { name: tmp, direction: sorted[i].e.direction }, query));
            }

            // hierarchy
            if (hierarchyFilters) {
                tmp = this.getFiltersFrom(hierarchyFilters, query);
                if (tmp)
                    r.filters.push(callAdaptorFunc(this, "onEachWhere", tmp.toJSON(), query));
            }

            // Filters
            for (var i = 0; i < filters.length; i++) {
                r.filters.push(callAdaptorFunc(this, "onEachWhere", filters[i].e.toJSON(), query));

                for (var prop in r.filters[i]) {
                    if (isNull(r[prop]))
                        delete r[prop];
                }
            }

            // Searches
            for (var i = 0; i < searchs.length; i++) {
                tmp = searchs[i].e;
                r.searches.push(callAdaptorFunc(this, "onEachSearch", {
                    fields: tmp.fieldNames,
                    operator: tmp.operator,
                    key: tmp.searchKey,
                    ignoreCase: tmp.ignoreCase
                }, query));
            }

            // Grouping
            for (var i = 0; i < grouped.length; i++) {
                r.grouped.push(getValue(grouped[i].e.fieldName, query));
            }

            // aggregates
            for (var i = 0; i < aggregates.length; i++) {
                tmp = aggregates[i].e; 
                r.aggregates.push({ type: tmp.type, field: getValue(tmp.field, query) });
            }

            var req = {};
            req[op.from] = query._fromTable;
            if (op.expand) req[op.expand] = query._expands;
            req[op.select] = singles["onSelect"] ? callAdaptorFunc(this, "onSelect", getValue(singles["onSelect"].fieldNames, query), query) : "";
            req[op.count] = query._requiresCount ? callAdaptorFunc(this, "onCount", query._requiresCount, query) : "";
            req[op.search] = r.searches.length ? callAdaptorFunc(this, "onSearch", r.searches, query) : "";
            req[op.skip] = singles["onSkip"] ? callAdaptorFunc(this, "onSkip", getValue(singles["onSkip"].nos, query), query) : "";
            req[op.take] = singles["onTake"] ? callAdaptorFunc(this, "onTake", getValue(singles["onTake"].nos, query), query) : "";
            req[op.where] = r.filters.length || r.searches.length ? callAdaptorFunc(this, "onWhere", r.filters, query) : "";
            req[op.sortBy] = r.sorted.length ? callAdaptorFunc(this, "onSortBy", r.sorted, query) : "";
            req[op.group] = r.grouped.length ? callAdaptorFunc(this, "onGroup", r.grouped, query) : "";
            req[op.aggregates] = r.aggregates.length ? callAdaptorFunc(this, "onAggregates", r.aggregates, query) : "";
			req["param"] = [];
			
            // Params
			callAdaptorFunc(this, "addParams", { dm: dm, query: query, params: params, reqParams: req });

            // cleanup
            for (var prop in req) {
                if (isNull(req[prop]) || req[prop] === "" || req[prop].length === 0 || prop === "params")
                    delete req[prop];
            }

            if (!(op.skip in req && op.take in req) && take !== null) {
                req[op.skip] = callAdaptorFunc(this, "onSkip", skip, query);
                req[op.take] = callAdaptorFunc(this, "onTake", take, query);
            }
            var p = this.pvt;
            this.pvt = {};

            if (this.options.requestType === "json") {
                return {
                    data: JSON.stringify(req),
                    url: url,
                    ejPvtData: p,
                    type: "POST",
                    contentType: "application/json; charset=utf-8"
                }
            }
            tmp = this.convertToQueryString(req, query, dm);
            tmp =  (dm.dataSource.url.indexOf("?")!== -1 ? "&" : "/") + tmp;
            return {
                type: "GET",
                url: tmp.length ? url.replace(/\/*$/, tmp) : url,
                ejPvtData: p
            };
        },
        convertToQueryString: function (req, query, dm) {
            if (dm.dataSource.url && dm.dataSource.url.indexOf("?") !== -1)
                return $.param(req);
            return "?" + $.param(req);
        },
        processResponse: function (data, ds, query, xhr, request, changes) {
            var pvt = request.ejPvtData || {};
			var groupDs= data.groupDs;
			if (xhr && xhr.getResponseHeader("Content-Type") && xhr.getResponseHeader("Content-Type").indexOf("xml") != -1 && data.nodeType == 9)
                return query._requiresCount ? { result: [], count: 0 } : [];
            var d = JSON.parse(request.data);
            if (d && d.action === "batch" && data.added) {
                changes.added = data.added;
                return changes;
            }
            if (data.d)
                data = data.d;

            if (pvt && pvt.aggregates && pvt.aggregates.length) {
                var agg = pvt.aggregates, args = {}, fn, res = {};
                if ('count' in data) args.count = data.count;
                if (data["result"]) args.result = data.result;
                if (data["aggregate"]) data = data.aggregate;
                for (var i = 0; i < agg.length; i++) {
                    fn = ej.aggregates[agg[i].type];
                    if (fn)
                        res[agg[i].field + " - " + agg[i].type] = fn(data, agg[i].field);
                }
                args["aggregates"] = res;
                data = args;
            }

            if (pvt && pvt.groups && pvt.groups.length) {
                var groups = pvt.groups, args = {};
                if ('count' in data) args.count = data.count;
                if (data["aggregates"]) args.aggregates = data.aggregates;
                if (data["result"]) data = data.result;
                for (var i = 0; i < groups.length; i++){
                    var level = null;
                    var format = getColFormat(groups[i], query.queries);
                    if (!ej.isNullOrUndefined(groupDs))
                        groupDs = ej.group(groupDs, groups[i], null, format);
                    data = ej.group(data, groups[i], pvt.aggregates, format, level, groupDs);
                }
                if (args.count != undefined)
                    args.result = data;
                else
                    args = data;
                return args;
            }
            return data;
        },
        onGroup: function (e) {
            this.pvt.groups = e;
        },
        onAggregates: function (e) {
            this.pvt.aggregates = e;
        },
        batchRequest: function (dm, changes, e, query) {
            var res = {
                changed: changes.changed,
                added: changes.added,
                deleted: changes.deleted,
                action: "batch",
                table: e.url,
                key: e.key
            };
            if (query)
                this.addParams({ dm: dm, query: query, params: query._params, reqParams: res });

            return {
                type: "POST",
                url: dm.dataSource.batchUrl || dm.dataSource.crudUrl || dm.dataSource.removeUrl || dm.dataSource.url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(res)
            };
        },
        beforeSend: function (dm, request) {
        },
        insert: function (dm, data, tableName, query) {
            var res = {
                value: data,
                table: tableName,
                action: "insert"
            };
            if (query)
                this.addParams({ dm: dm, query: query, params: query._params, reqParams: res });

            return {
                url: dm.dataSource.insertUrl || dm.dataSource.crudUrl || dm.dataSource.url,
                data: JSON.stringify(res)
            };
        },
        remove: function (dm, keyField, value, tableName, query) {
            var res = {
                key: value,
                keyColumn: keyField,
                table: tableName,
                action: "remove"
            };
            if (query)
                this.addParams({ dm: dm, query: query, params: query._params, reqParams: res });

            return {
                type: "POST",
                url: dm.dataSource.removeUrl || dm.dataSource.crudUrl || dm.dataSource.url,
                data: JSON.stringify(res)
            };
        },
        update: function (dm, keyField, value, tableName, query) {
            var res = {
                value: value,
                action: "update",
                keyColumn: keyField,
                key: value[keyField],
                table: tableName
            };
            if (query)
                this.addParams({ dm: dm, query: query, params: query._params, reqParams: res });

            return {
                type: "POST",
                url: dm.dataSource.updateUrl || dm.dataSource.crudUrl || dm.dataSource.url,
                data: JSON.stringify(res)
            };
        },
        getFiltersFrom: function (data, query) {
            if (!(data instanceof Array) || !data.length)
                throwError("ej.SubQuery: Array of key values required");
            var key = query._fKey, value, prop = key, pKey = query._key, predicats = [],
                isValues = typeof data[0] !== "object";

            if (typeof data[0] !== "object") prop = null;

            for (var i = 0; i < data.length; i++) {
                value = !isValues ? ej.pvt.getObject(pKey || prop, data[i]) : data[i];
                predicats.push(new ej.Predicate(key, "==", value));
            }

            return ej.Predicate.or(predicats);
        },
        addParams: function (options) {
            var dm = options.dm, query = options.query, params = options.params, req = options.reqParams; req["params"] = {};
            for (var i = 0, tmp; tmp = params[i]; i++) {
                if (req[tmp.key]) throwError("ej.Query: Custom Param is conflicting other request arguments");
                req[tmp.key] = tmp.value;
                if (tmp.fn)
                    req[tmp.key] = tmp.fn.call(query, tmp.key, query, dm);                
                req["params"][tmp.key] = req[tmp.key];
            }
        }
    });
    ej.WebMethodAdaptor = new ej.UrlAdaptor().extend({
        processQuery: function (dm, query, hierarchyFilters) {
            var obj = ej.UrlAdaptor.prototype.processQuery(dm, query, hierarchyFilters);
            var data = ej.parseJSON(obj.data), result = {};

            result["value"] = data;

            //Params             
            callAdaptorFunc(this, "addParams", { dm: dm, query: query, params: query._params, reqParams: result });

            return {
                data: JSON.stringify(result),
                url: obj.url,
                ejPvtData: obj.ejPvtData,
                type: "POST",
                contentType: "application/json; charset=utf-8"
            }
        },
        addParams: function (options) {
            var dm = options.dm, query = options.query, params = options.params, req = options.reqParams; req["params"] = {};
            for (var i = 0, tmp; tmp = params[i]; i++) {
                if (req[tmp.key]) throwError("ej.Query: Custom Param is conflicting other request arguments");
                var webkey = tmp.key, webvalue = tmp.value;
                if (tmp.fn)
                    webvalue = tmp.fn.call(query, tmp.key, query, dm);
                req[webkey] = webvalue;
                req["params"][webkey] = req[webkey];
            }
        }
    });
    ej.CacheAdaptor = new ej.UrlAdaptor().extend({
        init: function (adaptor, timeStamp, pageSize) {
            if (!ej.isNullOrUndefined(adaptor)) {
                this.cacheAdaptor = adaptor;
            }
            this.pageSize = pageSize;
            this.guidId = ej.getGuid("cacheAdaptor");
            var obj = { keys: [], results: [] };
            if (window.localStorage)
                window.localStorage.setItem(this.guidId, JSON.stringify(obj));
            var guid = this.guidId;
            if (!ej.isNullOrUndefined(timeStamp)) {
                setInterval(function () {
                    var data = ej.parseJSON(window.localStorage.getItem(guid));
                    var forDel = [];
                    for (var i = 0; i < data.results.length; i++) {
                        data.results[i].timeStamp = new Date() - new Date(data.results[i].timeStamp)
                        if (new Date() - new Date(data.results[i].timeStamp) > timeStamp)
                            forDel.push(i);
                    }
                    var d = forDel;
                    for (var i = 0; i < forDel.length; i++) {
                        data.results.splice(forDel[i], 1);
                        data.keys.splice(forDel[i], 1);
                    }
                    window.localStorage.removeItem(guid);
                    window.localStorage.setItem(guid, JSON.stringify(data));
                }, timeStamp);
            }
        },
        generateKey: function (url, query) {
            var sorted = filterQueries(query.queries, "onSortBy"),
                grouped = filterQueries(query.queries, "onGroup"),
                filters = filterQueries(query.queries, "onWhere"),
                searchs = filterQueries(query.queries, "onSearch"),
				pageQuery = filterQueries(query.queries, "onPage"),
                singles = filterQueryLists(query.queries, ["onSelect", "onPage", "onSkip", "onTake", "onRange"]),
                params = query._params;
            var key = url;
            if (singles["onPage"])
              key += singles["onPage"].pageIndex;
              sorted.forEach(function (obj) {
                   key += obj.e.direction + obj.e.fieldName;
              });
                grouped.forEach(function (obj) {
                    key += obj.e.fieldName;
                });
                searchs.forEach(function (obj) {
                    key += obj.e.searchKey;
                });
            
            for (var filter = 0; filter < filters.length; filter++) {
                var currentFilter = filters[filter];
                if (currentFilter.e.isComplex) {
                    var newQuery = query.clone();
                    newQuery.queries = [];
                    for (var i = 0; i < currentFilter.e.predicates.length; i++) {
                        newQuery.queries.push({ fn: "onWhere", e: currentFilter.e.predicates[i], filter: query.queries.filter });
                    }
                    key += currentFilter.e.condition + this.generateKey(url, newQuery);
                }
                else
                    key += currentFilter.e.field + currentFilter.e.operator + currentFilter.e.value
            }
            return key;
        },
        processQuery: function (dm, query, hierarchyFilters) {
            var key = this.generateKey(dm.dataSource.url, query);
            var cachedItems;
            if (window.localStorage)
                cachedItems = ej.parseJSON(window.localStorage.getItem(this.guidId));
            var data = cachedItems ? cachedItems.results[cachedItems.keys.indexOf(key)] : null;
            if (data != null && !this._crudAction && !this._insertAction) {
                return data;
            }
            this._crudAction = null; this._insertAction = null;
            return this.cacheAdaptor.processQuery.apply(this.cacheAdaptor, [].slice.call(arguments, 0))
        },
        processResponse: function (data, ds, query, xhr, request, changes) {
            if (this._insertAction || (request && this.cacheAdaptor.options.batch && request.url.endsWith(this.cacheAdaptor.options.batch) && request.type.toLowerCase() === "post")) {
                return this.cacheAdaptor.processResponse(data, ds, query, xhr, request, changes);
            }
            var data = this.cacheAdaptor.processResponse.apply(this, [].slice.call(arguments, 0));
            var key = this.generateKey(ds.dataSource.url, query)
            var obj = {};
            if (window.localStorage)
                obj = ej.parseJSON(window.localStorage.getItem(this.guidId));
            var index = $.inArray(key, obj.keys);
            if (index != -1) {
                obj.results.splice(index, 1);
                obj.keys.splice(index, 1);
            }
            obj.results[obj.keys.push(key) - 1] = { keys: key, result: data.result, timeStamp: new Date(), count: data.count }
            while (obj.results.length > this.pageSize) {
                obj.results.splice(0, 1);
                obj.keys.splice(0, 1);
            }
            window.localStorage.setItem(this.guidId, JSON.stringify(obj));
            return data;
        },
        update: function (dm, keyField, value, tableName) {
            this._crudAction = true;
            return this.cacheAdaptor.update(dm, keyField, value, tableName);
        },
        insert: function (dm, data, tableName) {
            this._insertAction = true;
            return this.cacheAdaptor.insert(dm, data, tableName);
        },
        remove: function (dm, keyField, value, tableName) {
            this._crudAction = true;
            return this.cacheAdaptor.remove(dm, keyField, value, tableName);
        },
        batchRequest: function (dm, changes, e) {
            return this.cacheAdaptor.batchRequest(dm, changes, e);
        }
    });
    var filterQueries = function (queries, name) {
        return queries.filter(function (q) {
            return q.fn === name;
        }) || [];
    };
    var filterQueryLists = function (queries, singles) {
        var filtered = queries.filter(function (q) {
            return singles.indexOf(q.fn) !== -1;
        }), res = {};
        for (var i = 0; i < filtered.length; i++) {
            if (!res[filtered[i].fn])
                res[filtered[i].fn] = filtered[i].e;
        }
        return res;
    };
    var callAdaptorFunc = function (obj, fnName, param, param1) {
        if (obj[fnName]) {
            var res = obj[fnName](param, param1);
            if (!isNull(res)) param = res;
        }
        return param;
    };

    ej.ODataAdaptor = new ej.UrlAdaptor().extend({
        options: {
            requestType: "get",
            accept: "application/json;odata=light;q=1,application/json;odata=verbose;q=0.5",
            multipartAccept: "multipart/mixed",
            sortBy: "$orderby",
            select: "$select",
            skip: "$skip",
            take: "$top",
            count: "$inlinecount",
            where: "$filter",
            expand: "$expand",
            batch: "$batch",
            changeSet: "--changeset_",
            batchPre: "batch_",
            contentId: "Content-Id: ",
            batchContent: "Content-Type: multipart/mixed; boundary=",
            changeSetContent: "Content-Type: application/http\nContent-Transfer-Encoding: binary ",
            batchChangeSetContentType: "Content-Type: application/json; charset=utf-8 "
        },
        onEachWhere: function (filter, requiresCast) {
            return filter.isComplex ? this.onComplexPredicate(filter, requiresCast) : this.onPredicate(filter, requiresCast);
        },
        onPredicate: function (pred, query, requiresCast) {
            var returnValue = "",
                operator,guid,
                val = pred.value,
                type = typeof val,
                field = this._p(pred.field);

            if (val instanceof Date)
                val = "datetime'" + p.replacer(val).toJSON() + "'";

            if (type === "string") {
				if(val.indexOf("'") != -1)
                    val = val.replace(new RegExp(/'/g),"''");
                val = "'" + val + "'";

                if (requiresCast) {
                    field = "cast(" + field + ", 'Edm.String')";
                }
                if (ej.isGUID(val))
                    guid = 'guid';
                if (pred.ignoreCase) {
                    !guid ? field = "tolower(" + field + ")" : field;
                    val = val.toLowerCase();
                }
            }

            operator = ej.data.odBiOperator[pred.operator];
            if (operator) {
                returnValue += field;
                returnValue += operator;
                if (guid)
                    returnValue += guid;
                return returnValue + val;
            }

            operator = ej.data.odUniOperator[pred.operator];
            if (!operator || type !== "string") return "";

            if (operator === "substringof") {
                var t = val;
                val = field;
                field = t;
            }

            returnValue += operator + "(";
            returnValue += field + ",";
            if (guid) returnValue += guid;
            returnValue += val + ")";

            return returnValue;
        },
        onComplexPredicate: function (pred, requiresCast) {
            var res = [];
            for (var i = 0; i < pred.predicates.length; i++) {
                res.push("(" + this.onEachWhere(pred.predicates[i], requiresCast) + ")");
            }
            return res.join(" " + pred.condition + " ");
        },
        onWhere: function (filters) {
            if (this.pvt.searches)
                filters.push(this.onEachWhere(this.pvt.searches, null, true));

            return filters.join(" and ");
        },
        onEachSearch: function (e) {
            if (e.fields.length === 0)
                throwError("Query() - Search : oData search requires list of field names to search");

            var filter = this.pvt.searches || [];
            for (var i = 0; i < e.fields.length; i++) {
                filter.push(new ej.Predicate(e.fields[i], e.operator, e.key, e.ignoreCase));
            }
            this.pvt.searches = filter;
        },
        onSearch: function (e) {
            this.pvt.searches = ej.Predicate.or(this.pvt.searches);
            return "";
        },
        onEachSort: function (e) {
            var res = [];
            if (e.name instanceof Array) {
                for (var i = 0; i < e.name.length; i++)
                    res.push(this._p(e.name[i]));
            } else {
                res.push(this._p(e.name) + (e.direction === "descending" ? " desc" : ""));
            }
            return res.join(",");
        },
        onSortBy: function (e) {
            return e.reverse().join(",");
        },
        onGroup: function (e) {
            this.pvt.groups = e;
            return "";
        },
        onSelect: function (e) {
            for (var i = 0; i < e.length; i++)
                e[i] = this._p(e[i]);

            return e.join(',');
        },
        onAggregates: function(e){
            this.pvt.aggregates = e;
            return "";
        },
        onCount: function (e) {
            return e === true ? "allpages" : "";
        },
        beforeSend: function (dm, request, settings) {
            if (settings.url.endsWith(this.options.batch) && settings.type.toLowerCase() === "post") {
                request.setRequestHeader("Accept", oData.multipartAccept);
                request.setRequestHeader("DataServiceVersion", "2.0");
                request.overrideMimeType("text/plain; charset=x-user-defined");
            }

            if (!dm.dataSource.crossDomain) {
                request.setRequestHeader("DataServiceVersion", "2.0");
                request.setRequestHeader("MaxDataServiceVersion", "2.0");
            }
        },
        processResponse: function (data, ds, query, xhr, request, changes) {
            if (!ej.isNullOrUndefined(data.d)) {
                var dataCopy = (query && query._requiresCount) ? data.d.results : data.d;
                if (!ej.isNullOrUndefined(dataCopy))
                    for (var i = 0; i < dataCopy.length; i++) {
                        !ej.isNullOrUndefined(dataCopy[i].__metadata) && delete dataCopy[i].__metadata;
                    }
            }
            var pvt = request && request.ejPvtData;
            if (xhr && xhr.getResponseHeader("Content-Type") && xhr.getResponseHeader("Content-Type").indexOf("xml") != -1 && data.nodeType == 9)
                return query._requiresCount ? { result: [], count: 0 } : [];
            if (request && this.options.batch && request.url.endsWith(this.options.batch) && request.type.toLowerCase() === "post") {
                var guid = xhr.getResponseHeader("Content-Type"), cIdx, jsonObj;
                guid = guid.substring(guid.indexOf("=batchresponse") + 1);
                data = data.split(guid);
                if (data.length < 2) return;

                data = data[1];
                var exVal = /(?:\bContent-Type.+boundary=)(changesetresponse.+)/i.exec(data);
                data.replace(exVal[0], "");

                var changeGuid = exVal[1];
                data = data.split(changeGuid);

                for (var i = data.length; i > -1; i--) {
                    if (!/\bContent-ID:/i.test(data[i]) || !/\bHTTP.+201/.test(data[i]))
                        continue;

                    cIdx = parseInt(/\bContent-ID: (\d+)/i.exec(data[i])[1]);

                    if (changes.added[cIdx]) {
                        jsonObj = p.parseJson(/^\{.+\}/m.exec(data[i])[0]);
                        $.extend(changes.added[cIdx], this.processResponse(jsonObj));
                    }
                }
                return changes;
            }
            var version = xhr && xhr.getResponseHeader("DataServiceVersion"), count = null, aggregateResult = {};
            version = (version && parseInt(version, 10)) || 2;

            if (query && query._requiresCount) {
                if (data.__count || data['odata.count']) count = data.__count || data['odata.count'];
                if (data.d) data = data.d;
                if (data.__count || data['odata.count']) count = data.__count || data['odata.count'];
            }

            if (version === 3 && data.value) data = data.value;
            if (data.d) data = data.d;
            if (version < 3 && data.results) data = data.results;

            if (pvt && pvt.aggregates && pvt.aggregates.length) {
                var agg = pvt.aggregates, args = {}, fn, res = {};
                for (var i = 0; i < agg.length; i++) {
                    fn = ej.aggregates[agg[i].type];
                    if (fn)
                        res[agg[i].field + " - " + agg[i].type] = fn(data, agg[i].field);
                }
                aggregateResult = res;
            }
            if (pvt && pvt.groups && pvt.groups.length) {
                var groups = pvt.groups;
                for (var i = 0; i < groups.length; i++) {
                    var format = getColFormat(groups[i], query.queries)
                    data = ej.group(data, groups[i], pvt.aggregates, format);
                }
            }
            return isNull(count) ? data : { result: data, count: count, aggregates: aggregateResult };
        },
        convertToQueryString: function (req, query, dm) {
            var res = [], tableName = req.table || "";
            delete req.table;

            if (dm.dataSource.requiresFormat)
                req["$format"] = "json";

            for (var prop in req)
                res.push(prop + "=" + req[prop]);

            res = res.join("&");

            if (dm.dataSource.url && dm.dataSource.url.indexOf("?") !== -1 && !tableName)
                return res;

            return res.length ? tableName + "?" + res : tableName || "";
        },
        insert: function (dm, data, tableName) {
            return {
                url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : ''),
                data: JSON.stringify(data)
            }
        },
        remove: function (dm, keyField, value, tableName) {
            return {
                type: "DELETE",
                url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : '') + '(' + value + ')'
            };
        },
        update: function (dm, keyField, value, tableName) {
            return {
                type: "PUT",
                url: dm.dataSource.url.replace(/\/*$/, tableName ? '/' + tableName : '') + '(' + value[keyField] + ')',
                data: JSON.stringify(value),
                accept: this.options.accept
            };
        },
        batchRequest: function (dm, changes, e) {
            var initialGuid = e.guid = ej.getGuid(oData.batchPre);
            var url = dm.dataSource.url.replace(/\/*$/, '/' + this.options.batch);
            var args = {
                url: e.url,
                key: e.key,
                cid: 1,
                cSet: ej.getGuid(oData.changeSet)
            };
            var req = "--" + initialGuid + "\n";

            req += "Content-Type: multipart/mixed; boundary=" + args.cSet.replace("--", "") + "\n";

            this.pvt.changeSet = 0;

            req += this.generateInsertRequest(changes.added, args);
            req += this.generateUpdateRequest(changes.changed, args);
            req += this.generateDeleteRequest(changes.deleted, args);

            req += args.cSet + "--\n";
            req += "--" + initialGuid + "--";

            return {
                type: "POST",
                url: url,
                contentType: "multipart/mixed; charset=UTF-8;boundary=" + initialGuid,
                data: req
            };
        },
        generateDeleteRequest: function (arr, e) {
            if (!arr) return "";
            var req = "";

            for (var i = 0; i < arr.length; i++) {
                req += "\n" + e.cSet + "\n";
                req += oData.changeSetContent + "\n\n";
                req += "DELETE ";
                req += e.url + "(" + arr[i][e.key] + ") HTTP/1.1\n";
                req += "If-Match : * \n"
                req += "Accept: " + oData.accept + "\n";
                req += "Content-Id: " + this.pvt.changeSet++ + "\n";
                req += oData.batchChangeSetContentType + "\n";
            }

            return req + "\n";
        },
        generateInsertRequest: function (arr, e) {
            if (!arr) return "";
            var req = "";

            for (var i = 0; i < arr.length; i++) {
                req += "\n" + e.cSet + "\n";
                req += oData.changeSetContent + "\n\n";
                req += "POST ";
                req += e.url + " HTTP/1.1\n";
                req += "Accept: " + oData.accept + "\n";
                req += "Content-Id: " + this.pvt.changeSet++ + "\n";
                req += oData.batchChangeSetContentType + "\n\n";

                req += JSON.stringify(arr[i]) + "\n";
            }

            return req;
        },
        generateUpdateRequest: function (arr, e) {
            if (!arr) return "";
            var req = "";

            for (var i = 0; i < arr.length; i++) {
                req += "\n" + e.cSet + "\n";
                req += oData.changeSetContent + "\n\n";
                req += "PUT ";
                req += e.url + "(" + arr[i][e.key] + ")" + " HTTP/1.1\n";
                req += "If-Match : * \n"
                req += "Accept: " + oData.accept + "\n";
                req += "Content-Id: " + this.pvt.changeSet++ + "\n";
                req += oData.batchChangeSetContentType + "\n\n";

                req += JSON.stringify(arr[i]) + "\n\n";
            }

            return req;
        },
        _p: function (prop) {
            return prop.replace(/\./g, "/");
        }
    });
    ej.ODataV4Adaptor = new ej.ODataAdaptor().extend({
        options: {
            requestType: "get",
            accept: "application/json;odata=light;q=1,application/json;odata=verbose;q=0.5",
            multipartAccept: "multipart/mixed",
            sortBy: "$orderby",
            select: "$select",
            skip: "$skip",
            take: "$top",
            count: "$count",
            search: "$search",
            where: "$filter",
            expand: "$expand",
            batch: "$batch",
            changeSet: "--changeset_",
            batchPre: "batch_",
            contentId: "Content-Id: ",
            batchContent: "Content-Type: multipart/mixed; boundary=",
            changeSetContent: "Content-Type: application/http\nContent-Transfer-Encoding: binary ",
            batchChangeSetContentType: "Content-Type: application/json; charset=utf-8 "
        },
        onCount: function (e) {
            return e === true ? "true" : "";
        },
        onPredicate: function (pred, query, requiresCast) {
            var returnValue = "",
                val = pred.value,
                isDate = val instanceof Date;               
            ej.data.odUniOperator["contains"] = "contains";
            returnValue = ej.ODataAdaptor.prototype.onPredicate.call(this, pred, query, requiresCast);
            ej.data.odUniOperator["contains"] = "substringof";
                if (isDate)
                    returnValue = returnValue.replace(/datetime'(.*)'$/, "$1");

            return returnValue;
        },
        onEachSearch: function (e) {
			 var search = this.pvt.search || [];
			 search.push(e.key);
			 this.pvt.search = search;
		},
		onSearch: function (e) {
			 return this.pvt.search.join(" OR ");
		},
        beforeSend: function (dm, request, settings) {
 
        },
        processQuery: function (ds, query) {
            var digitsWithSlashesExp = /\/[\d*\/]*/g;
            var poppedExpand = "";
            for (var i = query._expands.length - 1; i > 0; i--) {
                if (poppedExpand.indexOf(query._expands[i]) >= 0) { // If current expand is child of previous
                    query._expands.pop(); // Just remove it because its in the expand already
                }
                else {
                    if (digitsWithSlashesExp.test(query._expands[i])) { //If expanded to subentities
                        poppedExpand = query._expands.pop();
                        var r = poppedExpand.replace(digitsWithSlashesExp, "($expand="); //Rewrite into odata v4 expand
                        for (var j = 0; j < poppedExpand.split(digitsWithSlashesExp).length - 1; j++) {
                            r = r + ")"; // Add closing brackets
                        }
                        query._expands.unshift(r); // Add to the front of the array
                        i++;
                    }
                }
            }
            return ej.ODataAdaptor.prototype.processQuery.apply(this, [ds, query]);
        },
        processResponse: function (data, ds, query, xhr, request, changes) {
            var pvt = request && request.ejPvtData;
            if (xhr && xhr.getResponseHeader("Content-Type") && xhr.getResponseHeader("Content-Type").indexOf("xml") != -1 && data.nodeType == 9)
                return query._requiresCount ? { result: [], count: 0 } : [];
            if (request && this.options.batch && request.url.endsWith(this.options.batch) && request.type.toLowerCase() === "post") {
                var guid = xhr.getResponseHeader("Content-Type"), cIdx, jsonObj;
                guid = guid.substring(guid.indexOf("=batchresponse") + 1);
                data = data.split(guid);
                if (data.length < 2) return;

                data = data[1];
                var exVal = /(?:\bContent-Type.+boundary=)(changesetresponse.+)/i.exec(data);
                data.replace(exVal[0], "");

                var changeGuid = exVal[1];
                data = data.split(changeGuid);

                for (var i = data.length; i > -1; i--) {
                   if (!/\bContent-ID:/i.test(data[i]) || !/\bHTTP.+201/.test(data[i]))
                        continue;

                    cIdx = parseInt(/\bContent-ID: (\d+)/i.exec(data[i])[1]);

                    if (changes.added[cIdx]) {
                        jsonObj = p.parseJson(/^\{.+\}/m.exec(data[i])[0]);
                        $.extend(changes.added[cIdx], this.processResponse(jsonObj));
                    }
                }
                return changes;
           }
            var count = null, aggregateResult = {};
            if (query && query._requiresCount)
                if ('@odata.count' in data) count = data['@odata.count'];

            data = ej.isNullOrUndefined(data.value) ? data : data.value;
           if (pvt && pvt.aggregates && pvt.aggregates.length) {
               var agg = pvt.aggregates, args = {}, fn, res = {};
               for (var i = 0; i < agg.length; i++) {
                   fn = ej.aggregates[agg[i].type];
                   if (fn)
                       res[agg[i].field + " - " + agg[i].type] = fn(data, agg[i].field);
               }
               aggregateResult = res;
           }
            if (pvt && pvt.groups && pvt.groups.length) {
                var groups = pvt.groups;
                for (var i = 0; i < groups.length; i++) {
                    var format = getColFormat(groups[i], query.queries);
                    data = ej.group(data, groups[i], pvt.aggregates, format);
                }
            }
            return isNull(count) ? data : { result: data, count: count, aggregates: aggregateResult };
        },
    });
    ej.JsonAdaptor = new ej.Adaptor().extend({
        processQuery: function (ds, query) {
            var result = ds.dataSource.json.slice(0), count = result.length, cntFlg = true, ret, key, agg = {};

            for (var i = 0; i < query.queries.length; i++) {
                key = query.queries[i];
                ret = this[key.fn].call(this, result, key.e, query);
                if (key.fn == "onAggregates")
                    agg[key.e.field + " - " + key.e.type] = ret;
                else
                result = ret !== undefined ? ret : result;

                if (key.fn === "onPage" || key.fn === "onSkip" || key.fn === "onTake" || key.fn === "onRange") cntFlg = false;

                if (cntFlg) count = result.length;
            }

            if (query._requiresCount) {
                result = {
                    result: result,
                    count: count,
                    aggregates: agg
                };
            }

            return result;
        },
        batchRequest: function (dm, changes, e) {
            var i;
            for (i = 0; i < changes.added.length; i++)
                this.insert(dm, changes.added[i]);
            for (i = 0; i < changes.changed.length; i++)
                this.update(dm, e.key, changes.changed[i]);
            for (i = 0; i < changes.deleted.length; i++)
                this.remove(dm, e.key, changes.deleted[i]);
            return changes;
        },
        onWhere: function (ds, e) {
            if (!ds) return ds;

            return ds.filter(function (obj) {
                return e.validate(obj);
            });
        },
        onAggregates: function(ds, e){
            var fn = ej.aggregates[e.type];
            if (!ds || !fn || ds.length == 0) return null;
            return fn(ds, e.field);
        },
        onSearch: function (ds, e) {
            if (!ds || !ds.length) return ds;

            if (e.fieldNames.length === 0) {
                ej.pvt.getFieldList(ds[0], e.fieldNames);
            }

            return ds.filter(function (obj) {
                for (var j = 0; j < e.fieldNames.length; j++) {
                    if (e.comparer.call(obj, ej.pvt.getObject(e.fieldNames[j], obj), e.searchKey, e.ignoreCase))
                        return true;
                }
                return false;
            });
        },
        onSortBy: function (ds, e, query) {
            if (!ds) return ds;
            var fnCompare, field = getValue(e.fieldName, query);
            if (!field)
                return ds.sort(e.comparer);

            if (field instanceof Array) {
                field = field.slice(0);

                for (var i = field.length - 1; i >= 0; i--) {
                    if (!field[i]) continue;

                    fnCompare = e.comparer;

                    if (field[i].endsWith(" desc")) {
                        fnCompare = ej.pvt.fnSort(ej.sortOrder.Descending);
                        field[i] = field[i].replace(" desc", "");
                    }

                    ds = stableSort(ds, field[i], fnCompare, []);
                }
                return ds;
            }
            return stableSort(ds, field, e.comparer, query ? query.queries : []);
        },
        onGroup: function (ds, e, query) {
            if (!ds) return ds;
            var aggQuery = filterQueries(query.queries, "onAggregates"), agg = [];
            if (aggQuery.length) {
                var tmp;
                for (var i = 0; i < aggQuery.length; i++) {
                    tmp = aggQuery[i].e;
                    agg.push({ type: tmp.type, field: getValue(tmp.field, query) });
                }
            }
            var format = getColFormat(e.fieldName, query.queries);
            return ej.group(ds, getValue(e.fieldName, query), agg, format);
        },
        onPage: function (ds, e, query) {
            var size = getValue(e.pageSize, query),
                start = (getValue(e.pageIndex, query) - 1) * size, end = start + size;

            if (!ds) return ds;

            return ds.slice(start, end);
        },
        onRange: function (ds, e) {
            if (!ds) return ds;
            return ds.slice(getValue(e.start), getValue(e.end));
        },
        onTake: function (ds, e) {
            if (!ds) return ds;

            return ds.slice(0, getValue(e.nos));
        },
        onSkip: function (ds, e) {
            if (!ds) return ds;
            return ds.slice(getValue(e.nos));
        },
        onSelect: function (ds, e) {
            if (!ds) return ds;
            return ej.select(ds, getValue(e.fieldNames));
        },
        insert: function (dm, data) {
            return dm.dataSource.json.push(data);
        },
        remove: function (dm, keyField, value, tableName) {
            var ds = dm.dataSource.json, i;
            if (typeof value === "object")
                value = ej.getObject(keyField, value);
            for (i = 0; i < ds.length; i++) {
                if (ej.getObject(keyField, ds[i]) === value) break;
            }

            return i !== ds.length ? ds.splice(i, 1) : null;
        },
        update: function (dm, keyField, value, tableName) {
            var ds = dm.dataSource.json, i, key = ej.getObject(keyField, value);

            for (i = 0; i < ds.length; i++) {
                if (ej.getObject(keyField, ds[i]) === key) break;
            }

            return i < ds.length ? $.extend(ds[i], value) : null;
        }
    });
    ej.ForeignKeyAdaptor = function (data, type) {
        var foreignObj = new ej[type || "JsonAdaptor"]().extend({
            init: function () {
                this.foreignData = [];
                this.key = [];
                this.adaptorType = type;
                this.value = [];
                this.fValue = [];
                this.keyField = [];
                var dataObj = data;
                for (var i = 0; i < dataObj.length; i++) {
                    this.foreignData[i] = dataObj[i].dataSource;
                    this.key[i] = dataObj[i].foreignKeyField;
                    this.fValue[i] = ej.isNullOrUndefined(dataObj[i].field)? dataObj[i].foreignKeyValue : dataObj[i].field + "_" + dataObj[i].foreignKeyValue;
                    this.value[i] = dataObj[i].foreignKeyValue;
                    this.keyField[i] = dataObj[i].field || dataObj[i].foreignKeyField;
                    this.initial = true;
                }
            },
            processQuery: function (ds, query) {
                var data = ds.dataSource.json;
                if (this.initial) {
                    for (var i = 0; i < data.length; i++) {
                        var proxy = this;
                        for (var j = 0; j < this.foreignData.length; j++) {
                            this.foreignData[j].filter(function (col) { //filtering the foreignKey dataSource
                                if (ej.getObject(proxy.key[j], col) == ej.getObject(proxy.keyField[j], data[i]))
                                    data[i][proxy.fValue[j]] = ej.getObject(proxy.value[j], col);
                            });
                        }
                    }
                    this.initial = false;
                }
                return this.base.processQuery.apply(this, [ds, query]);
            },
            setValue: function (value) {
                for (var i = 0; i < this.foreignData.length; i++) {
                    var proxy = this;
                    var keyValue = value[this.fValue[i]];
                    if (typeof keyValue == "string" && !isNaN(keyValue))
                        keyValue = ej.parseFloat(keyValue);
                    var data = $.grep(proxy.foreignData[i], function (e) {
                        return e[proxy.value[i]] == keyValue;
                    })[0];
                    if (ej.isNullOrUndefined(data)) {
                        data = $.grep(proxy.foreignData[i], function (e) {
                            return e[proxy.key[i]] == keyValue;
                        })[0];
                        if (ej.getObject(this.value[i], data) != undefined)
                            ej.createObject(proxy.value[i], ej.getObject(this.value[i], data), value);
                    }
                    if (ej.getObject(this.value[i], data) != undefined)
                        ej.createObject(this.keyField[i], ej.getObject(this.key[i], data), value);
                }
            },
            insert: function (dm, data, tableName) {
                this.setValue(data);
                return {
                    url: dm.dataSource.insertUrl || dm.dataSource.crudUrl || dm.dataSource.url,
                    data: JSON.stringify({
                        value: data,
                        table: tableName,
                        action: "insert"
                    })
                };
            },
            update: function (dm, keyField, value, tableName) {
                this.setValue(value);
                ej.JsonAdaptor.prototype.update(dm, keyField, value, tableName);
                return {
                    type: "POST",
                    url: dm.dataSource.updateUrl || dm.dataSource.crudUrl || dm.dataSource.url,
                    data: JSON.stringify({
                        value: value,
                        action: "update",
                        keyColumn: keyField,
                        key: value[keyField],
                        table: tableName
                    })
                };
            }
        });
        $.extend(this, new foreignObj());
        return this;
    }
    ej.remoteSaveAdaptor = new ej.JsonAdaptor().extend({
        beforeSend: ej.UrlAdaptor.prototype.beforeSend,
        insert: ej.UrlAdaptor.prototype.insert,
        update: ej.UrlAdaptor.prototype.update,
        remove: ej.UrlAdaptor.prototype.remove,
        addParams: ej.UrlAdaptor.prototype.addParams,
        batchRequest: function (dm, changes, e, query) { 
			var res = {
                changed: changes.changed,
                added: changes.added,
                deleted: changes.deleted,
                action: "batch",
                table: e.url,
                key: e.key
            };
            if (query)
                this.addParams({ dm: dm, query: query, params: query._params, reqParams: res });
            return {
                type: "POST",
                url: dm.dataSource.batchUrl || dm.dataSource.crudUrl || dm.dataSource.url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify(res)
            };
        },
         processResponse: function (data, ds, query, xhr, request, changes, key) {
			if(!ej.isNullOrUndefined(changes)){
            var i;
            for (i = 0; i < changes.added.length; i++)
                ej.JsonAdaptor.prototype.insert(ds, changes.added[i]);
            for (i = 0; i < changes.changed.length; i++)
                ej.JsonAdaptor.prototype.update(ds, key, changes.changed[i]);
            for (i = 0; i < changes.deleted.length; i++)
                ej.JsonAdaptor.prototype.remove(ds, key, changes.deleted[i]);
            return this.base.processResponse.apply(this, [data, ds, query, xhr, request, changes]);
             }
            else{
                if (data.d)
               return data.d;
            return data;
            }
        }
    });
    ej.WebApiAdaptor = new ej.ODataAdaptor().extend({
        insert: function (dm, data, tableName) {
            return {
                type: "POST",
                url: dm.dataSource.url,
                data: JSON.stringify(data)
            };
        },
        remove: function (dm, keyField, value, tableName) {
            return {
                type: "DELETE",
                url: dm.dataSource.url + "/" + value,
                data: JSON.stringify(value)
            };
        },
        update: function (dm, keyField, value, tableName) {
            return {
                type: "PUT",
                url: dm.dataSource.url,
                data: JSON.stringify(value)
            };
        },
		batchRequest: function (dm, changes, e) {
            var initialGuid = e.guid = ej.getGuid(oData.batchPre);
            var req = [];

		    //insertion 
		
			$.each(changes.added, function (i, d) {
			    req.push('--' + initialGuid);
			    req.push('Content-Type: application/http; msgtype=request', '');
			    req.push('POST' + ' ' + dm.dataSource.insertUrl + ' HTTP/1.1');
			    req.push('Content-Type: ' + 'application/json; charset=utf-8');
			    req.push('Host: ' + location.host);
			    req.push('', d ? JSON.stringify(d) : '');
			});
			
			//updation
			$.each(changes.changed, function (i, d) {
			    req.push('--' + initialGuid);
			    req.push('Content-Type: application/http; msgtype=request', '');
			    req.push('PUT' + ' ' + dm.dataSource.updateUrl + ' HTTP/1.1');
			    req.push('Content-Type: ' + 'application/json; charset=utf-8');
			    req.push('Host: ' + location.host);
			    req.push('', d ? JSON.stringify(d) : '');
			});
			
			//deletion
			$.each(changes.deleted, function (i, d) {
			    req.push('--' + initialGuid);
                req.push('Content-Type: application/http; msgtype=request', '');
                req.push('DELETE' + ' ' + dm.dataSource.removeUrl +"/"+ d[e.key] + ' HTTP/1.1');
                req.push('Content-Type: ' + 'application/json; charset=utf-8');
                req.push('Host: ' + location.host);
                req.push('', d ? JSON.stringify(d) : '');		
			});
			req.push('--' + initialGuid + '--', '');
            return {
				type: 'POST',
				url: dm.dataSource.batchUrl || dm.dataSource.crudUrl || dm.dataSource.url,
                data: req.join('\r\n'),
                contentType: 'multipart/mixed; boundary="' + initialGuid + '"',
            };
        },
        processResponse: function (data, ds, query, xhr, request, changes) {

            var pvt = request && request.ejPvtData;
            if (request && request.type.toLowerCase() != "post") {
                var version = xhr && xhr.getResponseHeader("DataServiceVersion"), count = null, aggregateResult = {};
                version = (version && parseInt(version, 10)) || 2;

                if (query && query._requiresCount) {
                     if (!isNull(data.Count)) count = data.Count;
                }

                if (version < 3 && data.Items) data = data.Items;

                if (pvt && pvt.aggregates && pvt.aggregates.length) {
                    var agg = pvt.aggregates, args = {}, fn, res = {};
                    for (var i = 0; i < agg.length; i++) {
                        fn = ej.aggregates[agg[i].type];
                        if (fn)
                            res[agg[i].field + " - " + agg[i].type] = fn(data, agg[i].field);
                    }
                    aggregateResult = res;
                }
                if (pvt && pvt.groups && pvt.groups.length) {
                    var groups = pvt.groups;
                    for (var i = 0; i < groups.length; i++) {
                        var format = getColFormat(groups[i], query.queries);
                        data = ej.group(data, groups[i], pvt.aggregates, format);
                    }
                }
                return isNull(count) ? data : { result: data, count: count, aggregates: aggregateResult };
            }
        }
    });
    var getValue = function (value, inst) {
        if (typeof value === "function")
            return value.call(inst || {});
        return value;
    }

    ej.TableModel = function (name, jsonArray, dataManager, modelComputed) {
        if (!instance(this, ej.TableModel))
            return new ej.TableModel(jsonArray);

        if (!instance(jsonArray, Array))
            throwError("ej.TableModel - Json Array is required");

        var rows = [], model, dirtyFn = $proxy(setDirty, this);

        for (var i = 0; i < jsonArray.length; i++) {
            model = new ej.Model(jsonArray[i], this);
            model.state = "unchanged";
            model.on("stateChange", dirtyFn);
            if (modelComputed)
                model.computes(modelComputed);
            rows.push(model);
        }

        this.name = name || "table1";

        this.rows = ej.NotifierArray(rows);
        this._deleted = [];

        this._events = $({});

        this.dataManager = dataManager;

        this._isDirty = false;

        return this;
    };

    ej.TableModel.prototype = {
        on: function (eventName, handler) {
            this._events.on(eventName, handler);
        },

        off: function (eventName, handler) {
            this._events.off(eventName, handler);
        },

        setDataManager: function (dataManager) {
            this.dataManagar = dataManager;
        },

        saveChanges: function () {
            if (!this.dataManager || !instance(this.dataManager, ej.DataManager))
                throwError("ej.TableModel - saveChanges : Set the dataManager using setDataManager function");

            if (!this.isDirty())
                return;

            var promise = this.dataManager.saveChanges(this.getChanges(), this.key, this.name);

            promise.done($proxy(function (changes) {
                var rows = this.toArray();
                for (var i = 0; i < rows.length; i++) {
                    if (rows.state === "added") {
                        rows.set(this.key, changes.added.filter(function (e) {
                            return e[this.key] === rows.get(this.key);
                        })[0][this.key]);
                    }
                    rows[i].markCommit();
                }

                this._events.triggerHandler({ type: "save", table: this });

            }, this));

            promise.fail($proxy(function (e) {
                this.rejectChanges();
                this._events.triggerHandler({ type: "reject", table: this, error: e });
            }, this));

            this._isDirty = false;
        },

        rejectChanges: function () {
            var rows = this.toArray();
            for (var i = 0; i < rows.length; i++)
                rows[i].revert(true);

            this._isDirty = false;
            this._events.triggerHandler({ type: "reject", table: this });
        },

        insert: function (json) {
            var model = new ej.Model(json);
            model._isDirty = this._isDirty = true;

            this.rows.push(model);

            this._events.triggerHandler({ type: "insert", model: model, table: this });
        },

        update: function (value) {
            if (!this.key)
                throwError("TableModel - update : Primary key should be assigned to TableModel.key");

            var row = value, model, key = this.key, keyValue = row[key];

            model = this.rows.array.filter(function (obj) {
                return obj.get(key) === keyValue;
            });

            model = model[0];

            for (var col in row) {
                model.set(col, row[col]);
            }

            this._isDirty = true;

            this._events.triggerHandler({ type: "update", model: model, table: this });
        },

        remove: function (key) {
            if (!this.key)
                throwError("TableModel - update : Primary key should be assigned to TableModel.key");

            var field = this.key;

            var index = -1, model;

            if (key && typeof key === "object") {
                key = key[field] !== undefined ? key[field] : key.get(field);
            }

            for (var i = 0; i < this.rows.length() ; i++) {
                if (this.rows.array[i].get(field) === key) {
                    index = i;
                    break;
                }
            }

            if (index > -1) {
                model = this.rows.removeAt(index);
                model.markDelete();

                this._deleted.push({ model: model, position: index });

                this._isDirty = true;
                this._events.triggerHandler({ type: "remove", model: model, table: this });
            }
        },

        isDirty: function () {
            return this._isDirty;
        },

        getChanges: function () {

            var changes = {
                added: [],
                changed: []
            };
            var rows = this.toArray();
            for (var i = 0; i < rows.length; i++) {
                if (changes[rows[i].state])
                    changes[rows[i].state].push(rows[i].json);
            }

            changes.deleted = ej.select(this._deleted, ["model"]);

            return changes;
        },

        toArray: function () {
            return this.rows.toArray();
        },

        setDirty: function (dirty, model) {
            if (this._isDirty === !!dirty) return;

            this._isDirty = !!dirty;

            this._events.triggerHandler({ type: "dirty", table: this, model: model });
        },
        get: function (index) {
            return this.rows.array[index];
        },
        length: function () {
            return this.rows.array.length;
        },

        bindTo: function (element) {
            var marker = tDiv, template = $(element.html()), rows = this.toArray(), cur;
            if ($.inArray(element.prop("tagName").toLowerCase(), ["table", "tbody"]))
                marker = tTR;

            marker.insertBefore(element);
            element.detach().empty();

            for (var i = 0; i < rows.length; i++) {
                cur = template.clone();
                rows[i].bindTo(cur);
                element.append(cur);
            }

            element.insertAfter(marker);
            marker.remove();
        }
    };

    var tDiv = doc ? $(document.createElement("div")) : {},
        tTR = doc ? $(document.createElement("tr")) : {};

    ej.Model = function (json, table, name) {
        if (typeof table === "string") {
            name = table;
            table = null;
        }
        this.$id = getUid("m");

        this.json = json;
        this.table = table instanceof ej.TableModel ? table : null;
        this.name = name || (this.table && this.table.name);
        this.dataManager = (table instanceof ej.DataManager) ? table : table.dataManagar;
        this.actual = {};
        this._events = $({});
        this.isDirty = false;
        this.state = "added";
        this._props = [];
        this._computeEls = {};
        this._fields = {};
        this._attrEls = {};
        this._updates = {};
        this.computed = {};
    };

    ej.Model.prototype = {
        computes: function (value) {
            $.extend(this.computed, value);
        },
        on: function (eventName, handler) {
            this._events.on(eventName, handler);
        },
        off: function (eventName, handler) {
            this._events.off(eventName, handler);
        },
        set: function (field, value) {
            var obj = this.json, actual = field, prev;
            field = field.split('.');

            for (var i = 0; i < field.length - 1; i++) {
                field = field[0];
                obj = obj[field[0]];
            }

            this.isDirty = true;
            this.changeState("changed", { from: "set" });

            prev = obj[field];

            if (this.actual[field] === undefined && !(field in this.actual))
                this.actual[field] = value; // Complex property ?

            obj[field] = value;

            this._updateValues(field, value);
            this._events.triggerHandler({ type: actual, current: value, previous: prev, model: this });
        },
        get: function (field) {
            return ej.pvt.getObject(field, this.json);
        },
        revert: function (suspendEvent) {
            for (var prop in this.actual) {
                this.json[prop] = this.actual[prop];
            }

            this.isDirty = false;

            if (suspendEvent)
                this.state = "unchanged";
            else
                this.changeState("unchanged", { from: "revert" });
        },
        save: function (dm, key) {
            dm = dm || this.dataManagar;
            key = key || dm.dataSource.key;
            if (!dm) throwError("ej.Model - DataManager is required to commit the changes");
            if (this.state === "added") {
                return dm.insert(this.json, this.name).done(ej.proxy(function (e) {
                    $.extend(this.json, e.record);
                }, this));
            }
            else if (this.state === "changed") {
                return dm.update(key, this.json, this.name);
            }
            else if (this.state === "deleted") {
                return dm.remove(key, this.json, this.name);
            }
        },
        markCommit: function () {
            this.isDirty = false;
            this.changeState("unchanged", { from: "commit" });
        },
        markDelete: function () {
            this.changeState("deleted", { from: "delete" });
        },
        changeState: function (state, args) {
            if (this.state === state) return;

            if (this.state === "added") {
                if (state === "deleted")
                    state = "unchanged";
                else return;
            }

            var prev = state;
            args = args || {};

            this.state = state;
            this._events.triggerHandler($.extend({ type: "stateChange", current: state, previous: prev, model: this }, args));
        },
        properties: function () {
            if (this._props.length)
                return this._props;

            for (var pr in this.json) {
                this._props.push(pr);
                this._updates[pr] = { read: [], input: [] };
            }

            return this._props;
        },
        bindTo: function (element) {
            var el = $(element), ctl, field,
                elements = el.find("[ej-observe], [ej-computed], [ej-prop]"), len = elements.length;

            el.data("ejModel", this);
            var unbindData = { fields: [], props: [], computes: [] };
            for (var i = 0; i < len; i++) {
                ctl = elements.eq(i);

                field = ctl.attr("ej-prop");
                if (field) {
                    this._processAttrib(field, ctl, unbindData);
                }
                field = ctl.attr("ej-observe");
                if (field && this._props.indexOf(field) !== -1) {
                    this._processField(ctl, field, unbindData);
                    continue;
                }

                field = ctl.attr("ej-computed");
                if (field) {
                    this._processComputed(field, ctl, unbindData);
                    continue;
                }
            }
            el.data("ejModelBinding" + this.$id, unbindData);
        },
        unbind: function (element) {
            var tmp, data = {
                props: this._attrEls,
                computes: this._computeEls
            }, isCustom = false;

            if (element) {
                data = $(element).removeData("ejModel").data("ejModelBinding" + this.$id) || data;
                isCustom = true;
            }

            for (var p in this.computed) {
                tmp = data.computes[p], p = this.computed[p];
                if (tmp && p.deps) {
                    this.off(p.deps.join(' '), tmp.handle);
                    if (isCustom)
                        delete this._computeEls[p];
                }
            }
            if (!isCustom)
                this._computeEls = {};

            for (var p in data.props) {
                tmp = data.props[p];
                if (tmp) {
                    this.off(tmp.deps.join(' '), tmp.handle);
                    delete data.props[p];
                    if (isCustom)
                        delete this._attrEls[p];
                }
            }
            if (!isCustom)
                this._attrEls = {};

            if (data.fields && data.fields.length) {
                var len = data.fields.length, ctl, idx, ty;
                for (var i = 0; i < len; i++) {
                    ctl = data.fields[i];
                    $(ctl).off("change", null, this._changeHandler);

                    ty = this.formElements.indexOf(ctl.tagName.toLowerCase()) !== -1 ? "input" : "read";
                    idx = this._updates[ty].indexOf(ctl);
                    if (idx !== -1)
                        this._updates[ty].splice(idx, 1);
                }
            }
        },
        _processComputed: function (value, element, data) {
            if (!value) return;

            var val, deps, safeVal = safeStr(value),
            type = this.formElements.indexOf(element[0].tagName.toLowerCase()) !== -1 ? "val" : "html";

            if (!this.computed[value] || !this.computed[safeVal]) {
                this.computed[safeVal] = {
                    value: new Function("var e = this; return " + value),
                    deps: this._generateDeps(value)
                }
                value = safeVal;
            }

            val = this.computed[value];
            if (!val.get) {
                val.get = function () {
                    val.value.call(this.json);
                }
            }

            deps = val.deps;
            val = val.value;

            this._updateDeps(deps);
            this._updateElement(element, type, val);

            val = { el: element, handle: $proxy(this._computeHandle, this, { value: value, type: type }) };
            this._computeEls[value] = val;
            data.computes[value] = val;

            this.on(deps.join(' '), val.handle);
        },
        _computeHandle: function (e) {
            var el = this._computeEls[e.value];
            if (el && this.computed[e.value])
                this._updateElement(el.el, e.type, this.computed[e.value].value);
        },
        _updateElement: function (el, type, val) {
            el[type](val.call($.extend({}, this.json, this.computed)));
        },
        _updateDeps: function (deps) {
            for (var i = 0; i < deps.length; i++) {
                if (!(deps[i] in this.json) && deps[i] in this.computed)
                    ej.merge(deps, this.computed[deps[i]].deps);
            }
        },
        _generateDeps: function (value) {
            var splits = value.replace(/(^e\.)|( e\.)/g, '#%^*##ej.#').split("#%^*#"),
                field, deps = [];

            for (var i = 0; i < splits.length; i++) {
                if (splits[i].startsWith("#ej.#")) {
                    field = splits[i].replace("#ej.#", "").split(' ')[0];
                    if (field && this._props.indexOf(field) !== -1)
                        deps.push(field);
                }
            }

            return deps;
        },
        _processAttrib: function (value, el, data) {
            var prop, val, res = {};
            value = value.replace(/^ +| +$/g, "").split(";");
            for (var i = 0; i < value.length; i++) {
                value[i] = value[i].split(":");
                if (value[i].length < 2) continue;

                prop = value[i][0].replace(/^ +| +$/g, "").replace(/^'|^"|'$|"$/g, "");
                res[prop] = value[i][1].replace(/^ +| +$/g, "").replace(/^'|^"|'$|"$/g, "");
            }
            value = res;
            var deps = [];
            for (prop in value)
                deps.push(value[prop]);

            this._updateDeps(deps);
            this._updateProps(el, value);

            res = getUid("emak");
            val = { el: el, handle: $proxy(this._attrHandle, this, res), value: value, deps: deps };
            el.prop("ejmodelattrkey", res);

            data.props[res] = val;
            this._attrEls[res] = val;

            this.on(deps.join(' '), val.handle);
        },
        _attrHandle: function (res) {
            var el = this._attrEls[res];
            if (el)
                this._updateProps(el.el, el.value);
        },
        _updateProps: function (element, value) {
            var json = this.json, t, c = this.computed;
            for (var prop in value) {
                t = value[prop];
                if (t in json)
                    t = json[t];
                else if (t in c) {
                    t = c[t];
                    if (t) {
                        t = t.value.call($.extend({}, this.json, c));
                    }
                }

                if (!isNull(t)) {
                    element.prop(prop, t);
                }
            }
        },
        _updateValues: function (prop, value) {
            var arr = this._updates[prop];

            if (!arr || (!arr.read && !arr.input)) return;

            this._ensureItems(arr.read, "html", value);
            this._ensureItems(arr.input, "val", value);
        },
        _ensureItems: function (a, type, value) {
            if (!a) return;

            for (var i = a.length - 1; i > -1; i--) {
                if (!a[i].offsetParent) {
                    a.splice(i, 1);
                    continue;
                }
                $(a[i])[type](value);
            }
        },
        _changeHandler: function (e) {
            e.data.self.set(e.data.prop, $(this).val());
        },
        _processField: function (ctl, field, data) {
            var e = { self: this, prop: field }, val = this.get(field);

            data.fields.push(ctl[0]);

            if (this.formElements.indexOf(ctl[0].tagName.toLowerCase()) === -1) {
                ctl.html(val);
                return this._updates[field].read.push(ctl[0]);
            }

            ctl.val(val)
                    .off("change", null, this._changeHandler)
                    .on("change", null, e, this._changeHandler);

            return this._updates[field].input.push(ctl[0]);
        },
        formElements: ["input", "select", "textarea"]
    };

    var safeReg = /[^\w]+/g;
    var safeStr = function (value) {
        return value.replace(safeReg, "_");
    };
    var setDirty = function (e) {
        this.setDirty(true, e.model);
    };

    ej.Predicate = function (field, operator, value, ignoreCase) {
        if (!(this instanceof ej.Predicate))
            return new ej.Predicate(field, operator, value, ignoreCase);

        if (typeof field === "string") {
            this.field = field;
            this.operator = operator;
            this.value = value;
            this.ignoreCase = ignoreCase;
            this.isComplex = false;

            this._comparer = ej.data.fnOperators.processOperator(this.operator);

        } else if (field instanceof ej.Predicate && value instanceof ej.Predicate || value instanceof Array) {
            this.isComplex = true;
            this.condition = operator.toLowerCase();
            this.predicates = [field];
            if (value instanceof Array)
                [].push.apply(this.predicates, value);
            else
                this.predicates.push(value);
        }
        return this;
    };

    ej.Predicate.and = function () {
        return pvtPredicate._combinePredicates([].slice.call(arguments, 0), "and");
    };

    ej.Predicate.or = function () {
        return pvtPredicate._combinePredicates([].slice.call(arguments, 0), "or");
    };

    ej.Predicate.fromJSON = function (json) {
        if (instance(json, Array)) {
            var res = [];
            for (var i = 0, len = json.length; i < len; i++)
                res.push(pvtPredicate._fromJSON(json[i]));
            return res;
        }

        return pvtPredicate._fromJSON(json);
    };

    // Private fn
    var pvtPredicate = {
        _combinePredicates: function (predicates, operator) {
            if (!predicates.length) return undefined;
            if (predicates.length === 1) {
                if (!instance(predicates[0], Array))
                    return predicates[0];
                predicates = predicates[0];
            }
            return new ej.Predicate(predicates[0], operator, predicates.slice(1));
        },

        _combine: function (pred, field, operator, value, condition, ignoreCase) {
            if (field instanceof ej.Predicate)
                return ej.Predicate[condition](pred, field);

            if (typeof field === "string")
                return ej.Predicate[condition](pred, new ej.Predicate(field, operator, value, ignoreCase));

            return throwError("Predicate - " + condition + " : invalid arguments");
        },

        _fromJSON: function (json) {

            if (!json || instance(json, ej.Predicate))
                return json;

            var preds = json.predicates || [], len = preds.length, predicates = [], result;

            for (var i = 0; i < len; i++)
                predicates.push(pvtPredicate._fromJSON(preds[i]));                     

            if(!json.isComplex)
                result = new ej.Predicate(json.field, json.operator, ej.parseJSON({ val: json.value }).val, json.ignoreCase);
            else
                result = new ej.Predicate(predicates[0], json.condition, predicates.slice(1));

            return result;
        }
    };

    ej.Predicate.prototype = {
        and: function (field, operator, value, ignoreCase) {
            return pvtPredicate._combine(this, field, operator, value, "and", ignoreCase);
        },
        or: function (field, operator, value, ignoreCase) {
            return pvtPredicate._combine(this, field, operator, value, "or", ignoreCase);
        },
        validate: function (record) {
            var p = this.predicates, isAnd, ret;

            if (!this.isComplex) {
                return this._comparer.call(this, ej.pvt.getObject(this.field, record), this.value, this.ignoreCase);
            }

            isAnd = this.condition === "and";

            for (var i = 0; i < p.length; i++) {
                ret = p[i].validate(record);
                if (isAnd) {
                    if (!ret) return false;
                } else {
                    if (ret) return true;
                }
            }

            return isAnd;
        },
        toJSON: function () {
            var predicates, p;
            if (this.isComplex) {
                predicates = [], p = this.predicates;
                for (var i = 0; i < p.length; i++)
                    predicates.push(p[i].toJSON());
            }
            return {
                isComplex: this.isComplex,
                field: this.field,
                operator: this.operator,
                value: this.value,
                ignoreCase: this.ignoreCase,
                condition: this.condition,
                predicates: predicates
            }
        }
    };

    ej.dataUtil = {
        swap: function (array, x, y) {
            if (x == y) return;

            var tmp = array[x];
            array[x] = array[y];
            array[y] = tmp;
        },

        mergeSort: function (jsonArray, fieldName, comparer) {
            if (!comparer || typeof comparer === "string")
                comparer = ej.pvt.fnSort(comparer, true);

            if (typeof fieldName === "function") {
                comparer = fieldName;
                fieldName = null;
            }

            return ej.pvt.mergeSort(jsonArray, fieldName, comparer);
        },

        max: function (jsonArray, fieldName, comparer) {
            if (typeof fieldName === "function") {
                comparer = fieldName;
                fieldName = null;
            }

            return ej.pvt.getItemFromComparer(jsonArray, fieldName, comparer || ej.pvt.fnDescending);
        },

        min: function (jsonArray, fieldName, comparer) {
            if (typeof fieldName === "function") {
                comparer = fieldName;
                fieldName = null;
            }

            return ej.pvt.getItemFromComparer(jsonArray, fieldName, comparer || ej.pvt.fnAscending);
        },

        distinct: function (json, fieldName, requiresCompleteRecord) {
            var result = [], val, tmp = {};
            for (var i = 0; i < json.length; i++) {
                val = getVal(json, fieldName, i);
                if (!(val in tmp)) {
                    result.push(!requiresCompleteRecord ? val : json[i]);
                    tmp[val] = 1;
                }
            }
            return result;
        },

        sum: function (json, fieldName) {
            var result = 0, val, castRequired = typeof getVal(json, fieldName, 0) !== "number";

            for (var i = 0; i < json.length; i++) {
                val = getVal(json, fieldName, i);
                if (!isNaN(val) && val !== null) {
                    if (castRequired)
                       val = +val;
                   result += val;
                }
            }
            return result;
        },

        avg: function (json, fieldName) {
            return ej.sum(json, fieldName) / json.length;
        },

        select: function (jsonArray, fields) {
            var newData = [];

            for (var i = 0; i < jsonArray.length; i++) {
                newData.push(ej.pvt.extractFields(jsonArray[i], fields));
            }

            return newData;
        },

        group: function (jsonArray, field, agg, format,/* internal */ level,groupDs) {
            level = level || 1;

            if (jsonArray.GROUPGUID == ej.pvt.consts.GROUPGUID) {
                for (var j = 0; j < jsonArray.length; j++) {
                    if(!ej.isNullOrUndefined(groupDs)){
                        var indx = -1;
                        var temp = $.grep(groupDs,function(e){return e.key==jsonArray[j].key});
                        indx = groupDs.indexOf(temp[0]);
                        jsonArray[j].items = ej.group(jsonArray[j].items, field, agg, format, jsonArray.level + 1, groupDs[indx].items);
                        jsonArray[j].count = groupDs[indx].count;
                    }
                    else{
                        jsonArray[j].items = ej.group(jsonArray[j].items, field, agg, format, jsonArray.level + 1);
                        jsonArray[j].count = jsonArray[j].items.length;
                    }  
                }

                jsonArray.childLevels += 1;
                return jsonArray;
            }

            var grouped = {}, groupedArray = [];

            groupedArray.GROUPGUID = ej.pvt.consts.GROUPGUID;
            groupedArray.level = level;
            groupedArray.childLevels = 0;
            groupedArray.records = jsonArray;

            for (var i = 0; i < jsonArray.length; i++) {
                var val = getVal(jsonArray, field, i);
                if (!ej.isNullOrUndefined(format)) val = format(val, field);

                if (!grouped[val]) {
                    grouped[val] = {
                        key: val,
                        count: 0,
                        items: [],
                        aggregates: {},
                        field: field
                    };
                    groupedArray.push(grouped[val]);
					if(!ej.isNullOrUndefined(groupDs)) {
                        var tempObj = $.grep(groupDs,function(e){return e.key==grouped[val].key});
                       grouped[val].count = tempObj[0].count
                    }
                }

                grouped[val].count = !ej.isNullOrUndefined(groupDs) ? grouped[val].count :  grouped[val].count += 1;
                grouped[val].items.push(jsonArray[i]);
            }
            if (agg && agg.length) {

                for (var i = 0; i < groupedArray.length; i++) {
                    var res = {}, fn;
                    for (var j = 0; j < agg.length; j++) {

                        fn = ej.aggregates[agg[j].type];
                        if(!ej.isNullOrUndefined(groupDs)) {
                            var temp = $.grep(groupDs,function(e){return e.key==groupedArray[i].key});
                            if(fn)
                                res[agg[j].field + " - " + agg[j].type] = fn(temp[0].items, agg[j].field);
                        }
                        else{
                            if (fn)
                                res[agg[j].field + " - " + agg[j].type] = fn(groupedArray[i].items, agg[j].field);
                        }

                    }
                    groupedArray[i]["aggregates"] = res;
                }
            }
            return groupedArray;
        },

        parseTable: function (table, headerOption, headerRowIndex) {
            var tr = table.rows, headerRow, headerTds = [], data = [], i;

            if (!tr.length) return [];

            headerRowIndex = headerRowIndex || 0;

            switch ((headerOption || "").toLowerCase()) {
                case ej.headerOption.tHead:
                    headerRow = table.tHead.rows[headerRowIndex];
                    break;
                case ej.headerOption.row:
                default:
                    headerRow = table.rows[headerRowIndex];
                    break;
            }

            var hTd = headerRow.cells;

            for (i = 0; i < hTd.length; i++)
                headerTds.push($.trim(hTd[i].innerHTML));

            for (i = headerRowIndex + 1; i < tr.length; i++) {
                var json = {}, td = tr[i].cells;
                for (var j = 0; j < td.length; j++) {
                    var temp = td[j].innerHTML;
                    if (typeof temp == "string" && $.isNumeric(temp))
                       json[headerTds[j]] = Number(temp);
				    else
                       json[headerTds[j]] = temp;
                }
                data.push(json);
            }
            return data;
        }
    };

    ej.headerOption = {
        tHead: "thead",
        row: "row"
    };

    ej.aggregates = {
        sum: function (ds, field) {
            return ej.sum(ds, field);
        },
        average: function (ds, field) {
            return ej.avg(ds, field);
        },
        minimum: function (ds, field) {
            return ej.getObject(field, ej.min(ds, field));
        },
        maximum: function (ds, field) {
            return  ej.getObject(field, ej.max(ds, field));
        },
        truecount: function (ds, field){
            var predicate = ej.Predicate(field, "equal", true);
            return ej.DataManager(ds).executeLocal(ej.Query().where(predicate)).length;
        },
        falsecount: function (ds, field) {
            var predicate = ej.Predicate(field, "equal", false);
            return ej.DataManager(ds).executeLocal(ej.Query().where(predicate)).length;
        },
        count: function (ds, field) {
            return ds.length;
        }

    };
    ej.pvt = {
        filterQueries: filterQueries,
        mergeSort: function (jsonArray, fieldName, comparer) {
            if (jsonArray.length <= 1)
                return jsonArray;

            // else list size is > 1, so split the list into two sublists
            var middle = parseInt(jsonArray.length / 2, 10);

            var left = jsonArray.slice(0, middle),
                right = jsonArray.slice(middle);

            left = ej.pvt.mergeSort(left, fieldName, comparer);
            right = ej.pvt.mergeSort(right, fieldName, comparer);

            return ej.pvt.merge(left, right, fieldName, comparer);
        },

        getItemFromComparer: function (array, field, comparer) {
            var keyVal, current, key, i = 0,castRequired = typeof getVal(array, field, 0) == "string";
            if (array.length)
            while (ej.isNullOrUndefined(keyVal) && i < array.length) {
                keyVal = getVal(array, field, i);
                key = array[i++];
            }
            for (; i < array.length; i++) {
                current = getVal(array, field, i);
                if (ej.isNullOrUndefined(current))
                    continue;
                if (castRequired) {
                    keyVal = +keyVal;
                    current = +current;
                }
                if (comparer(keyVal, current) > 0) {
                    keyVal = current;
                    key = array[i];
                }
            }
            return key;
        },

        quickSelect: function (array, fieldName, left, right, k, comparer) {
            if (left == right)
                return array[left];

            var pivotNewIndex = ej.pvt.partition(array, fieldName, left, right, comparer);

            var pivotDist = pivotNewIndex - left + 1;

            if (pivotDist == k)
                return array[pivotNewIndex];

            else if (k < pivotDist)
                return ej.pvt.quickSelect(array, fieldName, left, pivotNewIndex - 1, k, comparer);
            else
                return ej.pvt.quickSelect(array, fieldName, pivotNewIndex + 1, right, k - pivotDist, comparer);
        },

        extractFields: function (obj, fields) {
            var newObj = {};

            if (fields.length == 1)
                return ej.pvt.getObject(fields[0], obj);

            for (var i = 0; i < fields.length; i++) {
                newObj[fields[i].replace('.', ej.pvt.consts.complexPropertyMerge)] = ej.pvt.getObject(fields[i], obj);
            }

            return newObj;
        },

        partition: function (array, field, left, right, comparer) {

            var pivotIndex = parseInt((left + right) / 2, 10),
                pivot = getVal(array, field, pivotIndex);

            ej.swap(array, pivotIndex, right);

            pivotIndex = left;

            for (var i = left; i < right; i++) {
                if (comparer(getVal(array, field, i), pivot)) {
                    ej.swap(array, i, pivotIndex);
                    pivotIndex++;
                }
            }

            ej.swap(array, pivotIndex, right);

            return pivotIndex;
        },

        fnSort: function (order) {
            order = order ? order.toLowerCase() : ej.sortOrder.Ascending;

            if (order == ej.sortOrder.Ascending)
                return ej.pvt.fnAscending;

            return ej.pvt.fnDescending;
        },

        fnGetComparer: function (field, fn) {
            return function (x, y) {
                return fn(ej.pvt.getObject(field, x), ej.pvt.getObject(field, y));
            }
        },

        fnAscending: function (x, y) {
            if (y === null || y === undefined)
                return -1;

            if (typeof x === "string")
                return x.localeCompare(y);

            if (x === null || x === undefined)
                return 1;

            return x - y;
        },

        fnDescending: function (x, y) {
            if (y === null || y === undefined)
                return 1;

            if (typeof x === "string")
                return x.localeCompare(y) * -1;

            if (x === null || x === undefined)
                return -1;

            return y - x;
        },

        merge: function (left, right, fieldName, comparer) {
            var result = [], current;

            while (left.length > 0 || right.length > 0) {
                if (left.length > 0 && right.length > 0) {
                    if (comparer)
                        current = comparer(getVal(left, fieldName, 0), getVal(right, fieldName, 0)) <= 0 ? left : right;
                    else
                        current = left[0][fieldName] < left[0][fieldName] ? left : right;
                } else {
                    current = left.length > 0 ? left : right;
                }

                result.push(current.shift());
            }

            return result;
        },

        getObject: function (nameSpace, from) {
            if (!from) return undefined;
            if (!nameSpace) return from;

            if (nameSpace.indexOf('.') === -1) return from[nameSpace];

            var value = from, splits = nameSpace.split('.');

            for (var i = 0; i < splits.length; i++) {

                if (value == null) break;

                value = value[splits[i]];
            }

            return value;
        },

        createObject: function (nameSpace, value, initIn) {
            var splits = nameSpace.split('.'), start = initIn || window, from = start, i;

            for (i = 0; i < splits.length; i++) {

                if (i + 1 == splits.length)
                    from[splits[i]] = value === undefined ? {} : value;
                else if (from[splits[i]] == null)
                    from[splits[i]] = {};

                from = from[splits[i]];
            }

            return start;
        },

        getFieldList: function (obj, fields, prefix) {
            if (prefix === undefined)
                prefix = "";

            if (fields === undefined || fields === null)
                return ej.pvt.getFieldList(obj, [], prefix);

            for (var prop in obj) {
                if (typeof obj[prop] === "object" && !(obj[prop] instanceof Array))
                    ej.pvt.getFieldList(obj[prop], fields, prefix + prop + ".");
                else
                    fields.push(prefix + prop);
            }

            return fields;
        }
    };

    ej.FilterOperators = {
        lessThan: "lessthan",
        greaterThan: "greaterthan",
        lessThanOrEqual: "lessthanorequal",
        greaterThanOrEqual: "greaterthanorequal",
        equal: "equal",
        contains: "contains",
        startsWith: "startswith",
        endsWith: "endswith",
        notEqual: "notequal"
    };

    ej.data = {};

    ej.data.operatorSymbols = {
        "<": "lessthan",
        ">": "greaterthan",
        "<=": "lessthanorequal",
        ">=": "greaterthanorequal",
        "==": "equal",
        "!=": "notequal",
        "*=": "contains",
        "$=": "endswith",
        "^=": "startswith"
    };

    ej.data.odBiOperator = {
        "<": " lt ",
        ">": " gt ",
        "<=": " le ",
        ">=": " ge ",
        "==": " eq ",
        "!=": " ne ",
        "lessthan": " lt ",
        "lessthanorequal": " le ",
        "greaterthan": " gt ",
        "greaterthanorequal": " ge ",
        "equal": " eq ",
        "notequal": " ne "
    };

    ej.data.odUniOperator = {
        "$=": "endswith",
        "^=": "startswith",
        "*=": "substringof",
        "endswith": "endswith",
        "startswith": "startswith",
        "contains": "substringof"
    };

    ej.data.fnOperators = {
        equal: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return toLowerCase(actual) == toLowerCase(expected);

            return actual == expected;
        },
        notequal: function (actual, expected, ignoreCase) {
            return !ej.data.fnOperators.equal(actual, expected, ignoreCase);
        },
        lessthan: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return toLowerCase(actual) < toLowerCase(expected);

            return actual < expected;
        },
        greaterthan: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return toLowerCase(actual) > toLowerCase(expected);

            return actual > expected;
        },
        lessthanorequal: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return toLowerCase(actual) <= toLowerCase(expected);

            return actual <= expected;
        },
        greaterthanorequal: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return toLowerCase(actual) >= toLowerCase(expected);

            return actual >= expected;
        },
        contains: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return !isNull(actual) && !isNull(expected) && toLowerCase(actual).indexOf(toLowerCase(expected)) != -1;

            return !isNull(actual) && !isNull(expected) && actual.toString().indexOf(expected) != -1;
        },
        notnull: function (actual) {
            return actual !== null;
        },
        isnull: function (actual) {
            return actual === null;
        },
        startswith: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return actual && expected && toLowerCase(actual).startsWith(toLowerCase(expected));

            return actual && expected && actual.startsWith(expected);
        },
        endswith: function (actual, expected, ignoreCase) {
            if (ignoreCase)
                return actual && expected && toLowerCase(actual).endsWith(toLowerCase(expected));

            return actual && expected && actual.endsWith(expected);
        },

        processSymbols: function (operator) {
            var fnName = ej.data.operatorSymbols[operator];
            if (fnName) {
                var fn = ej.data.fnOperators[fnName];
                if (fn) return fn;
            }

            return throwError("Query - Process Operator : Invalid operator");
        },

        processOperator: function (operator) {
            var fn = ej.data.fnOperators[operator];
            if (fn) return fn;
            return ej.data.fnOperators.processSymbols(operator);
        }
    };

    ej.NotifierArray = function (array) {
        if (!instance(this, ej.NotifierArray))
            return new ej.NotifierArray(array);

        this.array = array;

        this._events = $({});
        this._isDirty = false;

        return this;
    };

    ej.NotifierArray.prototype = {
        on: function (eventName, handler) {
            this._events.on(eventName, handler);
        },
        off: function (eventName, handler) {
            this._events.off(eventName, handler);
        },
        push: function (item) {
            var ret;

            if (instance(item, Array))
                ret = [].push.apply(this.array, item);
            else
                ret = this.array.push(item);

            this._raise("add", { item: item, index: this.length() - 1 });

            return ret;
        },
        pop: function () {
            var ret = this.array.pop();

            this._raise("remove", { item: ret, index: this.length() - 1 });

            return ret;
        },
        addAt: function (index, item) {
            this.array.splice(index, 0, item);

            this._raise("add", { item: item, index: index });

            return item;
        },
        removeAt: function (index) {
            var ret = this.array.splice(index, 1)[0];

            this._raise("remove", { item: ret, index: index });

            return ret;
        },
        remove: function (item) {
            var index = this.array.indexOf(item);

            if (index > -1) {
                this.array.splice(index, 1);
                this._raise("remove", { item: item, index: index });
            }

            return index;
        },
        length: function () {
            return this.array.length;
        },
        _raise: function (e, args) {
            this._events.triggerHandler($.extend({ type: e }, args));
            this._events.triggerHandler({ type: "all", name: e, args: args });
        },
        toArray: function () {
            return this.array;
        }
    };

    $.extend(ej, ej.dataUtil);

    // For IE8
    Array.prototype.forEach = Array.prototype.forEach || function (fn, scope) {
        for (var i = 0, len = this.length; i < len; ++i) {
            fn.call(scope, this[i], i, this);
        }
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

    Array.prototype.filter = Array.prototype.filter || function (fn) {
        if (typeof fn != "function")
            throw new TypeError();

        var res = [];
        var thisp = arguments[1] || this;
        for (var i = 0; i < this.length; i++) {
            var val = this[i]; // in case fun mutates this
            if (fn.call(thisp, val, i, this))
                res.push(val);
        }

        return res;
    };

    String.prototype.endsWith = String.prototype.endsWith || function (key) {
        return this.slice(-key.length) === key;
    };

    String.prototype.startsWith = String.prototype.startsWith || function (key) {
        return this.slice(0, key.length) === key;
    };

    if (!ej.support) ej.support = {};
    ej.support.stableSort = function () {
        var res = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].sort(function () { return 0; });
		for(var i = 0; i < 17; i++){
		    if(i !== res[i]) return false;
		}
        return true;
    }();
    ej.support.cors = $.support.cors;

    if (!$.support.cors && window.XDomainRequest) {
        var httpRegEx = /^https?:\/\//i;
        var getOrPostRegEx = /^get|post$/i;
        var sameSchemeRegEx = new RegExp('^' + location.protocol, 'i');
        var xmlRegEx = /\/xml/i;

        // ajaxTransport exists in jQuery 1.5+
        $.ajaxTransport('text html xml json', function (options, userOptions, jqXHR) {
            // XDomainRequests must be: asynchronous, GET or POST methods, HTTP or HTTPS protocol, and same scheme as calling page
            if (options.crossDomain && options.async && getOrPostRegEx.test(options.type) && httpRegEx.test(userOptions.url) && sameSchemeRegEx.test(userOptions.url)) {
                var xdr = null;
                var userType = (userOptions.dataType || '').toLowerCase();
                return {
                    send: function (headers, complete) {
                        xdr = new XDomainRequest();
                        if (/^\d+$/.test(userOptions.timeout)) {
                            xdr.timeout = userOptions.timeout;
                        }
                        xdr.ontimeout = function () {
                            complete(500, 'timeout');
                        };
                        xdr.onload = function () {
                            var allResponseHeaders = 'Content-Length: ' + xdr.responseText.length + '\r\nContent-Type: ' + xdr.contentType;
                            var status = {
                                code: 200,
                                message: 'success'
                            };
                            var responses = {
                                text: xdr.responseText
                            };

                            try {
                                if (userType === 'json') {
                                    try {
                                        responses.json = JSON.parse(xdr.responseText);
                                    } catch (e) {
                                        status.code = 500;
                                        status.message = 'parseerror';
                                        //throw 'Invalid JSON: ' + xdr.responseText;
                                    }
                                } else if ((userType === 'xml') || ((userType !== 'text') && xmlRegEx.test(xdr.contentType))) {
                                    var doc = new ActiveXObject('Microsoft.XMLDOM');
                                    doc.async = false;
                                    try {
                                        doc.loadXML(xdr.responseText);
                                    } catch (e) {
                                        doc = undefined;
                                    }
                                    if (!doc || !doc.documentElement || doc.getElementsByTagName('parsererror').length) {
                                        status.code = 500;
                                        status.message = 'parseerror';
                                        throw 'Invalid XML: ' + xdr.responseText;
                                    }
                                    responses.xml = doc;
                                }
                            } catch (parseMessage) {
                                throw parseMessage;
                            } finally {
                                complete(status.code, status.message, responses, allResponseHeaders);
                            }
                        };
                        xdr.onerror = function () {
                            complete(500, 'error', {
                                text: xdr.responseText
                            });
                        };
						if(navigator.userAgent.indexOf("MSIE 9.0") != -1)
							xdr.onprogress = function() {};
                        xdr.open(options.type, options.url);
                        xdr.send(userOptions.data);
                        //xdr.send();
                    },
                    abort: function () {
                        if (xdr) {
                            xdr.abort();
                        }
                    }
                };
            }
        });
    }

    $.support.cors = true;

    ej.sortOrder = {
        Ascending: "ascending",
        Descending: "descending"
    };

    // privates
    ej.pvt.consts = {
        GROUPGUID: "{271bbba0-1ee7}",
        complexPropertyMerge: "_"
    };

    // private utils
    var nextTick = function (fn, context) {
        if (context) fn = $proxy(fn, context);
        (window.setImmediate || window.setTimeout)(fn, 0);
    };

    ej.support.enableLocalizedSort = false;

    var stableSort = function (ds, field, comparer, queries) {
        if (ej.support.stableSort) {
            if(!ej.support.enableLocalizedSort && typeof ej.pvt.getObject(field, ds[0] || {}) == "string" 
                && (comparer === ej.pvt.fnAscending || comparer === ej.pvt.fnDescending)
                && queries.filter(function(e){return e.fn === "onSortBy";}).length === 1)
                return fastSort(ds, field, comparer === ej.pvt.fnDescending);
            return ds.sort(ej.pvt.fnGetComparer(field, comparer));
        }
        return ej.mergeSort(ds, field, comparer);
    };
    var getColFormat = function (field, query) {
        var grpQuery = $.grep(query, function (args) { return args.fn == "onGroup" });
        for (var grp = 0; grp < grpQuery.length; grp++) {
            if (ej.getObject("fieldName", grpQuery[grp].e) == field) {
                return ej.getObject("fn", grpQuery[grp].e);
            }
        }
    };
    var fastSort = function(ds, field, isDesc){
        var old = Object.prototype.toString;
        Object.prototype.toString = (field.indexOf('.') === -1) ? function(){
            return this[field];
        }:function(){
            return ej.pvt.getObject(field, this);
        };
        ds = ds.sort();
        Object.prototype.toString = old;
        if(isDesc)
            ds.reverse();
    }

    var toLowerCase = function (val) {
        return val ? val.toLowerCase ? val.toLowerCase() : val.toString().toLowerCase() : (val === 0 || val === false) ? val.toString() : "";
    };

    var getVal = function (array, field, index) {
        return field ? ej.pvt.getObject(field, array[index]) : array[index];
    };

    var isHtmlElement = function (e) {
        return typeof HTMLElement === "object" ? e instanceof HTMLElement :
            e && e.nodeType === 1 && typeof e === "object" && typeof e.nodeName === "string";
    };

    var instance = function (obj, element) {
        return obj instanceof element;
    };

    var getTableModel = function (name, result, dm, computed) {
        return function (tName) {
            if (typeof tName === "object") {
                computed = tName;
                tName = null;
            }
            return new ej.TableModel(tName || name, result, dm, computed);
        };
    };

    var getKnockoutModel = function (result) {
        return function (computedObservables, ko) {
            ko = ko || window.ko;

            if (!ko) throwError("Knockout is undefined");

            var model, koModels = [], prop, ob;
            for (var i = 0; i < result.length; i++) {
                model = {};
                for (prop in result[i]) {
                    if (!prop.startsWith("_"))
                        model[prop] = ko.observable(result[i][prop]);
                }
                for (prop in computedObservables) {
                    ob = computedObservables[prop];

                    if ($.isPlainObject(ob)) {
                        if (!ob.owner) ob.owner = model;
                        ob = ko.computed(ob);
                    } else
                        ob = ko.computed(ob, model);

                    model[prop] = ob;
                }
                koModels.push(model);
            }

            return ko.observableArray(koModels);
        };
    };

    var uidIndex = 0;
    var getUid = function (prefix) {
        uidIndex += 1;
        return prefix + uidIndex;
    };

    ej.getGuid = function (prefix) {
        var hexs = '0123456789abcdef', rand;
        return (prefix || "") + '00000000-0000-4000-0000-000000000000'.replace(/0/g, function (val, i) {
            if ("crypto" in window && "getRandomValues" in crypto) {
                var arr = new Uint8Array(1)
                window.crypto.getRandomValues(arr);
                rand = arr[0] % 16|0
            }
            else rand = Math.random() * 16 | 0;
            return hexs[i === 19 ? rand & 0x3 | 0x8 : rand];
        });
    };

    var proxy = function (fn, context) {
        return function () {
            var args = [].slice.call(arguments, 0);
            args.push(this);

            return fn.apply(context || this, args);
        };
    };

    var $proxy = function (fn, context, arg) {
        if ('bind' in fn)
            return arg ? fn.bind(context, arg) : fn.bind(context);

        return function () {
            var args = arg ? [arg] : []; args.push.apply(args, arguments);
            return fn.apply(context || this, args);
        };
    };

    ej.merge = function (first, second) {
        if (!first || !second) return;

        Array.prototype.push.apply(first, second);
    };

    var isNull = function (val) {
        return val === undefined || val === null;
    };

    var throwError = function (er) {
        try {
            throw new Error(er);
        } catch (e) {
            throw e.message + "\n" + e.stack;
        }
    };

})(window.jQuery, window.Syncfusion, window.document);;
/**
* @fileOverview Plugin to drag the html elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 
    ej.widget("ejDraggable", "ej.Draggable", {
        
        element: null,

        
        model: null,
        validTags: ["div", "span", "a"],

        
        defaults: {
            
            scope: 'default', 
            
            handle: null,  
            
            dragArea: null,
            
            clone: false,
            
            distance: 1, 
			
			dragOnTaphold: false,
            
            cursorAt: { top: -1, left: -2 }, 
            
            dragStart: null, 
            
            drag: null, 
            
            dragStop: null, 
			
			create: null,
            
            destroy: null, 
            
            helper: function () {
                return $('<div class="e-drag-helper" />').html("draggable").appendTo(document.body);
            }
        },

        
        _init: function () {
            this.handler = function () { },
			this.resizables = {};
            this._wireEvents();
            this._browser = ej.browserInfo();
            this._isIE8 = this._browser.name == "msie" && this._browser.version == "8.0";
            this._isIE9 = this._browser.name == "msie" && this._browser.version == "9.0";
            //e-pinch class enables the touch mode operations in IE browsers
            this._browser.name == "msie" && this.element.addClass("e-pinch");
            this._browser.name == "edge" && this.element.css("touch-action", "none");
        },

        _setModel: function (options) {
            for (var key in options) {
                switch (key) {
                    case "dragArea":
                        this.model.dragArea = options[key];
                        break;
						case "dragOnTaphold":
                        this.model.dragOnTaphold = options[key];
                        break; 
                }
            }
        },
        
        
        _destroy: function () {
            $(document)
                .off(ej.eventType.mouseUp, this._destroyHandler)
                .off(ej.eventType.mouseUp, this._dragStopHandler)
                .off(ej.eventType.mouseMove, this._dragStartHandler)
                .off(ej.eventType.mouseMove, this._dragHandler)
                .off("mouseleave", this._dragMouseOutHandler)
                .off('selectstart', false);

            

            ej.widgetBase.droppables[this.scope] = null;
            
        },

        _initialize: function (e) {
            if( e.target && e.target.nodeName && $( e.target ).closest( "input[type='text'], textarea, select, option" ).length) return true;
            var ori = e;
			e.preventDefault();
            e = this._getCoordinate(e);
            this.target = $(ori.currentTarget);
            this._initPosition = { x: e.pageX, y: e.pageY };
            
            $(document).on(ej.eventType.mouseMove, this._dragStartHandler).on(ej.eventType.mouseUp, this._destroyHandler);
            if (!this.model.clone) {
                var _offset = this.element.offset();
                this._relXposition = e.pageX - _offset.left;
                this._relYposition = e.pageY - _offset.top;
            }
            $(document.documentElement).trigger(ej.eventType.mouseDown, ori); // The next statement will prevent 'mousedown', so manually trigger it.
           //return false;
        },
        _setDragArea: function () {
            var _dragElement = $(this.model.dragArea)[0]; if (!_dragElement) return;
            var elementArea, elementWidthBound, elementHeightBound, elementArea, direction = ["left", "right", "bottom", "top"], top, left;
            if (!ej.isNullOrUndefined(_dragElement.getBoundingClientRect)) {
                elementArea = _dragElement.getBoundingClientRect();
                elementArea.width ? elementWidthBound = elementArea.width : elementWidthBound = elementArea.right - elementArea.left;
                elementArea.height ? elementHeightBound = elementArea.height : elementHeightBound = elementArea.bottom - elementArea.top;
                for (var j = 0; j < direction.length; j++) {
                    this["border-" + direction[j] + "-width"] = isNaN(parseFloat($($(this.model.dragArea)[0]).css("border-" + direction[j] + "-width"))) ? 0 : parseFloat($($(this.model.dragArea)[0]).css("border-" + direction[j] + "-width"));
                    this["padding-" + direction[j]] = isNaN(parseFloat($($(this.model.dragArea)[0]).css("padding-" + direction[j]))) ? 0 : parseFloat($($(this.model.dragArea)[0]).css("padding-" + direction[j]));
                }
                top = $(this.model.dragArea).offset().top; left = $(this.model.dragArea).offset().left;
            } else {
                elementWidthBound = $(this.model.dragArea).outerWidth();
                elementHeightBound = $(this.model.dragArea).outerHeight();
                for (var j = 0; j < direction.length; j++) {
                    this["border-" + direction[j] + "-width"] = 0;
                    this["padding-" + direction[j]] = 0;
                }
                top = left = 0;
            }
            this._left = ej.isNullOrUndefined($(this.model.dragArea).offset()) ? 0 + this["border-left-width"] + this["padding-left"] : left + this["border-left-width"] + this["padding-left"];
            this._top = ej.isNullOrUndefined($(this.model.dragArea).offset()) ? 0 + this["border-top-width"] + this["padding-top"] : top + this["border-top-width"] + this["padding-top"];
            this._right = left + elementWidthBound - [this["border-right-width"] + this["padding-right"]];
            this._bottom = top + elementHeightBound - [this["border-bottom-width"] + this["padding-bottom"]];
        },
        _dragStart: function (e) {
            var ori = e;
            e = this._getCoordinate(e);
            this.margins = {
                left: (parseInt(this.element.css("marginLeft"), 10) || 0),
                top: (parseInt(this.element.css("marginTop"), 10) || 0),
                right: (parseInt(this.element.css("marginRight"), 10) || 0),
                bottom: (parseInt(this.element.css("marginBottom"), 10) || 0)
            };
            this.offset = this.element.offset();
            this.offset = {
                top: this.offset.top - this.margins.top,
                left: this.offset.left - this.margins.left
            };
            this.position = this._getMousePosition(ori);
            var x = this._initPosition.x - e.pageX, y = this._initPosition.y - e.pageY;
            var distance = Math.sqrt((x * x) + (y * y));

            if (distance >= this.model.distance) {
			    var ele = this.model.helper({ sender: ori, element: this.target });
				if(!ele || ej.isNullOrUndefined(ele)) return;
                var dragTargetElmnt = this.model.handle = this.helper = ele;
                if (this.model.dragStart) {
                    var currTarget = null;
                    if (ori.type == 'touchmove') {
                        var coor = ori.originalEvent.changedTouches[0];
                        currTarget = document.elementFromPoint(coor.clientX, coor.clientY);
                    }
                    else currTarget = ori.originalEvent.target || ori.target;
					if(this.model.cursorAt["top"] == 0 && this.model.cursorAt["left"] ==0)
						currTarget = this._checkTargetElement(e) || currTarget;   
                    if (this._trigger("dragStart", { event: ori, element: this.element, target: currTarget })) {
                        this._destroy();
                        return false;
                    }
                }
                if (this.model.dragArea) this._setDragArea();
                else {
                    this._left = this._top = this._right = this._bottom = 0;
                    this["border-top-width"] = this["border-left-width"] = 0;
                }
                
                var pos= dragTargetElmnt.offsetParent().offset();
                $(document).off(ej.eventType.mouseMove, this._dragStartHandler).off(ej.eventType.mouseUp, this._destroyHandler)
                    .on(ej.eventType.mouseMove, this._dragHandler).on(ej.eventType.mouseUp, this._dragStopHandler).on("mouseleave", this._dragMouseOutHandler).on("selectstart", false);
                ej.widgetBase.droppables[this.model.scope] = {
                    draggable: this.element,
                    helper: dragTargetElmnt.css({ position: 'absolute',  left: (this.position.left-pos.left), top: (this.position.top-pos.top) }),
                    destroy: this._destroyHandler
                }
            }
        },

        _drag: function (e) {
            var left, top, pageX, pageY;
			e.preventDefault();
            this.position = this._getMousePosition(e);
            if (this.position.top < 0)
                this.position.top = 0;
            if ($(document).height() < this.position.top)
                this.position.top = $(document).height();
            if ($(document).width() < this.position.left)
                this.position.left = $(document).width();
            var helperElement = ej.widgetBase.droppables[this.model.scope].helper;
            if (this.model.drag) {
                var currTarget = null;
                if (e.type == 'touchmove') {
                    var coor = e.originalEvent.changedTouches[0];
                    currTarget = document.elementFromPoint(coor.clientX, coor.clientY);
                }
                else currTarget = e.originalEvent.target || e.target;
				if(this.model.cursorAt["top"] == 0 && this.model.cursorAt["left"] ==0 )
                    currTarget = this._checkTargetElement(e)|| currTarget; 
                this._trigger("drag", { event: e, element: this.target, target: currTarget });// Raise the dragging event
            }
            var element = this._checkTargetElement(e);
            if (!ej.isNullOrUndefined(element)) {
                e.target = e.toElement = element;
                element.object._over(e); 
                this._hoverTarget = element; 
            }
            else if (this._hoverTarget) {
                e.target = e.toElement = this._hoverTarget;
                this._hoverTarget.object._out(e);
                this._hoverTarget = null;
            }
            var helperElement = ej.widgetBase.droppables[this.model.scope].helper;
			var pos= helperElement.offsetParent().offset();			 
            pageX = ej.isNullOrUndefined(e.pageX) ? e.originalEvent.changedTouches[0].pageX : e.pageX;
            pageY = ej.isNullOrUndefined(e.pageY) ? e.originalEvent.changedTouches[0].pageY : e.pageY;
            if (this.model.dragArea) {
                if (this._pageX != pageX) {
                    if (this._left > this.position.left) left = this._left;
                    else if (this._right < this.position.left + helperElement.outerWidth(true)) left = this._right - helperElement.outerWidth(true);
                    else left = this.position.left;
                }
                if (this._pageY != pageY) {
                    if (this._top > this.position.top) top = this._top;
                    else if (this._bottom < this.position.top + helperElement.outerHeight(true)) top = this._bottom - helperElement.outerHeight(true);
                    else top = this.position.top;
                }
            }
            else {
                left = this.position.left;
                top = this.position.top;
            }
            if (top < 0 || top - [pos.top + this["border-top-width"]] < 0) top = [pos.top + this["border-top-width"]];
            if (left < 0 || left - [pos.left + this["border-left-width"]] < 0) left = [pos.left + this["border-left-width"]];
            helperElement.css({ left: left - [pos.left + this["border-left-width"]], top: top - [pos.top + this["border-top-width"]] });
            this.position.left = left;
            this.position.top = top;
            this._pageX = pageX;
            this._pageY = pageY;
        },

        _dragStop: function (e) {
            if (e.type == 'mouseup' || e.type == 'touchend') 
                this._destroy(e);
            if (this.model.dragStop) {
                var currTarget = null;
                if (e.type == 'touchend') {
                if(this.model.cursorAt["top"] == 0 && this.model.cursorAt["left"] ==0)
				currTarget = e.originalEvent.target || e.target;  
                else{
                    var coor = e.originalEvent.changedTouches[0];
                    currTarget = document.elementFromPoint(coor.clientX, coor.clientY);
                }  
                }
                else currTarget = e.originalEvent.target || e.target;                
                if(this.model.cursorAt["top"] == 0 && this.model.cursorAt["left"] ==0)
                    currTarget = this._checkTargetElement(e) || currTarget;              
                this._trigger("dragStop", { event: e, element: this.target, target: currTarget });// Raise the dragstop event
            }
            this._dragEnd(e);
        },
        _dragEnd: function (e) {
            var element = this._checkTargetElement(e);
            if (!ej.isNullOrUndefined(element)) {
                e.target = e.toElement = element;
                element.object._drop(e, this.element);
            }
        },

        _dragMouseEnter: function (e) {
            $(document).off("mouseenter", this._dragMouseEnterHandler);
            if (this._isIE9)
                this._dragManualStop(e);
            else if (this._isIE8) {
                if (e.button == 0)
                    this._dragManualStop(e);
            }
            else if (e.buttons == 0)
                this._dragManualStop(e);
        },

        _dragManualStop: function (e) {
            if (this.model.dragStop != null)
                this._trigger("dragStop", { event: e, element: this.target, target: e.originalEvent.target || e.target });  // Raise the dragstop event
            this._destroy(e);
        },

        _dragMouseOut: function (e) {
            $(document).on("mouseenter", this._dragMouseEnterHandler);
        },

        _checkTargetElement:function(e)
        {
            var target ;
			if (e.type == "touchmove" || e.type == "touchstart" || e.type == "touchend" || e.type=="taphold") {
				var coor = e.originalEvent.changedTouches[0];
				target = document.elementFromPoint(coor.clientX, coor.clientY);
			}
			else
				target = e.target;
            if (this.helper && this._contains(this.helper[0], target)) {
                this.helper.hide();
                target = this._elementUnderCursor(e);
                this.helper.show();
                return this._withDropElement(target);
            }
            return this._withDropElement(target);
        },
        _withDropElement:function(target)
        {
            if (target) {
                var dropObj = $(target).data('ejDroppable');
                if (ej.isNullOrUndefined(dropObj)) dropObj = this._checkParentElement($(target));
                if (!ej.isNullOrUndefined(dropObj)) {
                    return $.extend(target, { object: dropObj });
                }
            }
        },
        _checkParentElement: function (element) {
            var target = $(element).closest('.e-droppable');
            if (target.length > 0) {
                var dropObj = $(target).data('ejDroppable');
                if (!ej.isNullOrUndefined(dropObj)) return dropObj;
            }
        },
        _elementUnderCursor:function(e){
            if(e.type == "touchmove" || e.type == "touchstart" || e.type == "touchend" || e.type=="taphold")
                return document.elementFromPoint(e.originalEvent.changedTouches[0].clientX, e.originalEvent.changedTouches[0].clientY);
            else return document.elementFromPoint(e.clientX, e.clientY);
        },
        _contains:function(parent, child) {
            try {
                return $.contains(parent, child) || parent == child;
            } catch (e) {
                    return false;
                }
        },
        _wireEvents: function () {
			if(ej.isDevice()==true && this.model.dragOnTaphold==true)
            this._on(this.element, "taphold", this._initialize);
		else
            this._on(this.element, ej.eventType.mouseDown, this._initialize);
            this._dragStartHandler = $.proxy(this._dragStart, this);
            this._destroyHandler = $.proxy(this._destroy, this);
            this._dragStopHandler = $.proxy(this._dragStop, this);
            this._dragHandler = $.proxy(this._drag, this);
            this._dragMouseEnterHandler = $.proxy(this._dragMouseEnter, this);
            this._dragMouseOutHandler = $.proxy(this._dragMouseOut, this);
        },
        _getMousePosition: function (event) {
            event = this._getCoordinate(event);
            var pageX = this.model.clone ? event.pageX : event.pageX - this._relXposition;
            var pageY = this.model.clone ? event.pageY : event.pageY - this._relYposition;
            return { left: pageX - [this.margins.left + this.model.cursorAt.left ], top: pageY - [this.margins.top + this.model.cursorAt.top ] };
        },
        _getCoordinate: function (evt) {
            var coor = evt;
            if (evt.type == "touchmove" || evt.type == "touchstart" || evt.type == "touchend" || evt.type== "taphold" && ej.browserInfo().name !="msie")
                coor = evt.originalEvent.changedTouches[0];
            return coor;
        }
    });

})(jQuery, Syncfusion);

/**
* @fileOverview Plugin to drop the html elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 
    ej.widget("ejDroppable", "ej.Droppable", {
        
        element: null,        
        model: null,
        validTags: ["div", "span", "a"],
        dropElements : [],
        defaults: {
            
            accept: null,
            
            scope: 'default',
            
            drop: null,
            
            over: null,
            
            out: null,
			
			create: null,
            
            destroy: null
        },

        
        _init: function () {
            this._mouseOver = false;
			this.dropElements.push(this);
        },

        _setModel: function (options) {

        },
        
        
        _destroy: function () {
			 $(this.element).off('mouseup', $.proxy(this._drop, this));
        },

        _over: function (e) {
            if (!this._mouseOver) {
                this._trigger("over", e);
                this._mouseOver = true;
            }
        },
        _out: function (e) {
            if (this._mouseOver) {
                this._trigger("out", e);
                this._mouseOver = false;
            }
        },
        _drop: function (e, dragElement) {
			var _target = e.target; 
			var _parents = $(_target).parents(".e-droppable");
			if($(_target).hasClass("e-droppable")) _parents.push(_target);
			for (var i =0; i< this.dropElements.length; i++ ){
				if ($(_parents).is($(this.dropElements[i].element)))
					this.dropElements[i]._dropEvent.call( this.dropElements[i], e, dragElement );
			}
        },
		_dropEvent : function (e, dragElement){
			var drag = ej.widgetBase.droppables[this.model.scope];
            var isDragged = !ej.isNullOrUndefined(drag.helper) && drag.helper.is(":visible");
			if(isDragged && e.type == "touchend") $(drag.helper).hide();
            var area = this._isDropArea(e);
			if(isDragged && e.type == "touchend") $(drag.helper).show();
            if (drag && !ej.isNullOrUndefined(this.model.drop) && isDragged && area.canDrop) {
                this.model.drop($.extend(e, { dropTarget: area.target , dragElement : dragElement }, true), drag);
            }
		},
        _isDropArea: function (e) {
            // check for touch devices only
            var area = { canDrop: true, target: $(e.target) };
            if (e.type == "touchend") {
                var coor = e.originalEvent.changedTouches[0], _target;
                _target = document.elementFromPoint(coor.clientX, coor.clientY);
                area.canDrop = false;
                var _parents = $(_target).parents();

                for (var i = 0; i < this.element.length; i++) {
                    if ($(_target).is($(this.element[i]))) area = { canDrop: true, target: $(_target) };
                    else for (var j = 0; j < _parents.length; j++) {
                        if ($(this.element[i]).is($(_parents[j]))) {
                            area = { canDrop: true, target: $(_target) };
                            break;
                        }
                    }
                    if (area.canDrop) break;
                }
            }
            return area;
        }
    });

})(jQuery, Syncfusion);

/**
* @fileOverview Plugin to resize the Html elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) { 
    ej.widget("ejResizable", "ej.resizable", {
        
        element: null,        
        model: null,
        validTags: ["div", "span", "a"],
        
        defaults: {
            
            scope: 'default',
            
            handle: null,
            
            distance: 1,
            
            maxHeight: null,
            
            maxWidth: null,
            
            minHeight: 10,
            
            minWidth: 10,
            
            cursorAt: { top: 1, left: 1 },
            
            resizeStart: null,
            
            resize: null,
            
            resizeStop: null,
			
			create: null,
            
            destroy: null,
            
            helper: function () {
                return $('<div class="e-resize-helper" />').html("resizable").appendTo(document.body);
            }
        },
        
        _init: function () {
            this.target = this.element;
            this._browser = ej.browserInfo();
            this._isIE8 = this._browser.name == "msie" && this._browser.version == "8.0";
            this._isIE9 = this._browser.name == "msie" && this._browser.version == "9.0";
            if (this.handle != null) {
                $(this.target).delegate(this.handle, ej.eventType.mouseDown, $.proxy(this._mousedown, this))
                .delegate(this.handle, 'resizestart', this._blockDefaultActions);
            }
            else {
                $(this.target).on("mousedown", $.proxy(this._mousedown, this));                                
            }
            this._resizeStartHandler = $.proxy(this._resizeStart, this);
            this._destroyHandler = $.proxy(this._destroy, this);
            this._resizeStopHandler = $.proxy(this._resizeStop, this);
            this._resizeHandler = $.proxy(this._resize, this);
            this._resizeMouseEnterHandler = $.proxy(this._resizeMouseEnter, this);
        },
        _mouseover: function (e) {
            if ($(e.target).hasClass("e-resizable")) {
                $(e.target).css({ cursor: "se-resize" });
                $(this.target).on(ej.eventType.mouseDown, $.proxy(this._mousedown, this));
            }
            else {
                $(this.target).off(ej.eventType.mouseDown);
                $(this.target).css({ cursor: "" });
            }
        },
        _blockDefaultActions: function (e) {
            e.cancelBubble = true;
            e.returnValue = false;
            if (e.preventDefault) e.preventDefault();
            if (e.stopPropagation) e.stopPropagation();
        },
        _setModel: function (options) {

        },
        _mousedown: function (e) {
            var ori = e;
            e = this._getCoordinate(e);
            this.target = $(ori.currentTarget);
            this._initPosition = { x: e.pageX, y: e.pageY };
            this._pageX = e.pageX;
            this._pageY = e.pageY;

            $(document).on(ej.eventType.mouseMove, this._resizeStartHandler).on(ej.eventType.mouseUp, this._destroyHandler);

            $(document.documentElement).trigger(ej.eventType.mouseDown, ori); // The next statement will prevent 'mousedown', so manually trigger it.
            return false;
        },

        _resizeStart: function (e) {
            if ($(e.target).hasClass("e-resizable")) {
                e = this._getCoordinate(e);
                var x = this._initPosition.x - e.pageX, y = this._initPosition.y - e.pageY, _width, _height;
                var distance = Math.sqrt((x * x) + (y * y));
                if (distance >= this.model.distance) {
                    if (this.model.resizeStart != null) 
                        if (this._trigger("resizeStart", { event: e, element: this.target }))  // Raise the resize start event
                            return;
                    var resizeTargetElmnt = this.model.helper({ element: this.target });
                    _width = (e.pageX - this._pageX) + resizeTargetElmnt.outerWidth();
                    _height = (e.pageY - this._pageY) + resizeTargetElmnt.outerHeight();
                    this._pageX = e.pageX;
                    this._pageY = e.pageY;
                    var pos = this.getElementPosition(resizeTargetElmnt);
                    $(document).off(ej.eventType.mouseMove, this._resizeStartHandler).off(ej.eventType.mouseUp, this._destroyHandler)
                        .on(ej.eventType.mouseMove, this._resizeHandler).on(ej.eventType.mouseUp, this._resizeStopHandler).on("mouseenter", this._resizeMouseEnterHandler).on("selectstart", false);
                    ej.widgetBase.resizables[this.scope] = {
                        resizable: this.target,
                        helper: resizeTargetElmnt.css({ width: _width, height: _height }),
                        destroy: this._destroyHandler
                    }
                }
            }
        },

        _resize: function (e) {
            var _width, _height, _diff;
            e = this._getCoordinate(e);
            var pos = this.getElementPosition(ej.widgetBase.resizables[this.scope].helper);
            var resizeTargetElmnt = this.model.helper({ element: this.target });
            _width = (e.pageX - this._pageX) + resizeTargetElmnt.outerWidth();
            _height = (e.pageY - this._pageY) + resizeTargetElmnt.outerHeight();
            this._pageX = e.pageX;
            this._pageY = e.pageY;
            if (_width < this.model.minWidth) {
                _diff = this.model.minWidth - _width;
                _width = this.model.minWidth;
                this._pageX = e.pageX + _diff;
            }
            if (_height < this.model.minHeight) {
                _diff = this.model.minHeight - _height;
                _height = this.model.minHeight;
                this._pageY = e.pageY + _diff;
            }
            if (this.model.maxHeight != null && _height > this.model.maxHeight) {
                _diff = _height - this.model.maxHeight;
                _height = this.model.maxHeight;
                this._pageY = e.pageY - _diff;
            }
            if (this.model.maxWidth != null && _width > this.model.maxWidth) {
                _diff = _width - this.model.maxWidth;
                _width = this.model.maxWidth;
                this._pageX = e.pageX - _diff;
            }
            ej.widgetBase.resizables[this.scope].helper.css({ width: _width, height: _height });
            this._trigger("resize", { element: this.target }) // Raise the resize event
        },

        _resizeStop: function (e) {
            if (this.model.resizeStop != null)
                this._trigger("resizeStop", { element: this.target });  // Raise the resize stop event
            if (e.type == 'mouseup' || e.type == 'touchend')
                this._destroy(e);
        },

        _resizeMouseEnter: function (e) {
            if (this._isIE9)
                this._resizeManualStop(e);
            else if (this._isIE8) {
                if (e.button == 0)
                    this._resizeManualStop(e);
            }
            else if (e.buttons == 0)
                this._resizeManualStop(e);
        },

        _resizeManualStop: function (e) {
            if (this.model.resizeStop != null)
                this._trigger("resizeStop", { element: this.target });  // Raise the resize stop event
            this._destroy(e);
        },

        
        _destroy: function (e) {
            $(document)
                .off(ej.eventType.mouseUp, this._destroyHandler)
                .off(ej.eventType.mouseUp, this._resizeStopHandler)
                .off(ej.eventType.mouseMove, this._resizeStartHandler)
                .off(ej.eventType.mouseMove, this._resizeHandler)
                .off("mouseenter", this._resizeMouseEnterHandler)
                .off('selectstart', false);            
            ej.widgetBase.resizables[this.scope] = null;
            
        },

        getElementPosition: function (elemnt) {
            if (elemnt != null && elemnt.length > 0)
                return {
                    left: elemnt[0].offsetLeft,
                    top: elemnt[0].offsetTop
                };
            else
                return null;
        },
        _getCoordinate: function (evt) {
            var coor = evt;
            if (evt.type == "touchmove" || evt.type == "touchstart" || evt.type == "touchend")
                coor = evt.originalEvent.changedTouches[0];
            return coor;
        }
    });

})(jQuery, Syncfusion);;
/**
* @fileOverview Plugin to style the Html UL elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejListBox", "ej.ListBox", {

        element: null,
        _ignoreOnPersist: ["dataSource", "query", "itemRequestCount", "fields", "create", "change", "select", "unselect", "itemDragStart", "itemDrag", "itemDragStop", "itemDrop", "checkChange", "destroy", "actionComplete", "actionFailure", "actionSuccess", "actionBegin", "itemDropped", "selected"],
        model: null,
        validTags: ["ul"],
        _setFirst: false,
        _rootCSS: "e-listbox",
        defaults: {
            itemsCount: null,
            totalItemsCount: null,
            dataSource: null,
            query: ej.Query(),
            itemRequestCount: 5,
            itemHeight:null,
            fields: {
                id: null,
                text: null,
                imageUrl: null,
                imageAttributes: null,
                spriteCssClass: null,
                htmlAttributes: null,
                tooltipText: null,
                selectBy: null,
                checkBy: null,
                groupBy: null,
                tableName: null,

                //deprecated field properties
                selected: null,
                category: null,
                toolTipText: null
            },
            height: "auto",
            width: "200",
            template: null,
            text: "",
            selectedIndex: null,
            checkedIndices: [],
            selectedIndices: [],
            cascadeTo: null,
            value: "",
            cssClass: "",
            targetID: null,
            htmlAttributes: {},
            showRoundedCorner: false,
            enableRTL: false,
            enabled: true,
            showCheckbox: false,
            allowVirtualScrolling: false,
            virtualScrollMode: "normal",
            enablePersistence: false,
            allowMultiSelection: false,
            allowDrag: false,
            allowDrop: false,
            enableIncrementalSearch: false,
            enableWordWrap:true,
            caseSensitiveSearch: false,
            loadDataOnInit: true,
            create: null,
            change: null,
            select: null,
            unselect: null,
            itemDragStart: null,
            itemDrag: null,
            itemDragStop: null,
            itemDrop: null,
            checkChange: null,
            destroy: null,
            actionComplete: null,
            actionSuccess: null,
            actionBeforeSuccess:null,
            focusIn:null,
            focusOut:null,
            actionFailure: null,
            actionBegin: null,
			cascade: null,
            sortOrder: "none",

            //Deprecated Members
            enableVirtualScrolling: false,
            checkAll: false,
            uncheckAll: false,
            enableLoadOnDemand: false,
            itemRequest: null,
            allowDragAndDrop: undefined,
            selectedItemIndex: null,
            enableItemsByIndex: null,
            checkItemsByIndex: null,
            disableItemsByIndex: null,
            uncheckItemsByIndex: null,
            itemDropped: null,
            selected: null,
            selectIndexChanged: null,
            selectedItems: [],
            checkedItems: [],
            checkedItemlist: [],
            selectedItemlist: [],
        },
        dataTypes: {
            cssClass: "string",
            itemsCount: "number",
            itemRequestCount: "number",
            allowDrag: "boolean",
            allowDrop: "boolean",
            enableWordWrap:"boolean",
            enableIncrementalSearch: "boolean",
            caseSensitiveSearch: "boolean",
            template: "string",
            targetID: "string",
            cascadeTo: "string",
            showRoundedCorner: "boolean",
            enableRTL: "boolean",
            enablePersistence: "boolean",
            enabled: "boolean",
            allowMultiSelection: "boolean",
            dataSource: "data",
            query: "data",
            checkedIndices: "data",
            selectedIndices: "data",
            htmlAttributes: "data",
            loadDataOnInit: "boolean",
            showCheckbox: "boolean",
            sortOrder: "enum"
        },
        observables: ["value", "dataSource"],
        value: ej.util.valueFunction("value"),
        dataSource: ej.util.valueFunction("dataSource"),
        enable: function () {
            if (this.listContainer.hasClass("e-disable")) {
                this.target.disabled = false;
                this.model.enabled = this.model.enabled = true;
                this.element.removeAttr("disabled");
                this.listContainer.removeClass('e-disable');
                if (this.model.allowMultiSelection) this.listContainer.removeClass("e-disable");
                var scroller = this.listContainer.find(".e-vscrollbar,.e-hscrollbar");
                if (this.model.showCheckbox) { 
                    var items = this.listContainer.find('li:not(.e-disable)');
                    items.find(".listcheckbox").ejCheckBox("enable");
                }
                if (scroller.length > 0)
                    this.scrollerObj.enable();
            }
        },
        disable: function () {
            if (!this.listContainer.hasClass("e-disable")) {
                this.target.disabled = true;
                this.model.enabled = this.model.enabled = false;
                this.element.attr("disabled", "disabled");
                this.listContainer.addClass('e-disable');
                if (this.model.allowMultiSelection) this.listContainer.addClass("e-disable");
                var scroller = this.listContainer.find(".e-vscrollbar,.e-hscrollbar");
                if (this.model.showCheckbox) this.element.find(".listcheckbox").ejCheckBox("disable");
                if (scroller.length > 0)
                    this.scrollerObj.disable();
            }
        },
        selectItemByIndex: function (index) {            
            var prevSelectedItem = this.model.selectedIndex, listitems= (this.listitems)?this.listitems:this.listitem;
			if(index!=0) index=parseInt(index);       
            if (index != null) {				
                if ((index > this.element.find("li:not('.e-ghead')").length) || (index < 0) || ((1 / index) == -Infinity))
					 index=this.model.selectedIndex;                    				
                var activeitem = $(this.element.find("li:not('.e-ghead')")[index]);
                if (!activeitem.hasClass("e-select")) {
                    this._activeItem = index;
                    this.element.children("li").removeClass("e-select");
                    this._selectedItems = [];
                    this.model.selectedIndices = [];
                    activeitem.addClass("e-select");
                    if (this.model.showCheckbox) {
                        if (!($(activeitem).find('.listcheckbox').ejCheckBox('isChecked'))) {
                            $(activeitem).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                            activeitem.removeClass("e-select");
                            if (!($.inArray(this._activeItem, this._checkedItems) > -1)) this._checkedItems.push(this._activeItem);
                            if (!($.inArray(activeitem[0], this.model.checkedIndices) > -1)) this.model.checkedIndices.push(this._activeItem);
                        }
                    }
                    this._selectedItems.push(activeitem);
                    this.model.selectedIndices.push(index);
                    var selectData = this._getItemObject(activeitem, null);
                    selectData["isInteraction"] = false;
                    if (this.model.select)
                        this._trigger('select', selectData);
                }
            }
            if (this.model.cascadeTo) {
                this._activeItem = index;
                this._cascadeAction();
            }
            this._setSelectionValues()._OnListSelect(prevSelectedItem, this._activeItem);;
        },
        checkItemByIndex: function (index) {
            if (typeof (index) == "number")
                this.checkItemsByIndices(index.toString());
        },
        uncheckItemByIndex: function (index) {
            if (typeof (index) == "number")
                this.uncheckItemsByIndices(index.toString());
        },
        checkItemsByIndices: function (index) {
            if ((ej.isNullOrUndefined(index))) return false;
            var checkitems = index.toString().split(',');
            if (checkitems.length > 0) {
                for (var i = 0; i < checkitems.length; i++) {
                    if (checkitems[i] != null) {
                        this._activeItem = parseInt(checkitems[i]);
                        if (this._activeItem < 0) this._activeItem = 0;
                        var activeitem = $(this.element.children("li:not('.e-ghead')")[this._activeItem]);
                        if (this.model.showCheckbox) {
                            if (!($(activeitem).find('.listcheckbox').ejCheckBox('isChecked'))) {
                                $(activeitem).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                                this.checkedStatus = true;
                                if (!($.inArray(this._activeItem, this._checkedItems) > -1)) this._checkedItems.push(this._activeItem);
                                if (!($.inArray(activeitem[0], this.model.checkedIndices) > -1)) this.model.checkedIndices.push(this._activeItem);
                                var checkData = this._getItemObject(activeitem, null);
                                checkData["isInteraction"] = false;
                                if (this.model.checkChange)
                                    this._trigger('checkChange', checkData);
                            }
                        }
                    }
                }
            }
            this._setSelectionValues();
        },
        uncheckItemsByIndices: function (value) {
            if ((ej.isNullOrUndefined(value))) return false;
            var checkitems = value.toString().split(',');
            if (checkitems.length > 0) {
                for (var i = 0; i < checkitems.length; i++) {
                    if (checkitems[i] != null) {
                        var index = parseInt(checkitems[i]);
                        var unselectitem = $(this.element.children("li:not('.e-ghead')")[parseInt(index)]);
                        if (this.model.showCheckbox) {
                            if (($(unselectitem).find('.listcheckbox').ejCheckBox('isChecked'))) {
                                $(unselectitem).find('.listcheckbox').ejCheckBox('option', 'checked', false);
                                this.checkedStatus = false;
                                var itemIndex = $.inArray(index, this.model.checkedIndices);
                                if ($.inArray(index, this._checkedItems) > -1) this._checkedItems.splice(itemIndex, 1);
                                if (itemIndex > -1) this.model.checkedIndices.splice(itemIndex, 1);
                                var unselectData = this._getItemObject(unselectitem, null);
                                unselectData["isInteraction"] = false;
                                if (this.model.checkChange)
                                    this._trigger('checkChange', unselectData);
                            }
                        }
                    }
                }
            }
            this._setSelectionValues();
        },
        selectAll: function () {
            if (!this.model.showCheckbox && this.model.allowMultiSelection) {
                var activeItem = this.element.children("li:not('.e-ghead')");
                for (var i = 0; i < activeItem.length; i++) {
                    if (!$(activeItem[i]).hasClass("e-select") && !$(activeItem[i]).hasClass("e-disable")) {
                        $(activeItem[i]).addClass("e-select");
                        this._selectedItems.push($(activeItem[i]));
                        this.model.selectedIndices.push(i);
                        var selectData = this._getItemObject(activeItem, null);
                        selectData["isInteraction"] = false;
                        if (this.model.select)
                            this._trigger('select', selectData);
                    }
                }
            }
            this._setSelectionValues();
        },
        //Deprecated Method
        unSelectAll: function () { this.unselectAll(); },
        unselectAll: function () {
            if (!this.model.showCheckbox)
                this._removeListHover();
            this._setSelectionValues();
            return this;
        },
        //deprecated function
        selectItemsByIndex: function (value) {
            this.selectItemsByIndices(value);
        },
        selectItemsByIndices: function (value) {
            if (ej.isNullOrUndefined(value)) return false;
            var selectitems = value.toString().split(',');
            if (this.model.allowMultiSelection) {
                for (var i = 0; i < selectitems.length; i++) {
                    if (selectitems[i] != null && !isNaN(parseInt(selectitems[i])) && selectitems[i] < this.element.children('li').length) {
                        var index = parseInt(selectitems[i]);
                        this._activeItem = index;
                        var activeitem = $(this.element.children("li:not('.e-ghead')")[this._activeItem]);
                        if (!activeitem.hasClass("e-select")) {
                            activeitem.addClass("e-select");
                            this._selectedItems.push(activeitem);
                            this.model.selectedIndices.push(index);
                            if (this.model.showCheckbox) {
                                if (!($(activeitem).find('.listcheckbox').ejCheckBox('isChecked'))) {
                                    $(activeitem).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                                    activeitem.removeClass("e-select");
                                    if (!($.inArray(this._activeItem, this._checkedItems) > -1)) this._checkedItems.push(this._activeItem);
                                    if (!($.inArray(activeitem[0], this.model.checkedIndices) > -1)) this.model.checkedIndices.push(this._activeItem);
                                }
                            }
                            var selectData = this._getItemObject(activeitem, null);
                            selectData["isInteraction"] = false;
                            if (this.model.select)
                                this._trigger('select', selectData);
                        }
                    }
                }
            }
            this._setSelectionValues();
        },
        //deprecated property
        unselectItemsByIndex: function (value) {
            this.unselectItemsByIndices(value);
        },
        unselectItemsByIndices: function (value) {
            var selectitems = value.toString().split(',');
            for (var i = 0; i < selectitems.length; i++) {
                if (selectitems[i] != null) {
                    var index = parseInt(selectitems[i]);
                    var activeitem = $(this.listItemsElement[index]);
                    this._activeItem = index;
                    activeitem.removeClass('e-active e-select');
                    if (this.model.showCheckbox) {
                        if (($(activeitem).find('.listcheckbox').ejCheckBox('isChecked'))) {
                            $(activeitem).find('.listcheckbox').ejCheckBox('option', 'checked', false);
                            var itemIndex = $.inArray(index, this.model.checkedIndices);
                            if ($.inArray(index, this._checkedItems) > -1) this._checkedItems.splice(itemIndex, 1);
                            if (itemIndex > -1) this.model.checkedIndices.splice(itemIndex, 1);
                        }
                    }
                    if (this.model.selectedIndex == index) this.model.selectedIndex = this._activeItem = null;
                    var itemIndex = this._selectedItems.indexOf(activeitem[0]);
                    this._selectedItems.splice(this.model.selectedIndices.indexOf(itemIndex), 1);
                    this.model.selectedIndices.splice(this.model.selectedIndices.indexOf(itemIndex), 1);

                    var unselectData = this._getItemObject(activeitem, null);
                    unselectData["isInteraction"] = false;
                    if (this.model.unselect)
                        this._trigger('unselect', unselectData);
                }
            }
            this._setSelectionValues();
        },
        unselectItemByIndex: function (index) {
            index = parseInt(index);
            var unselectitem = $(this.element.children("li:not('.e-ghead')")[index]);
            if (this.model.showCheckbox) {
                if (($(unselectitem).find('.listcheckbox').ejCheckBox('isChecked'))) {
                    $(unselectitem).find('.listcheckbox').ejCheckBox('option', 'checked', false);
                    var itemIndex = $.inArray(index, this.model.checkedIndices);
                    if ($.inArray(index, this._checkedItems) > -1) this._checkedItems.splice(itemIndex, 1);
                    if (itemIndex > -1) this.model.checkedIndices.splice(itemIndex, 1);
                }
            }
            if (unselectitem.hasClass('e-select')) {
                unselectitem.removeClass('e-active e-select');
                if (this.model.selectedIndex == index) this.model.selectedIndex = this._activeItem = null;
                var itemIndex = this._selectedItems.indexOf(unselectitem[0]);
                this._selectedItems.splice(this.model.selectedIndices.indexOf(itemIndex), 1);
                this.model.selectedIndices.splice(this.model.selectedIndices.indexOf(itemIndex), 1);
                var unselectData = this._getItemObject(unselectitem, null);
                unselectData["isInteraction"] = false;
                if (this.model.unselect)
                    this._trigger('unselect', unselectData);
            }
            this._setSelectionValues();
        },
        selectItemByText: function (text) {
            if (!ej.isNullOrUndefined(text))
            this[(this.model.allowMultiSelection ? "selectItemsByIndices" : "selectItemByIndex")](this.getIndexByText(text));
        },
        selectItemByValue: function (value) {
            this[(this.model.allowMultiSelection ? "selectItemsByIndices" : "selectItemByIndex")](this.getIndexByValue(value));
        },
        unselectItemByText: function (text) {
            this[(this.model.allowMultiSelection ? "unselectItemsByIndices" : "unselectItemByIndex")](this.getIndexByText(text));
        },
        unselectItemByValue: function (value) {
            this[(this.model.allowMultiSelection ? "unselectItemsByIndices" : "unselectItemByIndex")](this.getIndexByValue(value));
        },
        getSelectedItems: function () {
            var items = [], proxy = this;
            $(proxy.model.selectedIndices).each(function (index, elementIndex) {
                items.push(proxy.getItemByIndex(elementIndex));
            });
            return items;
        },
        getCheckedItems: function () {
            var items = [], proxy = this;
            $(proxy.model.checkedIndices).each(function (index, elementIndex) {
                items.push(proxy.getItemByIndex(elementIndex));
            });
            return items;
        },
        removeItem: function () {
            return this.removeSelectedItems();
        },
        removeItemByText: function (text) {
            if (ej.isNullOrUndefined(this.getItemByText(text))) return false;
            return this.removeItemByIndex(this.getItemByText(text).index);
        },
        hideSelectedItems: function () {
            var items = this.getSelectedItems();
            this._hideOrShowItemsByIndex(items, "hide");
        },
        hideCheckedItems: function () {
            var items = this.getCheckedItems();
            this._hideOrShowItemsByIndex(items, "hide");
        },
        _hideOrShowItemsByIndex: function (items, hideOrShow) {
            if ($.type(items) == "number") {
                if (hideOrShow == "hide") {
                    $(this.listItemsElement[items]).hide();
                    if ($(this.listItemsElement[items]).next().hasClass('e-ghead'))
                        $(this.listItemsElement[items]).prev().hide();
                }
                else {
                    $(this.listItemsElement[items]).show();
                    if ($(this.listItemsElement[items]).prev().hasClass('e-ghead'))
                        $(this.listItemsElement[items]).prev().show();
                }
            }
            else {
                for (var litem = 0; litem < items.length; litem++) {
                    if (hideOrShow == "hide")
                        items[litem].item ? items[litem].item.hide() : $(this.listItemsElement[items[litem]]).hide();
                    else
                        items[litem].item ? items[litem].item.show() : $(this.listItemsElement[items[litem]]).show();
                }
            }
            this._refreshScroller();
        },
        showItemsByIndices: function (items) {
            this._hideOrShowItemsByIndex(items, "show");
        },
        hideItemsByIndices: function (items) {
            this._hideOrShowItemsByIndex(items, "hide");
        },
        _hideOrShowItemsByValue: function (values, hideOrShow) {
            if ($.type(values) == "array") {
				for(var i=0;i < this.listItemsElement.length;i++){
					 for (var length = 0; length <= values.length; length++) {
                        if ($(this.listItemsElement[i]).attr("value") == values[length])
                            (hideOrShow == "hide") ? $(this.listItemsElement[i]).hide() : $(this.listItemsElement[i]).show();
                    }			
			 }                
            }
            else {
                for(var i=0;i < this.listItemsElement.length;i++){
                    if ($(this.listItemsElement[i]).attr("value") == values)
                        (hideOrShow == "hide") ? $(this.listItemsElement[i]).hide() :$(this.listItemsElement[i]).show();
                }
            }
            this._refreshScroller();
        },
        showItemsByValues: function (value) {
            this._hideOrShowItemsByValue(value, "show");
        },
        hideItemsByValues: function (value) {
            this._hideOrShowItemsByValue(value, "hide");
        },
        showItemByValue: function (value) {
            this._hideOrShowItemsByValue(value, "show");
        },
        hideItemByValue: function (value) {
            this._hideOrShowItemsByValue(value, "hide");
        },
        showItemByIndex: function (item) {
            this._hideOrShowItemsByIndex(item, "show");
        },
        hideItemByIndex: function (item) {
            this._hideOrShowItemsByIndex(item, "hide");
        },
        hide: function () {
            this.listContainer.hide();
        },
        show: function () {
            this.listContainer.show()
        },
        hideAllItems: function () {
            this.element.find("li:visible").hide()
            this._refreshScroller();
        },
        showAllItems: function () {
            this.element.find("li:hidden").show()
            this._refreshScroller();
        },
        _stateMaintained: function (index) {
            var lenth, len, value, j;
            this.model.disableItemsByIndex = [];
            this.model.selectedIndices = [];
            this.model.checkedIndices = [];
            if (this.model.selectedIndex >= index && this.model.selectedIndex != null) {
                if (this.model.selectedIndex == index || $(this.element.children()[index - 1]).hasClass('e-disable'))
                    this.model.selectedIndex = null;
                else if (this.model.selectedIndex != index)
                    this.model.selectedIndex -= 1;
            }
            len = $(index).length;
            if (len > 1) {
                for (i = len; i >= 0; i--)
                    $(this.element.children()[index[i]]).remove();
                lenth = this.element.children().length;
                for (j = 0; j < lenth; j++)
                    if ($(this.element.children()[j]).hasClass('e-disable'))
                        this.model.disableItemsByIndex.push(j);
            }
            else {
                value = index - 1;
                for (value; value >= 0; value--) {
                    if ($(this.element.children()[value]).hasClass('e-disable'))
                        this.model.disableItemsByIndex.push(value);
                    if ($(this.element.children()[value]).hasClass('e-select'))
                        this.model.selectedIndices.push(value);
                    if ($(this.element.children()[value]).find('.listcheckbox').ejCheckBox('isChecked'))
                        this.model.checkedIndices.push(value);
                }
                index = parseInt(index) + 1;
                for (index; index < this._listSize; index++) {
                    if ($(this.element.children()[index]).hasClass('e-disable'))
                        this.model.disableItemsByIndex.push(index - 1);
                    if ($(this.element.children()[index]).hasClass('e-select'))
                        this.model.selectedIndices.push(index - 1);
                    if ($(this.element.children()[index]).find('.listcheckbox').ejCheckBox('isChecked'))
                        this.model.checkedIndices.push(index - 1);
                }
            }
        },
        removeAll: function () {
            if (ej.isNullOrUndefined(this.dataSource())) {
                var text = [];
                $(this.listitems).each(function (i, e) {
                    text.push($(this).text());
                    e.remove();
                });
                this._refreshItems();
                return text;
            }
            else if (!(this.dataSource() instanceof ej.DataManager)) {
                var elements = [], count = $(this.listItemsElement).length;
                for (var i = 0; i < count; i++) {
                    elements.push(this._getRemovedItems([parseInt(0)]));
                }
                return elements;
            }
        },
        removeItemByIndex: function (index) {
            var text, selectItem = this.model.selectedIndex;
            if (ej.isNullOrUndefined(this.dataSource())) {
                text = $(this.listItemsElement[index]).remove().text();
                this._stateMaintained(index);
                this._refreshItems();
            }
            else if (!(this.dataSource() instanceof ej.DataManager)) text = this._getRemovedItems([parseInt(index)]);
            this.model.selectedIndex = (index == selectItem) ? null : index < selectItem ? selectItem - 1 : selectItem;
            return text;
        },
        removeSelectedItems: function () {
            if (this.model.showCheckbox) return false;
            if (ej.isNullOrUndefined(this.dataSource())) {
                var text = this.value();
                $(this.getSelectedItems()).each(function (i, e) {
                    e.item.remove()
                });
                this._refreshItems();
                return text;
            }
            else if (!(this.dataSource() instanceof ej.DataManager)) {
                this.model.selectedIndex = null;
                return this._getRemovedItems(this.model.selectedIndices);
            }
        },
        _getRemovedItems: function (index) {
            var removedItems = [];
            this._stateMaintained(index);
            this.value(null);
            this._activeItem = null;
            this.dataSource(this.dataSource().filter(function (e, i) {
                if (index.indexOf(i) != -1)
                    removedItems.push(e);
                else
                    return true;
            }));
            this.refresh(true);
            return removedItems;
        },
        getIndexByValue: function (value) {
            var index;
			for(var i=0;i < this.listItemsElement.length;i++){
				if($(this.listItemsElement[i]).attr("value") == value){
					index=i;
                    break;					
				}             
			}                     
			return index;
        },
        getIndexByText: function (text) {
            var index;
            if (this.model.allowMultiSelection) {
                var text = text.split(",");
                index = [];
            }
			for(var i=0;i < this.listItemsElement.length;i++){
				if (typeof text == "object") {
                    for (var j = 0; j < text.length; j++) {
                        if ($(this.listItemsElement[i]).text() == text[j]) {                           
                            index.push(i);                          
                            break;							
                        }
                    }
                }
                else if ($(this.listItemsElement[i]).text() == text) {
                    index = i;  
                    break;					
                }				
				}			                    
            return index;
        },
        getTextByIndex: function (index) {
            return $(this.element.find("li:not('.e-ghead')")[index]).text();
        },
        getItemByText: function (text) {
            var proxy = this, obj;
            this.listItemsElement.each(function () {
                if ($(this).text() == text) {
                    obj = proxy._getItemObject($(this));
                    return false;
                }
            });
            return obj;
        },
        getItemByIndex: function (index) {
            return this._getItemObject($(this.element.children("li:not('.e-ghead')")[index]));
        },
        getListData: function () {
            if (ej.DataManager && this.dataSource() instanceof ej.DataManager) {
                if(this.model.allowVirtualScrolling) {
                    this.listitems = this.element.find('li');
                    return this.listitems;
                }
                else
                    return this.listitems;
            }
            else if (this.dataSource())
                return this.dataSource();
            else
                return;
        },
        enableItem: function (text) {
            var proxy = this;
            this.listItemsElement.each(function () {
                if ($(this).text() == text) {
                    $(this).removeClass("e-disable");
                    if (proxy.model.showCheckbox) $(this).find(".listcheckbox").ejCheckBox("enable");
                    proxy._disabledItems.splice($(this).index().toString());
                    return false;
                }
            });
        },
        disableItem: function (text) {
            var proxy = this;
            this.listItemsElement.each(function () {
                if ($(this).text() == text) {
                    $(this).addClass("e-disable");
                    if (proxy.model.showCheckbox) $(this).find(".listcheckbox").ejCheckBox("disable");
                    proxy._disabledItems.push($(this).index().toString());
                    return false;
                }
            });
        },
        moveUp: function () {
            var process = (this.model.fields.groupBy != null) ? (this.model.allowMultiSelection || this.model.showCheckbox) ? false : true : true;
            if (process) {
                this.checkedorselected = this.model.checkedIndices.length == 0 ? this.model.selectedIndices.reverse() : this.model.checkedIndices.reverse();
				this._checkstate(true);
               
            }
        },
				
        moveDown: function () {
            var process = (this.model.fields.groupBy != null) ? (this.model.allowMultiSelection || this.model.showCheckbox) ? false : true : true;
            if (process) {
                this.checkedorselected = this.model.checkedIndices.length == 0 ? this.model.selectedIndices : this.model.checkedIndices;   this._checkstate();
                }
        },
		
		_checkstate:function(ismoveup){			
			 var curItem = $(this.element.children("li:not('.e-ghead')")[this.checkedorselected[0]]);
                if ((ismoveup && !curItem.prev().hasClass("e-ghead")) || !curItem.next().hasClass("e-ghead") ) {
                    if (!ej.isNullOrUndefined(this.checkedorselected)) {
                        var selectIndex = 0;
                        var listval = this._getItem(this.checkedorselected[selectIndex]);
                        this._moveupdown(listval, selectIndex, ismoveup ? "up":"down");
                    }
                }			
		},
		
        _moveItem: function (item, list, direction) {
            var selectedItem = item, index = item.index(), moveup = (direction == "up"), movedown = (direction == "down");
			this._addListHover();
			this._getItem(this._selectedItem).removeClass("e-hover");
            if (moveup) {
                list.insertAfter(selectedItem);
                if (list.hasClass('e-disable') && $.inArray(index.toString(), this._disabledItems) > -1) {
                    this._disabledItems.splice($.inArray(index.toString(), this._disabledItems), 1);
                    this._disabledItems.push((index + 1).toString());
                }
				  this._selectedItem -= 1;
                  this._refreshItems();
            } else if (movedown) {
                list.insertBefore(selectedItem);
                if (list.hasClass('e-disable') && $.inArray(index.toString(), this._disabledItems) > -1) {
                    this._disabledItems.splice($.inArray(index.toString(), this._disabledItems), 1);
                    this._disabledItems.push((index - 1).toString());
                }
				 this._selectedItem += 1;
                 this._refreshItems();
            }
        },
        _moveupdown: function (list, index, direction) {

            var j = this.checkedorselected[index], next, k;
            var i = 0, i = j;
            while (i < $(this.element.children("li:not('.e-ghead')")).length) {
                next = $(this.element.children("li:not('.e-ghead')")[i]);
                if (ej.isNullOrUndefined(next)) break;
                if (next.hasClass("e-select") || next.find("span").hasClass("e-checkmark")) {
                    k = i;
                    direction == "down" ? eval(i++) : eval(i--);
                    continue;
                }
                else break;
            }
            if (!ej.isNullOrUndefined(next) && i < $(this.element.children("li")).length) this._moveItem(list, next, direction);

            if (index < this.checkedorselected.length) {
                ele = $(this.element.children("li")[this.checkedorselected[index]]);
                if (ele.next().hasClass("e-select") || ele.next().find("span").hasClass("e-checkmark")) var oneafter = direction == "down" ? true : false;
                else if (ej.isNullOrUndefined(ele[0])) var oneafter = direction == "up" ? true : false;
                else if (ele.hasClass("e-select") || ele.find("span").hasClass("e-checkmark")) {
                    this._moveupdown(ele, index + 1, direction);
                }

            }

            length = this.element.children("li:not('.e-ghead')").length;
            if (this.model.checkedIndices.length == 0) {
                this.model.selectedIndices = [];
                for (var i = 0; i < length; i++) {
                    if ($(this.element.children("li:not('.e-ghead')")[i]).hasClass('e-select'))
                        this.model.selectedIndices.push(i);
                }
            } else {
                this.model.checkedIndices = [];
                for (var j = 0; j < length; j++)
                    if ($.parseJSON($(this.element.children("li:not('.e-ghead')")[j]).find("span").attr("aria-checked")))
                        this.model.checkedIndices.push(j);
            }

        },


        checkAll: function () {
            if (!this.model.showCheckbox) return false;
            var items = this.element.find("li:not('.e-ghead')");
            for (i = 0; i < items.length; i++) {
                if (!($(items[i].firstChild).find('.listcheckbox').ejCheckBox('isChecked'))) {
                    $(items[i].firstChild).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                    this._checkedItems.push(items[i]);
                    this.model.checkedIndices.push(i);
                }
            }
			this._setSelectionValues();
            this.model.uncheckAll = false;
        },
        //Deprecated Method
        unCheckAll: function () { this.uncheckAll(); },
        uncheckAll: function () {
            if (!this.model.showCheckbox) return false;
            var items = this.element.find("li:not('.e-ghead')");
            for (i = 0; i < items.length; i++)
                if ($(items[i].firstChild).find('.listcheckbox').ejCheckBox('isChecked'))
                    $(items[i].firstChild).find('.listcheckbox').ejCheckBox('option', 'checked', false);
            this._checkedItems = [];
            this.model.checkedIndices = [];
			this._setSelectionValues();
            this.model.checkAll = false;
        },
        addItem: function (val, index) {
            var index = (!ej.isNullOrUndefined(index) && index <= this.element.find("li:not('.e-ghead')").length) ? index : this.element.find("li:not('.e-ghead')").length;
            var proxy = this, num = index;
            if (ej.isNullOrUndefined(this.dataSource())) {
                if (!(val instanceof Array)) {
					 if(this.model.fields.groupBy && typeof val == "object" ){ 
                          _query = ej.Query().group(this.model.fields.groupBy);
                           groupedList = ej.DataManager([val]).executeLocal(_query);
                            this.dataSource([]);  
                            for (i = 0; i < groupedList.length; i++) {
							this._setMapFields();
                            this.dummyUl.push(ej.buildTag('li.e-ghead', groupedList[i].key)[0]);
                            this._loadlist(groupedList[i].items);
                            this.dataSource(this.dataSource().concat(groupedList[i].items));										
					               } 
					    }
					 else{						 
						val = (typeof val == "object" ) ? val[this.model.fields.text] : val;
                    this.listitem = (this.element.find("li:not('.e-ghead')").length ?
                                        ((index - 1 < 0) ? $(this.element.find("li:not('.e-ghead')")[0]).before('<li role="option">' + val + '</li>') : $(this.element.find("li:not('.e-ghead')")[index - 1]).after('<li role="option">' + val + '</li>'))
                                         : $(this.element).html('<li role="option">' + val + '</li>'));
					 }
                    this.listitems = this.element.find("li:not('.e-ghead')");
                    this._addItemIndex = index;
                    if (this.model.showCheckbox) {
                        $checkbox = ej.buildTag("input.listcheckbox e-align#popuplist" + (this.listitems.length - 1) + "_" + this._id, "", {}, {
                            type: "checkbox",
                            name: "list" + (this.listitems.length - 1)
                        });
                        $(this.listitems[index]).prepend($checkbox);
                        $($(this.listitems[index]).find(".listcheckbox")).ejCheckBox({
                            change: $.proxy(this._onClickCheckList, this)
                        });
                    }
                    if (this.model.allowDrag || this.model.allowDrop) this._enableDragDrop();
                    this._addItemIndex = null;
                    this._refreshItems();
                }
                else {
                    $(val).each(function (i, e) {
                        proxy.addItem(e, index);
                        index = index + 1;
                    })
                }
            }
            else if (!(this.dataSource() instanceof ej.DataManager)) {
                if (proxy.dataSource() instanceof Object) {
					dup = new Object();
                    if (!(val instanceof Object)) {
                        dup[proxy.model.fields.text] = val;
                        val = dup;
                    }
                }
                else if (!(val instanceof Array)) val = [val];
                $(val).each(function (i, e) {
                    proxy.dataSource().splice(index, 0, e);
                    index = index + 1;
                })
                this.model.disableItemsByIndex = [];
                this.model.selectedIndices = [];
                this.model.checkedIndices = [];
                if (this.model.selectedIndex >= num)
                    this.model.selectedIndex += 1;
                var value = num - 1;
                for (value; value >= 0; value--) {
                    if ($(this.element.find("li:not('.e-ghead')")[value]).hasClass('e-disable'))
                        this.model.disableItemsByIndex.push(value);
                    if ($(this.element.find("li:not('.e-ghead')")[value]).hasClass('e-select'))
                        this.model.selectedIndices.push(value);
                    if ($(this.element.children()[value]).hasClass("e-checkmark"))
                        this.model.checkedIndices.push(value);
                }
                for (num; num < this._listSize; num++) {
                    if ($(this.element.find("li:not('.e-ghead')")[num]).hasClass('e-disable'))
                        this.model.disableItemsByIndex.push(num + 1);
                    if ($(this.element.find("li:not('.e-ghead')")[num]).hasClass('e-select'))
                        this.model.selectedIndices.push(num + 1);
                    if ($(this.element.find("li:not('.e-ghead')")[num]).find('.listcheckbox').ejCheckBox('isChecked'))
                        this.model.checkedIndices.push(num + 1);
                }
                this.refresh(true);
            }
        },
        enableItemByIndex: function (index) {
            if (typeof (index) == "number")
                this.enableItemsByIndices(index.toString());
        },
        disableItemByIndex: function (index) {
            if (typeof (index) == "number")
                this.disableItemsByIndices(index.toString());
        },
        disableItemsByIndices: function (value) {
            if (ej.isNullOrUndefined(value)) return false;
            var selectitems = value.toString().split(',');
            for (var i = 0; i < selectitems.length; i++) {
                if (selectitems.length > 0 && !($.inArray(selectitems[i], this._disabledItems) > -1)) {
                    var disable = $(this.element.children("li:not('.e-ghead')")[parseInt(selectitems[i])]).addClass('e-disable');
                    disable.find(".listcheckbox").ejCheckBox("disable");
                    this._disabledItems.push(selectitems[i]);
                }
            }
        },
        enableItemsByIndices: function (value) {
            var selectitems = value.toString().split(','), index;
            for (var i = 0; i < selectitems.length; i++) {
                if (selectitems.length > 0 && ($.inArray(selectitems[i], this._disabledItems) > -1)) {
                    index = $.inArray(selectitems[i], this._disabledItems);
                    var enable = $(this.element.children("li:not('.e-ghead')")[parseInt(selectitems[i])]).removeClass('e-disable');
                    enable.find(".listcheckbox").ejCheckBox("enable");
                    this._disabledItems.splice(index, 1);
                }
            }
        },
        _init: function () {
            this._id = this.element[0].id;
            this._isMozilla = ej.browserInfo().name == "mozilla" ? true : false;
            this._cloneElement = this.element.clone();
            this._deprecatedValue()._initialize()._render()._wireEvents();
            this._initValue = this.focused = false;
            this._typeInterval = null;
            this._dummyVirtualUl = [];
            this._virtualCount = 0;
            this._liItemHeight = 0;
            this._typingThreshold = 2000;
            this._dataUrl = this.dataSource();
            //deprecatedFunction
            if (this.model.checkAll)
                this.checkAll();
            if (this.model.uncheckAll)
                this.uncheckAll();
            if (this.model.disableItemsByIndex)
                this.disableItemsByIndices(this.model.disableItemsByIndex.toString());
            if (this.model.enableItemsByIndex)
                this.enableItemsByIndices(this.model.enableItemsByIndex.toString());
            if (this.model.uncheckItemsByIndex)
                this.uncheckItemsByIndices(this.model.uncheckItemsByIndex.toString());
            this._deprecatedValue()._enabled(this.model.enabled);

        },
        _deprecatedValue: function () {
            this.model.itemDrop = (this.model.itemDrop || this.model.itemDropped);
            this.model.change = (this.model.change || this.model.selectIndexChanged);
            this.model.fields.checkBy = this.model.fields.selected || this.model.fields.checkBy;
            this.model.fields.tooltipText = this.model.fields.toolTipText || this.model.fields.tooltipText;
            this.model.fields.groupBy = this.model.fields.category || this.model.fields.groupBy;
            this.model.select = (this.model.select || this.model.selected);
            if (this.model.allowDragAndDrop != undefined)
                this.model.allowDrag = this.model.allowDrop = true;
            this.model.selectedIndex = this.model.selectedIndex != null ? this.model.selectedIndex : this.model.selectedItemIndex;
            this.model.checkedIndices = ((this.model.checkedIndices.length ? this.model.checkedIndices : null) || (this.model.checkItemsByIndex ? this.model.checkItemsByIndex : null) || (this.model.checkedItems.length ? this.model.checkedItems : null) || (this.model.checkedItemlist.length ? this.model.checkedItemlist : []));
            this.model.selectedIndices = ((this.model.selectedIndices.length ? this.model.selectedIndices : null) || (this.model.selectedItems.length ? this.model.selectedItems : null) || (this.model.selectedItemlist.length ? this.model.selectedItemlist : []));
            return this;
        },
        _setModel: function (options) {
            var option, refresh = false;
            for (option in options) {
                switch (option) {
                    case "value":
                        this._setText(ej.util.getVal(options[option]));
                        break;
                    case "dataSource":
                        if (!ej.isNullOrUndefined(this._isCasCadeTarget))
                            this.model.selectedIndex = null;
                        options[option] = ej.util.getVal(options[option])
                        this._checkModelDataBinding(options[option]);
                        break;
                    case "query":
                        this._queryCheck(options[option]);
                        break;
                    case "fields":
                        this.model.fields = $.extend(this.model.fields, options[option]);
                        this._checkModelDataBinding(this.dataSource());
                        break;
                    case "template":
                        this.model.template = options[option];
                        this.refresh(true);
                        break;
                    case "loadDataOnInit":
                        this._loadContent = options[option];
                        this._checkModelDataBinding(this.dataSource());
                        break;
                    case "enableRTL":
                        this.model.enableRTL = options[option];
                        (this.model.enableRTL) ? this.listContainer.addClass("e-rtl") : this.listContainer.removeClass("e-rtl");
                        break;
                    case "enabled":
                        this.model.enabled = options[option];
                        this._enabled(options[option]);
                        break;
				    case "enableWordWrap":
					      this.model.enableWordWrap=options[option];
					      this._wordWrapItems(options[option]);
						  break;
                    case "height":
                    case "width":
                        this.model[option] = options[option];
                        this._setDimensions();
                        break;
                    case "cssClass":
                        this.model.cssClass = options[option];
                        this.listContainer.addClass(this.model.cssClass);
                        break;
                    case "showCheckbox":
                        this._checkboxHideShow(options[option]); if (options[option]) this._removeListHover();
                        break;
                    case "showRoundedCorner":
                        this.model.showRoundedCorner=options[option];
                        this._roundedCorner();
                        break;
                    case "selectedItemIndex":
                    case "selectedIndex":
                         if (this.listitem[options[option]] || options[option] == null || this.listitems[options[option]]) {
                            this.selectItemByIndex(options[option]);
                            this.model.selectedIndex = this.model.selectedItemIndex = options[option];
                        } else options[option] = this.model.selectedIndex;
                        break;
                    case "sortOrder":
                        this.model.sortOrder = options[option];
                        if (this.dataSource() != null)
                            this._showFullList();
                        else
                            this._renderlistContainer();
                        break;
                    case "checkItemsByIndex":
                    case "checkedItemlist":
                    case "checkedItems":
                    case "checkedIndices":
                        this.uncheckAll();
                        this.checkItemsByIndices(options[option].toString());
                        options[option] = this.model[option] = this.model.checkedIndices;
                        break;
                    case "uncheckItemsByIndex":
                        this.uncheckItemsByIndices(options[option].toString());
                        this.model[option] = options[option];
                        break;
                    case "selectedItemlist":
                    case "selectedItems":
                    case "selectedIndices":
                        this.unselectAll();
                        this.selectItemsByIndices(options[option].toString());
                        options[option] = this.model.selectedIndices;
                        break;
                    case "enableItemsByIndex":
                        this.model[option] = options[option];
                        this.enableItemsByIndices(options[option].toString());
                        break;
                    case "disableItemsByIndex":
                        this.model[option] = options[option];
                        this.disableItemsByIndices(options[option].toString());
                        break;
                    case "enableVirtualScrolling":
                        this.model.allowVirtualScrolling = options[option]; refresh = true;
                        break;
                    case "allowDrag":
                    case "allowDrop":
                    case "allowDragAndDrop":
                    case "allowVirtualScrolling":
                    case "virtualScrollMode":
                        this.model[option] = options[option]; refresh = true;
                        break;
                    case "checkAll":
                        this.model[option] = options[option]; if (options[option]) this.checkAll(); else this.uncheckAll();
                        break;
                    case "uncheckAll":
                        this.model[option] = options[option]; if (options[option]) this.uncheckAll(); else this.checkAll();
                        break;
                    case "htmlAttributes":
                        this._addAttr(options[option]);
                        break;
                    case "itemsCount":
                        var items = this.model.itemsCount;
                        if (this.model.height) {
                            this.model.itemsCount = options[option];
                            this._setItemsCount()._setDimensions();
                        } else options[option] = items;
                        break;
                    case "itemHeight":
                        var $liElements = this.listItemsElement;
                        var optionHeight = ej.isNullOrUndefined(options[option]) ? options[option] : options[option].toString().replace("px", "");
                        var modelHeight= ej.isNullOrUndefined(this.model.itemHeight) ? this.model.itemHeight :this.model.itemHeight.toString().replace("px", "");
                        for (var z = 0; z < $liElements.length; z++) {
                            var style = ej.isNullOrUndefined(options[option]) ? { "min-height": ej.isNullOrUndefined(this.model.itemHeight)? "20px":modelHeight } : { "min-height": optionHeight + "px", "height": optionHeight + "px" };
                            $liElements.eq(z).css(style);
                        } this.refresh();
                        break;
                    case "allowMultiSelection":
                        this.model.allowMultiSelection = options[option];
                        if (!options[option]) {
                            var index = this.model.selectedIndex;
                            this._removeListHover();
                            ej.isNullOrUndefined(index) ? "" : this.selectItemByIndex(index);
                        };
                        break;
                    case "totalItemsCount":
                        if (!ej.isNullOrUndefined(this.dataSource())) {
                            this.model.totalItemsCount = options[option];
                            if (this.model.query)
                                this._queryCheck(this.model.query);
                        }
                        break;
                }
            }
            if (refresh) this._refresh();
        },
        _destroy: function () {
            if (!ej.isNullOrUndefined(this._lilist)) $(this._lilist).ejDraggable("destroy");
            this.element.insertAfter(this.listContainer);
            this.element.find(".e-chkbox-wrap").remove();
            this.listContainer.remove();
			this.element.removeClass("e-ul");
            if (!this._isList) this.element.empty();
            $(window).off("resize", $.proxy(this._OnWindowResize, this));
			this._ListEventUnbind(this.element.children("li"));
            return this;
        },
		_ListEventUnbind: function (_ListItemsContainer) {
			_ListItemsContainer.off("contextmenu", $.proxy(this._OnMouseContext, this));
            _ListItemsContainer.off("click", $.proxy(this._OnMouseClick, this));
            _ListItemsContainer.off("touchstart mouseenter", $.proxy(this._OnMouseEnter, this));
            _ListItemsContainer.off("touchend mouseleave", $.proxy(this._OnMouseLeave, this));
		},
        _refresh: function () {
            this._destroy()._init();
        },
        _finalize: function () {
            if (this.model.selectedIndex != null)
                this.selectItemByIndex(this.model.selectedIndex);
            else if ((this.model.showCheckbox == true) && (this._selectedItems.length > 0))
                this._selectCheckedItem(this._selectedItems);
            if (this.model.checkedIndices != null) this.checkItemsByIndices(this.model.checkedIndices.toString());
            return this;
        },
        _initialize: function () {
            this._isList = this.element.children().length ? true : false;
            this.target = this.element[0];
            this._queryString = null;
            this._disabledItems = [];
            this._itemId = null;
            this._up = this._down = this._ctrlClick = false;
            this.checkedStatus = this._isScrollComplete = false;
            this._incqueryString = "";
            this._totalCount = 0;
            this._activeItem = null;
            this._initValue = true;
            this.model.allowVirtualScrolling = (this.model.allowVirtualScrolling) ? this.model.allowVirtualScrolling : this.model.enableLoadOnDemand;
            this.model.virtualScrollMode = (this.model.enableVirtualScrolling) ? "continuous" : this.model.virtualScrollMode;
            this._selectedItems = [];
            this._checkedItems = [];
            this._loadContent = this.model.loadDataOnInit;
            this._loadInitialRemoteData = true;
            this._skipInitialRemoteData = false;
            if (this.model.enableVirtualScrolling) this.model.allowVirtualScrolling = true;
            this._setItemsCount();
            return this;
        },
        _render: function () {
            this._savedQueries = this.model.query.clone();
            if (this.model.totalItemsCount)
                this._savedQueries.take(this.model.totalItemsCount);
            this._renderContainer()._addAttr(this.model.htmlAttributes);
            if (ej.DataManager && this.dataSource() instanceof ej.DataManager) {
                if (this.model.actionBegin)
                    this._trigger("actionBegin", {});
                if (this._loadInitialRemoteData)
                    this._initDataSource(this.dataSource());
            }
            else
                this._showFullList();
            if (!this.dataSource()) this._finalize();
			this.listItemsElement=this.element.find("li:not('.e-ghead')");
            if (this.model.showRoundedCorner)
                this._roundedCorner();
            return this;
        },
        _queryCheck: function (value) {
            this._savedQueries = value.clone();
            this.element.empty();
            if (this.dataSource())
                this._checkModelDataBinding(this.dataSource());
        },
        _checkModelDataBinding: function (source) {
            this.mergeValue = null;
            this.dataSource(source);
            if (source != null && source.length != 0) {
                if (ej.DataManager && source instanceof ej.DataManager) this._initDataSource(source);
                else this._showFullList();
            } else { this.element.empty(); this._refreshScroller(); }
        },
        _initDataSource: function (source) {
            var proxy = this;
            proxy.listitems = proxy.dataSource();
            proxy._updateLoadingClass(true);
            var queryPromise = source.executeQuery(this._getQuery());
            queryPromise.done(function (e) {
                proxy._totalCount = e.count;
                proxy.listitems = e.result;
                proxy._updateLoadingClass()._showFullList()._trigger("actionSuccess", e);
                proxy._finalize();
                proxy._virtualPages = [0];
            }).fail(function (e) {
                proxy.dataSource(null);
                proxy._updateLoadingClass(true)._trigger("actionFailure", e);
            }).always(function (e) {
                if (proxy.model.checkAll)
                    proxy.checkAll();
                if (proxy.model.uncheckAll)
                    proxy.uncheckAll();
                proxy._trigger("actionComplete", e);
            });
        },
        _getQuery: function () {
            var queryManager;
            if (ej.isNullOrUndefined(this.model.query)) {
                var column = [],
                    mapper = this.model.fields;
                queryManager = ej.Query();
                for (var col in mapper)
                    if (col !== "tableName") column.push(mapper[col]);
                if (column.length > 0) queryManager.select(column);
                if (!this.dataSource().dataSource.url.match(mapper.tableName + "$")) !ej.isNullOrUndefined(mapper.tableName) && queryManager.from(mapper.tableName);
            } else queryManager = this.model.query.clone();
            if(this.model.allowVirtualScrolling) {
                queryManager.requiresCount();
                queryManager.take(this.model.itemRequestCount);
            }
            return queryManager;
        },
        _getLiHeight: function () {
            this._liItemHeight = $(this.element.find('li')[0]).outerHeight();
        },
        _addDragableClass: function () {
            if (this.model.allowDrag || this.model.allowDrop) {
                this.element.css("cursor", "pointer");
                if (this.model.allowDrop) {
                    this.listContainer.addClass("e-droppable");
                    this.listBoxScroller.addClass("e-droppable");
                }
                var proxy = this;
                this.element.children("li").each(function (index) {
                    if (proxy.model.allowDrag) ($(this).addClass("e-draggable"));
                    if (proxy.model.allowDrop) ($(this).addClass("e-droppable"));
                });
            }
            return this;
        },
        _enableDragDrop: function () {
            if (this.model.allowDrag || this.model.allowDrop) this._drag();
        },
        _updateLoadingClass: function (value) {
            this.listContainer[(value ? "addClass" : "removeClass")]("e-load"); return this;
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.listContainer.addClass(value);
                else if (key == "required") proxy.element.attr(key, value);
                else if (key == "disabled" && value == "disabled") proxy._enabled(false);
                else proxy.listContainer.attr(key, value);
            });
        },
        _renderContainer: function () {
            this.listContainer = ej.buildTag("div.e-ddl-popup e-box e-popup e-widget " + this.model.cssClass, "", {
                "visibility": "hidden"
            }, {
                "tabIndex": 0,
                "id": this._id + "_container"
            });
            this.listBoxScroller = ej.buildTag("div.e-listbox-container");
            this.ultag = ej.buildTag("ul.e-ul", "", {}, {
                "role": "listbox"
            });
            this.element = this.element.addClass("e-ul");
            this.listContainer.append(this.listBoxScroller).insertAfter(this.element);
            this.listBoxScroller.append(this.element);
            this.element.attr('data-ej-unselectable', 'on').css('user-select', 'none');
            this._hiddenInput = ej.buildTag("input#" + this._id + "_hidden", "", {}, {
                type: "hidden"
            }).insertBefore(this.element);
            this._hiddenInput.attr('name', this._id);
            return this;
        },
        _setMapFields: function () {
           var mapper = this.model.fields;
            this.mapFld = {
                _id: null,
                _imageUrl: null,
                _imageAttributes: null,
                _tooltipText: null,
                _spriteCSS: null,
                _text: null,
                _value: null,
                _htmlAttributes: null,
                _selectBy: null,
                _checkBy: null
            };
            this.mapFld._id = (mapper && mapper.id) ? mapper["id"] : "id";
            this.mapFld._imageUrl = (mapper && mapper.imageUrl) ? mapper["imageUrl"] : "imageUrl";
            this.mapFld._tooltipText = (mapper && mapper.tooltipText) ? mapper["tooltipText"] : "tooltipText";
            this.mapFld._imageAttributes = (mapper && mapper.imageAttributes) ? mapper["imageAttributes"] : "imageAttributes";
            this.mapFld._spriteCSS = (mapper && mapper.spriteCssClass) ? mapper["spriteCssClass"] : "spriteCssClass";
            this.mapFld._text = (mapper && mapper.text) ? mapper["text"] : this.listitems[0].text ? "text" : this._getObjectKey(this.listitems[0])[0];
            this.mapFld._value = (mapper && mapper.value) ? mapper["value"] : "value";
            this.mapFld._htmlAttributes = (mapper && mapper.htmlAttributes) ? mapper["htmlAttributes"] : "htmlAttributes";
            this.mapFld._checkBy = (mapper && mapper.checkBy) ? mapper["checkBy"] : "checkBy";
            this.mapFld._selectBy = (mapper && mapper.selectBy) ? mapper["selectBy"] : "selectBy";
            this.mapCateg = (mapper && mapper.groupBy) ? mapper["groupBy"] : ""
        },
        _getObjectKey: function (obj) {
            if (!Object.keys) {
                var keys = [];
                for (var i in obj) {
                    if (obj.hasOwnProperty(i)) {
                        keys.push(i);
                    }
                }
                return keys;
            }
            else return Object.keys(obj)
        },
        _itemStyle:function(){
            var height = ej.isNullOrUndefined(this.model.itemHeight) ? this.model.itemHeight : this.model.itemHeight.toString().replace("px", "");
            var itemHeight = ej.isNullOrUndefined(this.model.itemHeight) ? "" : "min-height:" + height + "px;height:" + height + "px";
            return { style: itemHeight }
        },
        sort: function () {
            var sortedlist = document.createElement("ul"), i, sortitems;
            $(sortedlist).append(this.itemsContainer.children());
            if (this.model.fields.groupBy != null || $(sortedlist).find(">.e-ghead").length > 0) {
                for (i = 0; i < $(sortedlist).find(">.e-ghead").length; i++) {
                    sortitems = $(sortedlist).find(">.e-ghead").eq(0).first().nextUntil(".e-ghead").get();
                    this._setSortList(sortedlist, sortitems);
                }
                var headerlist = document.createElement("ul"), headeritems, j;
                headeritems = $(sortedlist).clone().find('>.e-ghead').get();
                for (var k = 0; k < headeritems.length; k++)
                    headerlist.append(headeritems[k]);
                var headerdata = this._customSort(headerlist, headeritems);
                var groupSort = document.createElement("ul"), groupitems;
                var temp = $(sortedlist).find('li.e-ghead').get();
                if (this.model.sortOrder.toLowerCase() == "descending")
                    headerdata.reverse();
                for (j = 0; j < headerdata.length; j++) {
                    groupSort.append(headerdata[j]);
                    for (l = 0; l < temp.length; l++) {
                        if (headerdata[j].textContent == temp[l].textContent) {
                            groupitems = $(sortedlist).find(">.e-ghead").eq(l).first().nextUntil(".e-ghead").get();
                            for (m = 0; m < groupitems.length; m++) {
                                groupSort.append(groupitems[m]);
                            }
                        }
                    }
                }
                this.itemsContainer = $(groupSort);
            }
            else {
                sortitems = $(sortedlist).children('li').get();
                this._setSortList(sortedlist, sortitems);
                this.itemsContainer = $(sortedlist)
            }
        },
        _customSort: function (headerlist, headeritems) {
            headeritems.sort(function (objA, objB) {
                var sortA = $(objA).text().toUpperCase();
                var sortB = $(objB).text().toUpperCase();
                return (sortA < sortB) ? -1 : (sortA > sortB) ? 1 : 0;
            });
            return headeritems;
        },
        _setSortList: function (sortedlist, sortitems) {
            this._customSort(sortedlist, sortitems);
            if (this.model.sortOrder.toLowerCase() == "descending") sortitems.reverse();
            if (this.model.fields.groupBy != null || $(sortedlist).find(">.e-ghead").length > 0) {
                $(sortedlist).append($("<li>").text($(sortedlist).find(">.e-ghead").eq(0).text()).addClass("e-ghead"));
                $(sortedlist).find(">.e-ghead").eq(0).remove();
            }
            $.each(sortitems, function (index, item) {
                $(sortedlist).append(item);
            });
        },
        _renderlistContainer: function () {
            this.hold = this.touchhold = false;
            this.item = "";
            this.startime = 0;
            this.listitemheight = 24;
            var list = this.listitems,
                i, ulempty, ulno, litag, _id, _txt, mapper = this.model.fields,
                predecessor;
            this.lastScrollTop = -1;
            this.dummyUl = $();
            if (this.model.enableRTL) this.listContainer.addClass("e-rtl");
            this._wordWrapItems();
            if (this.dataSource() == null || this.dataSource().length < 1) {
                predecessor = this.element.parents().last();
                if (this.model.targetID) this.docbdy = predecessor.find("#" + this.model.targetID);
                else this.docbdy = predecessor.find("#" + this._id);
                this.itemsContainer = this.docbdy;
                if(this.model.sortOrder != "none") this.sort();
                this.itemsContainer.children("ol,ul").remove();
                this.items = this.itemsContainer.children('li');
                this.items.children("img").addClass("e-align");
                this.items.children("div").addClass("e-align");
                var iHeight = parseInt(this.model.itemHeight) + "px";
                if (this.model.itemHeight) $('li').css({ "min-height": iHeight, "height": iHeight });
                this.element.append(this.itemsContainer.children());
            }
            else if (this.dataSource() != null && typeof list[0] != "object") {
                if (this._loadInitialRemoteData && this.mergeValue && this.model.virtualScrollMode == "continuous" && this.model.totalItemsCount)
                    this._loadlist(this.mergeValue);
                else if (this._loadInitialRemoteData && this.mergeValue && this.model.virtualScrollMode == "normal" && this.model.totalItemsCount) {
                    this.realUllength = 0;
                    this.mergeUl = [];
                    for (i = 0; i < this.mergeValue.length; i++)
                         this.mergeUl.push(ej.buildTag('li', this.mergeValue[i][this.model.fields.text], null, this._itemStyle())[0]);
                    this.element.append(this.mergeUl);
                    for (i = 0; i < this.model.totalItemsCount - this.mergeValue.length; i++)
                        this.dummyUl.push(ej.buildTag('li', null, null, this._itemStyle())[0]);
                    this.element.append(this.dummyUl);
                    this._refreshScroller();
                }
                else if (this._loadInitialRemoteData && this.mergeValue && !this.model.totalItemsCount)
                    this._initDataSource(this.dataSource());
            }
            else {
                this._setMapFields();
                var groupedList, _query;
                _query = this._savedQueries;
                this.listContainer.height(this.model.height);
                this.listitemheight = 24;
                if (this.model.allowVirtualScrolling) {
                    if (this.model.virtualScrollMode == "normal") {
                        this.realUllength = 0;
                        if (this.dataSource().length < 0) {
                            query = this._savedQueries.take(parseInt(this.listContainer.height() / this.listitemheight));
                            var proxy = this;
                            if (ej.DataManager && this.dataSource() instanceof ej.DataManager) {
                                proxy.listitems = proxy.dataSource();
                                var queryPromise = this.dataSource().executeQuery(query);
                                queryPromise.done(function (e) {
								    proxy._trigger("actionBeforeSuccess", e);
                                    proxy.listitems = e.result;
                                    proxy._trigger("actionSuccess", e);
                                }).fail(function (e) { proxy._trigger("actionFailure", e); })
                                  .always(function (e) { proxy._trigger("actionComplete", e); });
                            }
                        }
                        if (this.mergeValue && this.mergeValue != groupedList && this.mergeValue != undefined) {
                            this.mergeUl = [];
                            for (i = 0; i < this.mergeValue.length; i++) {
                                var $liEle = ej.buildTag('li', this.model.template ? "" : this.mergeValue[i][this.model.fields.text], null,  this._itemStyle())[0]
                                if (this.model.template) $liEle.append(this._getTemplatedString(list[i]));
                                this.mergeUl.push($liEle[0]);
                            }
                            this.element.append(this.mergeUl);
                        }
                        if (!this.model.totalItemsCount)
                            var originalliLength = this.listitems.length;
                        else
                            var originalliLength = (this.mergeValue) ? this.model.totalItemsCount - this.mergeValue.length : this.model.totalItemsCount;
                        for (var i = 0; i < originalliLength; i++) {
                            var $listEle = ej.buildTag('li', null, null,  this._itemStyle());
                            this.dummyUl.push($listEle[0]);
                        }
                        this.dummyUl.attr("data-ej-page", 0);
                        this.element.append(this.dummyUl);
                    }
                    this._loadInitialData(_query, list);
                } else {
                    if (this.mapCateg && this.mapCateg != "") {
                        _query = ej.Query().group(this.mapCateg);
                        if(this.model.sortOrder.toLowerCase() == "none")
                       _query.queries.splice(0, 1);
                        groupedList = ej.DataManager(list).executeLocal(_query);
                        if (this.model.sortOrder.toLowerCase() != "none") {
                            var sortQuery = ej.Query().sortBy(this.mapFld._text, this.model.sortOrder, true);
                            groupedList = ej.DataManager(groupedList).executeLocal(sortQuery);
                        }
                        this.dataSource([]);
                        for (i = 0; i < groupedList.length; i++) {
                            this.dummyUl.push(ej.buildTag('li.e-ghead', groupedList[i].key)[0]);
                            this._loadlist(groupedList[i].items);
                            this.dataSource(this.dataSource().concat(groupedList[i].items));
                        }
                    }
                    else {
                        groupedList = ej.DataManager(list).executeLocal(_query);
                        if (groupedList.length > 0) {
                            if (this.mergeValue && this.mergeValue != groupedList && this.mergeValue != undefined) {
                                this.mergeUl = [];
                                for (i = 0; i < this.mergeValue.length; i++) {
                                    this.mergeUl.push(ej.buildTag('li', this.mergeValue[i][this.model.fields.text], null,  this._itemStyle())[0]);
                                    groupedList.push(this.mergeValue[i]);
                                }
                            }
                            if (this.model.template != null && this._loadContent) {
                                if (this.model.sortOrder.toLowerCase() != "none") {
                                    var sortQuery = ej.Query().sortBy(this.mapFld._text, this.model.sortOrder, true);
                                    list = ej.DataManager(list).executeLocal(sortQuery);
                                }
                                for (i = 0; i < list.length; i++) {
                                    var _dhtmlAttributes = this._getField(list[i], this.mapFld._htmlAttributes);
                                    var _did = this._getField(list[i], this.mapFld._id);
                                    litag = ej.buildTag('li');
                                    if ((_dhtmlAttributes) && (_dhtmlAttributes != "")) litag.attr(_dhtmlAttributes);
                                    if (_did) litag.attr('id', _did);
                                    if (this.model.template) litag.append(this._getTemplatedString(list[i]));
                                    this.dummyUl.push(litag[0]);
                                }
                                if (!this.model.allowVirtualScrolling) this.element.children().remove();
								var k = (this.model.virtualScrollMode == "continuous" && this.mergeValue) ? this.realUllength + this.mergeValue.length : this.realUllength;
                                if (this.element.children()[k] == null && (!this.model.allowVirtualScrolling || this.model.virtualScrollMode == ej.VirtualScrollMode.Continuous) && this._loadContent)								
                                this.element.append(this.dummyUl);
                            }
                            else {
                                this.realUllength = 0;
                                this._loadlist(groupedList);
                            }
                        }
                    }
                }
            }
            var proxy = this;
            if (groupedList) this.listitems = groupedList;
            this._setDimensions();
            this.listContainer.css({ "position": "relative", "height": "" });
            this.listBoxScroller.css({ "height": "", "width": "" });
            if(this.model.allowVirtualScrolling == true && this.model.virtualScrollMode == "normal") {
                this._getLiHeight();
                totalHeight = this._totalCount * this._liItemHeight;
                $('.e-listbox-container ul.e-listbox').height(totalHeight);
            }
            else if(this.model.allowVirtualScrolling == true && this.model.virtualScrollMode == "continuous") {
                $('.e-listbox-container ul.e-listbox').css("height", "auto");
            }
            this.listContainer.ejScroller({
                height: this.listContainer.height(),
                width: 0,
                scrollerSize: 20,
                scroll: function (e) {
                    proxy._onScroll(e);
                },
            });
            this.scrollerObj = this.listContainer.ejScroller("instance");
            this._setDimensions();
            this.listContainer.css({ 'display': 'none', 'visibility': 'visible' });
            this._checkboxHideShow(this.model.showCheckbox)._checkitems()._showResult();
            //if (this.model.totalItemsCount)
            //    this._setTotalItemsCount();
        },
		  _wordWrapItems:function(){
			   this.model.enableWordWrap?this.listContainer.addClass("e-wrap").removeClass("e-nowrap"):this.listContainer.addClass("e-nowrap").removeClass("e-wrap");
			},
	
        _loadInitialData: function (query, list) {
            var _query = query.clone();
            this.realUllength = 0;
            if ((ej.DataManager && this.dataSource() instanceof ej.DataManager))
                _query = _query.range(0, parseInt(this.listContainer.height() / this.listitemheight));
            else
                _query = _query.range(0, this.listitems.length);
            groupedList = list;
            if (this.mergeValue && this.mergeValue != groupedList && this.mergeValue != undefined && this.model.virtualScrollMode == "continuous") {
                this.mergeUl = [];
                for (i = 0; i < this.mergeValue.length; i++)
                    this.mergeUl.push(ej.buildTag('li', this.mergeValue[i][this.model.fields.text], null,  this._itemStyle())[0]);
                this.element.append(this.mergeUl);
            }
            if (!this.mergeValue || (this.mergeValue && this._loadInitialRemoteData))
                this._loadlist(groupedList);
        },
        _loadlist: function (sublist) {
            this._dummyVirtualUl = [];
            if (this.element != null) {
                var selectionArray = [];
                if (this.model.sortOrder.toLowerCase() != "none") {
                    var sortQuery = ej.Query().sortBy(this.mapFld._text, this.model.sortOrder, true);
                    sublist = ej.DataManager(sublist).executeLocal(sortQuery);
                }
                for (var j = 0; j < sublist.length; j++) {
                    var _did = this._getField(sublist[j], this.mapFld._id);
                    var _dimageUrl = this._getField(sublist[j], this.mapFld._imageUrl);
                    var _dimageAttributes = this._getField(sublist[j], this.mapFld._imageAttributes);
                    var _dspriteCss = this._getField(sublist[j], this.mapFld._spriteCSS);
                    var _dtext = this._getField(sublist[j], this.mapFld._text);
                    var _dvalue = this._getField(sublist[j], this.mapFld._value);
                    var _dhtmlAttributes = this._getField(sublist[j], this.mapFld._htmlAttributes);
                    var _dselectBy = this._getField(sublist[j], this.mapFld._selectBy);
                    var _dcheckBy = this._getField(sublist[j], this.mapFld._checkBy);
                    var _dtooltipText = this._getField(sublist[j], this.mapFld._tooltipText);
                    var k = (this.model.virtualScrollMode == "continuous" && this.mergeValue) ? this.realUllength + this.mergeValue.length : this.realUllength;
                    if ((_dvalue) && (_dvalue != "")) litag = ej.buildTag('li', "", "", $.extend( this._itemStyle(), {value: _dvalue}));
                    else var litag = ej.buildTag('li', null, null,  this._itemStyle()); if (_did) litag.attr('id', _did);

                    if ((_dimageUrl) && (_dimageUrl != "")) {
                        imgtag = ej.buildTag('img.e-align', '', {}, {
                            'src': _dimageUrl,
                            'alt': _dtext
                        });
                        if ((_dimageAttributes) && (_dimageAttributes != "")) imgtag.attr(_dimageAttributes);
                        litag.append(imgtag);
                    }
                    if ((_dspriteCss) && (_dspriteCss != "")) {
                        divtag = ej.buildTag('div.e-align ' + _dspriteCss + ' sprite-image');
                        litag.append(divtag);
                    }
                    if ((_dtext) && (_dtext != "")){
                    if(this.model.template) litag.append(this._getTemplatedString(sublist[j]))
                    else litag.append(_dtext);
                    }
                    if ((_dhtmlAttributes) && (_dhtmlAttributes != "")) litag.attr(_dhtmlAttributes);
                    if ((_dtooltipText) && (_dtooltipText != "")) litag.attr('data-content', _dtooltipText).addClass("e-tooltip");
                    if (_dcheckBy || this.model.checkAll) litag.addClass("checkItem");
                    if (_dselectBy || this.model.selectAll) litag.addClass("selectItem");
                    if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "normal") {
                        $(litag[0]).attr("data-ej-page", 0);
                        ($(this.dummyUl[k])).replaceWith(litag[0]);
                        this._dummyVirtualUl.push(litag[0]);
                    }
                    else
                        this.dummyUl.push(litag[0]);
                    this.realUllength += 1;
                }
                if (!this.model.allowVirtualScrolling) this.element.children().remove();
                if (this.element.children()[k] == null && (!this.model.allowVirtualScrolling || this.model.virtualScrollMode == ej.VirtualScrollMode.Continuous) && this._loadContent)
                    this.element.append(this.dummyUl);
                var listItems = this.element.find("li:not('.e-ghead')"); this.listItemsElement = this.element.find("li:not('.e-ghead')");
                if (this.model.showCheckbox && this.model.checkedIndices) {
                    for (var i = 0; i < listItems.length; i++)
                        if (this.model.checkedIndices.indexOf(i) != -1)
                            $(listItems[i]).addClass("checkItem");
                }
                else if (!this.model.showCheckbox) {
					if(this.value()!="" && !this.mapCateg && !this.mapCateg != "") this.selectItemByText(this.value());
                    for (var i = 0; i < listItems.length; i++)
                        if (this.model.selectedIndices.indexOf(i) != -1 || this.model.selectedIndex == i)
                            $(listItems[i]).addClass("selectItem");
                }
                this.element.find('.selectItem').each(function (i, e) {
                    selectionArray.push($(e).parent().find("li").index($(e)));
                });
                var proxy = this;
                if (!proxy.model.showCheckbox && !this.mapCateg && !this.mapCateg != "")
                    proxy._selectListItems();
                this.element.find('.checkItem').each(function (i, e) {
                    proxy.model.checkedIndices.push(proxy._elementIndex(e));
                });
				if(!this.mapCateg && !this.mapCateg != ""){
                if (selectionArray.length)
                    this.model.allowMultiSelection ? this.model.selectedIndices = selectionArray : this.model.selectedIndex = selectionArray[0];
                if (this.model.checkedIndices)
                    this.model.checkedIndices = $.grep(proxy.model.checkedIndices, function (el, index) { return index == $.inArray(el, proxy.model.checkedIndices); });
                else if (this.model.selectedIndices)
                    this.model.selectedIndices = $.grep(proxy.model.selectedIndices, function (el, index) { return index == $.inArray(el, proxy.model.selectedIndices); });
				}
                this._loadContent = true;
            }
            return this;
            
        },
        _applySelection: function () {
            if (!(this.model.fields.checkBy || this.model.fields.selectBy)) return false;
            if (this.model.showCheckbox) {
                this.uncheckAll();
                this.checkItemsByIndices(this.model.checkedIndices);
            }
            else {
                if (this.model.allowMultiSelection)
                    this.selectItemsByIndices(this.model.selectedIndices);
                else {
                    this.unselectAll();
                    this.selectItemByIndex(this.model.selectedIndex);
                }
            }
        },
        _getField: function (obj, fieldName) {
            return ej.pvt.getObject(fieldName, obj);
        },
        _getTemplatedString: function (list) {
            var str = this.model.template,
                start = str.indexOf("${"),
                end = str.indexOf("}");
            while (start != -1 && end != -1) {
                var content = str.substring(start, end + 1);
                var field = content.replace("${", "").replace("}", "");
                str = str.replace(content, this._getField(list, field));
                start = str.indexOf("${"), end = str.indexOf("}");
            }
            return str;
        },
        _checkboxHideShow: function (value) {
            this.model.showCheckbox = value;
            (value) ? this._createCheckbox() : this._removeCheckbox();
            return this;
        },
        _createCheckbox: function () {
            var i, _extchk, chklist, me = this;
            this._listitems = this.listContainer.find("ol,ul").length > 0 ? this.listContainer.find("ol,ul").children("li:not('.e-ghead')") : this.element.children("li:not('.e-ghead')");
            chklist = this._listitems.find('input[type=checkbox]');
            for (i = 0; i < this._listitems.length; i++) {
                if ($(this._listitems[i]).text() != "") {
                    $checkbox = ej.buildTag("input.listcheckbox e-align#popuplist" + i + "_" + this._id, "", {}, {
                        type: "checkbox",
                        name: "list" + i
                    });
                    if (!$(this._listitems[i]).find('input[type=checkbox]').length)
                        $(this._listitems[i]).prepend($checkbox);
                }
            }
            this.listContainer.find(".listcheckbox").ejCheckBox({
                cssClass: this.model.cssClass,
                change: $.proxy(this._onClickCheckList, this)
            });
            for (i = 0; i < this._listitems.length; i++) {
                var checkbox = $(this._listitems[i]).find(".listcheckbox");
                if ($(this._listitems[i]).hasClass('e-disable')) checkbox.ejCheckBox('disable');
                else if ( $(this._listitems[i]).hasClass('checkItem') && !checkbox.ejCheckBox('isChecked')) {                    
                    checkbox.ejCheckBox({
                        "checked": true
                    });
                    this._activeItem = i;
                    this.checkedStatus = true;
                    var checkData = this._getItemObject($(this._listitems[i]), null);
                    checkData["isInteraction"] = true;
                    if (!this._initValue) this._trigger('checkChange', checkData);
                    $(this._listitems[i]).removeClass('checkItem');
                }
            }
            for (i = 0; i < this.model.selectedIndices.length; i++) {
                this.checkItemsByIndices(this.model.selectedIndices);
            }
        },
        _removeCheckbox: function () {
            var i, checkbox;
            this.listitem = this.listContainer.find("ol,ul").children("li");
            checkbox = this.listitem.find('.listcheckbox');
            if (checkbox.length > 0) {
                this.listitem.find('.listcheckbox').ejCheckBox('destroy');
                this.listitem.find('input[type=checkbox]').remove();
                if (this.model.allowMultiSelection) {
                    for (i = 0; i < this.model.checkedIndices.length; i++) {
                        this.selectItemsByIndices(this.model.checkedIndices);
                    }
                } else this.selectItemByIndex(this.model.checkedIndices[0]);
                this._checkedItems = this.model.checkedIndices = [];
            }
        },
        _selectCheckedItem: function (chkitems) {
            if (chkitems.length > 0)
                for (i = 0; i < chkitems.length; i++)
                    this._selectedItems.push(chkitems[i]);
        },
        _refreshScroller: function () {
            if (this.model.virtualScrollMode == "continuous") {
                this.listContainer.css({ "display": "block" });
                if (this.scrollerObj) {
                    this.scrollerObj.model.height = this.listContainer.height();
                    this.scrollerObj.refresh();
                }
            } else {
                this.listContainer.find(".e-vhandle div").removeAttr("style");
                var listboxcontent = this.listBoxScroller.height();
                this.listContainer.css({ "display": "block" });
                if (this.scrollerObj) {
                    this.scrollerObj.model.height = this.listContainer.css("height");
                    this.scrollerObj.refresh();
                }
                this.listBoxScroller.css("height", "100%");
            }
            if (!this.model.enabled) {
                if (this.scrollerObj) this.scrollerObj.disable();
            }
            this.listContainer.css("height", this.model.height);
        },
        _setDimensions: function () {
            this.listContainer.css({ "width": this.model.width, "height": this.model.height });
            this._refreshScroller();
            return this;
        },
        _setItemsCount: function () {
            if(this.model.height=="auto"){
            if (this.model.itemsCount && this.model.itemsCount != 0 && this.model.height == "auto")
                this.model.height = this.model.itemsCount * 30;
            else
                this.model.height = (this.model.height == "auto") ? "220" : this.model.height;
              }
               else if (this.model.height != "auto" && this.model.itemsCount) {
                if (this.model.itemHeight)
                this.model.height = (this.model.height == "auto") ? "220" : this.model.itemsCount * this.model.itemHeight.replace(/[^-\d\.]/g, '');
                else
                    this.model.height = (this.model.height == "auto") ? "220" : this.model.itemsCount * 30;
            }
            else if (this.model.height != "auto" && this.model.itemsCount !=0) {
                this.model.height;
            }
            return this;
        },
        _setTotalItemsCount: function () {
            if (this.model.virtualScrollMode != "continuous") {
                this.element.height(this.element.find("li").outerHeight() * this.model.totalItemsCount);
                this.scrollerObj.refresh();
            }
        },

        _refreshContainer: function () {
            this.listContainer.css({ "position": "relative" });
            this._setDimensions()._roundedCorner()._refreshScroller();
        },
        _drag: function () {
            var proxy = this,
                pre = false,
                _clonedElement = null,
                dragContainment = null;
            this._listitem = this.element.parent();
            this._lilist = this._addItemIndex ? $($(this._listitem).find("li")[this._addItemIndex]) : $(this._listitem).find("li");
            this._lilist.not(".e-js").ejDraggable({
                dragArea: dragContainment,
                clone: true,
                dragStart: function (args) {
                  if( proxy.model.allowDrag || proxy.model.allowDragAndDrop ) {
                    if (!$(args.element.closest('.e-ddl-popup.e-js')).hasClass('e-disable') && !args.element.hasClass('e-disable')) {
                        var draggedobj = $("#" + this.element.parent()[0].id).data("ejListBox");
                        draggedobj._refreshItems();
                        var dragEle = proxy.getSelectedItems();
                        if (dragEle.length > 1 ? proxy._onDragStarts(dragEle, args.target) : proxy._onDragStarts([proxy._getItemObject(args.element, args)], args.target)) {
                            args.cancel = true;
                            _clonedElement && _clonedElement.remove();
                            return false;
                        }
                    } else {
                        _clonedElement && _clonedElement.remove();
                        return false;
                    }
                  }
                  else return false;
                },
                drag: function (args) {
                    var target = args.target;
                    var dragEle = proxy.getSelectedItems();
                    if (dragEle.length > 1 ? proxy._onDrag(dragEle, target) : proxy._onDrag([proxy._getItemObject(args.element, args)], target)) return false;
                    if ($(target).hasClass('e-droppable') || $(target).parent().hasClass('e-droppable'))
                        $(target).addClass("allowDrop");
                },
                dragStop: function (args) {
                    if (!args.element.dropped)
                        _clonedElement && _clonedElement.remove();
					if(!$(args.target).closest(".e-js.e-widget").hasClass("e-disable")){					
                    var target = args.target, targetObj = proxy;
                    var position = pre ? "Before" : "After";
                    var dragEle = proxy.getSelectedItems();
                    if (dragEle.length > 1 ? proxy._onDragStop(dragEle, target) : proxy._onDragStop([proxy._getItemObject(args.element, args)], target)) return false;
                    $(args.element).removeClass("e-active");
                    if (target.nodeName == 'UL') target = $(target)[0];
                    if ($(target).closest('li').length) target = $(args.target).closest('li')[0];
                    else if (target.nodeName != 'LI') target = $(target).closest('.e-ddl-popup.e-droppable')[0];
                    if (target && target.nodeName == 'LI' && $(target).hasClass('e-droppable') && $(target).closest('.e-ddl-popup.e-droppable').length) proxy._dropItem(target, args.element, pre, args.event);
                    else if ($(target).hasClass('e-droppable') && $(target).closest('.e-ddl-popup.e-droppable').length) proxy._dropItemContainer(target, args.element, args.event);
                    $(".allowDrop").removeClass("allowDrop");
                    if (args.target != proxy.element[0] && (args.element.parent().length && $(args.element.parent()[0]).data().ejWidgets[0] == "ejListBox")) {
                        proxy = $("#" + args.element.parent()[0].id).data($(args.element.parent()[0]).data().ejWidgets[0]);
                        if (dragEle.length > 1 ? proxy._onDropped(dragEle, target) : proxy._onDropped([proxy._getItemObject(args.element), args], args.target)) return false;
					}}
                    if( !proxy.model.allowDrag && !proxy.model.allowDragAndDrop ) proxy.element.children().removeClass("e-draggable");
                },
                helper: function (event, ui) {
                    if (!ej.isNullOrUndefined(event.element) && !$(event.element.closest('.e-ddl-popup.e-js')).hasClass('e-disable') && $(event.element).hasClass('e-draggable')) {
                        proxy = $(event.element).closest('.e-listbox.e-js').data('ejListBox');
                        proxy._tempTarget = $(event.element).text();
                        if ((proxy.model.allowDrag || proxy.model.allowDragAndDrop) && proxy) {
                            _clonedElement = $(event.sender.target).clone().addClass("dragClone e-dragClonelist");
                            _clonedElement.addClass(proxy.model.cssClass + (proxy.model.enableRTL ? ' e-rtl' : ''));
                            _clonedElement.css({ "width": proxy.element.width(), "padding": "5px 5px 5px 0.857em", "list-style": "none", "text-align": (proxy.model.enableRTL ? "right" : "left"), "opacity": "1" });
                            return _clonedElement.appendTo($("body"));
                        }
                    }
                }
            });
        },
        _dropItem: function (target, element, pre, event) {
            element.addClass("e-droppable");
            var targetid = $(target).closest('.e-ddl-popup.e-droppable')[0].id.replace('_container', '');
            var dataIndex = [], dataObj = [];
            var droppedobj = $("#" + targetid).data("ejListBox");
            var preventDrop = (droppedobj.model.showCheckbox ? !this.model.showCheckbox : this.model.showCheckbox);
            if (preventDrop) return;
            var data = this._getDropObject(target, element, event);
            dataIndex = data.dataIndex;
            dataObj = data.dataObj;
            pre ? $(this.li).insertBefore(target) : $(this.li).insertAfter(target);
            this._refreshItems();
            var ulElements =$(this.li.parent()[0]).find("li:not('.e-ghead')");
            if (dataObj && this.dataSource())
                this._dropDataSource(droppedobj, dataIndex, dataObj, ulElements.index(this.li));
            droppedobj._refreshItems();
        },
        _dropItemContainer: function (target, element, event) {
            element.addClass("e-droppable");
            var targetid = $(target)[0].id.replace('_container', '');
            var droppedobj = $("#" + targetid).data("ejListBox");
            var preventDrop = (droppedobj.model.showCheckbox ? !this.model.showCheckbox : this.model.showCheckbox);
            if (preventDrop) return;
            var dataIndex = [], dataObj = [];
            var data = this._getDropObject(target, element, event);
            dataIndex = data.dataIndex;
            dataObj = data.dataObj;
            this.li.insertAfter($($(target).find('li')).last());
			if($(target).find('ul').length > 0) $(target).find('ul').append(this.li);
			else $(target).find('ej-listbox').append(this.li);
            this._refreshItems();
            if (dataObj && this.dataSource())
                this._dropDataSource(droppedobj, dataIndex, dataObj, droppedobj.dataSource() ? droppedobj.dataSource().length : 0);
            if (!droppedobj.model.allowDrag)
                $(this.li).ejDraggable("instance")._destroy();
            droppedobj._refreshItems();
        },
        _dropDataSource: function (droppedobj, dataIndex, dataObj, droppedIndex) {
            var preventDropData = ej.DataManager && this.dataSource() instanceof ej.DataManager;
            if (preventDropData) return;
            if (dataIndex instanceof Array) {
                var proxy = this;
                $.each(dataObj, function (index) {
                   var indx = proxy.dataSource().indexOf(dataObj[index]);
                    proxy.dataSource().splice(indx, 1);
                });
            }
            else
                this.dataSource().splice(dataIndex, 1);
            if (droppedobj.dataSource() instanceof Array) {
                droppedobj.dataSource().splice.apply(droppedobj.dataSource(), [droppedIndex, 0].concat(dataObj));
            }
            else {
                droppedobj.dataSource(dataObj);
            }
        },
        _getDropObject: function (target, element, event) {
            var dataIndex = [], dataObj = [];
            if (this.model.allowMultiSelection) {
                this.li = $(element).parent().find(".e-select").removeClass("e-select e-hover");
                if (!this.li.length)
                 this.li = element.removeClass("e-select e-hover");
            }
            else
                this.li = element.removeClass("e-select e-hover");

            if (this.li.length) {
               var proxy = this;
               var sortFlg=this.model.sortOrder.toLowerCase();
                $.each(this.li, function (ele) {
                    var ulElements=$(this.parentElement).find("li:not('.e-ghead')");
                    dataIndex.push(ulElements.index(this));
                            if( sortFlg!="none"){
            var sortQuery = ej.Query().sortBy(sortFlg, true);
                    dataAfterSort = ej.DataManager(proxy.dataSource()).executeLocal(sortQuery);
                dataObj.push((proxy.dataSource()) ? dataAfterSort[ulElements.index(this)] : null);
            }
            else
                    dataObj.push((proxy.dataSource()) ? proxy.dataSource()[ulElements.index(this)] : null);
                });
            }
            else {
                dataIndex = this.li.index();
                dataObj = (this.dataSource()) ? this.dataSource()[dataIndex] : null;
            }
            return { "dataIndex": dataIndex, "dataObj": dataObj };
        },
        _showResult: function () {
            var proxy = this;
            this._refreshContainer();
            this.element.attr({
                "aria-expanded": true
            });
            var _ListItemsContainer = this.element.children("li:not('.e-ghead')");
            this._listSize = _ListItemsContainer.length;
			this._ListEventUnbind(_ListItemsContainer);
            _ListItemsContainer.on("touchstart mouseenter", $.proxy(this._OnMouseEnter, this));
            _ListItemsContainer.on("touchend mouseleave", $.proxy(this._OnMouseLeave, this));
            _ListItemsContainer.on("click", $.proxy(this._OnMouseClick, this));
            _ListItemsContainer.on("contextmenu", $.proxy(this._OnMouseContext, this));            
            if (proxy.model.showCheckbox) proxy.element.find(".listcheckbox").ejCheckBox({ enabled: proxy.model.enabled });
            return this;
        },
        _OnWindowResize: function (e) {
            this._refreshContainer();
            this.listContainer.css("display", "block");
        },
        refresh: function (value) {
		    if (!ej.isNullOrUndefined(this.model.query)) this._savedQueries = this.model.query; 
            if (this.model.dataSource) {
                if (this.model.template)
                    this.element.empty();
                this._checkModelDataBinding(this.dataSource());
            }
            else {
                this.listContainer.css({ "height": this.model.height, "width": this.model.width });
                this._refreshScroller();
            }
        },
        _removeListHover: function () {
            this._selectedItems = [];
            this.model.selectedIndices = [];
            this.model.selectedIndex = null;
            this.element.children("li").removeClass("e-hover e-select selectItem");
            return this;
        },
        _addListHover: function () {
            this._activeItem = this._selectedItem;
            var activeItem = this._getItem(this._selectedItem);
            activeItem.addClass("e-select e-hover");
            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop() });
            activeItem.focus();
            this._OnListSelect(this.prevselectedItem, this._selectedItem);
        },
        _calcScrollTop: function (value) {
            var ulH = this.element.outerHeight(),
                li = this.element.find("li"),
                liH = 0,
                index, top, i;
            index = value ? value : this.element.find("li.e-select").index();
            for (i = 0; i < index; i++)
                liH += li.eq(i).outerHeight();
            top = liH - ((this.listContainer.outerHeight() - li.eq(index).outerHeight()) / 2);
            return top;
        },
        _refreshItems: function () {
            this.listBoxScroller.append(this.element);
            this.listContainer.append(this.listBoxScroller);
            this._refreshContainer();
            this._showResult();
            this._setSelectionValues();
            this._setDisableValues();
        },
        _selectedIndices: function () {
            var selectItem;
            this.element.children("li:not('.e-ghead')").each(function (index) {
                if ($(this).hasClass("e-select")) {
                    selectItem = index;
                    return false
                }
            });
            this._selectedItem = selectItem;
            return selectItem;
        },
        _addSelectedItem: function (e) {
            if ((!$.isArray(this.model.disableItemsByIndex) && this.model.disableItemsByIndex != null) || ($.isArray(this.model.disableItemsByIndex) && this.model.disableItemsByIndex.length > 0)) {
                if (e.keyCode == 40 || e.keyCode == 39) this._disableItemSelectDown();
                else this._disableItemSelectUp();
                this._selectedItem = this._activeItem
            }
            var activeItem = this._getItem(this._selectedItem);
            this._selectedItems.push(activeItem)
        },
        _getItem: function (val) {
            return $(this.element.children("li:not('.e-ghead')")[val])
        },
        _getItemObject: function (item, evt) {
            var index = this._elementIndex(item);
            return {
                item: item,
                index: index,
                text: item.text(),
                value: item.attr("value") ? item.attr("value") : item.text(),
                isEnabled: !item.hasClass("e-disable"),
                isSelected: item.hasClass("e-select"),
                isChecked: item.find('.e-chk-image').hasClass('e-checkmark'),
                data: this.dataSource() ? this.getListData()[index] : null,
                event: evt ? evt : null
            };
        },
        _roundedCorner: function () {
            this.listContainer[(this.model.showRoundedCorner ? "addClass" : "removeClass")]("e-corner-all");
            return this;
        },
        _enabled: function (boolean) {
            boolean ? this.enable() : this.disable();
            return this;
        },
        _showFullList: function () {
            if (this.dataSource() != null) {
                if (!(ej.DataManager && this.dataSource() instanceof ej.DataManager))
                    this.listitems = this.dataSource();
                if (this._savedQueries.queries.length && !(ej.DataManager && this.dataSource() instanceof ej.DataManager))
                    this.listitems = ej.DataManager(this.dataSource()).executeLocal(this._savedQueries);
            }
            this._renderlistContainer();
            if (!(this.dataSource() instanceof ej.DataManager)) this._trigger("actionComplete");
            this._addDragableClass()._enableDragDrop();
            this._disabledItems = [];
            this.disableItemsByIndices(this.model.disableItemsByIndex);
            if (this.model.selectedIndex == 0) this.selectItemByIndex(this.model.selectedIndex);
            else this.model.selectedIndex && this.selectItemByIndex(this.model.selectedIndex);
            this.selectItemsByIndices(this.model.selectedIndices);
            this.checkItemsByIndices(this.model.checkedIndices);
            this._tooltipList();
            return this;
        },
        _tooltipList: function(){
             if (this.listContainer.find('li').hasClass('e-tooltip')){
                $(this.listContainer).ejTooltip({
                    target: ".e-tooltip",
                    isBalloon: false,
                    position: {
                        target: { horizontal: "center", vertical: "bottom" },
                        stem: { horizontal: "left", vertical: "top" }
                    }
                });
            }
       },
        _cascadeAction: function () {
            if (this.model.cascadeTo) {
                this._currentValue = this._getField(this.listitems[this._activeItem], this.mapFld._value);
                this.selectDropObj = $('#' + this.model.cascadeTo).ejListBox('instance');
                 $.extend(true, this.selectDropObj, { _isCasCadeTarget: true });
                if (ej.isNullOrUndefined(this._dSource))
                    this._dSource = this.selectDropObj.dataSource();
                this._performJsonDataInit();
			     var args = { cascadeModel: this.selectDropObj.model, cascadeValue: this._currentValue, setCascadeModel:{}, requiresDefaultFilter: true };
                this._trigger("cascade", args);	
                this.selectDropObj._setCascadeModel = args.setCascadeModel;				
            }
        },
        _performJsonDataInit: function () {
            this._changedSource = ej.DataManager(this._dSource).executeLocal(ej.Query().where(this.mapFld._value, "==", this._currentValue));
            this.selectDropObj.setModel({
                dataSource: this._changedSource,
                enable: true,
                value: "",
                selectedIndex: -1                
            })
        },
        _OnMouseContext: function (e) {
            e.preventDefault();
            return false
        },
        _OnMouseEnter: function (e) {
            this.startime = 0;
            this.item = "";
            if (e.type == "touchstart") {
                this.item = $(e.target).text();
                this.startime = new Date().getTime()
            }
            if (this.model.enabled) {
                var targetEle;
                this.element.children("li").removeClass("e-hover");
                if ($(e.target).is("li")) $(e.target).addClass("e-hover");
                if ($(e.target).hasClass("e-disable")) $(e.target).removeClass('e-hover');
                else if (e.target.tagName != "li") {
                    targetEle = $(e.target).parents("li");
                    $(targetEle).addClass("e-hover")
                }
                var activeItem, selectItem = 0;
                this.element.children("li:not('.e-ghead')").each(function (index) {
                    if ($(this).hasClass("e-hover")) {
                        activeItem = index;
                        return false
                    }
                });
                this._hoverItem = activeItem
            }
        },
        _OnMouseLeave: function (e) {
            this.element.children("li").removeClass("e-hover");
            this.endtime = new Date().getTime();
            if ((((this.endtime - this.startime) / 200) > 2))
                if ((this.item == $(e.target).text())) this.hold = (((this.endtime - this.startime) / 200) > 2) ? !this.hold : false;
        },
        _OnMouseClick: function (e) {
            if($(e.currentTarget).hasClass("e-disable")) return false;
            if (e.which == 3)
                this.hold = true;
            this.endtime = new Date().getTime();
            if ((((this.endtime - this.startime) / 200) > 2))
                if ((!this.model.template && this.item == $(e.target).text()) && (!this.hold))
                    this.hold = (((this.endtime - this.startime) / 200) > 2);
            if (e.shiftKey && this._shiftkey) {
                this._shiftkey = false;
                this.prevselectedItem = this._activeItem;
            }
            if (!ej.isNullOrUndefined(this._hoverItem)) this._activeItem = this._hoverItem;
            if (this.model.enabled && this._activeItem != undefined) {
                if (!e.shiftKey || isNaN(this.prevselectedItem)) {
                    this._shiftkey = true;
                    this.prevselectedItem = this._lastEleSelect ? this._lastEleSelect : this._activeItem;
                }
                if (!this.model.showCheckbox) {
                    var activeitem = $(this.element.children("li:not('.e-ghead')")[this._hoverItem]);
                    if (!this.model.allowMultiSelection || (!(e.ctrlKey || this.touchhold || this.hold) && !e.shiftKey))
                        this._removeListHover();
                    this.element.children("li").removeClass('e-hover');
                    if (!activeitem.hasClass('e-select') ||(e.shiftKey && this.model.allowMultiSelection)) {
                        activeitem.addClass('e-select');
                        this._selectedItems.push(activeitem);
                        this.model.selectedIndices.push(this._activeItem);
                        if (e.shiftKey && (this.model.allowMultiSelection)) {
                            if (!e.ctrlKey) this._removeListHover();
                            var initial, last;
                            if (this.prevselectedItem < this._activeItem)
                                initial = this.prevselectedItem, last = this._activeItem;
                            else
                                initial = this._activeItem, last = this.prevselectedItem;
                            this._activeItemLoop(initial,last);
                        }
                    } else {
                        activeitem.removeClass('e-select');
                        this._selectedItems.splice(this.model.selectedIndices.indexOf(this._activeItem), 1);
                        this.model.selectedIndices.splice(this.model.selectedIndices.indexOf(this._activeItem), 1);
                    }
                    this._selectedItem = this._selectedIndices();
                    this.model.selectedIndex = this._activeItem;
                    this._cascadeAction();
                    var selecteditem = $(this.element.children("li:not('.e-ghead')")[this._selectedItem]);
                    if ($(selecteditem).text() != "") {
                        this.element.val($(selecteditem).text());
                        this.element.attr({
                            "value": this.element.val()
                        });
                    }
                    this.model.selectedText = activeitem.text();
                    this._selectedData = this._getItemObject($(selecteditem), e);
                    this._selectedData["isInteraction"] = true;
                    if (this._prevSelectedData && (this._selectedData.text != this._prevSelectedData.text))
                        this._trigger("unselect", this._prevSelectedData)
                    this._trigger("select", this._selectedData);
                    this._prevSelectedData = this._selectedData;
                    this._lastEleSelect = this._activeItem;
                    if (this._selectedItems && this._selectedItems.length != 1)
                        this._ctrlClick = true;
                } else {
                    if (($(e.currentTarget).is("li")) && ($(e.target).is("li"))) {
                        if ($(e.currentTarget.firstChild).find('.listcheckbox').ejCheckBox('isChecked')) {
                            $(e.currentTarget.firstChild).find('.listcheckbox').ejCheckBox('option', 'checked', false);
                            var index = this.model.checkedIndices.indexOf($(e.currentTarget).index());
                            this._checkedItems.splice(index, 1);
                            this.model.checkedIndices.splice(index, 1);
                            this.checkedStatus = false;
                        } else {
                            $(e.currentTarget.firstChild).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                            this._checkedItems.push(this._activeItem);
                            this.model.checkedIndices.push(this._elementIndex(e.currentTarget));
                            this.checkedStatus = true;
                        }
                    }
                    else if (($(e.currentTarget).is("li")) && ($(e.target).is("span"))) {
                        if ($(e.currentTarget.firstChild).find('.listcheckbox').ejCheckBox('isChecked')) {
                            this._checkedItems.push(this._activeItem);
                            this.model.checkedIndices.push($(e.currentTarget).index());
                            this.checkedStatus = true;
                        }
                        else {
                            var index = this.model.checkedIndices.indexOf($(e.currentTarget).index());
                            this._checkedItems.splice(index, 1);
                            this.model.checkedIndices.splice(index, 1);
                            this.checkedStatus = false;
                        }
                    }
                    else
                        return false;
                    this.selectedTextValue = $(e.currentTarget).text();
                    if (!this.element.hasClass("e-disable") && $(e.target).is("li")) {
                        var args = {
                            status: this.model.enabled,
                            isChecked: this.checkedStatus,
                            selectedTextValue: this.selectedTextValue
                        };
                        var checkData = this._getItemObject($(e.target), e);
                        checkData["isInteraction"] = true;
                        this._trigger("checkChange", checkData);
                    }
                    this._lastEleSelect = $(e.currentTarget).index();
                }
                if (e.ctrlKey || e.shiftKey) e.shiftKey ? (this._shiftSelectItem = this._activeItem, this._ctrlSelectItem = null)  : (this._ctrlSelectItem = this._activeItem, this._shiftSelectItem = null);
                else {
                    this._shiftSelectItem = null;
                    this._ctrlSelectItem = null;
                }
                this._setSelectionValues()._OnListSelect(this.prevselectedItem, this._activeItem);
            }
            if (e.target.nodeName != "INPUT")
                this.listContainer.focus();
			this._pageUpStep = this._pageDownStep = null;
        },
		_activeItemLoop: function (initial , last) {
		    if (this.model.showCheckbox) {
		        var items = this.listContainer.find('li:not(.e-disable)');
		        items.find(".listcheckbox").ejCheckBox('option', 'checked', false);
				this._checkedItems = [];
                this.model.checkedIndices = [];
			}
			for (var i = initial; i <= last; i++) {
			    if (this.model.showCheckbox && !this.listContainer.find('li').eq(i).hasClass('e-disable')) {
					this.element.find('.listcheckbox').eq(i).ejCheckBox('option', 'checked', true);
                    this._checkedItems.push(i);
                    this.model.checkedIndices.push(i);
                    this.checkedStatus = true;
                }
				else {
			        activeitem = $(this.element.children("li:not('.e-ghead')")[i]);
                    if (!activeitem.hasClass('e-disable')) {
                        if (!activeitem.hasClass('e-select')) activeitem.addClass('e-select');
                        this._selectedItems.push(activeitem);
                        this.model.selectedIndices.push(i);
                    }
                }
            }
		},
        _setSelectionValues: function () {
            var selectionArray = [];
            var oldSelectedIndices = this.model.selectedIndices;
            var oldCheckedIndices = this.model.checkedIndices;
            this.model.selectedIndices = [];
            this.model.checkedIndices = [];
            var proxy = this;
            if (!this.model.showCheckbox) {
                if (!ej.isNullOrUndefined(this._activeItem) && this._activeItem >= 0) this.model.selectedIndex = this._activeItem;
                var liItem = this.element.children("li:not('.e-ghead')");
                this.element.children("li:not('.e-ghead').e-select").each(function (index, ele) {
                    selectionArray.push($(ele).attr("value") ? $(ele).attr("value") : !ej.isNullOrUndefined(proxy.model.fields.text) && proxy.dataSource() ? proxy.getListData()[proxy._elementIndex(ele)][proxy.model.fields.text] : $(ele).text());
                    proxy.model.selectedIndices.push(liItem.index(ele));
                });
            }
            else {
                this.element.find("li:not('.e-ghead') .listcheckbox:checked").closest('li').each(function (index, ele) {
                    selectionArray.push($(ele).attr("value") ? $(ele).attr("value") : !ej.isNullOrUndefined(proxy.model.fields.text) && proxy.dataSource() ? proxy.getListData()[proxy._elementIndex(ele)][proxy.model.fields.text] : $(ele).text());
                    proxy.model.checkedIndices.push(proxy._elementIndex(ele));
                });
            }
            if (ej.DataManager && ej.DataManager && this.dataSource() instanceof ej.DataManager && this.model.allowVirtualScrolling) {
                if (this.model.showCheckbox) {
                    for (var i = 0; i < oldCheckedIndices.length; i++) {
                        if (this.model.checkedIndices.indexOf(oldCheckedIndices[i]) == -1)
                            this.model.checkedIndices.push(oldCheckedIndices[i]);
                    }
                }
                else {
                    for (var i = 0; i < oldSelectedIndices.length; i++) {
                        if (this.model.selectedIndices.indexOf(oldSelectedIndices[i]) == -1)
                            this.model.selectedIndices.push(oldSelectedIndices[i]);
                    }
                }
            }
            this.model.selectedItemIndex = this.model.selectedIndex;
            this.model.selectedItems = this.model.selectedItemlist = this.model.selectedIndices;
            this.model.checkedItems = this.model.checkedItemlist = this.model.checkItemsByIndex = this.model.checkedIndices;
			this.model.text = "";
			if(this.model.showCheckbox){
				for(i=0;i< this.getCheckedItems().length;i++){			
				         this.model.text +=  this.getCheckedItems()[i].text + ","
			        }
			}else{
				for(i=0;i< this.getSelectedItems().length;i++){			
				         this.model.text +=  this.getSelectedItems()[i].text + ","
			        }	
			}
            this.value(selectionArray.toString());
            this._hiddenInput.val(this.value());
            return this;
        },
        _setDisableValues: function () {
            this._disabledItems = [];
            this.model.disableItemsByIndex = [];
            var lenth = this.element.children().length, indx;
            for (var indx = 0; indx < lenth; indx++)
                if ($(this.element.children()[indx]).hasClass('e-disable'))
                    this.model.disableItemsByIndex.push(indx);
            this.disableItemsByIndices(this.model.disableItemsByIndex);
        },
        _onClickCheckList: function (e) {
			if(!e.isChecked) $("#"+ e.model.id).closest('li').removeClass("checkItem");
            if (e.isInteraction) {
                this.checkedStatus = e.isChecked ? true : false;
                if (!this._initValue) {
                    this.checkedStatus ? this.model.checkedIndices.push($(e.event.target).closest('li:not(".e-ghead")').index()) : this.model.checkedIndices.splice($.inArray($(e.event.target).closest('li:not(".e-ghead")').index(), this.model.checkedIndices), 1);
                    var checkData = this._getItemObject($(e.event.target).closest('li'), e);
                    checkData["isInteraction"] = true;
                    this._trigger('checkChange', checkData);
                }
            }
        },
		_elementIndex: function (args) {
		    return $(args).parent().children("li:not('.e-ghead')").index(args);
		},
        _disableItemSelectCommon: function () {
            this.listitems = this.element.find('li');
            this._activeItem = this.listitems.index(this.element.find(".e-select"));
        },

        _disableItemSelectUp: function () {
            this._disableItemSelectCommon();
            var disableList = (typeof (this.model.disableItemsByIndex) != "object") ? this.model.disableItemsByIndex.split(",").sort().reverse() : this.model.disableItemsByIndex;
            if (this._activeItem == 0) this._activeItem = this.listitems.length - 1;
            else this._activeItem--;
            for (var lists = 0;
                ($.inArray(this._activeItem.toString(), disableList.toString())) > -1; lists++) {
                this._activeItem--;
                if (this._activeItem < 0) this._activeItem = this.listitems.length - 1
            }
            $(this.element.children("li")[this._activeItem]).addClass('e-select')
        },
        _disableItemSelectDown: function () {
            this._disableItemSelectCommon();
            var disableList = (typeof (this.model.disableItemsByIndex) != "object") ? this.model.disableItemsByIndex.split(",").sort() : this.model.disableItemsByIndex;
            ((this.listitems.length - 1) == this._activeItem) ? this._activeItem = 0 : this._activeItem++;
            for (var lists = 0;
                ($.inArray(this._activeItem.toString(), disableList.toString())) > -1; lists++) {
                this._activeItem++;
                if ((this.listitems.length) == this._activeItem) this._activeItem = 0
            }
            $(this.element.children("li")[this._activeItem]).addClass('e-select')
        },
        _checkitems: function () {
            if (this.model.showCheckbox) {
                var listitems = this.element.find("li:not('.e-ghead')");
                for (i = 0; i < this.model.checkedIndices.length; i++) {
                    var item = this.model.checkedIndices[i];
                    $(listitems[item]).find('.listcheckbox').ejCheckBox('option', 'checked', true);
                    this._checkedItems.push(listitems[item])
                }
            } else {
                if (this.model.allowMultiSelection) {
                    for (i = 0; i < this.model.selectedIndices.length; i++) {
                        var item = this.model.selectedIndices[i];
                        if (!($(this.listitem[item]).hasClass("e-select"))) {
                            $(this.listitem[item]).addClass("e-select");
                            this._selectedItems.push($(this.listitem[item]));
                        }
                    }
                } else {
                    if (!($(this.listitem[this.model.selectedIndex]).hasClass("e-select")))
                        $(this.listitem[this.model.selectedIndex]).addClass("e-select");
                    this._selectedItems.push($(this.listitem[this.model.selectedIndex]))
                }
            }
            this._setSelectionValues();
            return this;
        },
        _OnListSelect: function (previtem, selecteditem, e) {
            if (!ej.isNullOrUndefined(previtem) && previtem != selecteditem && !this.model.showCheckbox) {
                var selectData = this._getItemObject($(this.element.find("li:not('.e-ghead')")[selecteditem]), e);
                selectData["isInteraction"] = true;
                this._trigger('change', selectData);
            }
        },
        _OnKeyDown: function (e) {
            if (this.model.enabled) {
                if (this._selectedItems && this._selectedItems.length == 1 && !this.model.showCheckbox)
                    this._lastEleSelect = $(this.element.children("li.e-select")).index();
                this._itemId = null;
                var _ListItemsContainer = this.element.children("li:not('.e-ghead')"), proxy = this, liH, popupH, activeitem;
                popupH = this.listContainer.height();
                liH = _ListItemsContainer.outerHeight();
                activeitem = Math.round(popupH / liH) != 0 ? Math.floor(popupH / liH) : 7;
                this._listSize = this.element.children("li").length;
                if (!e.shiftKey) this._up = this._down;
				if(e.keyCode != 33 && e.keyCode != 34) this._pageUpStep = this._pageDownStep = null;
                switch (e.keyCode) {
                    case 37:
                    case 38:
                        var liItems = this.listItemsElement;
                        var selectedIndex = this._shiftSelectItem ? this._shiftSelectItem : this._ctrlSelectItem ? this._ctrlSelectItem : (this.model.showCheckbox) ? (this._lastEleSelect || 0) : liItems.index(this.element.find("li.e-select"));
                        if (e.shiftKey && this.model.allowMultiSelection && !this.model.showCheckbox) {
                            if (this._lastEleSelect == 0) return false;
                            this._lastEleSelect = (this._ctrlClick) ? this._lastEleSelect - 1 : this._lastEleSelect;
                            selectedIndex = this._lastEleSelect;
                            this._selectedItem = (selectedIndex || selectedIndex == 0) ? (selectedIndex == 0 ? this._listSize - 1 : (this._down ? selectedIndex : selectedIndex - 1)) : 0;
                            for (var i = this._selectedItem; $(_ListItemsContainer[i]).hasClass("e-disable") ; i--)
                                this._selectedItem -= 1;
                            if($(_ListItemsContainer[this._selectedItem]).hasClass("e-select") && this.element.find("li.e-select").length == 1) this._selectedItem -= 1;
                            var activeItem = $(_ListItemsContainer[this._selectedItem]);
                            if (activeItem.hasClass("e-select")) {
                                if (this._selectedItem == 0) return;
                                activeItem.removeClass("e-select");
                                this._selectedItems.pop();
                            }
                            else {
                                activeItem.addClass("e-select");
                                this._selectedItems.push(activeItem);
                            }
                            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(this._selectedItem) });
                            this._up = true;
                            this._down = false;
                            this._ctrlClick = false;
                        }
                        else {
                            this._selectedItem = (selectedIndex || selectedIndex == 0) ? (selectedIndex == 0 ? this._listSize - 1 : selectedIndex - 1) : 0;
                            for (var i = this._selectedItem; $(_ListItemsContainer[i]).hasClass("e-disable") ; i--)
                                this._selectedItem -= 1;
                            if (this._selectedItem == -1) this._selectedItem = this._listSize - 1;
                            this._addSelectedItem(e);
                            $(_ListItemsContainer).removeClass("e-hover e-select");
                            var addClass = (this.model.showCheckbox) ? "e-hover" : "e-select";
                            $(_ListItemsContainer[this._selectedItem]).addClass(addClass);
                            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(this._selectedItem) });
                        }
						this._activeItem = this.prevselectedItem = this._selectedItem;
                        this._OnListSelect(this._selectedItem + 1, this._selectedItem, e);
                        this._lastEleSelect = this._selectedItem;
                        this._keyCascade(_ListItemsContainer[this._selectedItem]);
                        this._setSelectionValues();
                        this._shiftSelectItem = this._ctrlSelectItem = null;
                        e.preventDefault();
                        return false;
                        break;
                    case 39:
                    case 40:
                        var liItems = this.listItemsElement;
                        var selectedIndex = this._shiftSelectItem ? this._shiftSelectItem : this._ctrlSelectItem ? this._ctrlSelectItem : (this.model.showCheckbox) ? (this._lastEleSelect || 0) : liItems.index(this.element.find("li.e-select"));
                        if (e.shiftKey && this.model.allowMultiSelection && !this.model.showCheckbox) {
                            if (this._lastEleSelect == this._listSize - 1) return false;
                            this._lastEleSelect = (this._ctrlClick) ? this._lastEleSelect + 1 : this._lastEleSelect;
                            selectedIndex = this._lastEleSelect;
                            this._selectedItem = (selectedIndex || selectedIndex == 0) ? (selectedIndex == this._listSize - 1 ? 0 : ((this._up || this._ctrlClick) ? selectedIndex : selectedIndex + 1)) : 0;
                            for (var i = this._selectedItem; $(_ListItemsContainer[i]).hasClass("e-disable") ; i++)
                                this._selectedItem += 1;
							if($(_ListItemsContainer[this._selectedItem]).hasClass("e-select") && this.element.find("li.e-select").length == 1) this._selectedItem += 1;		
                            var activeItem = $(_ListItemsContainer[this._selectedItem]);
                            if (activeItem.hasClass("e-select")) {
                                activeItem.removeClass("e-select");
                                this._selectedItems.pop();
                            }
                            else {
                                activeItem.addClass("e-select");
                                this._selectedItems.push(activeItem);
                            }
                            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(this._selectedItem) });
                            this._up = false;
                            this._down = true;
                            this._ctrlClick = false;
                        }
                        else {
                            this._selectedItem = (selectedIndex || selectedIndex == 0) ? (selectedIndex == this._listSize - 1 ? 0 : selectedIndex + 1) : 0;
                            for (var i = this._selectedItem; $(_ListItemsContainer[i]).hasClass("e-disable") ; i++)
                                this._selectedItem += 1;
                            if (this._selectedItem == this._listSize) this._selectedItem = 0;
                            this._addSelectedItem(e);
                            $(_ListItemsContainer).removeClass("e-hover e-select");
                            var addClass = (this.model.showCheckbox) ? "e-hover" : "e-select";
                            $(_ListItemsContainer[this._selectedItem]).addClass(addClass);
                            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(this._selectedItem) });
							this.element.find("li").removeClass("selectItem");
							this.model.selectedIndices.length = 0;
							this.model.selectedIndices.push(this._selectedItem);
                        }
						this._activeItem = this.prevselectedItem = this._selectedItem;
                        this._OnListSelect(this._selectedItem - 1, this._selectedItem);
                        this._lastEleSelect = this._selectedItem;
                        this._keyCascade(_ListItemsContainer[this._selectedItem]);
                        this._setSelectionValues();
                        this._shiftSelectItem = this._ctrlSelectItem = null;
                        return false;
                        break;
                    case 8:
                    case 9:
                    case 13:
                        if (this.model.showCheckbox) {
                            if (this.model.checkedIndices.indexOf(this._selectedItem) < 0)
                                this.checkItemByIndex(this._selectedItem);
                            else
                                this.uncheckItemByIndex(this._selectedItem);
                        }
                        break;
                    case 18:
                    case 33: /* page up */
                        var step = e.keyCode == 33 ? activeitem : 1;
						if (e.shiftKey && this.model.allowMultiSelection) { 
							if(this._pageUpStep == null) this._pageUpStep = this.prevselectedItem;
							if(this._pageDownStep == null) this._pageDownStep = this.prevselectedItem;
							if(this._pageDownStep <= this.prevselectedItem) {
								start = this._pageUpStep - step > 0  ? this._pageUpStep - step : 0;
								end = this._pageDownStep;
							}
							else {
								start = this.prevselectedItem;
								end = this._pageDownStep - step > this.prevselectedItem  ? this._pageDownStep - step : this.prevselectedItem;
							}
							this._shiftHomeAndEndKeyProcess( start,end, end > this.prevselectedItem ? end:start);
							this._pageUpStep = start;
							this._pageDownStep =end;
						}
                        else this._moveUp(this._activeItem, step);
					    this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop() });
                        this._preventDefaultAction(e);
                        break;
                    case 34: /* page down */
                        var step = e.keyCode == 34 ? activeitem : 1;
                        if (e.shiftKey && this.model.allowMultiSelection){
                            if(this._pageUpStep == null) this._pageUpStep = this.prevselectedItem;
                            if(this._pageDownStep == null) this._pageDownStep = this.prevselectedItem;
                            if( this._pageUpStep == 0 && this.prevselectedItem != 0) { 
								if( this._pageUpStep + step >= this.prevselectedItem) start = end = this.prevselectedItem;
								else {
									start = this._pageUpStep + step ;
									end = this._pageDownStep + step < this.element.children("li").length ?  this._pageDownStep + step : this.element.children("li").length-1;
                               }
                            }
                            else if(this._pageUpStep != this.prevselectedItem && this._pageUpStep + step >= this.prevselectedItem) start = end = this.prevselectedItem;
                            else {
                                start = this._pageUpStep;
                                end = this._pageDownStep + step < this.element.children("li").length ?  this._pageDownStep + step : this.element.children("li").length-1;
                            }
                            if(start < this.prevselectedItem && end > this.prevselectedItem ) end = this.prevselectedItem;
                            this._shiftHomeAndEndKeyProcess(start,end, start < this.prevselectedItem ? start:end);
                            this._pageUpStep = start;
                            this._pageDownStep =end;
                        } 
                        else this._moveDown(this._activeItem, step);
						this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop() });
                        this._preventDefaultAction(e);
                        break;
                    case 35:
                        if (e.shiftKey && this.model.allowMultiSelection) this._shiftHomeAndEndKeyProcess(this._activeItem,(this._listSize - 1) , (this._listSize - 1));
                        else this._homeAndEndKeyProcess(e, _ListItemsContainer, (this._listSize - 1));
                        for (var i = this._listSize - 1; i > 0; i--) {
                            if (!$(this.element.find('li')[i]).hasClass('e-disable')) {
                                this.model.selectedIndex = i;
                                this._shiftSelectItem = i;
                               if (this.model.allowVirtualScrolling == true) proxy._onScroll(e);
                                return false;
                            }
                        }
                    break;
                case 36:
                    if (e.shiftKey && this.model.allowMultiSelection) this._shiftHomeAndEndKeyProcess(0, this._activeItem, 0);
                    else this._homeAndEndKeyProcess(e, _ListItemsContainer, 0);
                    for (var i = 0; i < this._listSize; i++) {
                        if (!$(this.element.find('li')[i]).hasClass('e-disable')) {
                            this.model.selectedIndex = i;
                            return false;
                        }
                    }
                    break;
                }
            }
        },
        _moveUp: function (current, step) {
            if (current == null || current <= 0)  this._checkDisableStep(0, step, false);
            else if (current > this._listSize - 1) this._checkDisableStep(this._listSize - 1, step, false);
            else if (current > 0 && current <= this._listSize - 1) this._checkDisableStep(current, step, false);
        },
        _moveDown: function (current, step) {
            if (current == null || current < 0) this._checkDisableStep(-1, step, true);
            else if (current == 0)  this._checkDisableStep(0, step, true);
            else if (current >= this._listSize - 1) this._checkDisableStep(this._listSize - 1, step, true);
            else if (current < this._listSize - 1)  this._checkDisableStep(current, step, true);
        },
        _checkDisableStep: function (current, step, isdown, shift) {
            var command = isdown ? "_disableItemSelectDown" : "_disableItemSelectUp";
            var index = isdown ? current + step : current - step;
            var select = this[command](index);
            if (select == null) {
                for (var i = step; i >= 0; i--) {
                    index = isdown ? current + i : current - i;
                    select = this[command](index);
                    if (select != null) break;
                }
            }
            if (select != null)
                this.selectItemByIndex(select);
        },
        _disableItemSelectDown: function (current) {
            if (current == null || current < 0) current = 0;
            if (current < this._listSize) {
                if ($.inArray(current, this._disabledItems) < 0) 
                    return current;
                else
                    return this._disableItemSelectDown(current + 1);
            }
            else return this._listSize - 1;
        },

        _disableItemSelectUp: function (current) {
            if (current == null || current < 0) current = 0;
            if (current < this._listSize) {
                if ($.inArray(current, this._disabledItems) < 0) 
                    return current;
                else {
                    if (current > 0) 
                        return this._disableItemSelectUp(current - 1);
                }
            }
        },

        _preventDefaultAction: function (e, stopBubble) {
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            if (stopBubble) 
                e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
        },
        _homeAndEndKeyProcess: function (e, _ListItemsContainer, index) {
            if ($(':focus').length && $(':focus')[0].nodeName != "INPUT") {
                this._OnListSelect(this._selectedItem, index);
                this.selectItemByIndex(index);
                this._selectedItem = index;
                this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(index) });
                if (this.model.showCheckbox) {
                    this._removeListHover();
                    $(_ListItemsContainer[index]).addClass("e-hover");
                    this._lastEleSelect = this._selectedItem = index;
                }
                this._keyCascade(_ListItemsContainer[index],e);
                e.preventDefault();
                return false;
            }
        },
        _shiftHomeAndEndKeyProcess: function(initial , last , index) {
			this._removeListHover();
			this._activeItemLoop(initial ,last);
			this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop(index) });
            return false;
		},
        _keyCascade: function (obj, evt) {
            var selectData = this._getItemObject($(obj), evt);
            this.model.selectedText = selectData.text;
            selectData["isInteraction"] = true;
            this._trigger("select", selectData);
            if (this.model.cascadeTo) {
                this._activeItem = this._selectedItem;
                this._cascadeAction();
            }
        },

        mergeData: function (data,skipInitial) {
            this.mergeUl = $();
            this._setMapFields();
            var proxy = this;
            this._skipInitialRemoteData = skipInitial ? skipInitial : false;
            if (ej.DataManager && data instanceof ej.DataManager) {
                var queryPromise = data.executeQuery(this._getQuery());
                queryPromise.done(function (e) {
                    proxy.mergeValue = e.result;
                    proxy._renderlistContainer();
                });
            }
            else {
                this.mergeValue = data;
                this.listitems = this.listitems ? this.listitems : this.dataSource();
                this._renderlistContainer();
            }
            this._loadInitialRemoteData = false;
        },

        _onScroll: function (e) {
            if (!e.scrollTop) return;
            var scrollerPosition = e.scrollTop, proxy = this;
            if (this.model.actionBegin)
                this._trigger("actionBegin", {});
            this.realUllength = this.element.find('li').length;
            if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "normal") {
                window.setTimeout(function () {
                    if (proxy._virtualCount == 0) {
                        proxy._loadVirtualList();
                    }
                }, 300);
            }
            else if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "continuous") {
                if (scrollerPosition >= Math.round($(this.listContainer).find("ul").height() - $(this.listContainer).height()) && this.listitems.length < this._totalCount) {
                    this._updateLoadingClass(true);
                    if (ej.DataManager && this.model.dataSource instanceof ej.DataManager) {
                        this._queryPromise(this.realUllength, proxy, this.realUllength + this.model.itemRequestCount, e);
                    }
                }
            }
        },
        _queryPromise: function (start, proxy, end, e) {
            this._trigger('itemRequest', { event: e, isInteraction: true });
            this._setMapFields();
            var mQuery = this._savedQueries.clone();
            var queryPromise = this.dataSource().executeQuery(mQuery.range(start, end));
            this._updateLoadingClass(true);
            queryPromise.done(function (d) {
			    proxy._trigger("actionBeforeSuccess", d);
                proxy.realUllength = (e.source != "wheel") ? proxy.mergeValue ? proxy.mergeValue.length + start : start : start;
                proxy._loadlist(d.result)._checkboxHideShow(proxy.model.showCheckbox)._showResult()._updateLoadingClass();
                proxy._applySelection();
                if (proxy.model.virtualScrollMode == "continuous") {
                    proxy.scrollerObj.refresh();
                }
                proxy._trigger("actionSuccess", d);
            }).fail(function (e) {
                proxy._trigger("actionFailure", e);
            }).always(function (e) {
                proxy._trigger("actionComplete", e);
            });
        },
        _loadVirtualList: function () {
            this._virtualCount++;
            this._getLiHeight();
            var top = this.scrollerObj.scrollTop(), proxy = this, prevIndex = 0, prevPageLoad, nextIndex = null;
            this._currentPageindex = Math.round(top / (this._liItemHeight * this.model.itemRequestCount));
            if (($.inArray(this._currentPageindex, this._virtualPages.sort(function (a, b) { return a - b; }))) != -1) {
                if (this._currentPageindex == 0) {
                    if (($.inArray(this._currentPageindex + 1, this._virtualPages)) != -1) {
                        this._virtualCount--;
                        return false;
                    } else {
                        this._currentPageindex = this._currentPageindex + 1;
                    }
                }
                else if (($.inArray(this._currentPageindex - 1, this._virtualPages)) != -1) {
                    if (($.inArray(this._currentPageindex + 1, this._virtualPages)) != -1) {
                        this._virtualCount--;
                        return false;
                    } else {
                        this._currentPageindex = this._currentPageindex + 1;
                    }
                }
                else {
                    this._currentPageindex = this._currentPageindex - 1;
                }
            }
            prevPageLoad = !($.inArray(this._currentPageindex - 1, this._virtualPages) != -1);
            this._updateLoadingClass(true);
            for (var i = this._virtualPages.length - 1; i >= 0; i--) {
                if (this._virtualPages[i] < this._currentPageindex) {
                    prevIndex = this._virtualPages[i];
                    if (!(i + 1 == this._virtualPages.length))
                        nextIndex = this._virtualPages[i + 1];
                    break;
                }
            }
            var firstArg = prevPageLoad ? (this._currentPageindex - 1) * this.model.itemRequestCount : this._currentPageindex * this.model.itemRequestCount;
            var skipQuery = ej.Query().range(firstArg, this._currentPageindex * this.model.itemRequestCount + this.model.itemRequestCount), queryPromise, list;
            if (ej.DataManager) {
                var skipParam = prevPageLoad ? (this._currentPageindex - 1) * this.model.itemRequestCount : this._currentPageindex * this.model.itemRequestCount;
                if(this.dataSource().dataSource.offline == true)
                    skipQuery = ej.Query().skip(skipParam).take(this.model.itemRequestCount);
                else 
                    skipQuery = this._getQuery().skip(skipParam);
                if (prevPageLoad) {
                    for (i = 0; i < skipQuery.queries.length; i++) {
                        if (skipQuery.queries[i].fn == "onTake") {
                            skipQuery.queries.splice(i, 1);
                            break;
                        }
                    }
                    skipQuery.take(2 * this.model.itemRequestCount);
                }
                if (!proxy._trigger("actionBegin")) {
                    queryPromise = proxy._dataUrl.executeQuery(skipQuery);
                    queryPromise.done(function (e) {
                        proxy._appendVirtualList(e.result, prevIndex, proxy._currentPageindex, nextIndex, prevPageLoad);
                        proxy._trigger("actionSuccess", { e: e });
                    }).fail(function (e) {
                        proxy._virtualCount--;
                        proxy._trigger("actionFailure", { e: e });
                    }).always(function (e) {
                        proxy._updateLoadingClass(false);
                        proxy._trigger("actionComplete", { e: e });
                    });
                }
            } 
            else {
                list = ej.DataManager(proxy.model.dataSource).executeLocal(skipQuery);
                this._appendVirtualList(list, prevIndex, this._currentPageindex, nextIndex, prevPageLoad);
                this._updateLoadingClass(false);
            }
        },

        _appendVirtualList: function (list, prevIndex, currentIndex, nextIndex, prevPageLoad) {
            this._virtualCount--;
            this._getLiHeight();
            if (($.inArray(currentIndex, this._virtualPages.sort(function (a, b) { return a - b; }))) != -1) return false;
            if (prevPageLoad && ($.inArray(currentIndex - 1, this._virtualPages.sort()) != -1)) {
                list.splice(0, this.model.itemRequestCount);
                prevPageLoad = false;
            }
            var items = this.model.itemRequestCount, tempUl = $("<ul>"), firstVirtualHeight, secondVirtualHeight;
            firstVirtualHeight = prevPageLoad ? ((currentIndex - 1) * items * this._liItemHeight) - (prevIndex * items + items) * this._liItemHeight : (currentIndex * items * this._liItemHeight) - (prevIndex * items + items) * this._liItemHeight;
            if (firstVirtualHeight != 0) tempUl.append($("<span>").addClass("e-virtual").css({ display: "block", height: firstVirtualHeight }));
            this._loadlist(list);
            $(this._dummyVirtualUl).attr("data-ej-page", currentIndex);
            if (prevPageLoad) {
                $(this._dummyVirtualUl).slice(0, items).attr("data-ej-page", currentIndex - 1);
            }
            tempUl.append(this._dummyVirtualUl);
            var ulItems = this.element;
            secondVirtualHeight = (currentIndex * items + items) * this._liItemHeight;
            if (nextIndex != null) secondVirtualHeight = (nextIndex * items * this._liItemHeight) - secondVirtualHeight;
            else secondVirtualHeight = ulItems.height() - secondVirtualHeight;
            if (secondVirtualHeight != 0) tempUl.append($("<span>").addClass("e-virtual").css({ display: "block", height: secondVirtualHeight }));
            var selector = ulItems.find("li[data-ej-page=" + prevIndex + "]").last();
            selector.next().remove();
            tempUl.children().insertAfter(selector);
            if(this.model.showCheckbox) this._checkboxHideShow(true);
            this._virtualPages.push(currentIndex);
            if (prevPageLoad) this._virtualPages.push(currentIndex - 1);
            this._virtualUl = ulItems.clone(true);
            this._showResult();
        },

        _selectListItems: function () {
            var listItems = this.element.find("li:not('.e-ghead')");;
            for (var i = 0; i < listItems.length; i++) {
                if ($(listItems[i]).hasClass('selectItem') && !$(listItems[i]).hasClass('e-select'))
                    $(listItems[i]).addClass("e-select").removeClass('selectItem');
            }
        },
        _setText: function (text) {
            for (i = 0; i < this.listitems.length; i++)
                if ($(this.element.children("li")[i]).text() == text) this.unselectAll().selectItemByIndex(i);
        },
        _getLiCount: function () {
            return parseInt(this.listContainer.height() / this.listItemsElement.height());
        },
        _onDragStarts: function (data, target) {
            return this._trigger("itemDragStart", { items: data, target: target });
        },
        _onDrag: function (data, target) {
            return this._trigger("itemDrag", { items: data, target: target });
        },
        _onDragStop: function (data, target) {
            return this._trigger("itemDragStop", { items: data, target: target });
        },
        _onDropped: function (data, target) {
            data = { droppedItemText: data[0].text, droppedItemValue: data[0].value, droppedItemIsChecked: data[0].isChecked, droppedElementData: data[0], dropTarget:[data[1].target],event:data[1].event};
            return this._trigger("itemDrop",data);
        },
        _OnKeyPress: function (e) {
            if (this.model.enableIncrementalSearch && this.model.enabled) {
                this._incrementalSearch(this._isMozilla ? e.charCode : e.keyCode)
            }
        },
        _incrementalSearch: function (from) {
            _proxy = this;
            var typedCharacter = String.fromCharCode(from);
            if (this._incqueryString != typedCharacter) this._incqueryString += typedCharacter;
            else this._incqueryString = typedCharacter;
            if ((this._incqueryString.length > 0) && (this._typeInterval == null)) {
                this._typeInterval = setTimeout(function () {
                    _proxy._incqueryString = "";
                    _proxy._typeInterval = null
                }, _proxy._typingThreshold)
            }
            var list = this.listContainer.find("ol,ul").children("li:not('.e-ghead')"),
                i, strlen;
            var caseSence = this.model.caseSensitiveSearch,
                str, queryStr = this._incqueryString;
            var querylength = this._incqueryString.length,
                searchflag = false;
            if (!caseSence) queryStr = queryStr.toLowerCase();
            var initialSelection = this._activeItem;
            --initialSelection;
            var startIndex = this._activeItem != list.length - 1 ? (this._activeItem + 1) : 0;
            if (this._incqueryString.length > 1) startIndex = this._activeItem;
            for (var i = startIndex;
                (i < list.length && initialSelection != i) ; i++) {
                str = $.trim($(list[i]).text());
                str = caseSence ? str : str.toLowerCase();
                if (str.substr(0, querylength) === queryStr) {
                    this._removeListHover();
                    this.element.children("li").removeClass('e-active');
                    this._selectedItem = i;
                    this._addListHover();
                    searchflag = true;
                } else if ((i == list.length - 1) && (searchflag == false)) {
                    if (startIndex != 0) {
                        i = -1;
                        ++initialSelection;
                    } else searchflag = true;
                }
                if (searchflag) break;
            }
        },
        _wireEvents: function () {
            this._on(this.listContainer, "focus", this._OnFocusIn);
            this._on(this.listContainer, "blur", this._OnFocusOut);
            $(window).on("resize", $.proxy(this._OnWindowResize, this));
        },
        _OnFocusIn: function () {
            if (!this._focused) {
                this._trigger("focusIn");
                this._on(this.listContainer, "keydown", this._OnKeyDown);
                this._on(this.listContainer, "keypress", this._OnKeyPress);
                this._focused = true;
            }
        },
        _OnFocusOut: function () {
            if (this._focused) {
                this._trigger("focusOut");
                this._off(this.listContainer, "keydown", this._OnKeyDown);
                this._off(this.listContainer, "keypress", this._OnKeyPress);
                this._focused = false;
            }
        }
    });
    ej.VirtualScrollMode = {
        /** Supports to Virtual Scrolling mode with normal only */
        Normal: "normal",
        /** Supports to Virtual Scrolling mode with continuous only */
        Continuous: "continuous"
    };
    ej.SortOrder = {

        Ascending: "ascending",

        Descending: "descending",

	    None:"none"
    };
})(jQuery, Syncfusion);
;
/**
* @fileOverview Plugin to style the Html CheckBox elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejCheckBox", "ej.CheckBox", {
        _rootCSS: "e-checkbox",

        element: null,

        model: null,
        validTags: ["input"],
        _addToPersist: ["checked", "checkState"],
        _setFirst: false,
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions']
        },


        defaults: {

            id: null,

            name: null,

            value: null,

            htmlAttributes: {},

            checked: false,

            enabled: true,

            enableTriState: false,

            showRoundedCorner: false,

            enablePersistence: false,

            cssClass: "",

            text: "",

            enableRTL: false,

            idPrefix: "ej",

            size: "small",

            checkState: "uncheck",

            validationRules: null,

            validationMessage: null,
            validationMessages: null,

            beforeChange: null,

            change: null,

            create: null,

            destroy: null

        },

        dataTypes: {
            id: "string",
            name: "string",
            enablePersistence: "boolean",
            enableTriState: "boolean",
            size: "enum",
            enabled: "boolean",
            idPrefix: "string",
            validationRules: "data",
            validationMessage: "data",
            validationMessages: "data",
            htmlAttributes: "data"
        },
        observables: ["checked", "checkState"],
        checked: ej.util.valueFunction("checked"),
        checkState: ej.util.valueFunction("checkState"),

        _init: function (options) {
            this._cloneElement = this.element.clone();
            var browserInfo = ej.browserInfo();
            this._isIE8 = (browserInfo.name == 'msie' && browserInfo.version == '8.0') ? true : false;
            this._isIE9 = (browserInfo.name == 'msie' && browserInfo.version == '9.0') ? true : false;
            this._isDevice = this._checkDevice();
            this._setValue();
            this._renderControl();
            this.model.enableRTL && this._setRTL();
            if (this.model.enabled)
                this._wireEvents();
            this._setEnabled(this.model.enabled);
			if (!ej.isNullOrUndefined(options) && !ej.isNullOrUndefined(options.validationMessage))
				this.model.validationMessages= this.model.validationMessage;
            if (this.model.validationRules != null) {
                this._initValidator();
                this._setValidation();
            }
            this._addAttr(this.model.htmlAttributes);
            if (this._isIE9 || this._isIE8) {
                // In IE8 and IE9, the text of the checkox will float to next line while the length of the text is high fixed this by adding the following class and procssed with CSS
                this.wrapper.addClass("e-tb-cell");
            }
        },
        _checkDevice: function () {
            return (ej.isDevice() && ej.isTouchDevice());
        },
        _setRTL: function () {
            $(this.maindiv).addClass("e-rtl");
        },
        _initValidator: function () {
            (!this.wrapper.closest("form").data("validator")) && this.wrapper.closest("form").validate();
        },
        _setValidation: function () {
            this.wrapper.find('input').rules("add", this.model.validationRules);
            var validator = this.wrapper.closest("form").data("validator");
            validator = validator ? validator : this.wrapper.closest("form").validate();
            name = this.wrapper.find('input').attr("name");
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
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                if (key == "class") proxy.wrapper.addClass(value);
                else if (key == "name") proxy.element.attr(key, value);
                else if (key == "required") proxy.element.attr(key, value);
                else if (key == "disabled" && value == "disabled") proxy._setEnabled(false);
                else if (key == "checked" && value == "checked") {
                    if (proxy.checked() instanceof Array)
                        proxy._updateCheckedItem();
                    else
                        proxy._checked(true);
                }
                else proxy.wrapper.attr(key, value);
            });
        },

        _triggerBeforeChange: function () {
            var data = { isChecked: this._isChecked, isInteraction: false };
            if (true == this._trigger("beforeChange", data)) return false;
        },

        _triggerChange: function () {
            var data = { isChecked: this._isChecked, checkState: this.checkState(), isInteraction: false };
            this._trigger("change", data);
        },

        _setModel: function (options) {
            for (var prop in options) {
                switch (prop) {
                    case "checked":
                        $(this.maindiv).removeClass("e-material-animate");
                        if (this.model.beforeChange) this._triggerBeforeChange();
                        if (this.checked() instanceof Array) {
                            var checkedItemArray = ej.util.getVal(options[prop]);
                            var lastVal = checkedItemArray[checkedItemArray.length - 1];
                            if (this.model.value == lastVal) this._isChecked = true;
                        }
                        else {
                            this._isChecked = ej.util.getVal(options[prop]);
                            this.checked(this._isChecked);
                        }
                        this._isChecked ? this._checked() : this._unChecked();
                        if (this.model.change) this._triggerChange();
                        break;
                    case "enableTriState":
                        if (options[prop]) {
                            this.model.enableTriState = options[prop];
                            this._indeterminateState = options[prop];
                        }
                        break;
                    case "checkState":
                        if (this.model.enableTriState) {
                            if (this.model.beforeChange) this._triggerBeforeChange();
                            this._isChecked = ej.util.getVal(options[prop]);
                            this.checkState(this._isChecked);
                            this._changeState(this._isChecked);
                            this._setCheckBoxState();
                            this.checked(this._isChecked);
                            if (this.model.checkState == "indeterminate")
                                this._setIndeterminate(this._indeterminateState);
                            if (this.checked() instanceof Array)
                                this._updateCheckedItem();
                            else if (options[prop] == "check") this._hiddenInput.removeAttribute("name");
                            else this._hiddenInput.setAttribute("name", this.model.name);
                            if (this.model.change) {
                                if (!(this.checked() instanceof Array)) this._isChecked = this.checkState() == "uncheck" ? false : true;
                                this._triggerChange();
                            }
                        }
                        break;
                    case "cssClass": this._changeSkin(options[prop]); break;
                    case "enableRTL":
                        (options[prop]) ? this._setRTL() : $(this.maindiv).removeClass("e-rtl");
                        break;
                    case "text": this._setText(options[prop]); break;
                    case "validationRules":
                        if (this.model.validationRules != null) {
                            this.wrapper.find('input').rules('remove');
                            this.model.validationMessages = null;
                        }
                        this.model.validationRules = options[prop];
                        if (this.model.validationRules != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "validationMessage":
					this.model.validationMessages = options[prop];
                        if (this.model.validationRules != null && this.model.validationMessages != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                         break;
					case "validationMessages":
					  this.model.validationMessages = options[prop];
                        if (this.model.validationRules != null && this.model.validationMessages != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "id": this._setIdAttr(options[prop]); break;
                    case "name": this.element.attr('name', options[prop]);
                        if (!this._isChecked || this.spanImg.hasClass("e-chk-indeter")) this._hiddenInput.setAttribute('name', options[prop]);
                        this.model.name = options[prop];
                        break;
                    case "value": this.element.attr('value', options[prop]); break;
                    case "size": this._setSize(options[prop]); break;
                    case "showRoundedCorner": this._setRoundedCorner(options[prop]); break;
                    case "enabled": this._setEnabled(options[prop]); break;
                    case "htmlAttributes": this._addAttr(options[prop]); break;
                }
            }
        },

        _destroy: function () {
            this.element.removeClass("e-checkbox e-input");
            !this._cloneElement.attr("name") && this.element.attr("name") && this.element.removeAttr("name");
            !this._cloneElement.attr("value") && this.element.attr("value") && this.element.removeAttr("value");
            this.element.insertBefore(this.wrapper);
            this.wrapper.remove();
        },

        _changeSkin: function (skin) {
            if (this.model.cssClass != skin) {
                this.wrapper.removeClass(this.model.cssClass).addClass(skin);
                $("#" + this.model.idPrefix + this.model.id + "_wrapper").removeClass(this.model.cssClass).addClass(skin);
            }
        },

        _setValue: function () {
            this._indeterminateState = false;
            this._isChecked = false;
            var _id = this.element[0].getAttribute("id"), _name = this.element[0].getAttribute('name'), _value = this.element[0].getAttribute('value');
            !ej.isNullOrUndefined(_id) && (this.model.id = _id);
            !ej.isNullOrUndefined(_name) && (this.model.name = _name);
            if (!ej.isNullOrUndefined(_value) && _value != "") this.model.value = _value;
            if (!this.checked() && !ej.isNullOrUndefined(this.element.attr('checked'))) this._isChecked = true;
            ej.isNullOrUndefined(this.model.name) && (this.model.name = this.model.id);
            this.model.enabled = this.model.enabled && !this.element.attr("disabled");
        },

        _setSize: function (val) {
            if (val == ej.CheckboxSize.Medium) {
                $(this.innerdiv).removeClass('e-chkbox-small').addClass('e-chkbox-medium');
                $(this.maindiv).removeClass('e-check-small').addClass('e-check-medium');
				
			}
            else {
                $(this.innerdiv).removeClass('e-chkbox-medium').addClass('e-chkbox-small');
				$(this.maindiv).removeClass('e-check-medium').addClass('e-check-small');
			}
        },

        _setRoundedCorner: function (val) {
            if (val)
                this.span.addClass("e-corner");
            else
                this.span.removeClass("e-corner");
        },

        _setEnabled: function (val) {
            if (val) {
                this.enable();
            } else {
                this.disable();
            }
        },
        _setCheckBoxState: function () {
            if (this.model.enableTriState) {
                if (this.checkState() == "indeterminate")
                    this._indeterminateState = true;
                else if (this.checkState() == "check")
                    this._isChecked = true;
                else if (this.checkState() == "uncheck")
                    this._isChecked = false;
            }
            else if (this.checkState() == "indeterminate")
                this.checkState("uncheck");
        },
        _createElement: function (tagName, attrs) {
            var ele = document.createElement(tagName);
            this._setAttributes(ele, attrs);
            return ele;
        },
        _setAttributes: function (ele, attrs) {
            for (var key in attrs) {
                ele.setAttribute(key, attrs[key]);
            }
        },
        _renderControl: function () {
            this._setCheckBoxState();
            this.maindiv = this._createElement("span", { "class": "e-chkbox-wrap e-widget " + this.model.cssClass, "role": "checkbox", tabindex: 0 });
            if (this._isValid(this.model.id)) {
                this.maindiv.setAttribute("id", this.model.idPrefix + this.model.id);
                this.element[0].setAttribute("id", this.model.id);
            }
            this.innerdiv = document.createElement("div");
            this._setSize(this.model.size);
            this.span = document.createElement("span");
            this.span = $(this.span);
            this.spanImg = this._createElement("span", { "class": "e-chk-image e-icon", "role": "presentation" });
            this.spanImg = $(this.spanImg);
            this.element.addClass("e-input");
            this.model.name = ej.isNullOrUndefined(this.model.name) ? this.model.id : this.model.name;
            this._setAttributes(this.element[0], { "name": this.model.name, "value": this.model.value });
            var hiddenEl = $("#" + this._id + "_hidden")
            // hidden input element will be generated in MVC wrapper
            this._hiddenInput = hiddenEl.length ? hiddenEl[0] : this._createElement("input", { type: "checkbox", value: false, style: "display:none" });
            this._isValid(this.model.name) && this._hiddenInput.setAttribute("id", this.model.name + "_hidden");

            this._setRoundedCorner(this.model.showRoundedCorner);
            if (this.checked())
                this._setCheckedItem(this.checked());
            if (this._isChecked) {
                this.spanImg.addClass("e-checkmark");
                this.span.addClass("e-chk-act");
                this.maindiv.setAttribute("aria-checked", true);
                this.element.attr("checked", "checked")
            }
            else {
                this.span.addClass("e-chk-inact");
                this.maindiv.setAttribute("aria-checked", false);
                this._hiddenInput.setAttribute("name", this.model.name);
            }
            if (!(this.checked() instanceof Array))
                this.checked(this._isChecked);
            this.span[0].appendChild(this.spanImg[0]);
            this.innerdiv.appendChild(this.span[0]);
            this.element[0].parentNode && this.element[0].parentNode.insertBefore(this.maindiv, this.element[0]);
            this.maindiv.appendChild(this.element[0]);
            this.maindiv.appendChild(this._hiddenInput);
            this.maindiv.appendChild(this.innerdiv);
            this.wrapper = $(this.maindiv);
            this._setTextWrapper(this.model.text);
            this.chkbx = this.element;
            if (this.model.enableTriState == true && this._indeterminateState == true)
                this._setIndeterminate(this._indeterminateState);
            if (this.checked() instanceof Array)
                this._updateCheckedItem();
        },
        _changeState: function (state) {
            if (state == "indeterminate") {
                this.spanImg.removeClass("e-checkmark").addClass("e-stop");
                this.span.removeClass("e-chk-act e-chk-inact").addClass("e-chk-indeter");
                this.wrapper[0].setAttribute("aria-checked", "mixed");
                this.wrapper.find('input').prop('enableTriState', true);
                if (!(this.checked() instanceof Array))
                    this.checked(null);
            }
            else if (state == "check") {
                this.spanImg.removeClass("e-stop").addClass("e-checkmark");
                this.span.removeClass("e-chk-act e-chk-inact e-chk-indeter").addClass("e-chk-act");
                this.wrapper[0].setAttribute("aria-checked", true);
            }
            else if (state == "uncheck") {
                this.spanImg.removeClass("e-checkmark e-stop");
                this.span.removeClass("e-chk-act e-chk-indeter").addClass("e-chk-inact");
                this.wrapper[0].setAttribute("aria-checked", false);
            }
        },

        _setIndeterminate: function (indeter) {
            if (indeter) {
                this.spanImg.removeClass("e-checkmark").addClass("e-stop");
                this.span.removeClass("e-chk-act e-chk-inact").addClass("e-chk-indeter");
                this.wrapper[0].setAttribute("aria-checked", "mixed");
                this.wrapper.find('input').prop('enableTriState', true);
                this.checkState("indeterminate");
                if (!(this.checked() instanceof Array))
                    this.checked(null);
                this._hiddenInput.setAttribute("name", this.model.name);
            }
            else {
                this.span.removeClass("e-chk-indeter");
                this.spanImg.removeClass("e-stop");
                this.wrapper.find('input').removeAttr('enableTriState');
                this.wrapper.find('input').prop('enableTriState', false);
                if (this.checked())
                    this._checked();
                else
                    this._unChecked();
            }
        },

        _setTextWrapper: function (val) {
            if (val != "") {
                this.txtSpan = ej.buildTag("div.e-text", val);
                this.wrapper.append(this.txtSpan);
                this.model.enableRTL && this._setRTL();
            }
        },

        _setText: function (val) {
            if ((this.model.text == "") && (val != "")) {
                this._setTextWrapper(val);
            } else {
                this.txtSpan.html(val);
            }
        },

        _setIdAttr: function (val) {
            $("#" + this.model.idPrefix + this.model.id + "_wrapper").attr('id', this.model.idPrefix + val + "_wrapper");
            this.element[0].setAttribute('id', val);
        },

        _isValid: function (value) {
            return (!ej.isNullOrUndefined(value) && value != "") ? true : false;
        },

        _wireEvents: function () {
            this._on(this.wrapper, "click", this._checkedHandler);
            if (this._isIE8) {
                this._isValid(this.model.id) && this._on($("label[for=" + this.model.id + "]"), "click", function () { this.wrapper.click(); });
            }
            this._on(this.wrapper, "focus", this._focusIn);
            this._on(this.wrapper, "focusout", this._focusOut);
        },


        _unWireEvents: function () {
            this._off(this.wrapper, (this._isDevice && $.isFunction($.fn.tap)) ? "tap" : "click");
            if (this._isIE8) {
                this._isValid(this.model.id) && this._off($("label[for=" + this.model.id + "]"), "click");
            }
            this._off(this.wrapper, "focus");
            this._off(this.wrapper, "focusout");
        },
        _focusIn: function (evt) {
            $(this.wrapper).addClass("e-focus");
            $(this.wrapper).on("keydown", $.proxy(this._checkUnCheck, this));
        },
        _focusOut: function (evt) {
            $(this.wrapper).removeClass("e-focus");
            $(this.wrapper).off("keydown", $.proxy(this._checkUnCheck, this));
        },
        _checkUnCheck: function (evt) {
            //Space bar to check and uncheck
            if (evt.keyCode == 32) {
                evt.preventDefault();
                this._checkedHandler();
            }
        },
        _checkedHandler: function (evt) {
            var data = { isChecked: this._isChecked, isInteraction: true, event: evt };
            if (true == this._trigger("beforeChange", data)) {
                return false;
            }
            if (this.span.hasClass("e-chk-inact")) {
                this._checked();
                if (!(this.checked() instanceof Array))
                    this.checked(true);
                if (this.model.enableTriState) {
                    this._indeterminateState = true;
                    this.checkState("check");
                }
            }
            else if (this.span.hasClass("e-chk-act")) {
                if ((this.model.enableTriState == true) && (this.model.checkState == "check") && (this.model.checked == true)){
                    this._setIndeterminate(true);
                    if (!(this.checked() instanceof Array)) {
                        this.checked(true);
                        this.checkState("indeterminate");
                    }
                } else {
                    this._unChecked();
                    if (!(this.checked() instanceof Array)) {
                        this.checked(false);
                        this.checkState("uncheck");
                    }
                }
            }
            else if (this.span.hasClass("e-chk-indeter")) {
                if (!(this.checked() instanceof Array))
                    this.checked(false);
                else
                    this._isChecked = false;
                this._setIndeterminate(false);
                this._indeterminateState = false;
            }
            if (this.checked() instanceof Array)
                this._updateCheckedItem();
            else
                this._isChecked = this.checked();
            $(this.maindiv).addClass("e-material-animate");
            var data = { isChecked: this._isChecked, checkState: this.checkState(), isInteraction: true, event: evt };
            this._trigger("change", data);
            return true;
        },


        _checked: function () {
            this.span.removeClass("e-chk-inact").addClass("e-chk-act");
            this.spanImg.removeClass("e-stop").addClass("e-checkmark");
            this.wrapper[0].setAttribute("aria-checked", true);
            this.wrapper.find('input[type=checkbox]').prop('checked', true);
            this.checkState("check");
            this._hiddenInput.removeAttribute("name");
        },


        _unChecked: function () {
            this.span.removeClass("e-chk-act e-chk-indeter").addClass("e-chk-inact");
            this.wrapper[0].setAttribute("aria-checked", false);
            this.spanImg.removeClass("e-checkmark e-stop");
            this.wrapper.find('input[type=checkbox]').prop('checked', false);
            this.checkState("uncheck");
            this._hiddenInput.setAttribute("name", this.model.name);
        },

        _setCheckedItem: function (value) {
            if (typeof(value) == "boolean" && !(value instanceof Array))
                this._isChecked = true;
            else if (value instanceof Array && !ej.isNullOrUndefined(this.model.value) && this.model.value != "") {
                for (var item = 0; item < value.length; item++) {
                    if (value[item] == this.model.value)
                        this._isChecked = true;
                }
            }
        },

        _updateCheckedItem: function () {
            if (!ej.isNullOrUndefined(this.model.value) && this.model.value != "" && !this.wrapper.find("span:first").hasClass("e-chk-indeter")) {
                if (($.inArray(this.model.value, this.checked()) < 0) && this.wrapper.find("span:first").hasClass("e-chk-act")) {
                    this.checked().push(this.model.value);
                    this._isChecked = true;
                    this._hiddenInput.removeAttribute("name");
                }
                else if (($.inArray(this.model.value, this.checked()) > -1) && this.wrapper.find("span:first").hasClass("e-chk-inact")) {
                    this.checked().splice($.inArray(this.model.value, this.checked()), 1);
                    this._isChecked = false;
                    this._hiddenInput.setAttribute("name", this.model.name);
                }
            }
        },


        disable: function () {
            if (!this.wrapper.hasClass("e-disable")) {
                this.wrapper.addClass("e-disable");
                this.wrapper[0].setAttribute("aria-disabled", true);
                this.element[0].setAttribute("disabled", "disabled");
                if (this._isIE8) this.span.addClass("e-disable");
                this._unWireEvents();
                this.model.enabled = false;
            }
        },

        enable: function () {
            if (this.wrapper.hasClass("e-disable")) {
                this.wrapper.removeClass("e-disable");
                this.wrapper[0].setAttribute("aria-disabled", false);
                this.element.prop("disabled", false);
                if (this._isIE8) this.span.removeClass("e-disable");
                this._wireEvents();
                this.model.enabled = true;
            }
        },

        isChecked: function () {
            if ((this._isChecked != null) && (this._isChecked != undefined))
                return this._isChecked;
        }
    });

    ej.CheckboxSize = {
        /**  Creates checkbox with inbuilt small size height, width specified */
        Small: "small",
        /**  Creates checkbox with inbuilt medium size height, width specified */
        Medium: "medium"
    };

    ej.CheckState = {
        /**  Specifies the Check attribute of the Checkbox */
        Check: "check",
        /**  Specifies the Uncheck attribute of the Checkbox */
        Uncheck: "uncheck",
        /**  Specifies the Indeterminate state of the Checkbox */
        Indeterminate: "indeterminate"
    };
})(jQuery, Syncfusion);;;

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