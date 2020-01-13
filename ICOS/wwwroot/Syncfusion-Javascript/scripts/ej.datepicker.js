/*!
*  filename: ej.datepicker.js
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
* @fileOverview Plugin provides support to display calendar within your web page and allows to pick the date.
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget("ejDatePicker", "ej.DatePicker", {

        element: null,
        _rootCss: "e-datepicker",

        model: null,
        validTags: ["input", "div", "span"],
        _setFirst: false,
        _addToPersist: ["value"],
        _cancelValue: false,
        type: "editor",
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions'],
            requireFormatters: true
        },


        defaults: {

            dayHeaderFormat: "min",

            showPopupButton: true,

            enableAnimation: true,

            showFooter: true,

            displayInline: false,

            htmlAttributes: {},

            dateFormat: '',

            watermarkText: "Select date",

            value: null,
            minDate: new Date("01/01/1900"),

            maxDate: new Date("12/31/2099"),

            startLevel: "month",

            depthLevel: "",

            cssClass: "",

            startDay: -1,

            stepMonths: 1,

            locale: "en-US",

            showOtherMonths: true,

            enableStrictMode: false,

            enablePersistence: false,

            enabled: true,

            width: "",

            height: "",

            enableRTL: false,

            showRoundedCorner: false,

            headerFormat: 'MMMM yyyy',

            buttonText: 'Today',

            readOnly: false,

            specialDates: null,

            fields: {

                date: "date",

                tooltip: "tooltip",

                iconClass: "iconClass",

                cssClass: "cssClass"
            },

            showTooltip: true,

            showDisabledRange: true,

            highlightSection: "none",

            highlightWeekend: false,

            validationRules: null,

            validationMessage: null,
            validationMessages: null,

            allowEdit: true,

            tooltipFormat: "ddd MMM dd yyyy",

            allowDrillDown: true,

            blackoutDates: [],

            beforeDateCreate: null,

            open: null,

            close: null,

            select: null,

            change: null,

            focusIn: null,

            focusOut: null,

            beforeOpen: null,

            beforeClose: null,

            navigate: null,

            create: null,

            destroy: null,

            weekNumber: false

        },


        dataTypes: {
            startDay: "number",
            stepMonths: "number",
            showOtherMonths: "boolean",
            enableStrictMode: "boolean",
            showRoundedCorner: "boolean",
            enableRTL: "boolean",
            displayInline: "boolean",
            showPopupButton: "boolean",
            locale: "string",
            readOnly: "boolean",
            cssClass: "string",
            dateFormat: "string",
            watermarkText: "string",
            headerFormat: "string",
            buttonText: "string",
            specialDates: "data",
            showTooltip: "boolean",
            highlightSection: "enum",
            highlightWeekend: "boolean",
            enableAnimation: "boolean",
            validationRules: "data",
            validationMessage: "data",
            validationMessages: "data",
            htmlAttributes: "data",
            tooltipFormat: "string",
            allowEdit: "boolean",
            allowDrillDown: "boolean",
            weekNumber: "boolean"

        },

        _renderPopup: function () {
            this.sfCalendar = ej.buildTag('div.e-datepicker e-popup e-widget ' + this.model.cssClass + ' e-calendar ' + (this.model.specialDates ? (this.model.specialDates[0][this._mapField._icon] ? 'e-icons ' : '') : ''), "", {}, { id: (this._id ? 'e-' + this._id : "") }).attr({ 'aria-hidden': 'true' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                     .insertBefore(this.element);
            if (this.model.displayInline && !this.element.is("input"))
                this.sfCalendar.addClass('e-inline');
            this.popup = this.sfCalendar;
            if (!ej.isTouchDevice()) this.sfCalendar.addClass('e-ntouch');
            this._setRestrictDateState(this.model.showDisabledRange);
            this._createCalender();
            this._setDisplayInline(this.model.displayInline);
            this._resizeCalender();
            this._setRTL(this.model.enableRTL);
            this._setRoundedCorner(this.model.showRoundedCorner);
            this._wireCalendarEvents();
        },

        _setModel: function (jsondata) {
            if (ej.isNullOrUndefined(this.sfCalendar)) this._renderPopup();
            var callRefresh = false, start = false, validate = false;
            for (var key in jsondata) {
                switch (key) {
                    case "dayHeaderFormat":
                        this.model.dayHeaderFormat = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "weekNumber":
                        this.model.weekNumber = jsondata[key];
                        this._refreshDatepicker();
                        break;
                    case "showPopupButton":
                        this._renderDateIcon(jsondata[key], true);
                        break;
                    case "displayInline":
                        if (!jsondata[key]) this._bindDateButton();
                        this._setDisplayInline(jsondata[key]);
                        if (!this.model.allowEdit && !jsondata[key] && this._isInputBox)
                            this.element.on("mousedown", $.proxy(this._showDatePopUp, this));
                        break;
                    case "value":
                        if (ej.isPlainObject(jsondata[key])) jsondata[key] = null;
                        if (ej.isNullOrUndefined(jsondata["minDate"]) && ej.isNullOrUndefined(jsondata["maxDate"])) {
                            this._setDateValue(jsondata[key]);
                            if (this._specificFormat())
                                this._stopRefresh = true;
                            jsondata[key] = this.model.value;
                        }
                        else
                            this._updateDateValue(jsondata[key]);
                        validate = callRefresh = start = true;
                        break;
                    case "specialDates":
                        this.model.specialDates = jsondata[key];
                        this._createSpecialDateObject();
                        callRefresh = start = true;
                        break;
                    case "fields":
                        this.model.fields = jsondata[key];
                        this._mapField = this._getMapper();
                        callRefresh = start = true;
                        break;
                    case "showTooltip":
                        this.model.showTooltip = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "highlightWeekend":
                        this.model.highlightWeekend = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "highlightSection":
                        this.model.highlightSection = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "dateFormat":
                        this.model.dateFormat = jsondata[key];
                        this._ensureValue();
                        break;
                    case "minDate":
                        this._setMinDate(jsondata[key]);
                        jsondata[key] = this.model.minDate;
                        this._ensureValue();
                        validate = callRefresh = start = true;
                        break;
                    case "maxDate":
                        this._setMaxDate(jsondata[key]);
                        jsondata[key] = this.model.maxDate;
                        this._ensureValue();
                        validate = callRefresh = start = true;
                        break;
                    case "locale":
                        this.model.locale = jsondata[key];
                        this.model.startDay = ((ej.isNullOrUndefined(this._options.startDay)) && (this.model.startDay === this.culture.calendar.firstDay))
                            ? -1 : (this._options.startDay === this.defaults.startDay) ? -1 : this.model.startDay;
                        this.model.dateFormat = ((ej.isNullOrUndefined(this._options.dateFormat)) && (this.model.dateFormat === this.culture.calendar.patterns.d))
                            ? '' : this.model.dateFormat;
                        this._setCulture(jsondata[key]);
                        if (this.model.value) this._setDateValue(this.model.value);
                        jsondata[key] = this.model.locale;
                        callRefresh = start = true;
                        break;
                    case "showOtherMonths":
                        this.model.showOtherMonths = jsondata[key];
                        this._otherMonthsVisibility();
                        break;
                    case "enableStrictMode":
                        this.model.enableStrictMode = jsondata[key];
                        validate = callRefresh = start = true;
                        break;
                    case "validationRules":
                        if (this.model.validationRules != null) {
                            this.element.rules('remove');
                            this.model.validationMessages = null;
                        }
                        this.model.validationRules = jsondata[key];
                        if (this.model.validationRules != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "validationMessages":
                        this.model.validationMessages = jsondata[key];
                        if (this.model.validationRules != null && this.model.validationMessages != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "validationMessage":
                        this.model.validationMessages = jsondata[key];
                        if (this.model.validationRules != null && this.model.validationMessages != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "readOnly":
                        this.model.readOnly = jsondata[key];
                        this._disbleMaualInput();
                        break;
                    case "width":
                        this._setWidth(jsondata[key]);
                        break;
                    case "height":
                        this._setHeight(jsondata[key]);
                        break;
                    case "cssClass":
                        this._setSkin(jsondata[key]);
                        break;
                    case "enableRTL":
                        this._setRTL(jsondata[key]);
                        break;
                    case "showRoundedCorner":
                        this._setRoundedCorner(jsondata[key]);
                        break;
                    case "enabled":
                        if (!jsondata[key]) this.disable();
                        else this.enable();
                        break;
                    case "buttonText":
                        if (ej.isNullOrUndefined(this._options)) this._options = {};
                        this._options["buttonText"] = this.model.buttonText = jsondata[key];
                        this._localizedLabels.buttonText = this.model.buttonText;
                        this._setFooterText(jsondata[key]);
                        break;
                    case "showFooter":
                        this._enableFooter(jsondata[key]);
                        break;
                    case "watermarkText":
                        if (ej.isNullOrUndefined(this._options)) this._options = {};
                        this._options["watermarkText"] = this.model.watermarkText = jsondata[key];
                        this._localizedLabels.watermarkText = this.model.watermarkText;
                        this._setWaterMark();
                        break;
                    case "startDay":
                        var initial = jsondata[key];
                        if (parseInt(jsondata[key]) < 0 || parseInt(jsondata[key]) > 6) {
                            jsondata[key] = this.culture.calendar.firstDay;
                            initial = -1;
                        }
                        this.model.startDay = jsondata[key];
                        if (ej.isNullOrUndefined(this._options)) this._options = {};
                        this._options["startDay"] = initial;
                        callRefresh = start = true;
                        break;
                    case "startLevel":
                        this.model.startLevel = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "headerFormat":
                        this.model.headerFormat = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "depthLevel":
                        this.model.depthLevel = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "htmlAttributes": this._addAttr(jsondata[key]); break;
                    case "allowEdit": this._changeEditable(jsondata[key]); break;
                    case "tooltipFormat":
                        this.model.tooltipFormat = jsondata[key];
                        callRefresh = start = true;
                        break;
                    case "allowDrillDown":
                        this._allowQuickPick(jsondata[key]);
                        callRefresh = start = true;
                        break;
                    case "showDisabledRange":
                        this._setRestrictDateState(jsondata[key]);
                        break;
                    case "blackoutDates":
                        this.model.blackoutDates = jsondata[key];
                        this._initDisableObj(this.model.blackoutDates);
                        callRefresh = start = true;
                        break;
                }
            }
            if (validate) {
                this._validateMinMaxDate();
                jsondata["value"] = this.model.value;
                jsondata["maxDate"] = this.model.maxDate;
                jsondata["minDate"] = this.model.minDate;
            }
            this._setWaterMark();

            if (callRefresh && (this.isValidState || this.model.displayInline))
                this._refreshDatepicker();
            if (start) this._startLevel(this.model.startLevel);
            this._triggerChangeEvent();
            this._checkErrorClass();
        },
        observables: ["value"],

        _destroy: function () {
            if (this.model.displayInline)
                $(window).off("resize", $.proxy(this._OnWindowResize, this));
            if (this._isOpen)
                this.hide();
            this.sfCalendar && this.sfCalendar.remove();
            if (this.wrapper) {
                this.element.insertAfter(this.wrapper);
                this.wrapper.remove();
            }
            this._cloneElement.removeClass("e-js e-input").removeClass(ej.util.getNameSpace(this.sfType));
            this._cloneElement.insertAfter(this.element);
            this.element.remove();
        },

        _init: function (options) {
            this._options = options;
            this._cloneElement = this.element.clone();
            this._dt_drilldown = false;
            this._ISORegex();
            this._initDisableObj(this.model.blackoutDates);
            this.animation = {
                open: { duration: 200 },
                close: { duration: 100 }
            };
            this._animating = false;
            this._isInputBox = this._isInputBox();
            this._isSupport = document.createElement("input").placeholder == undefined ? false : true;
            this._checkAttribute();
            this._setValues();
            this._createDatePicker();
            if (!ej.isNullOrUndefined(options) && !ej.isNullOrUndefined(options.validationMessage))
                this.model.validationMessages = this.model.validationMessage;
            if (this.model.validationRules != null) {
                this._initValidator();
                this._setValidation();
            }
            if (options && options.value != undefined && options.value != this.element.val()) {
                this._trigger("_change", { value: this.element.val() });
            }
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

        _initValidator: function () {
            (!this.element.closest("form").data("validator")) && this.element.closest("form").validate();
        },
        _setValidation: function () {
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
        _checkAttribute: function () {
            var attr = ["min", "max", "readonly", "disabled"], propName = ["minDate", "maxDate", "readOnly", "enabled"], value, propValue;
            for (var i = 0; i < attr.length; i++) {
                value = this.element.attr(attr[i]); propValue = propName[i];
                if (!ej.isNullOrUndefined(value)) {
                    if (ej.isNullOrUndefined(this._options))
                        this.model[propValue] = ((propValue != "enabled") && (propValue != "readOnly")) ? new Date(value) : propValue == "readOnly" ? this.element.is("[readonly]") : !this.element.is("[disabled]");
                    else if (ej.isNullOrUndefined(this._options[propValue]))
                        this.model[propValue] = ((propValue != "enabled") && (propValue != "readOnly")) ? new Date(value) : propValue == "readOnly" ? this.element.is("[readonly]") : !this.element.is("[disabled]");
                }
            }
        },
        _updateDateValue: function (value) {
            var date = this._checkDateObject(value);
            if (date != null) {
                this.isValidState = true;
                if (date == "") {
                    this.element.val("");
                    this.model.value = null;
                } else {
                    this.model.value = date;
                    this._preTxtValue = this.element.val(this._formatter(this.model.value, this.model.dateFormat));
                }
            }
            else {
                (typeof date === "string" && this.model.enableStrictMode) ? this.element.val(value) : this.element.val("");
                this.model.value = null;
                this.isValidState = (this.element.val() == "") ? true : false;
            }
            this._removeWatermark();
        },
        _ensureValue: function () {
            var dateValue = this._parseDate(this.element.val(), this.model.dateFormat);
            if (this.model.value)
                this._setDateValue(this.model.value);
            else if (dateValue)
                this._setDateValue(dateValue);
        },
        _changeEditable: function (bool) {
            var action = bool ? "_on" : "_off";
            if (this.element.is(":input")) {
                if (bool) {
                    if (!this.model.readOnly) this.element.attr("readonly", false);
                    this.element.off("mousedown", $.proxy(this._showDatePopUp, this));
                }
                else {
                    if (!this.model.readOnly) this.element.attr("readonly", "readonly");
                    if (!this.model.displayInline) this.element.on("mousedown", $.proxy(this._showDatePopUp, this));
                }
                this[action](this.element, "blur", this._onFocusOut);
                this[action](this.element, "focus", this._onFocusIn);
                this[action](this.element, "keydown", this._onKeyDown);
            }
        },
        _allowQuickPick: function (value) {
            $('.e-datepicker-headertext', this.sfCalendar)[value ? "on" : "off"]("click", $.proxy(this._forwardNavHandler, this));
        },
        _setRestrictDateState: function (value) {
            var action = value ? "addClass" : "removeClass";
            this.sfCalendar[action]("e-dp-restrict-show");
        },
        _setValues: function () {
            this.Date = new Date();
            this._id = this.element[0].id;
            this.isValidState = true;
            this._setCulture(this.model.locale);
            this._setMinDate(this.model.minDate);
            this._setMaxDate(this.model.maxDate);
            this._calendarDate = this._zeroTime(new Date());
            if (this.model.startDay < 0 || this.model.startDay > 6) this.model.startDay = 0;
            this.Date.firstDayOfWeek = this.model.startDay;
            this.Date.fullYearStart = '20';
            this._showHeader = true;
            if (ej.isNullOrUndefined(this.model.value) && this.element[0].value != "")
                this.model.value = this.element[0].value;
            this._validateMinMaxDate();
            this._dateValue = new Date(this._calendarDate.toString());
            this._isIE7 = this._checkIE7();
            this._isIE8 = (ej.browserInfo().name == "msie") && (ej.browserInfo().version == "8.0") ? true : false;
            this._isIE9 = (ej.browserInfo().name == "msie") && (ej.browserInfo().version == "9.0") ? true : false;
            // this variable is set to true in DateTimePicker control
            this._getInternalEvents = false;
            this._flag = true;
            this._ejHLWeekEnd = false;
            this._isOpen = false;
            this._prevDate = null;
            this._preValue = null;
            this._isFocused = false;
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                var keyName = key.toLowerCase();
                if (keyName == "class") proxy.wrapper.addClass(value);
                else if (keyName == "disabled") proxy.disable();
                else if (keyName == "readOnly") proxy.model.readOnly = true;
                else if (keyName == "style" || keyName == "id") proxy.wrapper.attr(key, value);
                else if (ej.isValidAttr(proxy.element[0], key)) proxy.element.attr(key, value);
                else proxy.wrapper.attr(key, value);

            });
        },
        _createDatePicker: function () {
            this._createWrapper();
            this._wireEvents();
            if (this.model.displayInline) {
                this.show();
            }
            if (this.model.enableRTL) this._setRTL(true);
            if (this.model.showRoundedCorner) this._setRoundedCorner(true);
        },
        _checkNameAttr: function () {
            if (!this.element.attr("name") && this._isInputBox)
                this.element.attr("name", this.element[0].id);
            if (this.model.displayInline && !this._isInputBox)
                this._hiddenInput.attr("name", this.element[0].id);
        },
        _createWrapper: function () {
            this._getMapper();
            if (this.model.specialDates)
                this._createSpecialDateObject();
			this.element.attr("tabindex","0");
            if (this._isInputBox) {
                this.element.addClass("e-input").attr({ 'aria-atomic': 'true', 'aria-live': 'assertive', 'aria-expanded':'false','role':'combobox' });
                this.wrapper = ej.buildTag("span.e-datewidget e-widget " + this.model.cssClass);
                this.wrapper.attr("style", this.element.attr("style"));
                this.element.removeAttr('style');
                if (!ej.isTouchDevice()) this.wrapper.addClass('e-ntouch');
                this.innerWrapper = ej.buildTag("span.e-in-wrap e-box e-padding");
                this.wrapper.append(this.innerWrapper).insertBefore(this.element);
                this.innerWrapper.append(this.element);
                this.dateIcon = ej.buildTag("span.e-select#" + this._id + "-img", "", {}, (this._isIE8) ? { 'unselectable': 'on' } : {})
                    .append(ej.buildTag("span.e-icon e-calendar", "", {}, { 'aria-label': 'Select' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})).insertAfter(this.element);
            }
            if (!this._isSupport || (this.model.displayInline && !this._isInputBox)) {
                this._hiddenInput = ej.buildTag("input.e-input e-placeholder ", "", {}, { type: "text" }).insertAfter(this.element);
                if (this._isInputBox) this._hiddenInput.val(this._localizedLabels.watermarkText);
                this._hiddenInput.css("display", "block");
                var proxy = this;
                $(this._hiddenInput).focus(function () {
                    proxy.element.focus();
                });
            }
            this._checkNameAttr();
            if (!this.model.height) this.model.height = this.element.attr("height"); if (!this.model.width) this.model.width = this.element.attr("width");
            this._setHeight(this.model.height);
            this._setWidth(this.model.width);
            if (this._id)
                $("#e-" + this._id).remove();
            this._setDateValue(this.model.value);
            this._preValue = this._parseDate(this.element.val(), this.model.dateFormat);
            this._setWaterMark();
            this._dateValue = new Date(this._calendarDate.toString());
            if (this.model.displayInline) this._renderPopup();
            else if (this._isInputBox) this._renderDateIcon(this.model.showPopupButton, false);
            if (this.model.readOnly) this._disbleMaualInput();
            if (!this.model.enabled) this.disable();
            else if (this.model.enabled && $(this.element).hasClass("e-disable")) this.enable();
            this._layoutChanged();
            this._checkErrorClass();
            this._addAttr(this.model.htmlAttributes);
        },
        _isInputBox: function () {
            return (this.element.is("input") && (this.element.is("input[type=text]") || !this.element.attr('type')));
        },

        _renderDateIcon: function (bool, reRender) {
            if (reRender && this.model.showPopupButton == bool) return;
            if (!bool && this.dateIcon) {
                this._bindInputEvent();
                this.dateIcon.css('display', 'none');
                this.innerWrapper.removeClass('e-padding');
            }
            else {
                if (this.innerWrapper) {
                    this.innerWrapper.addClass('e-padding');
                    this.dateIcon.css('display', 'block');
                }
                if (!this.model.displayInline)
                    this._bindDateButton();
            }
            this.model.showPopupButton = bool;
        },

        _resizeCalender: function () {
            if ((this.model.dayHeaderFormat == "short") || (this.model.dayHeaderFormat == "min") || (this.model.dayHeaderFormat == "none"))
                this.sfCalendar.removeClass("e-headerlong");
            else if (this.model.dayHeaderFormat == "long") {
                this.sfCalendar.addClass("e-headerlong");
            }
        },

        _setWidth: function (value) {
            if (value) {
                if (this.wrapper) this.wrapper.width(value);
                else this.element.width(value);
            }
            else
                this.model.width = this.wrapper ? this.wrapper.outerWidth() : this.element.width();
        },
        _setHeight: function (value) {
            if (value) {
                if (this.wrapper) this.wrapper.height(value);
                else this.element.height(value);
            }
            else
                this.model.height = this.wrapper ? this.wrapper.outerHeight() : this.element.height();
            if (this._isIE7) this.element.height(this.innerWrapper.height());
        },
        _setRTL: function (isRTL) {
            if (isRTL) {
                if (this.wrapper) {
                    this.wrapper.addClass("e-rtl");
                }
                this.sfCalendar && this.sfCalendar.addClass("e-rtl");
            }
            else {
                if (this.wrapper) {
                    this.wrapper.removeClass("e-rtl");
                }
                this.sfCalendar && this.sfCalendar.removeClass("e-rtl");
            }
        },
        _setRoundedCorner: function (bool) {
            if (bool) {
                if (this.innerWrapper)
                    this.innerWrapper.addClass("e-corner");
                this.sfCalendar && this.sfCalendar.addClass("e-corner");
            }
            else {
                if (this.innerWrapper)
                    this.innerWrapper.removeClass("e-corner");
                this.sfCalendar && this.sfCalendar.removeClass("e-corner");
            }
        },

        _refreshDatepicker: function () {
            if (this._stopRefresh) {
                this._stopRefresh = false
                return;
            }
            var _currentVal = this.element.val();
            //  For checking the year maximum range....
            if (this._specificFormat() && this._formatter(this._preValue, this.model.dateFormat, this.model.locale) != _currentVal)
                var currentValue = this._parseDate(_currentVal, true);
            else var currentValue = this._parseDate(_currentVal);
            currentValue = this._validateYearValue(currentValue);
            this._setDateValue(currentValue);
            if (this._specificFormat() && this._compareDate(this.model.value, this._calendarDate))
                this.element.val(_currentVal)
            $(".e-datepicker-headertext", this.sfCalendar).text(this._formatter(this._calendarDate, this.model.headerFormat));
            this._resizeCalender();
            this._dateValue = new Date(this._calendarDate.toString());
            this._hoverDate = this._calendarDate.getDate() - 1;
            this._renderCalendar(this, this._dateValue);
            this._setFooterText(this._localizedLabels.buttonText);
            this._enableFooter(this.model.showFooter);
            this._layoutChanged();
        },
        _validateYearValue: function (value) {
            if (value != null) {
                var twoDigitYearMax = ej.preferredCulture(this.model.locale).calendars.standard.twoDigitYearMax;
                twoDigitYearMax = typeof twoDigitYearMax === "string" ? new Date().getFullYear() % 100 + parseInt(twoDigitYearMax, 10) : twoDigitYearMax;
                if (this._calendarDate.getFullYear() - value.getFullYear() == 100) {
                    if (this._calendarDate.getFullYear() > twoDigitYearMax)
                        value.setFullYear(this._calendarDate.getFullYear())
                }
            }
            return value;
        },
        _setFooterText: function (footerText) {
            $('.e-footer-text', this.sfCalendar).html(footerText);
        },
        _setSkin: function (skin) {
            if (this.wrapper) {
                this.wrapper.removeClass(this.model.cssClass);
                this.wrapper.addClass(skin);
            }
            else {
                this.element.removeClass(this.model.cssClass);
                this.element.addClass(skin);
            }
            this.sfCalendar.removeClass(this.model.cssClass);
            this.sfCalendar.addClass(skin);
        },
        _setDisplayInline: function (isDisplayInline) {
            this.model.displayInline = isDisplayInline;
            if (isDisplayInline && this._isInputBox) {
                this.sfCalendar.insertAfter(this.wrapper);
                this._setDatePickerPosition();
            }
            else if (isDisplayInline) {
                this.element.append(this.sfCalendar);
                if (!this._isSupport || !this._isInputBox) this._hiddenInput.css("display", "none");
            }
            else {
                this.sfCalendar.css('display', 'none');
                $('body').append(this.sfCalendar);
                this._isOpen = false;
            }
            if (isDisplayInline) {
                this.show();
                this._off(this.dateIcon, "mousedown", this._showDatePopUp);
                this.element.off("mousedown", $.proxy(this._showDatePopUp, this));
            }

        },

        _disbleMaualInput: function () {
            if (this.model.readOnly) {
                $(this.element).attr("readonly", "readonly");
                if (!this.model.displayInline) this.hide();
            }
            else if (this.model.allowEdit)
                $(this.element).prop("readonly", false);

        },
        _checkDateObject: function (date, val) {
            if (!date || (typeof JSON === "object" && JSON.stringify(date) === "{}")) return date = null;
            else if (!(date instanceof Date)) {
                if (this._specificFormat())
                    var val = this._parseDate(date, true);
                else
                    var val = this._parseDate(date, val);
                date = val ? val : (val = this._checkJSONString(date)) ? val : null;
            }
            if (!isNaN(Date.parse(date))) {
                this._dateValue = this._calendarDate = this._zeroTime(date)
                if (this._validateDate(date))
                    return this._dateValue;
            }
            return null;
        },
        _checkJSONString: function (date) {
            // Validate the string value
            if (!isNaN(Date.parse(date))) {
                if ((new Date(date).toJSON() === date) || (new Date(date).toDateString() === date) || (new Date(date).toGMTString() === date) ||
                    (new Date(date).toISOString() === date) || (new Date(date).toLocaleString() === date) ||
                    (new Date(date).toString() === date) || (new Date(date).toUTCString() === date)) {
                    return new Date(new Date(date).getTime() + (ej.serverTimezoneOffset * 60 * 60 * 1000));
                }
                else if (typeof date == "string") return this._dateFromISO(date);
            } else if (this._extISORegex.exec(date) || this._basicISORegex.exec(date)) return this._dateFromISO(date);
        },
        _dateFromISO: function (date) {
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
        _checkInstanceType: function (date) {
            date = this._stringToObject(date);
            if (!date) return null;
            else if (!(date instanceof Date)) {
                date = this._parseDate(date);
            }
            if (!isNaN(Date.parse(date))) return this._zeroTime(date);
            return null;
        },
        _stringToObject: function (value) {
            if (typeof value === "string") {
                var val = ej.parseDate(value, this.model.dateFormat, this.model.locale);
                value = (val != null) ? val : new Date(value);
            }
            return value;
        },
        _validateMinMaxDate: function () {
            var dateChange = false, valueExceed = false;
            if (this.model.maxDate < this.model.minDate) this.model.minDate = this.model.maxDate;
            if (!this.model.enableStrictMode) {
                if (this.model.value) {
                    if (this.model.value < this.model.minDate) {
                        this._calendarDate = this.model.value = this.model.minDate;
                        dateChange = true;
                    }
                    else if (this.model.value > this.model.maxDate) {
                        this._calendarDate = this.model.value = this.model.maxDate;
                        dateChange = true;
                    }
                }
                else {
                    this.element.val("");
                    if (this._calendarDate < this.model.minDate) this._calendarDate = this.model.minDate;
                    else if (this._calendarDate > this.model.maxDate) this._calendarDate = this.model.maxDate;
                }
                this.isValidState = true;
            }
            else {
                if (this.model.value) {
                    if (this.model.value < this.model.minDate) {
                        this._calendarDate = this.model.minDate;
                        this.isValidState = false;
                        valueExceed = true;
                    }
                    else if (this.model.value > this.model.maxDate) {
                        this._calendarDate = this.model.maxDate;
                        this.isValidState = false;
                        valueExceed = true;
                    }
                    else this.isValidState = true;
                }
                else {
                    if (this._calendarDate < this.model.minDate) this._calendarDate = this.model.minDate;
                    else if (this._calendarDate > this.model.maxDate) this._calendarDate = this.model.maxDate;
                }
            }
            if (dateChange) this.element.val(this._formatter(this.model.value, this.model.dateFormat));
            if (valueExceed && this._getInternalEvents) this._trigger("outOfRange");
        },
        _setCulture: function (culture) {
            this.culture = ej.preferredCulture(culture);
            if (this.culture) {
                this.model.locale = this.culture.name == "en" ? "en-US" : this.culture.name;
                this.Date.dayNames = this.culture.calendar.days.names;
                this.Date.dayNamesMin = this.culture.calendar.days.namesShort;
                this.Date.abbrDayNames = this.culture.calendar.days.namesAbbr;
                this.Date.monthNames = this.culture.calendar.months.names;
                this.Date.abbrMonthNames = this.culture.calendar.months.namesAbbr;
                this.Date.format = this.culture.calendar.patterns.d;
                if (this.model.dateFormat == '') this.model.dateFormat = this.culture.calendar.patterns.d;
                if (this.model.startDay == -1) this.model.startDay = this.culture.calendar.firstDay;
            }
            this._separator = this._getSeparator();
            this._localizedLabels = this._getLocalizedLabels();

            if (!ej.isNullOrUndefined(this._options)) {
                if (!ej.isNullOrUndefined(this._options.watermarkText))
                    this._localizedLabels.watermarkText = this._options.watermarkText;
                if (!ej.isNullOrUndefined(this._options.buttonText))
                    this._localizedLabels.buttonText = this._options.buttonText;
            }
            this._localizedLabelToModel();
        },

        _localizedLabelToModel: function () {
            this.model.watermarkText = this._localizedLabels.watermarkText;
            this.model.buttonText = this._localizedLabels.buttonText;
        },

        _setWaterMark: function () {
            if (this.element != null && this.element.hasClass("e-input")) {
                if (this._localizedLabels.watermarkText && this.element.val() == "") {
                    this.isValidState = true;
                    this._checkErrorClass();
                }
                if ((!this._isSupport) && this.element.val() == "") {
                    this._hiddenInput.css("display", "block").val(this._localizedLabels.watermarkText);
                }
                else {
                    $(this.element).attr("placeholder", this._localizedLabels.watermarkText);
                }
                return true;
            }
        },

        _setDatePickerPosition: function () {
            if (!this.model.displayInline || this._isInputBox) {
                var elementObj = this.element.is('input') ? this.wrapper : this.element;
                var pos = this._getOffset(elementObj), winLeftWidth, winRightWidth,
                winBottomHeight = $(document).scrollTop() + $(window).height() - (pos.top + $(elementObj).outerHeight()),
                winTopHeight = pos.top - $(document).scrollTop(),
                popupHeight = this.sfCalendar.outerHeight(),
                popupWidth = this.sfCalendar.outerWidth(),
                left = pos.left,
                totalHeight = elementObj.outerHeight(),
                border = (totalHeight - elementObj.height()) / 2,
                maxZ = this._getZindexPartial(), popupmargin = 3,
                topPos = (popupHeight < winBottomHeight || popupHeight > winTopHeight) ? pos.top + totalHeight + popupmargin : pos.top - popupHeight - popupmargin; // popupmargin denotes space b/w the element and the popup.
                winLeftWidth = $(document).scrollLeft() + $(window).width() - left;
                winRightWidth = $(document).scrollLeft() + left + elementObj.width();
                if (this.model.enableRTL || popupWidth > winLeftWidth && (popupWidth < left + elementObj.outerWidth()) && !ej.isNullOrUndefined(this.wrapper))
                    left += this.wrapper.width() - this.sfCalendar.width();
                if (popupWidth > winRightWidth) left = pos.left;
                this.sfCalendar.css({
                    "left": left + "px",
                    "top": topPos + "px",
                    "z-index": maxZ
                });
            }
        },

        _getOffset: function (ele) {
            return ej.util.getOffset(ele);
        },

        _getZindexPartial: function () {
            return ej.util.getZindexPartial(this.element, this.sfCalendar);
        },

        _setMinDate: function (d) {
            this.model.minDate = this._checkInstanceType(d);
            if (!this.model.minDate) {
                this.model.minDate = (new Date('11/31/1899'));
            }
        },

        _setMaxDate: function (d) {
            this.model.maxDate = this._checkInstanceType(d);
            if (!this.model.maxDate) {
                this.model.maxDate = (new Date('12/31/2099')); // using the JS Date.parse function which expects mm/dd/yyyy
            }
        },
        _setDateValue: function (date, val) {
            var newDate = this._checkDateObject(date, val);
            if (newDate != null) {
                this.isValidState = true;
                this.model.value = new Date(newDate.toString());
                if (!this.model.displayInline)
                    this.wrapper.addClass('e-valid');
                this._validateMinMaxDate();
                this._preTxtValue = this.element.val(this._formatter(this.model.value, this.model.dateFormat));
            }
            else {
                if (date instanceof Date) {
                    this._validateMinMaxDate();
                    date = this._formatter(date, this.model.dateFormat);
                }
                (this.model.enableStrictMode) ? this.element.val(date) : this.element.val(null);
                this.model.value = null; //updating model value as null to avoid the recursive call to this method
                if (!this.model.displayInline)
                    this.wrapper.removeClass('e-valid');
                this._triggerChangeEvent();
                this.isValidState = (this.element.val() == "" || ej.isNullOrUndefined(this.element.val())) ? true : false;
            }
            this._removeWatermark();
        },
        _updateInputVal: function () {
            var val = this._validateValue();
            if ((val != null || !this.model.enableStrictMode) && this.sfCalendar && this.sfCalendar.find('.e-datepicker-days').is(':visible'))
                this._refreshDatepicker();
        },
        _validateInputVal: function () {
            var val = this._validateValue();
            if (val != null) {
                if (!this.model.enableStrictMode) {
                    if (val <= this.model.maxDate && val >= this.model.minDate)
                        this.isValidState = true;
                    else {
                        this.model.value = null;
                        this.isValidState = true;
                    }
                }
            }
        },

        _validateValue: function () {
            if (this._specificFormat() && this.element.val() != this._formatter(this._preValue, this.model.dateFormat, this.model.locale))
                var value = this._parseDate(this.element.val(), true);
            else var value = this._parseDate(this.element.val());
            return this._validateYearValue(value);
        },
        _getSeparator: function () {
            var formats;
            if (this.culture) {
                formats = this.culture.calendar.patterns.d;
            }
            else formats = this.model.dateFormat;
            var regex = new RegExp("^[a-zA-Z0-9]+$");
            for (var i = 0; i < formats.length; i++) {
                if (!regex.test(formats[i])) return formats[i];
            }
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
        _isValidDate: function (dateObj) {
            return dateObj && typeof dateObj.getTime === "function" && isFinite(dateObj.getTime());
        },

        //Date formatter - Convert date object to specific date format
        _formatter: function (date, format) {
            var newFormat = this._checkFormat(format);
            return ej.format(date, newFormat, this.model.locale);
        },
        _parseDate: function (date, type) {
            var newFormat = this._checkFormat(this.model.dateFormat);
            var DateValue = date;
            if ((this._specificFormat()) && DateValue != undefined && date != "" && type != true && !(ej.format(ej.parseDate(DateValue, newFormat, this.model.locale), this.model.dateFormat, this.model.locale) == DateValue)) {
                return this._dateValue;
            }
            else return ej.parseDate(date, newFormat, this.model.locale);
        },
        _checkFormat: function (format) {
            var proxy = this;
            var dateFormatRegExp = this._regExp();
            return format.replace(dateFormatRegExp, function (match) {
                match = match === "/" ? ej.preferredCulture(proxy.model.locale).calendars.standard['/'] !== "/" ? "'/'" : match : match;
                return match;
            });
        },
        _regExp: function () {
            return /\/dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|HH|H|hh|h|mm|m|fff|ff|f|tt|ss|s|zzz|zz|z|gg|g|"[^"]*"|'[^']*'|[/]/g;
        },

        isLeapYear: function (year) {
            return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0;
        },
        //Sets the time component of this Date to zero for cleaner, easier comparison of dates where time is not relevant.
        _zeroTime: function (date) {
            var newDate = typeof date === "string" ? this._parseDate(date) : new Date(date);
            newDate.setMilliseconds(0);
            newDate.setSeconds(0);
            newDate.setMinutes(0);
            newDate.setHours(0);
            return newDate;
        },

        _getDaysInMonth: function (date) {
            return [31, (this.isLeapYear(date) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][date.getMonth()];
        },

        _addDays: function (d, number) {
            d.setDate(d.getDate() + number);
            return d;
        },

        _addYears: function (d, number) {
            d.setFullYear(d.getFullYear() + number);
            return d;
        },

        _addMonths: function (d, number) {
            var tempDatedateMonth = d.getDate();
            d.setMonth(d.getMonth() + number);
            if (tempDatedateMonth > d.getDate())
                this._addDays(d, -d.getDate());
            return d;
        },
        //Checks if the day is a weekend day (Sat or Sun).
        _isWeekend: function (date) {
            return date.getDay() == 0 || date.getDay() == 6;
        },

        _isSpecialDates: function (dates) {
            if (this.model.specialDates) {
                for (var i = 0; i < this.model.specialDates.length; i++) {
                    if (this.model.specialDates[i] && this.model.specialDates[i][this._mapField._date]) {
                        if (dates.getDate() == this.model.specialDates[i][this._mapField._date].getDate() && dates.getMonth() == this.model.specialDates[i][this._mapField._date].getMonth() && dates.getFullYear() == this.model.specialDates[i][this._mapField._date].getFullYear()) {
                            this._getIndex = i;
                            return true;
                        }
                    }
                }
            }
            return false;
        },
        _getMapper: function () {
            var mapper = this.model.fields;
            this._mapField = {};
            this._mapField["_date"] = (mapper && mapper.date) ? mapper["date"] : "date";
            this._mapField["_tooltip"] = (mapper && mapper.tooltip) ? mapper["tooltip"] : "tooltip";
            this._mapField["_icon"] = (mapper && mapper.iconClass) ? mapper["iconClass"] : "iconClass";
            this._mapField["_custom"] = (mapper && mapper.cssClass) ? mapper["cssClass"] : "cssClass";
        },
        _createSpecialDateObject: function () {
            for (var i = 0; i < this.model.specialDates.length; i++) {
                this.model.specialDates[i][this._mapField._date] = this._checkInstanceType(this.model.specialDates[i][this._mapField._date]);
            }
        },

        _getMonthName: function (abbreviated, date) {
            return abbreviated ? this.Date.abbrMonthNames[date.getMonth()] : this.Date.monthNames[date.getMonth()];
        },



        _displayNewMonth: function (m, y) {
            this._setDisplayedMonth(this.displayedMonth + m, this.displayedYear + y, true);
            return false;
        },

        _setDisplayedMonth: function (m, y, rerender) {
            if (this.model.minDate == undefined || this.model.maxDate == undefined) {
                return;
            }
            var s = new Date(this.model.minDate.getTime());
            s.setDate(1);
            var e = new Date(this.model.maxDate.getTime());
            e.setDate(1);

            var t;
            if ((!m && !y) || (isNaN(m) && isNaN(y))) {

                t = this._zeroTime(new Date());
                t.setDate(1);
            } else if (isNaN(m)) {

                t = new Date(y, this.displayedMonth, 1);
            } else if (isNaN(y)) {

                t = new Date(this.displayedYear, m, 1);
            } else {

                t = new Date(y, m, 1);
            }

            if (t.getTime() < s.getTime()) {
                t = s;
            } else if (t.getTime() > e.getTime()) {
                t = e;
            }
            var oldMonth = this.displayedMonth;
            var oldYear = this.displayedYear;
            this.displayedMonth = t.getMonth();
            this.displayedYear = t.getFullYear();
            var tempDate = t;
            if (rerender && (this.displayedMonth != oldMonth || this.displayedYear != oldYear)) {
                this._renderCalendar(this, tempDate);
                this._dateValue = tempDate;
                this._trigger("monthChanged", [this.displayedMonth, this.displayedYear]);
            }
        },
        _clearSelected: function () {
            this.numSelected = 0;
            if (!ej.isNullOrUndefined(this.sfCalendar)) {
                if (this.model.highlightSection == "week") {
                    $('td.e-active', this.sfCalendar).removeClass('e-active').addClass('e-state-hover').attr('aria-selected', false).parent().removeClass('e-selected-week');
                }
                else if (this.model.highlightSection == "month") {
                    $('td.e-active', this.sfCalendar).removeClass('e-active').addClass('e-state-hover').attr('aria-selected', false).parent().parent().removeClass('e-selected-month');
                }
                else if (this.model.highlightSection == "workdays") {
                    $('td.e-active', this.sfCalendar).removeClass('e-active').addClass('e-state-hover').attr('aria-selected', false).parent().removeClass('e-work-week');
                }
                else
                    $('td.e-active', this.sfCalendar).removeClass('e-active').addClass('e-state-hover').attr('aria-selected', false);
            }

        },
        _addSelected: function () {
            if (this.model.highlightSection == "week") {
                $('td.e-active', this.sfCalendar).parent().addClass('e-selected-week');
            }
            else if (this.model.highlightSection == "month") {
                $('td.e-active, this.sfCalendar').parent().parent().addClass('e-selected-month');
            }
            else if (this.model.highlightSection == "workdays") {
                $('td.e-active', this.sfCalendar).parent().addClass('e-work-week');
            }
        },

        _hideOtherMonths: function (sfCalendar) {
            $('td.other-month', sfCalendar).css("visibility", "hidden");
        },
        _showOtherMonths: function (sfCalendar) {
            $('td.other-month', sfCalendar).css({ 'visibility': 'visible' });
        },
        _otherMonthsVisibility: function () {
            if (this.model.showOtherMonths)
                this._showOtherMonths(this.sfCalendar);
            else
                this._hideOtherMonths(this.sfCalendar);
        },

        _createCalender: function () {
            ej.buildTag("div.e-header").attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                    .append(ej.buildTag("span.e-prev").append(ej.buildTag('a.e-icon e-arrow-sans-left').attr({ 'role': 'button' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})))
                    .append(ej.buildTag("span.e-text").append(ej.buildTag("span.e-datepicker-headertext").text(this._formatter(this._calendarDate, this.model.headerFormat)).attr({ 'aria-atomic': 'true', 'aria-live': 'assertive', 'role': 'heading' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})))
                    .append(ej.buildTag("span.e-next").append(ej.buildTag('a.e-icon e-arrow-sans-right').attr({ 'role': 'button' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})))
                    .appendTo(this.sfCalendar);
            this._enableHeader(this._showHeader);
            var table = ej.buildTag("table.e-dp-viewdays", "", {}).data("e-table", "data").attr({ 'role': 'grid'}).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            this.sfCalendar.append(table);
            this._renderCalendar(this);
            this._startLevel(this.model.startLevel);
            ej.buildTag("div.e-footer")
                .append(ej.buildTag("span.e-footer-icon"))
                .append(ej.buildTag("span.e-footer-text"))
                .appendTo(this.sfCalendar);
            $('.e-footer-text', this.sfCalendar).html(this._localizedLabels.buttonText);
            this._enableFooter(this.model.showFooter);
        },
        _enableHeader: function (show) {
            if (show) $(".e-header", this.sfCalendar).show();
            else $(".e-header", this.sfCalendar).hide();
        },
        _enableFooter: function (show) {
            if (show) $('.e-footer', this.sfCalendar).show();
            else $('.e-footer', this.sfCalendar).hide();
            this._todayBtnDisable();
        },
        _todayBtnDisable: function () {
            var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0);
            if (!(+this.model.minDate <= +today && +this.model.maxDate >= +today)) {
                $('.e-footer', this.sfCalendar).addClass('e-footer-disable')
            } else {
                $('.e-footer', this.sfCalendar).removeClass('e-footer-disable')
            }
        },
        _checkArrows: function (min, max) {
            this._preArrowCondition(min, this.model.minDate.getFullYear());
            this._nextArrowCondition(max, this.model.maxDate.getFullYear());
        },
        _checkDateArrows: function () {
            this._preArrowCondition(this._tempMinDate, this.model.minDate);
            this._nextArrowCondition(this._tempMaxDate, this.model.maxDate);
        },
        _preArrowCondition: function (val1, val2) {
            if (val1 <= val2) this.sfCalendar.find(".e-arrow-sans-left").addClass("e-disable").attr({ "aria-disabled": true });
            else this.sfCalendar.find(".e-arrow-sans-left").removeClass("e-disable").attr({ "aria-disabled": false });
        },
        _nextArrowCondition: function (val1, val2) {
            if (val1 >= val2) this.sfCalendar.find(".e-arrow-sans-right").addClass("e-disable").attr({ "aria-disabled": true });
            else this.sfCalendar.find(".e-arrow-sans-right").removeClass("e-disable").attr({ "aria-disabled": false });
        },

        _previousNextHandler: function (event) {
            if (this.model.readOnly || !this.model.enabled || $(event.target).hasClass("e-disable")) return false;
            event.preventDefault();
            var prevTable = $("table", this.sfCalendar), navFrom;
            navFrom = this._navigateFrom(prevTable);
            var element = ($(event.target).is('a')) ? $(event.target.parentNode) : $(event.target);
            var progress = element.hasClass('e-prev') ? true : false;
            this._processNextPrevDate(progress);
            var currentTable = $("table", this.sfCalendar), tClassName, navTo;
            tClassName = currentTable.get(0).className;
            switch (tClassName) {
                case "e-dp-viewdays": navTo = "month"; break;
                case "e-dp-viewmonths": navTo = "year"; break;
                case "e-dp-viewyears": navTo = "decade"; break;
                case "e-dp-viewallyears": navTo = "century"; break;
            }
            this._trigger("navigate", { date: this._dateValue, value: this._formatter(this._dateValue, this.model.dateFormat), navigateTo: navTo, navigateFrom: navFrom });
        },
        _processNextPrevDate: function (progress) {
            if (this._DRPdisableFade) {
                var s = new Date(this.sfCalendar.find("td.current-month").attr("data-date"));
                this._dateValue = s;
            }
            if (progress && this.sfCalendar.find(".e-arrow-sans-left").hasClass("e-disable")) return false;
            else if (!progress && this.sfCalendar.find(".e-arrow-sans-right").hasClass("e-disable")) return false;

            var currentTable = $("table", this.sfCalendar), temp;
            var tClassName = currentTable.get(0).className;
            switch (tClassName) {
                case 'e-dp-viewdays':
                    var step = this.model.stepMonths;
                    if (progress) {
                        if (this._dateValue <= this.model.minDate) {
                            this._flag = false;
                            return false;
                        }
                    } else {
                        if (this._dateValue >= this.model.maxDate) {
                            this._flag = false;
                            return false;
                        }
                    }
                    this._flag = true;
                    this._addMonths(this._dateValue, (progress ? -step : step));
                    if (this._clickedDate)
                        this._calendarDate = this._clickedDate;
                    this._dateValue = this._dateValue < this.model.minDate ? new Date(this.model.minDate.toString()) : this._dateValue;
                    this._dateValue = this._dateValue > this.model.maxDate ? new Date(this.model.maxDate.toString()) : this._dateValue;
                    this._renderCalendar(this, this._dateValue);
                    $('.e-datepicker-headertext', this.sfCalendar).text(this._formatter(this._dateValue, this.model.headerFormat));
                    this._addFocus('day', this._hoverDate);
                    var dateRange = this._findFirstLastDay(new Date(this._dateValue.toString()));
                    this._preArrowCondition(dateRange.firstDay, this.model.minDate);
                    this._nextArrowCondition(dateRange.lastDay, this.model.maxDate);
                    break;
                case 'e-dp-viewmonths':
                    var dateValue = this._dateValue;
                    dateValue.setFullYear($('.e-datepicker-headertext', this.sfCalendar).text())
                    if (progress) {
                        if (dateValue.getFullYear() <= this.model.minDate.getFullYear()) {
                            this._flag = false;
                            return false;
                        }
                    } else {
                        if (dateValue.getFullYear() >= this.model.maxDate.getFullYear()) {
                            this._flag = false;
                            return false;
                        }
                    }
                    this._flag = true;
                    this._addYears(dateValue, (progress ? -1 : 1));
                    this._renderCalendar(this, dateValue);
                    temp = dateValue.getFullYear();
                    $('.e-datepicker-headertext', this.sfCalendar).text(temp);
                    $('tbody,tr.e-week-header', currentTable).not('.e-datepicker-months').hide();
                    $($(currentTable).find('.e-datepicker-months')).show();
                    this._addFocus('month', this._hoverMonth);
                    this._checkArrows(temp, temp);
                    break;
                case 'e-dp-viewyears':
                    var yearValue;
                    yearValue = this._dateValue
                    yearValue.setFullYear($(currentTable).find(".e-state-hover").text());
                    if (progress) {
                        if (parseInt($('td.e-year-first:first').text()) <= this.model.minDate.getFullYear()) {
                            this._flag = false;
                            return false;
                        }
                    } else {
                        if (parseInt($('td.e-year-last:first').prev().text()) >= this.model.maxDate.getFullYear()) {
                            this._flag = false;
                            return false;
                        }
                    }
                    this._flag = true;
                    if (($(currentTable).find(".e-state-hover").hasClass('e-year-first') && progress) || ($(currentTable).find(".e-state-hover").hasClass('e-year-last') && !progress))
                        this._dateValue.setFullYear(yearValue.getFullYear());
                    else if (($(currentTable).find(".e-state-hover").hasClass('e-year-first') && !progress))
                        this._dateValue.setFullYear(yearValue.getFullYear() + 11);
                    else if (($(currentTable).find(".e-state-hover").hasClass('e-year-last') && progress))
                        this._dateValue.setFullYear(yearValue.getFullYear() - 11);
                    else
                        this._dateValue.setFullYear(yearValue.getFullYear() + (progress ? -10 : 10));
                    this._renderCalendar(this, this._dateValue);
                    var setYear = parseInt(this._dateValue.getFullYear()) - ((parseInt(this._dateValue.getFullYear()) % 10) + 1);
                    $(".e-datepicker-headertext", this.sfCalendar).text((setYear + 1) + ' - ' + (setYear + 10));
                    $('tbody,tr.e-week-header', currentTable).not('.e-datepicker-years').hide();
                    $($(currentTable).find('.e-datepicker-years')).show();
                    this._addFocus('year', this._hoverYear + (!($('.e-year-first.e-hidedate').length) ? 0 : -1));
                    this._checkArrows(setYear + 1, setYear + 10);
                    break;
                case 'e-dp-viewallyears':
                    var headYears;
                    if (progress) {
                        headYears = parseFloat($('td.e-allyear-first', currentTable.get(0)).text().split('-')[1]);
                        if (headYears <= this.model.minDate.getFullYear()) {
                            this._flag = false;
                            return false;
                        } else {
                            this._flag = true;
                        }

                    } else {
                        headYears = parseFloat($('td.e-allyear-last', currentTable.get(0)).prev().text().split('-')[1]);
                        if (headYears >= this.model.maxDate.getFullYear()) {
                            this._flag = false;
                            return false;
                        } else
                            this._flag = true;
                    }
                    this._dateValue.setFullYear((!(this._lastHoveredYear) ? this._dateValue.getFullYear() : this._lastHoveredYear) + (progress ? -100 : 100));
                    this._lastHoveredYear = this._dateValue.getFullYear();
                    this._renderCalendar(this, this._dateValue);
                    var setYear = parseInt(this._dateValue.getFullYear()) - ((parseInt(this._dateValue.getFullYear()) % 100) + 1);
                    temp = parseFloat($('td.e-allyear-last', currentTable.get(0)).prev().text().split('-')[1]);
                    $('.e-datepicker-headertext', this.sfCalendar).text((setYear + 1) + ' - ' + temp);
                    $('tbody,tr.e-week-header', currentTable).not('.e-datepicker-allyears').hide();
                    $($(currentTable).find('.e-datepicker-allyears')).show();
                    this._addFocus('allyear', this._hoverAllYear + (!($('.e-allyear-first.e-hidedate').length) ? 0 : -1));
                    this._checkArrows(setYear + 1, temp);
                    break;
            }
            this._layoutChanged();
        },
        _addFocus: function (selection, index) {
            var cls = 'e-current-' + selection;
            if (selection == 'day') cls = 'current-month';
            var items = this.sfCalendar.find('tbody tr td.' + cls);
            if (selection == "month") {
                $(items).each(function (i, ele) {
                    if (parseInt($(ele).attr("data-index")) == parseInt(index)) {
                        index = i;
                        return;
                    }
                });
            }
            var cell = items[index];
            if (!cell) cell = items.last();
            this.sfCalendar.find('table td').removeClass("e-state-hover");
            $(cell).addClass("e-state-hover");
            this._setActiveState(selection);
            return index;
        },
        _setActiveState: function (selection) {
            if (!(this.model.value instanceof Date)) return;
            var items = this.sfCalendar.find('tbody tr td.e-current-' + selection), cell, proxy = this;
            var indx = -1;
            switch (selection) {
                case "month":
                    if (this.model.value.getFullYear() === parseInt($('.e-text', this.sfCalendar).text())) {
                        $(items).each(function (i, ele) {
                            if (parseInt($(ele).attr("data-index")) == parseInt(proxy.model.value.getMonth())) {
                                indx = i;
                                return;
                            }
                        });
                    }
                    break;
                case "year":
                    var value = this.model.value.getFullYear();
                    $(items).each(function (i, ele) {
                        if (parseInt(ele.innerHTML) == parseInt(value)) {
                            indx = i;
                            return;
                        }
                    });
                    break;
                case "allyear":
                    var start = parseInt(this.model.value.getFullYear()) - ((parseInt(this.model.value.getFullYear()) % 10) + 1);
                    var active = (start + 1) + ' - ' + (start + 10);
                    $(items).each(function (i, ele) {
                        if (parseInt(ele.innerHTML) == parseInt(active)) {
                            indx = i;
                            return;
                        }
                    });
                    break;
            }
            cell = items[indx];
            if (cell) {
                this.sfCalendar.find('table td').removeClass("e-active");
                if (!$(cell).hasClass('e-hidedate'))
                    $(cell).addClass("e-active");
            }
        },
        _setFocusByName: function (name, value) {
            var allValues = this.sfCalendar.find('tbody tr td.e-current-' + name), index, cell;
            $(allValues).each(function (i, ele) {
                if (parseInt(ele.innerHTML) == parseInt(value)) {
                    index = i;
                    return;
                }
            });
            cell = allValues[index];
            if (!cell) cell = allValues.last();
            this.sfCalendar.find('table td').removeClass("e-state-hover");
            $(cell).addClass("e-state-hover");
            this._setActiveState(name);
            return index;
        },
        _getHeaderTxt: function () {
            return this.sfCalendar.find(".e-datepicker-headertext").text();
        },
        _findFirstLastDay: function (value) {
            var y = value.getFullYear(), m = value.getMonth();
            var firstDay = new Date(y, m, 1);
            var lastDay = new Date(y, m + 1, 0);
            return { firstDay: firstDay, lastDay: lastDay }
        },
        _forwardNavHandler: function (event) {
            if (this.model.readOnly || !this.model.enabled) return false;
            if (event) event.preventDefault();

            var currentTable = $("table", this.sfCalendar);
            var tclassName = $("table", this.sfCalendar).get(0).className, proxy = this, headerTxt, navTo;
            var navFrom = this._navigateFrom(currentTable);
            switch (tclassName) {
                case 'e-dp-viewdays':
                    this._hoverMonth = this._getDateObj(currentTable.find(".e-state-hover")).getMonth() ||
                                this._getDateObj(currentTable.find(".e-active")).getMonth() || 0;
                    if (this._DRPdisableFade) {
                        this._renderCalendar(this, this._calendarDate);
                        $('.e-datepicker-headertext', this.sfCalendar).text(this._formatter(this._dateValue, this.model.headerFormat));
                    }
                    this._startLevel("year"); navTo = "year";
                    this._addFocus('month', this._hoverMonth);
                    break;
                case 'e-dp-viewmonths':
                    headerTxt = this._getHeaderTxt();
                    this._startLevel("decade"); navTo = "decade";
                    this._hoverYear = this._setFocusByName('year', headerTxt);
                    break;
                case 'e-dp-viewyears':
                    headerTxt = this._getHeaderTxt();
                    this._startLevel("century"); navTo = "century";
                    this._hoverAllYear = this._setFocusByName('allyear', headerTxt);
                    break;
            }
            if (navFrom != "century") this._trigger("navigate", { date: this._dateValue, value: this._formatter(this._dateValue, this.model.dateFormat), navigateTo: navTo, navigateFrom: navFrom });
            this._layoutChanged();
        },
        _cellSelection: function () {
            var currentTable = $("table", this.sfCalendar);
            var tclassName = $("table", this.sfCalendar).get(0).className;
            switch (tclassName) {
                case 'e-dp-viewmonths':
                    this._hoverMonth = this._addFocus('month', this._dateValue.getMonth());
                    break;
                case 'e-dp-viewyears':
                    var dateValue = new Date(this._dateValue.toString());
                    // Navigate to Prev/Next year Calendar while selecting the first/last year in the calendar view.
                    this._navigationToPrevNext('year');
                    // Reasssign the old value
                    this._dateValue = dateValue;
                    this._hoverYear = this._setFocusByName('year', this._dateValue.getFullYear());
                    break;
                case 'e-dp-viewallyears':
                    var dateValue = new Date(this._dateValue.toString());
                    // Navigate to Prev/Next year Calendar while selecting the first/last year in the calendar view.
                    this._navigationToPrevNext('allyear');
                    // Reasssign the old value
                    this._dateValue = dateValue;
                    var setYear = parseInt(this._dateValue.getFullYear()) - ((parseInt(this._dateValue.getFullYear()) % 10) + 1);
                    this._hoverAllYear = this._setFocusByName('allyear', setYear + 1 + ' - ' + setYear + 10);
                    break;
            }
            this._layoutChanged();
        },
        _navigationToPrevNext: function (name) {
            var allValues = this.sfCalendar.find('tbody tr td.e-current-' + name), index, cell;
            var value = this._dateValue.getFullYear();
            $(allValues).each(function (i, ele) {
                if (parseInt(ele.innerHTML) == parseInt(value)) {
                    index = i;
                    return;
                }
            });
            cell = allValues[index];
            if (cell) {
                if ($(cell).hasClass('e-' + name + '-last'))
                    this._processNextPrevDate(false)
                else if ($(cell).hasClass('e-' + name + '-first'))
                    this._processNextPrevDate(true);
            }
        },
        _navigateFrom: function (prevTable) {
            var tPrevClassName = prevTable.get(0).className, navFrom;
            switch (tPrevClassName) {
                case "e-dp-viewdays": navFrom = "month"; break;
                case "e-dp-viewmonths": navFrom = "year"; break;
                case "e-dp-viewyears": navFrom = "decade"; break;
                case "e-dp-viewallyears": navFrom = "century"; break;
            }
            return navFrom;
        },
        _backwardNavHandler: function (event) {
            this._animating = true;
            if (this.model.readOnly || !this.model.enabled) return false;
            var element;
            if (event.type) {
                event.preventDefault();
                element = $(event.currentTarget);
            }
            else element = event;
            var cTable = $("table", this.sfCalendar), temp;
            var tclassName = $("table", this.sfCalendar).get(0).className, proxy = this, navTo;
            var navFrom = this._navigateFrom(cTable);
            switch (tclassName) {
                case 'e-dp-viewmonths':
                    cTable.removeClass("e-dp-viewmonths").addClass("e-dp-viewdays");
                    this._lastHoveredMonth = parseInt($(element).attr('data-index'));
                    this._dateValue = new Date(this._dateValue.getFullYear(), this._lastHoveredMonth, 1);
                    if (this._DRPdisableFade) this._trigger("_month_Loaded", { currentTarget: event.currentTarget });
                    this._renderCalendar(this, this._dateValue);
                    $('tbody', cTable).not('.e-datepicker-days,.e-week-header').hide();
                    $($(cTable).find('.e-datepicker-days,.e-week-header')).fadeIn("fast", function () {
                        proxy._addFocus('day', proxy._hoverDate || 0);
                        proxy._animating = false;
                    });
                    $('.e-datepicker-headertext', this.sfCalendar).text(this._formatter(this._dateValue, this.model.headerFormat)); navTo = "month";
                    break;
                case 'e-dp-viewyears':
                    cTable.removeClass("e-dp-viewyears").addClass("e-dp-viewmonths");
                    this._lastHoveredYear = parseInt(element.text());
                    this._dateValue.setFullYear(this._lastHoveredYear);
                    this._renderCalendar(this, this._dateValue);
                    $('tbody,tr.e-week-header', cTable).not('.e-datepicker-months').hide();
                    if (ej.isNullOrUndefined(this._hoverMonth) && !ej.isNullOrUndefined(this._dateValue)) this._hoverMonth = this._dateValue.getMonth();
                    $($(cTable).find('.e-datepicker-months')).fadeIn("fast", function () {
                        proxy._addFocus('month', proxy._hoverMonth || 0);
                        proxy._animating = false;
                    });
                    temp = element.text();
                    $('.e-datepicker-headertext', this.sfCalendar).text(temp);
                    this._checkArrows(temp, temp); navTo = "year";
                    break;
                case 'e-dp-viewallyears':
                    var headYears = element.text().split('-');
                    cTable.removeClass("e-dp-viewallyears").addClass("e-dp-viewyears");
                    if (headYears[0] < this.model.minDate.getFullYear()) headYears[0] = this.model.minDate.getFullYear().toString();
                    else if (headYears[0] > this.model.maxDate.getFullYear()) headYears[0] = this.model.maxDate.getFullYear().toString();
                    this._renderCalendar(this, (new Date(headYears[0], 0, 1)));
                    $('tbody,tr.e-week-header', cTable).not('.e-datepicker-years').hide();
                    $($(cTable).find('.e-datepicker-years')).fadeIn("fast", function () {
                        proxy._addFocus('year', proxy._hoverYear || 0);
                        proxy._animating = false;
                    });
                    $('.e-datepicker-headertext', this.sfCalendar).text(headYears[0] + ' - ' + headYears[1]);
                    this._checkArrows(headYears[0], headYears[1]); navTo = "decade";
                    this._dateValue = new Date(this._dateValue.setFullYear(parseInt($.trim(headYears[0])) + ((!this._lastHoveredYear) ? this._dateValue.getFullYear() % 10 : this._lastHoveredYear % 10)));
                    break;
                default:
                    this._clearSelected();
                    this.sfCalendar.find('table td').removeClass("e-state-hover");
                    element.not('td.other-month.e-hidedate').addClass('e-active').attr('aria-selected', true);
                    this._addSelected();

                    this._hoverDate = this._getDateObj(element).getDate() - 1;
                    this._dateValue = new Date(element.attr('data-date'));
                    this._clickedDate = new Date(element.attr('data-date'));
                    this._animating = false;
                    break;
            }
            if (navFrom != "month") this._trigger("navigate", { date: this._dateValue, value: this._formatter(this._dateValue, this.model.dateFormat), navigateTo: navTo, navigateFrom: navFrom });
            this._layoutChanged();
        },

        _startLevel: function (start) {
            var cTable = $("table", this.sfCalendar);
            var headerText = $(".e-datepicker-headertext", this.sfCalendar), s, e;
            var dateValue = this._dateValue;
            switch (start) {
                case "decade":
                    cTable.removeClass("e-dp-viewallyears e-dp-viewmonths e-dp-viewdays").addClass("e-dp-viewyears");
                    $('tbody,tr.e-week-header', cTable).not('.e-datepicker-years').hide();
                    $($(cTable).find('.e-datepicker-years')).show();
                    if (this.model.enableStrictMode && this._calendarDate < this._dateValue) dateValue = this._calendarDate;
                    else dateValue = dateValue;
                    var setYear = parseInt(dateValue.getFullYear()) - ((parseInt(dateValue.getFullYear()) % 10) + 1);
                    s = setYear + 1;
                    e = setYear + 10;
                    headerText.text(s + ' - ' + e);
                    this._checkArrows(s, e);
                    this._hoverYear = this._setFocusByName('year', dateValue.getFullYear());
                    break;
                case "century":
                    if (!(this._calendarDate < this._dateValue)) this._renderCalendar(this, dateValue);
                    cTable.removeClass("e-dp-viewyears e-dp-viewdays e-dp-viewmonths").addClass("e-dp-viewallyears");
                    $('tbody,tr.e-week-header', cTable).not('.e-datepicker-allyears').hide();
                    $($(cTable).find('.e-datepicker-allyears')).show();
                    s = parseFloat($('td.e-allyear-first', cTable.get(0)).text().split('-')[1]) + 1;
                    e = parseFloat($('td.e-allyear-last', cTable.get(0)).prev().text().split('-')[1]);
                    var headYears = s + ' - ' + e;
                    headerText.text(headYears);
                    this._checkArrows(s, e);
                    var setYear = parseInt(dateValue.getFullYear()) - ((parseInt(dateValue.getFullYear()) % 10) + 1);
                    this._hoverAllYear = this._setFocusByName('allyear', (setYear + 1) + ' - ' + (setYear + 10));
                    break;
                case "year":
                    cTable.removeClass("e-dp-viewyears e-dp-viewallyears e-dp-viewdays").addClass("e-dp-viewmonths");
                    $('tbody,tr.e-week-header', cTable).hide();
                    $($(cTable).find('.e-datepicker-months')).show();
                    if (this.model.enableStrictMode && this._calendarDate < this._dateValue) s = this._calendarDate.getFullYear();
                    else s = dateValue.getFullYear();
                    headerText.text(s);
                    this._checkArrows(s, s);
                    this._hoverMonth = dateValue.getMonth();
                    this._addFocus('month', this._hoverMonth);
                    break;
                case "month":
                    cTable.removeClass("e-dp-viewyears e-dp-viewallyears e-dp-viewmonths").addClass("e-dp-viewdays ");
                    break;
            }
        },
        _depthLevel: function (depth) {
            var calendarTable = this.sfCalendar;
            switch (depth) {
                case "year":
                    $(calendarTable.find('.e-current-year,.e-current-allyear')).on("click", $.proxy(this._backwardNavHandler, this));
                    this._on($('.e-current-month', this.sfCalendar), "click", $.proxy(this._onDepthSelectHandler, this));
                    break;
                case "decade":
                    $(calendarTable.find('.e-current-allyear')).on("click", $.proxy(this._backwardNavHandler, this));
                    $('.e-current-year', this.sfCalendar).on("click", $.proxy(this._onDepthSelectHandler, this));
                    break;
                case "century":
                    $(calendarTable.find('.e-current-allyear')).on("click", $.proxy(this._onDepthSelectHandler, this));
                    break;
                case "month":
                    this._on(calendarTable.find('.current-month,.other-month,.e-current-month,.e-current-year,.e-current-allyear'), "click", $.proxy(this._backwardNavHandler, this));
                    this._on(calendarTable.find('.current-month , .other-month'), "click", $.proxy(this._onSetCancelDateHandler, this));
            }
        },
        _onDepthSelectHandler: function (e) {
            if (this.model.readOnly || !this.model.enabled) return false;
            if ($(e.target).hasClass("e-current-month"))
                this._dateValue = new Date(this._dateValue.setMonth(parseInt(e.target.attributes["data-index"].value)));
            else if ($(e.target).hasClass("e-current-year"))
                this._dateValue = new Date(this._dateValue.setFullYear(parseInt(e.target.innerHTML)));
            else if ($(e.target).hasClass("e-current-allyear"))
                this._dateValue = new Date(this._dateValue.setFullYear(parseInt(e.target.innerHTML)));
            this._onSetCancelDateHandler(e);
        },

        _datepickerMonths: function (tbody, calendarTable, currentDate) {
            var dc = function (a) {
                return document.createElement(a);
            };
            var month = 0;
            for (var i = 0; i < 3; i++) {
                var row = $(dc('tr'));
                for (var j = 0; j < 4; j++) {
                    var td = $(dc('td'))
                        .addClass('e-current-month e-state-default')
                        .attr({ 'data-index': month }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                        .html(this.Date.abbrMonthNames[month++]);
                    if (currentDate.getFullYear() < this.model.minDate.getFullYear() || currentDate.getFullYear() > this.model.maxDate.getFullYear()) {
                        td.addClass('e-hidedate');
                        td.removeClass('e-current-month');
                    }
                    else if ((currentDate.getFullYear() <= this.model.minDate.getFullYear() && month < this.model.minDate.getMonth() + 1) ||
                        (currentDate.getFullYear() >= this.model.maxDate.getFullYear() && month > this.model.maxDate.getMonth() + 1)) {
                        td.addClass('e-hidedate');
                        td.removeClass('e-current-month');
                    }
                    row.append(td);
                }
                tbody.append(row);
            }
            calendarTable.append(tbody);
            var s = currentDate.getFullYear();
            this._checkArrows(s, s);
        },

        _datepickerYears: function (tbody, calendarTable, currentYear) {
            var dc = function (a) {
                return document.createElement(a);
            };
            var Year = parseInt(currentYear) - ((parseInt(currentYear) % 10) + 1);
            var years = [];
            for (var j = 0; j < 12; j++) {
                years.push(Year + j);
            }
            var year = 0;
            for (var i = 0; i < 3; i++) {
                var row = $(dc('tr'));
                for (var j = 0; j < 4; j++) {
                    var td = $(dc('td'));
                    td.attr((this._isIE8) ? { 'unselectable': 'on' } : {});
                    if (year == 0)
                        td.addClass('e-year-first e-current-year ');
                    else if (year == 11)
                        td.addClass('e-year-last e-current-year ');
                    else
                        td.addClass('e-current-year e-state-default');
                    if (years[year] < this.model.minDate.getFullYear() || years[year] > this.model.maxDate.getFullYear()) {
                        td.addClass('e-hidedate');
                        td.removeClass('e-current-year');
                    }
                    td.html(years[year++]);
                    row.append(td);
                }
                tbody.append(row);
            }
            calendarTable.append(tbody);
            this._checkArrows(years[0], years[years.length]);
        },

        _datepickerAllYears: function (tbody, calendarTable, currentYear) {
            var Year = parseInt(currentYear) - ((parseInt(currentYear) % 100) + 10);
            var headYear = Year;
            var years = [], newline = this._isIE8 || this._isIE9 ? "" : "\n";

            for (var j = 0; j < 12; j++) {
                years.push(parseInt(Year) + " -" + newline + parseInt(Year + 9));
                Year = Year + 10;
            }
            var year = 0;
            for (var i = 0; i < 3; i++) {
                var row = $(document.createElement('tr'));
                for (var j = 0; j < 4; j++) {
                    var td = $(document.createElement('td'));
                    td.attr((this._isIE8) ? { 'unselectable': 'on' } : {});
                    if (year == 0)
                        td.addClass('e-allyear-first e-current-allyear ');
                    else if (year == 11)
                        td.addClass('e-allyear-last e-current-allyear ');
                    else
                        td.addClass('e-current-allyear e-state-default');
                    if (parseInt(years[year].split('-\n')[1]) < this.model.minDate.getFullYear() || parseInt(years[year].split('-\n')[0]) > this.model.maxDate.getFullYear()) {
                        td.addClass('e-hidedate');
                        td.removeClass('e-current-allyear');
                    }
                    td.html(years[year++]);
                    row.append(td);
                }
                tbody.append(row);
            }
            calendarTable.append(tbody);
        },
        _renderHeader: function (dpObject) {
            var thead = $(document.createElement('thead'));
            var cultureObj = ej.preferredCulture(this.model.locale).calendars.standard.days;
            if (dpObject.model.dayHeaderFormat != "none") {
                var headRow = ej.buildTag("tr.e-week-header").attr({ 'role': 'row' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
                if (this.model.weekNumber == true) {
                    var WeekCulture = ej.preferredCulture(this.model.locale).calendars.standard.week;
                    var day = WeekCulture.name;
                    var headerday;
                    if (dpObject.model.dayHeaderFormat == "short")
                        headerday = WeekCulture.nameAbbr;
                    else if (dpObject.model.dayHeaderFormat == "long") headerday = week;
                    else headerday = WeekCulture.nameShort;
                    var tr = ej.buildTag("th", "", {}, { 'scope': 'col', 'abbr': day, 'data-date': day, 'title': this._formatter(day, "dddd") }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                        .html(headerday);
                    headRow.append(tr);
                }
                for (var i = this.Date.firstDayOfWeek; i < this.Date.firstDayOfWeek + 7; i++) {
                    var weekday = i % 7;
                    var day = cultureObj.names[weekday];
                    var headerday;
                    if (dpObject.model.dayHeaderFormat == "short")
                        headerday = cultureObj.namesAbbr[weekday];
                    else if (dpObject.model.dayHeaderFormat == "long") headerday = day;
                    else headerday = cultureObj.namesShort[weekday];
                    var th = ej.buildTag("th", "", {}, { 'scope': 'col', 'abbr': day, 'data-date': day, 'title': this._formatter(day, "dddd"), 'class': (weekday == 0 || weekday == 6 ? 'e-week-end' : 'e-week-day') }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                            .html(headerday);
                    headRow.append(th);
                }
            };
            return thead.append(headRow);
        },

        _renderCalendar: function (dpObject, date) {
            var proxy = this, today;
            dpObject = $.extend({}, ej.DatePicker.prototype.defaults, dpObject);
            this.Date.firstDayOfWeek = this.model.startDay;
            if (date) today = date;
            else if (this._calendarDate) today = this._calendarDate;
            else today = proxy._zeroTime(new Date());
            var calendarTable = $('table', this.sfCalendar);
            calendarTable.empty();

            calendarTable.append(this._renderHeader(dpObject));

            var tbody = ej.buildTag('tbody.e-datepicker-allyears', "", { 'display': 'none' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            this._datepickerAllYears(tbody, calendarTable, today.getFullYear());

            tbody = ej.buildTag("tbody.e-datepicker-years", "", { 'display': 'none' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            this._datepickerYears(tbody, calendarTable, today.getFullYear());
            var month = dpObject.model.month == undefined ? today.getMonth() : dpObject.model.month;
            var year = dpObject.model.year || today.getFullYear();
            var currentDate = (new Date(year, month, 1, 0, 0, 0));
            var firstDayOffset = this.Date.firstDayOfWeek - currentDate.getDay() + 1;
            if (firstDayOffset > 1) firstDayOffset -= 7;
            var weeksToDraw = Math.ceil(((-1 * firstDayOffset + 1) + this._getDaysInMonth(currentDate)) / 7);
            this._addDays(currentDate, (firstDayOffset - 1));
            var newdate = proxy._zeroTime(new Date());
            var selected = this._calendarDate;
            tbody = ej.buildTag('tbody.e-datepicker-months', "", { 'display': 'none' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {});

            this._datepickerMonths(tbody, calendarTable, today);

            tbody = ej.buildTag('tbody.e-datepicker-days', "", { 'display': 'none' }).attr((this._isIE8) ? { 'unselectable': 'on' } : {});
            var w = 0, _first = true, _last = true;
            while (w++ < weeksToDraw) {
                var r = jQuery(document.createElement('tr')).attr({'role':'row'});
                if (this.model.weekNumber == true)
                {
                    var week = this._weekDate(currentDate);
                    week = $(document.createElement('td')).attr({}).addClass('e-weeknumber').html(week)
                    r.append(week);
                }
                for (var i = 0; i < 7; i++) {
                    var thisMonth = currentDate.getMonth() == month;
                    var checkSpecialDate = this._isSpecialDates(currentDate);
                    var disable = this._checkDisableRange(currentDate);
                    var index = this._getIndex;
                    var d = $(document.createElement('td')).
                        html(checkSpecialDate ? '<span></span>' + currentDate.getDate() : currentDate.getDate() + '')
                        .attr({

                            'data-date': currentDate.toDateString(),
                            'title': (this.model.showTooltip ? (checkSpecialDate && this.model.specialDates[index][this._mapField._tooltip] ? this.model.specialDates[index][this._mapField._tooltip] : this._formatter(currentDate, this.model.tooltipFormat)) : ''),
                            'aria-selected': false,
                            'role': 'gridcell'
                        }).attr((this._isIE8) ? { 'unselectable': 'on' } : {})
                        .addClass((thisMonth ? 'current-month e-state-default ' : 'other-month e-state-default ') +
                            (this._isWeekend(currentDate) ? (this._ejHLWeekEnd ? 'e-dp-weekend e-week-end ' : (this.model.highlightWeekend ? 'e-week-end ' : '')) : 'e-week-day ') +
                            (thisMonth && currentDate.getTime() == newdate.getTime() ? 'today ' : ''));

                    d.find('span:first-of-type').addClass((checkSpecialDate ? (this.model.specialDates[index][this._mapField._icon] ? 'e-special-date-icon ' + this.model.specialDates[index][this._mapField._icon] + ' ' : 'e-special-day') : ''));
                    d.addClass(checkSpecialDate ? (this.model.specialDates[index][this._mapField._custom] ? this.model.specialDates[index][this._mapField._custom] : '') : '');
                    if (disable) this._disableDates({ date: currentDate, element: d });
                    if (selected.getTime() == currentDate.getTime() && thisMonth) {
                        if (!d.hasClass('e-hidedate'))
                            if (this.model.value) {
                                d.addClass('e-active').attr({ 'aria-selected': true });
                                if (this.model.highlightSection == "week") {
                                    r.addClass('e-selected-week');
                                }
                                if (this.model.highlightSection == "month") {
                                    tbody.addClass('e-selected-month');
                                }
                                if (this.model.highlightSection == "workdays") {
                                    r.addClass('e-work-week');
                                }
                            }
                            else { if(this.model.value!=null)d.addClass('e-state-hover').attr({ 'aria-selected': false }); }
                        if (!this._hoverDate) {
                            if (!d.hasClass('e-hidedate')) d.addClass('e-state-hover');
                            this._hoverDate = currentDate.getDate() - 1;
                        }
                    }
                    var cond = true;
                    if (currentDate < this.model.minDate || currentDate > this.model.maxDate) {
                        d.addClass('e-hidedate');
                        d.removeClass('current-month');
                        if (this.model.showOtherMonths) d.removeClass('other-month');
                        cond = _last = false;
                    }
                    if (thisMonth) {
                        if (cond && _first) {
                            this._tempMinDate = currentDate;
                            _first = false; _last = true;
                        }
                        if (_last) this._tempMaxDate = currentDate;
                    }
                    this._trigger("beforeDateCreate", { date: currentDate, value: this._formatter(currentDate, this.model.dateFormat), element: d });
                    r.append(d);
                    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1, 0, 0, 0);
                }
                tbody.append(r);
            }
            calendarTable.append(tbody);
            if (this._DRPdisableFade) {
                $(tbody).css("display", "block");
                $(tbody).css({ display: "table-row-group", "vertical-align": "middle", "border-color": "inherit" });
            }
            else {
                (this._isIE8 || this._isIE7) ? $(tbody).css("display", "block") : $(tbody).fadeIn("fast");
            }
            if (this.model.startLevel === this.model.depthLevel)
                this._depthLevel(this.model.depthLevel);
            else if (this.model.depthLevel != "month" && this.model.depthLevel != "") {
                if (this.model.startLevel == "century")
                    this._depthLevel(this.model.depthLevel);
                else if (this.model.startLevel == "decade" && this.model.depthLevel != "century")
                    this._depthLevel(this.model.depthLevel);
                else if (this.model.startLevel == "year" && this.model.depthLevel != "decade" && this.model.depthLevel != "century")
                    this._depthLevel(this.model.depthLevel);
                else {
                    this._on(calendarTable.find('.current-month,.other-month,.e-current-month,.e-current-year,.e-current-allyear'), "click", $.proxy(this._backwardNavHandler, this));
                    this._on(calendarTable.find('.current-month , .other-month'), "click", $.proxy(this._onSetCancelDateHandler, this));
                }
            }
            else {
                this._on(calendarTable.find('.current-month,.other-month,.e-current-month,.e-current-year,.e-current-allyear'), "click", $.proxy(this._backwardNavHandler, this));
                this._on(calendarTable.find('.current-month , .other-month'), "click", $.proxy(this._onSetCancelDateHandler, this));
            }

            this._otherMonthsVisibility();
            this._checkDateArrows();
        },

        _checkDisableRange: function (value) {
            if (!ej.isNullOrUndefined(this._disableCollection[value.getFullYear()]))
                if (jQuery.inArray(value.getMonth(), this._disableCollection[value.getFullYear()]) !== -1)
                    return true;
            return false;
        },
        _initDisableObj: function (disableDates) {
            this._disableCollection = {};
            for (var i = 0; i < this.model.blackoutDates.length; i++) {
                var dateObj = this._checkInstanceType(this.model.blackoutDates[i]);
                if (dateObj) {
                    var year = dateObj.getFullYear();
                    var month = dateObj.getMonth();
                    if (ej.isNullOrUndefined(this._disableCollection[year])) this._disableCollection[year] = [];
                    if (jQuery.inArray(month, this._disableCollection[year]) == -1) this._disableCollection[year].push(month);
                }
            }
        },

        _disableDates: function (args) {
            for (var i = 0; i < this.model.blackoutDates.length; i++) {
                var dateObj = this._checkInstanceType(this.model.blackoutDates[i]);
                if (dateObj && +args.date === +dateObj)
                    args.element.removeClass('current-month').addClass('e-hidedate');
            }
        },

        _keyboardNavigation: function (e) {
            if (this._animating) return false;
            if ((this._isOpen) && (e.keyCode == 37 || e.keyCode == 38 || e.keyCode == 39 || e.keyCode == 40 || e.keyCode == 13 || e.keyCode == 36 || e.keyCode == 35)) {
                e.preventDefault && e.preventDefault();
                if (e.altKey) { if (e.keyCode == 13) { this._setCurrDate(e); return false; } else return; }
                var t = { row: null, col: null };

                t.col = this.sfCalendar.find('tbody tr td.e-state-hover').index();
                t.row = this.sfCalendar.find('tbody tr td.e-state-hover').parent().index();

                t.col = (t.col != -1) ? t.col + 1 : this.sfCalendar.find('tbody tr td.e-active').index() + 1;
                t.row = (t.row != -1) ? t.row + 1 : this.sfCalendar.find('tbody tr td.e-active').parent().index() + 1;

                var tableClass = this.sfCalendar.find('table')[0].className, next, rowLength = 3, colLength = 4;
                switch (tableClass) {
                    case "e-dp-viewallyears":
                        next = this._changeRowCol(t, e.keyCode, rowLength, colLength, "yearall", e.ctrlKey);
                        if (!e.ctrlKey) this._hoverAllYear = this.sfCalendar.find('tbody.e-datepicker-allyears tr td').index(next);
                        break;
                    case "e-dp-viewyears":
                        next = this._changeRowCol(t, e.keyCode, rowLength, colLength, "year", e.ctrlKey);
                        if (!e.ctrlKey) this._hoverYear = this.sfCalendar.find('tbody.e-datepicker-years tr td').index(next);
                        break;
                    case "e-dp-viewmonths":
                        next = this._changeRowCol(t, e.keyCode, rowLength, colLength, "month", e.ctrlKey);
                        if (!e.ctrlKey) this._hoverMonth = this.sfCalendar.find('tbody.e-datepicker-months tr td').index(next);
                        break;
                    case "e-dp-viewdays":
                        rowLength = this.sfCalendar.find('tbody.e-datepicker-days tr').length, colLength = 7;
                        next = this._changeRowCol(t, e.keyCode, rowLength, colLength, "day", e.ctrlKey);
                        if (!e.ctrlKey) this._hoverDate = this._getDateObj(next).getDate() - 1;
                        break;
                }
                if (!e.ctrlKey) {
                    this.sfCalendar.find('table td').removeClass("e-state-hover");
                    next.addClass("e-state-hover");
                }
            }
            else if (!this.model.displayInline && (e.keyCode == 27 || e.keyCode == 9)) { this.hide(); }
            else if (e.altKey && e.keyCode == 40) { this.show(); return false; }
        },
        _changeRowCol: function (t, key, rows, cols, target, ctrlKey) {
            var eleClass, cls = { parent: null, child: null };
            switch (target) {
                case "day": eleClass = "tbody.e-datepicker-days tr td.current-month";
                    cls.parent = ".e-datepicker-days", cls.child = ".current-month";
                    break;
                case "month": eleClass = "tbody.e-datepicker-months tr td.e-current-month";
                    cls.parent = ".e-datepicker-months", cls.child = ".e-current-month";
                    break;
                case "year": eleClass = "tbody.e-datepicker-years tr td.e-current-year";
                    cls.parent = ".e-datepicker-years", cls.child = ".e-current-year";
                    break;
                case "yearall": eleClass = "tbody.e-datepicker-allyears tr td.e-current-allyear";
                    cls.parent = ".e-datepicker-allyears", cls.child = ".e-current-allyear";
                    break;
            }
            if (t.row <= 0 && t.col <= 0)
                return this.sfCalendar.find(eleClass + ':first');
            var cell, proxy = this;
            switch (key) {
                case 36:
                    return this.sfCalendar.find(eleClass + ':first');
                case 35:
                    return this.sfCalendar.find(eleClass + ':last');
                case 38:
                    if (ctrlKey && this.model.allowDrillDown) {
                        this._forwardNavHandler();
                    }
                    else if (t.row > 1) {
                        t.row -= 1;
                    }
                    else {
                        this._processNextPrevDate(true);
                        cell = this.sfCalendar.find(eleClass + ':nth-child(' + t.col + '):last');
                        return cell;
                    }
                    cell = this._getCell(t, cls);
                    if (cell.length <= 0) {
                        cell = this._findVisible(t, cls, "up");
                        if (cell !== null) return cell;
                        this._processNextPrevDate(true);
                        cell = this.sfCalendar.find(eleClass + ':nth-child(' + t.col + '):last');
                    }
                    return cell;
                case 37:
                    if (ctrlKey) {
                        this._processNextPrevDate(true);
                        return this.sfCalendar.find('tbody tr td.e-state-hover');
                    }
                    else if (t.col > 1)
                        t.col -= 1;
                    else if (t.row > 1) {
                        t = { row: t.row - 1, col: cols }
                    }
                    else {
                        this._processNextPrevDate(true);
                        cell = this.sfCalendar.find(eleClass + ':last');
                        return cell;
                    }
                    cell = this._getCell(t, cls);
                    if (cell.length <= 0) {
                        cell = this._findVisible(t, cls, "left");
                        if (cell !== null) return cell;
                        this._processNextPrevDate(true);
                        cell = this.sfCalendar.find(eleClass + ':last');
                    }
                    return cell;
                case 39:
                    if (ctrlKey) {
                        this._processNextPrevDate(false);
                        return this.sfCalendar.find('tbody tr td.e-state-hover');
                    }
                    else if (t.col < cols)
                        t.col += 1;
                    else if (t.row < rows) {
                        t = { row: t.row + 1, col: 1 }
                    }
                    else {
                        this._processNextPrevDate(false);
                        cell = this.sfCalendar.find(eleClass + ':first');
                        return cell;
                    }
                    cell = this._getCell(t, cls);
                    if (cell.length <= 0) {
                        cell = this._findVisible(t, cls, "right");
                        if (cell !== null) return cell;
                        this._processNextPrevDate(false);
                        cell = this.sfCalendar.find(eleClass + ':first');
                    }
                    return cell;
                case 40:
                    if (!ctrlKey) {
                        if (t.row < rows) {
                            t.row += 1;
                        }
                        else {
                            this._processNextPrevDate(false);
                            cell = this.sfCalendar.find(eleClass + ':nth-child(' + t.col + '):first');
                            return cell;
                        }
                        cell = this._getCell(t, cls);
                        if (cell.length <= 0) {
                            cell = this._findVisible(t, cls, "down");
                            if (cell !== null) return cell;
                            this._processNextPrevDate(false);
                            cell = this.sfCalendar.find(eleClass + ':nth-child(' + t.col + '):first');
                        }
                        return cell;
                    }
                case 13:
                    var tclassName = $("table", this.sfCalendar).get(0).className, ele, element;
                    ele = this._getCell(t, cls); element = $(ele)[0];
                    if (tclassName == "e-dp-viewmonths" && this.model.startLevel == "year" && this.model.depthLevel == "year") {
                        this._dateValue = new Date(this._dateValue.setMonth(parseInt(element.attributes["data-index"].value)));
                        this._onSetCancelDateHandler({ type: null, target: ele });
                    }
                    else if ((tclassName == "e-dp-viewyears" && this.model.startLevel == "decade" && this.model.depthLevel == "decade") ||
                        (tclassName == "e-dp-viewallyears" && this.model.startLevel == "century" && this.model.depthLevel == "century")) {
                        this._dateValue = new Date(this._dateValue.setFullYear(parseInt(element.innerHTML)));
                        this._onSetCancelDateHandler({ type: null, target: ele });
                    }
                    else if (tclassName == "e-dp-viewdays") {
                        this._backwardNavHandler(ele);
                        this._onSetCancelDateHandler({ type: null, target: ele });
                    }
                    else
                        this._backwardNavHandler(ele);
                    break;
            }
            return this._getCell(t, cls);
        },
        _findVisible: function (t, cls, key) {
            var cols = t.col, rows = t.row, requiredClass = cls.child.slice(1, cls.child.length);
            for (i = 0; i >= 0; i++) {
                nextElement = this.sfCalendar.find('tbody' + cls.parent + ' tr:nth-child(' + rows + ') td:nth-child(' + cols + ')');
                if (nextElement.length <= 0) {
                    return null;
                }
                if (nextElement.hasClass('e-hidedate') || !nextElement.is(":visible")) {
                    key == "right" || key == "left" ? (key == "right" ? cols++ : cols--) : (key == "down" ? rows++ : rows--);
                    if ((rows <= 0) || (rows > this.sfCalendar.find('tbody' + cls.parent + ' tr').length)) {
                        // No more rows there in popup.
                        return null;
                    }
                    // Column exceeds the range. 
                    if (cols > this.sfCalendar.find('tbody' + cls.parent + ' tr:nth-child(' + rows + ') td').length) {
                        //move to next row and select first column
                        rows++;
                        cols = 1;
                    }
                    if (cols <= 0) {
                        //move to previous row and select last column
                        rows--;
                        cols = this.sfCalendar.find('tbody' + cls.parent + ' tr:nth-child(' + rows + ') td').length;
                    }
                    // Row exceeds the range.
                    if ((rows <= 0) || (rows > this.sfCalendar.find('tbody' + cls.parent + ' tr').length)) {
                        // No more rows there in popup.
                        return null;
                    }
                } else if (nextElement.hasClass('other-month')) {
                    return null;
                } else if (nextElement.hasClass(requiredClass)) {
                    t.col = cols; t.row = rows;
                    return nextElement;
                }
            }
        },
        _getCell: function (t, cls) {
            return this.sfCalendar.find('tbody' + cls.parent + ' tr:nth-child(' + t.row + ') td' + cls.child + ':nth-child(' + t.col + ')');
        },
        _getDateObj: function (element) {
            return new Date(element.attr("data-date"));
        },
        _touchCalendar: function (e) {
            var tableClass = this.sfCalendar.find('table')[0].className;
            switch (e.type) {
                case "pinchin":
                    if (tableClass != "e-dp-viewdays")
                        this._keyboardNavigation({ keyCode: 13 });
                    break;
                case "pinchout":
                    if (tableClass != "e-dp-viewallyears" && this.model.allowDrillDown)
                        this._forwardNavHandler();
                    break;
                case "swipeleft":
                    this._processNextPrevDate(false);
                    break;
                case "swiperight":
                    this._processNextPrevDate(true);
                    break;
            }
        },

        show: function (e) {
            if (ej.isNullOrUndefined(this.sfCalendar)) this._renderPopup();
            if (this._isOpen) return false;
            var proxy = this;
            this._popupOpen = true;
            var previous = this._preValue != null ? new Date(this._preValue.toString()) : this._preValue;
            if (!this.model.enabled) return;
            if (!this.model.displayInline) this._setDatePickerPosition();
            if (this._trigger("beforeOpen", { element: this.sfCalendar, events: e })) return false;
            this.sfCalendar.attr({ 'aria-hidden': 'false' });
            proxy._isOpen = true;
            this.sfCalendar.slideDown(this.model.enableAnimation ? this.animation.open.duration : 0, function () {
                if (proxy.model && !proxy.model.displayInline)
                    $(document).on("mousedown", $.proxy(proxy._onDocumentClick, proxy));
            });
            if (this._isIE8) {
                if (this.element.val() && this._compareDate(new Date(this.element.val()), previous)) this._updateInputVal();
            }
            else this._updateInputVal();
            this._refreshLevel(previous);
            this._trigger("open", { prevDate: previous, date: this.model.value, value: this._formatter(this.model.value, this.model.dateFormat) });
            $(window).on("resize", $.proxy(this._OnWindowResize, this));
            if (!this.model.displayInline) {
              this._on(ej.getScrollableParents(this.wrapper), "scroll", this.hide);
              this._on(ej.getScrollableParents(this.wrapper), "touchmove", this.hide);
			}
            this._isInputBox && this.wrapper.addClass("e-active");
        },


        hide: function (e) {
            if (!this._isOpen || this._getInternalEvents) return false;
            if (this._trigger("beforeClose", { element: this.sfCalendar, events: e })) return false;
            var proxy = this;
            this._popupOpen = false;
            this.sfCalendar.attr({ 'aria-hidden': 'true' });
            if (this._popClose && e != undefined && e.type != "click") {
                return;
            }
            this.sfCalendar.slideUp(this.model.enableAnimation ? this.animation.close.duration : 0, function () {
                proxy._isOpen = false;
                $(document).off("mousedown", $.proxy(proxy._onDocumentClick, proxy));
                proxy._setWaterMark();
            });
            if (this.element.val() != "") this._validateInputVal();
            this._trigger("close", { prevDate: this._prevDate, date: this.model.value, value: this._formatter(this.model.value, this.model.dateFormat) });
            $(window).off("resize", $.proxy(this._OnWindowResize, this));
            this._off(ej.getScrollableParents(this.wrapper), "scroll", this.hide);
            this._off(ej.getScrollableParents(this.wrapper), "touchmove", this.hide);
            this._isInputBox && this.wrapper.removeClass("e-active");
        },


        enable: function () {
            this.model.enabled = true;
            this.wrapper && this.wrapper.removeClass('e-disable');
            this.element.removeClass('e-disable').attr({ "aria-disabled": false });
            this.element.prop("disabled", false);
            if (this.dateIcon) this.dateIcon.removeClass('e-disable').attr({ "aria-disabled": false });
            if (this._isIE8 && this.dateIcon) this.dateIcon.children().removeClass("e-disable");
            this.element.prop("disabled", false);
            if (!this._isSupport)
                this._hiddenInput.prop("disabled", false);
            this.sfCalendar && this.sfCalendar.removeClass('e-disable').attr({ "aria-disabled": false });
        },


        disable: function () {
            this.model.enabled = false;
            this.wrapper && this.wrapper.addClass('e-disable');
            this.element.addClass('e-disable').attr({ "aria-disabled": true });
            this.element.attr("disabled", "disabled");
            if (this.dateIcon) this.dateIcon.addClass('e-disable').attr({ "aria-disabled": true });
            if (this._isIE8 && this.dateIcon) this.dateIcon.children().addClass("e-disable");
            this.element.attr("disabled", "disabled");
            if (!this._isSupport)
                this._hiddenInput.attr("disabled", "disabled");
            this.sfCalendar && this.sfCalendar.addClass('e-disable').attr({ "aria-disabled": true });
            if (this._isOpen) {
                if (this.element.is(':input')) this.element.blur();
                if (!this.model.displayInline) this.hide();
            }
        },

        getValue: function () { return this._formatter(this.model.value, this.model.dateFormat); },

        _wireCalendarEvents: function () {
            this._allowQuickPick(this.model.allowDrillDown);
            this._on($('.e-next', this.sfCalendar), "click", $.proxy(this._previousNextHandler, this));
            this._on($('.e-prev', this.sfCalendar), "click", $.proxy(this._previousNextHandler, this));
            if (!this.model.displayInline) {
                this.sfCalendar.on("mouseenter touchstart", $.proxy(function () { this._popClose = true; }, this));
                this.sfCalendar.on("mouseleave touchend", $.proxy(function () { this._popClose = false; }, this));
            }
            if (this.model.showFooter)
                this._on($('.e-footer', this.sfCalendar), "click", this._setCurrDate);
            this.sfCalendar && this._on(this.sfCalendar, "pinchin pinchout swipeleft swiperight", $.proxy(this._touchCalendar, this));
        },

        _wireEvents: function () {
            if (this.element.is(":input") && (this.model.allowEdit)) {
                this._on(this.element, "blur", this._onFocusOut);
                this._on(this.element, "focus", this._onFocusIn);
                this._on(this.element, "keydown", this._onKeyDown);
            }

            if (!this.model.allowEdit) {
                this.element.attr("readonly", "readonly");
                this.element.on("mousedown", $.proxy(this._showDatePopUp, this));
            }
        },
        _bindDateButton: function () {
            this._on(this.dateIcon, "mousedown", this._showDatePopUp);
            if (this.model.allowEdit)
                this.element.off("mousedown", $.proxy(this._showDatePopUp, this));
        },
        _bindInputEvent: function () {
            this._off(this.dateIcon, "mousedown", this._showDatePopUp);
        },

        _specificFormat: function () {
            var parseInfo = ej.globalize._getDateParseRegExp(ej.globalize.findCulture(this.model.locale).calendar, this.model.dateFormat);
            return ($.inArray("dddd", parseInfo.groups) > -1 || $.inArray("ddd", parseInfo.groups) > -1)
        },

        _onFocusOut: function (e) {
            this._isFocused = false;
            var previous = this._preValue != null ? new Date(this._preValue.toString()) : this._preValue;
            this._validateOnFocusOut(this._validateValue(), e);
            this.wrapper.removeClass("e-focus");
            (ej.isNullOrUndefined(this.model.value)) ? this.wrapper.removeClass('e-valid') : this.wrapper.addClass('e-valid');
            if ((!this._isOpen || this.model.displayInline) && !this._setWaterMark() && !this._compareDate(this._preValue, this._parseDate(this.element.val(), this.model.dateFormat))) this._updateInputVal();
            if ((!this._isOpen || this.model.displayInline)) this._refreshLevel(previous);
            if (this.element.val() != "" && (!this._isOpen || this.model.displayInline)) { this._validateInputVal(); }
            this.element.off("keydown", $.proxy(this._keyboardNavigation, this));
            if (!this.model.showPopupButton) this._off(this.element, "click", this._elementClick);
            var _currentVal = this.element.val();
            var data = { prevDate: this._prevDate, value: _currentVal };
            if (this._specificFormat()) {
                if (this._prevDate != _currentVal)
                    this._setDateValue(_currentVal, true);
            }
            else
                this._setDateValue(_currentVal);
            if (!this.model.value) this._clearSelected();
            this._trigger("focusOut", data);
            this._checkErrorClass();
        },
        _onFocusIn: function (e) {
            if (this._isSupport) {
                e.preventDefault();
                this._isFocused = true;
            }
            this.wrapper.removeClass('e-error');
            this.isValidState = true;
            this.wrapper.addClass("e-focus");
            this.wrapper.addClass('e-valid');
            if (this.model.readOnly)
                return;
            if (!this._isSupport) this._hiddenInput.css("display", "none");
            this.element.on("keydown", $.proxy(this._keyboardNavigation, this));
            if (!this.model.showPopupButton && !this.model.readOnly) this.show(e);
            if (!this.model.showPopupButton) this._on(this.element, "click", this._elementClick);
            this._trigger("focusIn", { date: this.model.value, value: this._formatter(this.model.value, this.model.dateFormat) });
        },
        _elementClick: function (e) {
            if (!this._popupOpen) this.show(e);
        },
        _removeWatermark: function () {
            if (this.element.val() != "" && !this._isSupport)
                this._hiddenInput.css("display", "none");
        },
        _refreshPopup: function () {
            this._refreshDatepicker();
            this._startLevel(this.model.startLevel);
        },
        _weekDate: function (currentDate) {
            var time, checkDate = new Date(currentDate.getTime());
            checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
            time = checkDate.getTime();
            checkDate.setMonth(0);
            checkDate.setDate(1);
            return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;

        },
        _refreshLevel: function (previous) {
            if ((this.model.startLevel == this.model.depthLevel) && this.model.startLevel != "month") {
                var val = this._stringToObject(this.element.val());
                val = this._validateYearValue(val);
                if (val)
                    if (!this._compareDate(previous, val))
                        this._refreshPopup();
            }
        },
        _validateOnFocusOut: function (val, e) {
            var dateVal = this._preValue != null ? this._calendarDate : this._preValue;
            var calenderDate = this._formatter(dateVal, this.model.dateFormat);
            if (this._specificFormat() && (val > this.model.minDate) && (val < this.model.maxDate)) {
                if (val == null) this.model.value = dateVal
                else {
                    this.model.value = val;
                    var currDate = this._formatter(val, this.model.dateFormat, this.model.locale);
                }
            }
            else var currDate = this._formatter(this._parseDate((this._formatter(new Date(), "MM/dd/yyyy"))), this.model.dateFormat);
            var dateChange = false, valueExceed = false;
            if (val != null && !this.model.enableStrictMode) {
                if (ej.isNullOrUndefined(this.model.value))
                    this.model.value = this._parseDate(this.element.val());
                if (this.model.maxDate < this.model.minDate) this.model.minDate = this.model.maxDate;
                if (!this.model.enableStrictMode) {
                    if (val) {
                        if ((val < this.model.minDate) || (val > this.model.maxDate)) {
                            dateChange = true,
                            this._calendarDate = val = val < this.model.minDate ? this.model.minDate : this.model.maxDate
                        }
                    }
                    else {
                        this.element.val("");
                        if (this._calendarDate < this.model.minDate) this._calendarDate = this.model.minDate;
                        else if (this._calendarDate > this.model.maxDate) this._calendarDate = this.model.maxDate;
                    }
                    this.isValidState = true;
                }
                if (dateChange) this.element.val(this._formatter(val, this.model.dateFormat));
                if (!this._compareDate(this._preValue, this._parseDate(this.element.val(), true))) this._triggerChangeEvent(e);
            }
            else if (val == null && !this.model.enableStrictMode) {
                if (this._preTxtValue == null || this.element.val() == "") {
                    this.element.val("");
                    if (!this._isSupport) this._hiddenInput.css("display", "block");
                } else
                    this.element.val(calenderDate);
                this._triggerChangeEvent(e);
            }
            else {
                if (val) {
                    if ((val < this.model.minDate) || (val > this.model.maxDate)) {
                        this.isValidState = false, valueExceed = true,
                        this._calendarDate = val < this.model.minDate ? this.model.minDate : this.model.maxDate
                    }
                    else
                        this.isValidState = true;
                    this._triggerChangeEvent(e);
                    if (valueExceed && this._getInternalEvents) this._trigger("outOfRange");
                }
                else {
                    this.isValidState = false;
                    if (this._calendarDate < this.model.minDate) this._calendarDate = this.model.minDate;
                    else if (this._calendarDate > this.model.maxDate) this._calendarDate = this.model.maxDate;
                }
            }
        },
        _onKeyDown: function (e) {
            if (e.keyCode === 13) {
                var previous = this._preValue != null ? new Date(this._preValue.toString()) : this._preValue;
                this._validateOnFocusOut(this._validateValue(), e);
                if ((!this._isOpen || this.model.displayInline) && !this._setWaterMark() && !this._compareDate(this._preValue, this._parseDate(this.element.val(), this.model.dateFormat))) this._updateInputVal();
                if ((!this._isOpen || this.model.displayInline)) this._refreshLevel(previous);
                if (this.element.val() != "" && (!this._isOpen || this.model.displayInline)) { this._validateInputVal(); }
                this._checkErrorClass();
            }
        },
        _showhidePopup: function (e) {
            if (!this.model.enabled) return false;
            if (this._isOpen) {
                if (!this._isFocused && this.element.is(':input') && (!ej.isTouchDevice())) this.element.focus();
                if (!this._cancelValue) this.hide(e);
            }
            else {
                if (!this._isFocused && this.element.is(':input') && (!ej.isTouchDevice())) this.element.focus();
                this.show(e);
            }
        },
        _compareDate: function (first, second) {
            var result = (+first === +second) ? true : false;
            return result;
        },
        _validateDate: function (val) {
            var result = true;
            if (val != null) {
                for (var i = 0; i < this.model.blackoutDates.length; i++) {
                    var dateObj = this._checkInstanceType(this.model.blackoutDates[i]);
                    if (dateObj && +val === +dateObj)
                        result = false;
                }
                if ((val < this.model.minDate || val > this.model.maxDate) && this.model.enableStrictMode) {
                    result = false;
                    this.isValidState = false;
                }
            }

            return result;
        },

        _triggerChangeEvent: function (e) {
            var currentValue;
            var _currentVal = this.element.val() == "" ? null : this.element.val();
            this._prevDate = this._formatter(this._preValue, this.model.dateFormat);
            var data = { prevDate: this._prevDate, value: _currentVal, isInteraction: !!e };
            if (this._specificFormat() && e != undefined && e.type == "keydown" && this._formatter(this._preValue, this.model.dateFormat, this.model.locale) != this.element.val())
                currentValue = this._parseDate(this.element.val(), true);
            else if ((this._specificFormat() && e != undefined && e.type == "blur"))
                currentValue = this.model.value;
            else currentValue = this._parseDate(_currentVal);
            currentValue = this._validateYearValue(currentValue);
            if (!this._validateDate(currentValue)) currentValue = null;
            if (!this._compareDate(this._preValue, currentValue)) {
                this._preValue = this.model.value = currentValue;
                data.value = this._formatter(this.model.value, this.model.dateFormat);
                if (this.model.value) this._clickedDate = this._calendarDate = this.model.value;
                if (this.model.displayInline && !this._isInputBox) this._hiddenInput.attr('value', _currentVal);
                if (!this.model.value && !this.model.enableStrictMode) this._setDateValue(this.model.value);
                data.value = _currentVal;
                this._trigger("_change", data);
                data.value = this._formatter(this.model.value, this.model.dateFormat);
                this._trigger("change", data);
                this._checkErrorClass();
            }
            else if (!(this.element.val() == "" && this._prevDate == null) && this.element.val() != this._prevDate) {
                data.value = this.element.val();
                this._trigger("_change", data);
            }
        },

        _triggerSelectEvent: function (e) {
            var val = this.element.val();
            if (this._parseDate(val)) {
                var data = { prevDate: this._prevDate, date: this.model.value, value: val, isSpecialDay: this._isSpecialDates(this.model.value) };
                if (this._prevDate != val) {
                    if (this._parseDate(data.value) && (this.model.value >= this.model.minDate && this.model.value <= this.model.maxDate)) {
                        this._cancelValue = this._trigger("select", data);
                    }
                }
                if (this._dt_drilldown) this._trigger("dt_drilldown", data);
            }
        },

        _onDocumentClick: function (e) {
            if (this.model) {
                if (!$(e.target).is(this.popup) && !$(e.target).parents(".e-popup").is(this.popup) &&
                    !$(e.target).is(this.wrapper) && !$(e.target).parents(".e-datewidget").is(this.wrapper)) {
                    this.hide(e);
                }
                else if ($(e.target).is(this.popup) || $(e.target).parents(".e-popup").is(this.popup)) {
                    e.preventDefault();
                }
            }
        },

        _OnWindowResize: function (e) {
            if (this.sfCalendar) this._setDatePickerPosition();
        },

        _showDatePopUp: function (e) {
            var isRightClick = false;
            if (e.button)
                isRightClick = (e.button == 2);
            else if (e.which)
                isRightClick = (e.which == 3); //for Opera
            if (isRightClick) return;
            if (!this._isSupport && !this.model.showPopupButton) {
                e.preventDefault();
                this._onFocusIn();
            }
            if (this.model.readOnly) return;
            e.preventDefault();
            if (!this.model.enabled && this.model.displayInline) return false;
            this._showhidePopup(e);
        },
        _layoutChanged: function (e) {
            // this event internally used to observe the layout change in "DateTimePicker" control
            if (this._getInternalEvents) this._trigger("layoutChange");
        },
        _setCurrDate: function (e) {
            if (this.model.readOnly || !this.model.enabled) return false;
            if (e) e.preventDefault();
            var proxy = this;
            this._prevDate = this._formatter(this.model.value, this.model.dateFormat);
            this._dateValue = this._zeroTime(new Date());
            this.model.value = this._calendarDate = new Date(this._dateValue.toString());
            this._setDateValue(this.model.value);
            this._triggerSelectEvent(e);
            this._triggerChangeEvent(e);
            this._refreshDatepicker();
            this._changeDayClass();
            this._startLevel(this.model.startLevel);
            this._onSetCancelDateHandler(e);
            this._layoutChanged();
        },
        _changeDayClass: function () {
            var className = this.popup.children("table")[0].className;
            if (className != "e-dp-viewdays") {
                this.popup.children("table").removeClass(className).addClass("e-dp-viewdays");
            }
        },

        _onSetCancelDateHandler: function (e) {
            if (this.model.readOnly || !this.model.enabled) return false;
            if (e && ($(e.target).hasClass("e-disable") || $(e.target).hasClass("e-hidedate"))) return false;
            if (e && e.type) e.preventDefault();
            if (this._specificFormat()) this._prevDate = this.element.val();
            else this.model.value = this._parseDate(this.element.val());
            this._prevDate = this._formatter(this.model.value, this.model.dateFormat);
            this._setDateValue(this._dateValue);
            this._triggerSelectEvent(e);
            this._triggerChangeEvent(e);
            this._dateValue = (this.model.value == null)? null:new Date(this.model.value.toString());
            if (this.element.is(':input') && !this.model.displayInline) {
                this._showhidePopup(e);
            }
            if (e && $(e.currentTarget).hasClass("other-month"))
                this._refreshDatepicker();
            this._cellSelection();
        },
        _closeCalendar: function (ele) {
            if (!ele || ele == this.element) {
                this.sfCalendar.empty().remove();
            }
        },
        //Error class for input value validation
        _checkErrorClass: function () {
            if (this.wrapper) {
                if (this.isValidState) this.wrapper.removeClass("e-error");
                else this.wrapper.addClass("e-error");
            }
        },
        _getLocalizedLabels: function () {
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        }
    });

    ej.DatePicker.Locale = ej.DatePicker.Locale || {};

    ej.DatePicker.Locale['default'] = ej.DatePicker.Locale['en-US'] = {
        watermarkText: "Select date",
        buttonText: 'Today'
    };


    ej.DatePicker.Header = {
        /**  Removes the day header */
        None: "none",
        /**  Shows the day header format in short like Sun, Mon, Tue … */
        Short: "short",
        /**  Shows the day header format in min like Su, Mo, Tu … */
        Min: "min",
        /**  Shows the day header format in long like Sunday, Monday, Tuesday … */
        Long: "long"
    };

    ej.DatePicker.HighlightSection = {
        /**  Highlight the Current Month. */
        Month: "month",
        /**  Highlight the Current Week. */
        Week: "week",
        /**  Highlight the Current WorkDays. */
        WorkDays: "workdays",
        /** Don't Highlight Anything. */
        None: "none"
    };


    ej.DatePicker.Level = {
        /**  Starts from month level view. */
        Month: "month",
        /**  Starts from year level view. */
        Year: "year",
        /**  Starts from year decade level view. */
        Decade: "decade",
        /**  Starts from century level view.  */
        Century: "century"
    };
})(jQuery, Syncfusion);;

(function ($, undefined) {

    var $document = $(document);
    // add new event shortcuts
    $.each(("touchstart touchmove touchend " +
		"tap doubletap taphold " +
		"swipe swipeleft swiperight " + "pinch pinchin pinchout pinchstop " +
		"scrollstart scrollstop").split(" "), function (i, name) {

		    $.fn[name] = function (fn) {
		        return fn ? this.on(name, fn) : this.trigger(name);
		    };

		    // jQuery < 1.8
		    if ($.attrFn) {
		        $.attrFn[name] = true;
		    }
		});

    var isPointer = browserInfo().isMSPointerEnabled,
    isIE11Pointer = browserInfo().pointerEnabled,
    supportTouch = 'ontouchstart' in window,
	scrollEvent = "scroll",
    isDesktop = (typeof window.orientation === "undefined"),
    isIosDevice = navigator.userAgent.match(/iPhone|iPad|iPod/i),
	touchStartEvent = isPointer ? (isIE11Pointer ? "pointerdown" : "MSPointerDown") : (supportTouch ? "touchstart" : "mousedown"),
	touchStopEvent = isPointer ? (isIE11Pointer ? "pointerup" : "MSPointerUp") : isIosDevice ? ("touchend") : (supportTouch ? "touchend" : "mouseup"),
	touchMoveEvent = isPointer ? (isIE11Pointer ? "pointermove" : "MSPointerMove") : (supportTouch ? "touchmove" : "mousemove"),
    touchCancelEvent = isPointer ? (isIE11Pointer ? "pointercancel" : "MSPointerCancel") : (supportTouch ? "touchcancel" : "mouseleave"),
    mouseStartEvent = isPointer || !isDesktop ? touchStartEvent : isIosDevice ? "touchstart" : "touchstart mousedown",
    mouseStopEvent = isPointer || !isDesktop ? touchStopEvent : "touchend mouseup",
    mouseMoveEvent = isPointer || !isDesktop ? touchMoveEvent : "touchmove mousemove",
    browser = browserInfo(),
    isIE9 = ((browser.name == 'msie') && (browser.version == '9.0')) ? true : false;

    function browserInfo() {
        var browser = {}, clientInfo = [],
        browserClients = {
            webkit: /(chrome)[ \/]([\w.]+)/i, safari: /(webkit)[ \/]([\w.]+)/i, msie: /(msie) ([\w.]+)/i,
            opera: /(opera)(?:.*version|)[ \/]([\w.]+)/i, mozilla: /(mozilla)(?:.*? rv:([\w.]+)|)/i
        };
        for (var client in browserClients) {
            if (browserClients.hasOwnProperty(client)) {
                clientInfo = navigator.userAgent.match(browserClients[client]);
                if (clientInfo) {
                    browser.name = clientInfo[1].toLowerCase();
                    browser.version = clientInfo[2];
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
    }
    function initiateCustomEvent(obj, eventType, e) {
        var originalType = e.type;
        e.type = eventType;
        $.event.dispatch.call(obj, e);
        e.type = originalType;
    }
    function copyObject(e, origEvent) {
        if (origEvent) {
            for (prop in origEvent) {
                if (!(prop in e)) {
                    e[prop] = origEvent[prop];
                }
            }
        }
    }
    $.event.special.ejtouchmove = {
        setup: function () {
            var thisObj = this,
				$this = $(thisObj);
            $this.on(touchStartEvent, startMoveHandler);
            $document.on(touchStopEvent, clearTouchMoveHandlers);
            function clearTouchMoveHandlers() {
               // $this.off(touchMoveEvent, moveHandler)
            }
            var coords = {};
            function startMoveHandler(e) {
                if (!e.originalEvent) return;
                if (!(e.which && e.which !== 1)) {
                    var origTarget = e.target,
					origEvent = e.originalEvent;
                    if (isPointer)
                        coords = { x: origEvent.x, y: origEvent.y };
                    $this.on(touchMoveEvent, moveHandler);
                }
            }
            function moveHandler(e) {
                if (!(e.which && e.which !== 1)) {
                    var origTarget = e.target,
					origEvent = e.originalEvent;
                    copyObject(e, e.originalEvent);
                    if (!isPointer || !coords || (Math.abs(coords.x - origEvent.x) > 10 || Math.abs(coords.y - origEvent.y) > 10 && isPointer))
                        initiateCustomEvent(thisObj, "ejtouchmove", e);
                }
            }
        }
    };
    function touchObj(e) {
        return e.originalEvent.touches ?
					e.originalEvent.touches[0] : isPointer ? e.originalEvent : e;
    }
    // handles swipeup and swipedown
    $.event.special.swipeupdown = {
        setup: function () {
            var thisObj = this, $this = $(thisObj);
            checkMsieTouch($this);
            $this.on(touchStartEvent, function (e) {
                if (!e.originalEvent) return;
                var _startevent = e;
                var data = touchObj(e),
                            startPoint = {
                                time: (new Date).getTime(),
                                coords: [data.pageX, data.pageY],
                                origin: $(e.target)
                            },
                            stopPoint;
                function moveHandler(e) {
                    e.preventDefault();
                    if (!startPoint) return;
                    var data = touchObj(e);
                    stopPoint = {
                        time: (new Date).getTime(),
                        coords: [data.pageX, data.pageY]
                    };
                    if (Math.abs(startPoint.coords[1] - stopPoint.coords[1]) > 10) e.preventDefault();
                }

                $this
                            .on(touchMoveEvent, moveHandler)
                            .one(touchStopEvent, function (e) {
                                $this.off(touchMoveEvent, moveHandler);
                                if (startPoint && stopPoint) {
                                    if (stopPoint.time - startPoint.time < 1000 &&
                                    Math.abs(startPoint.coords[1] - stopPoint.coords[1]) > 30 &&
                                    Math.abs(startPoint.coords[0] - stopPoint.coords[0]) < 75) {
                                        var _addDetails = { time: stopPoint.time - startPoint.time, _isSwipe: true, _isDelta: true, stopPoint: stopPoint };
                                        var _options = _getOptions(e, _addDetails, _startevent);

                                        startPoint.origin
                                        .trigger($.extend(true, { type: "swipeupdown" }, _options))
                                        .trigger($.extend(true, { type: startPoint.coords[1] > stopPoint.coords[1] ? "swipeup" : "swipedown" }, _options));
                                    }
                                }
                                startPoint = stopPoint = undefined;
                            });
            });
        }
    };
    $.event.special.scrollstart = {
        isEnabled: true,
        setup: function () {
            var thisObj = this, $this = $(thisObj), scrolling, timer;
            function trigger(e, scrollState) {
                scrolling = scrollState;
                initiateCustomEvent(thisObj, scrolling ? "scrollstart" : "scrollstop", e);
            }
            $this.on(scrollEvent, function (e) {
                if (!$.event.special.scrollstart.isEnabled) return;
                if (!scrolling) trigger(e, true);
                clearTimeout(timer);
                timer = setTimeout(function () {
                    trigger(e, false);
                }, 250);
            });
        }
    };

    // also handles doubletap, taphold
    $.event.special.tap = {
        doubleTapThreshold: 500,
        tapholdThreshold: 650,
        canDoubleTap: function (d) {
            return ((getTimeSpan() - d.doubleTapStartTime) <= $.event.special.tap.doubleTapThreshold);
        },
        setup: function () {
            var thisObj = this, $this = $(thisObj), d = $this.data();
            var mouseDownTarget;            
            checkMsieTouch($this);
            d.isDoubleTapWait = false;
            d.stopProcess = false;
            d.preTouchend = null;
            d.preTouchstart = null;

            $this.on(mouseStartEvent, function (event) {
                if (!event.originalEvent) return;
                if (event.type == "mousedown" || event.type == "pointerdown" || "MSPointerDown")                   
                    mouseDownTarget = event.target;
                               
                d = $this.data();
                d.startTime = getTimeSpan();
                if (!d.isDoubleTapWait) d.doubleTapStartTime = d.startTime;
                if (event.type == "touchstart") d.preTouchstart = d.startTime;
                // checked mousedown event arrives within 300'ms after the touchend completes
                if (event.type == "mousedown" && (d.startTime - d.preTouchend < 300 || d.startTime - d.preTouchstart < 30))
                    d.stopProcess = true;
                else d.stopProcess = false;

                var origTarget = event.currentTarget,
					origEvent = event.originalEvent,
					timer;

                function clearTapHandlers() {
                    clearTimeout(timer);

                    $this.off(mouseStopEvent, clickHandler);
                    if (isIE9) $document.off(mouseStopEvent, clickHandler);
                    $this.off(touchCancelEvent, clearTapHandlers);
                    $this.off(mouseMoveEvent, touchMoveAction);
                    $this.off('dragstart', dragAction);
                }
                function touchMoveAction(e) {
                    var touchmoveThreshold = 10;
                    var coor1 = (e.originalEvent.changedTouches ? e.originalEvent.changedTouches[0] : e.originalEvent),
                        coor2 = (event.originalEvent.changedTouches ? event.originalEvent.changedTouches[0] : event.originalEvent);
                    if (!((coor1.pageX - coor2.pageX < touchmoveThreshold && coor1.pageX - coor2.pageX > -(touchmoveThreshold)) &&
                        (coor1.pageY - coor2.pageY < touchmoveThreshold && coor1.pageY - coor2.pageY > -(touchmoveThreshold)))) {
                        if (e.type == "mousemove" || (e.type == "pointermove" && e.originalEvent.pointerType == "mouse") ||
                            e.type == "MSPointerMove" && e.originalEvent.pointerType == 4) {
                            clearTimeout(timer);
                            $this.off(touchCancelEvent, clearTapHandlers);
                            $this.off(mouseMoveEvent, touchMoveAction);
                        }
                        else
                          clearTapHandlers();                                            
                    }                    
                }
                function clickHandler(e) {
                    if (e.type == "touchend") d.preTouchend = getTimeSpan();
                    clearTapHandlers();

                    // Modify the tap event target
                    if (mouseDownTarget != e.target && (e.type == "mouseup" || event.type == "pointerup" || "MSPointerUp")) {
                        var mouseupTarget = e.target;                        
                        // Mousedown element is the parent of the mouseup element.                       
                        if (jQuery.contains(mouseDownTarget, mouseupTarget))
                            // Mousedown element is target.
                            updateTargetEle(e, mouseDownTarget);
                       
                        // Mousedown element is the sibiling of the mouseup element.                            
                        else if (!(jQuery.contains(mouseupTarget, mouseDownTarget))) {
                            var ele = $(mouseDownTarget).parents().has($(mouseupTarget)).first()[0];
							if(!ej.isNullOrUndefined(ele))
                                updateTargetEle(e, ele);                         
                        }
                    }

                    // ONLY trigger a 'tap' event if the startPoint target is
                    // the same as the stopPoint target.
                    if (origTarget === e.currentTarget) {
                        initiateCustomEvent(thisObj, "tap", $.extend(_getBaseOptions(e), {
                            time: getTimeSpan() - d.startTime
                        }));

                        if (d.isDoubleTapWait && $.event.special.tap.canDoubleTap(d)) {
                            d.isDoubleTapWait = false;

                            initiateCustomEvent(thisObj, "doubletap", $.extend(_getBaseOptions(e), {
                                time: getTimeSpan() - d.doubleTapStartTime
                            }));
                        }
                        else {
                            if (d.isDoubleTapWait) {
                                d.isDoubleTapWait = false;
                                d.doubleTapStartTime = d.startTime;
                            }
                            if ($.event.special.tap.canDoubleTap(d)) {
                                d.isDoubleTapWait = true;
                            }
                        }
                    }
                }
                function updateTargetEle(e,target) {
                    e.target = target;
                    e.toElement = target;                  
                }
                function dragAction(e) {
                    // Remove the tap handler while moving the element inside the tap.
                    clearTapHandlers();
                }
                if (!(event.which && event.which !== 1) && !d.stopProcess) {                   
                    $this.on(mouseStopEvent, clickHandler);
                    if (isIE9) $document.on(mouseStopEvent, clickHandler);
                    $this.on(touchCancelEvent, clearTapHandlers);
                    $this.on(mouseMoveEvent, touchMoveAction);
                    $this.on('dragstart', dragAction);
                    var eventCopy = {};  
                    for (var i in origEvent) {
                        eventCopy[i] = origEvent[i];    // For IE8 taphold issue, copy the original event in local variable 
                    }
                    timer = setTimeout(function () {
                        if (d.isDoubleTapWait) d.isDoubleTapWait = false;
                        initiateCustomEvent(thisObj, "taphold", $.extend(_getBaseOptions(event), {
                            options: eventCopy,
                            time: getTimeSpan() - d.startTime
                        }));

                    }, $.event.special.tap.tapholdThreshold);
                }
                else if (d.stopProcess) d.stopProcess = false;
            });
        }
    };    
    $.event.special.swipe = {
        scrollSupression: 10,
        duration: 1000,
        horizontalDistance: 30,
        verticalDistance: 75,
        pointers: window.navigator.msPointerEnabled,
        startPoint: function (e) {
            var data = touchObj(e);
            return {
                time: (new Date()).getTime(),
                coords: [data.pageX, data.pageY],
                origin: $(e.target)
            };
        },
        stopPoint: function (e) {
            var data = touchObj(e);
            return {
                time: (new Date()).getTime(),
                coords: [data.pageX, data.pageY]
            };
        },
        handleSwipe: function (startPoint, stopPoint, e, _startevent) {

            if (stopPoint.time - startPoint.time < $.event.special.swipe.duration &&
				Math.abs(startPoint.coords[0] - stopPoint.coords[0]) > $.event.special.swipe.horizontalDistance &&
				Math.abs(startPoint.coords[1] - stopPoint.coords[1]) < $.event.special.swipe.verticalDistance) {

                var _addDetails = { time: stopPoint.time - startPoint.time, _isSwipe: true, _isDelta: true, stopPoint: stopPoint };
                var _options = _getOptions(e, _addDetails, _startevent);

                startPoint.origin.trigger($.extend(true, { type: "swipe" }, _options))
					.trigger($.extend(true,
                    { type: startPoint.coords[0] > stopPoint.coords[0] ? "swipeleft" : "swiperight" }, _options));
            }
        },

        setup: function () {
            var thisObj = this, $this = $(thisObj);
            checkMsieTouch($this);

            $this.on(touchStartEvent, function (e) {
                if (!e.originalEvent) return;
                var startPoint = $.event.special.swipe.startPoint(e),
					stopPoint;
                var _startevent = e;
                $(e.target).data('_dataTouchStart', { event: e, _now: new Date().getTime() });

                function moveHandler(e) {
                    if (!startPoint) return;
                    stopPoint = $.event.special.swipe.stopPoint(e);
                    if (Math.abs(startPoint.coords[0] - stopPoint.coords[0]) > $.event.special.swipe.scrollSupression) e.preventDefault();
                }

                $this.on(touchMoveEvent, moveHandler)
					.one(touchStopEvent, function (e) {
					    $this.off(touchMoveEvent, moveHandler);
					    if (startPoint && stopPoint) {
					        $.event.special.swipe.handleSwipe(startPoint, stopPoint, e, _startevent);
					    }
					    startPoint = stopPoint = undefined;
					});
            });
        }
    };
    // also handles pinchin, pinchout
    $.event.special.pinch = {
        distance: function (e) {
            if (e.originalEvent.touches.length < 2) return null;
            return $.event.special.pinch._getdistance(e.originalEvent.touches[0], e.originalEvent.touches[1]);
        },
        _getdistance: function (coor1, coor2) {
            return Math.sqrt((coor1.pageX - coor2.pageX) * (coor1.pageX - coor2.pageX) +
                (coor1.pageY - coor2.pageY) * (coor1.pageY - coor2.pageY));
        },
        setup: function () {
            var thisObj = this, $this = $(thisObj);
            checkMsieTouch($this);
            $this.on(touchStartEvent, function (e) {
                if (!e.originalEvent) return;
                var _startevent = e;
                if (e.originalEvent.touches && e.originalEvent.touches.length >= 2) {
                    var startPoint = $.event.special.pinch.distance(e), stopPoint, minDistance = 5;

                    var _pinchDistance = startPoint, moveEvent;
                    var _options = _getOptions(e, { _isPinch: true, _pinchDistance: _pinchDistance }, _startevent);

                    $(e.target).trigger($.extend(true, { type: "pinch" }, _options));

                    function moveHandler(e) {
                        moveEvent = e;
                        stopPoint = $.event.special.pinch.distance(e) || null;
                        if (startPoint && stopPoint && Math.abs(startPoint - stopPoint) > minDistance) {

                            $(e.target).trigger($.extend(true,
                                { type: startPoint > stopPoint ? "pinchin" : "pinchout" }, _getOptions(e,
                                { _isPinch: true, _pinchDistance: _pinchDistance }, _startevent)));

                            startPoint = stopPoint;
                        }
                    }

                    $this.on(touchMoveEvent, moveHandler)
                        .one(touchStopEvent, function () {
                            $this.off(touchMoveEvent, moveHandler);
                            $(e.target).trigger($.extend(true, { type: "pinchstop" }, _getOptions(moveEvent,
                                { _isPinch: true, _pinchDistance: stopPoint }, _startevent)));
                            startPoint = stopPoint = undefined;
                        });
                }
            });
        }
    };
    //  handles touchdrag, touchdrag
    $.event.special.touchdrag = {

        setup: function () {
            var thisObj = this, $this = $(thisObj);
            checkMsieTouch($this);

            $this.on(touchStartEvent, function (e) {
                if (!e.originalEvent) return;
                var startPoint = touchObj(e),
					stopPoint;
                var _startevent = e;
                $(e.target).data('_dataTouchStart', { event: e, _now: new Date().getTime() });

                function moveHandler(e) {
                    if (!startPoint) {
                        return;
                    }
                    stopPoint = touchObj(e);

                    if ($.event.special.pinch._getdistance(startPoint, stopPoint) > 5)
                        $(e.target).trigger($.extend(true, { type: "touchdrag" },
                            _getOptions(e, { _isdrag: true, stopPoint: stopPoint, _isDelta: true }, _startevent)));
                }

                $this.on(touchMoveEvent, moveHandler)
					.one(touchStopEvent, function (e) {
					    $this.off(touchMoveEvent, moveHandler);
					    startPoint = stopPoint = undefined;
					});
            });
        }
    };
    function _getBaseOptions(e) {
        var _pointer = isPointer ? e.originalEvent.pointerType : (!e.originalEvent.touches ? "mouse" : "touch")
        var pointerType = (isPointer && isIE11Pointer == undefined) ? (_pointer == 4 ? "mouse" : "touch") : _pointer;
        e["pointerType"] = pointerType;
        if (e.type != "mousedown" && e.type != "mouseup") {
            copyObject(e, e.originalEvent);
        }
        if (pointerType == "touch")
            e.button = undefined;
        return e;
    }
    function _getOptions(e, _details, _startevent) {
        var _distance, _time, _scale, _iDelta = {}, _startXY, _endXY;
        if (_startevent) {
            var coor;
            if (!_startevent.originalEvent.touches) coor = [_startevent.originalEvent, e.originalEvent];
            else coor = [_startevent.originalEvent.touches[0], e.originalEvent.changedTouches[0]];

            if (_details._isSwipe || _details._isdrag) {
                _distance = $.event.special.pinch._getdistance(coor[0], coor[1]);
                _time = _details.time;
                _endXY = { pageX: _details.stopPoint.pageX, pageY: _details.stopPoint.pageY };
            }
            else if (_details._isPinch) {
                _distance = $.event.special.pinch.distance(e);
                _time = e.timeStamp - _startevent.timeStamp;
                _scale = _details._pinchDistance;
            }
            if (_details._isDelta) {
                _iDelta._dTime = e.timeStamp - _startevent.timeStamp;
                _iDelta._x = coor[1].pageX - coor[0].pageX;
                _iDelta._y = coor[1].pageY - coor[0].pageY;
            }
        }

        return {
            options: e,
            delta: {
                time: _iDelta._dTime || null,
                X: _iDelta._x || null,
                Y: _iDelta._y || null
            },
            distance: _distance,
            scale: _details._isPinch ? _scale : null,
            time: _time,
            velocity: {
                XY: _distance / _iDelta._dTime || null,
                X: _iDelta._x / _iDelta._dTime || null,
                Y: _iDelta._y / _iDelta._dTime || null
            },
            currentPosition: { pageX: _endXY ? _endXY.pageX : null, pageY: _endXY ? _endXY.pageY : null }
        };
    }

    function getTimeSpan() {
        var now = new Date();
        return now.getTime();
    }
    function checkMsieTouch($this) {
        if (isPointer)
            $this.css("-ms-touch-action", "pinch-zoom").css("touch-action", "pinch-zoom");
    }

    $.each({
        scrollstop: "scrollstart",
        doubletap: "tap",
        taphold: "tap",
        swipeleft: "swipe",
        swiperight: "swipe",
        swipedown: "swipeupdown",
        swipeup: "swipeupdown",
        pinchin: "pinch",
        pinchout: "pinch",
        pinchstop: "pinch"
    }, function (event, sourceEvent) {

        $.event.special[event] = {
            setup: function () {
                $(this).on(sourceEvent, $.noop);
            }
        };
    });

})(jQuery);;