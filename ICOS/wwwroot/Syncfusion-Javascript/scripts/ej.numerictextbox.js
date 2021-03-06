/*!
*  filename: ej.numerictextbox.js
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
* @fileOverview Plugin to style the Html input elements
* @copyright Copyright Syncfusion Inc. 2001 - 2015. All rights reserved.
*  Use of this code is subject to the terms of our license.
*  A copy of the current license can be obtained at any time by e-mailing
*  licensing@syncfusion.com. Any infringement will be prosecuted under
*  applicable laws. 
* @version 12.1 
* @author <a href="mailto:licensing@syncfusion.com">Syncfusion Inc</a>
*/
(function ($, ej, undefined) {

    ej.widget(
    {
        "ejNumericTextbox": ["ej.NumericTextbox", "e-numerictextbox"],
        "ejPercentageTextbox": ["ej.PercentageTextbox", "e-percentagetextbox"],
        "ejCurrencyTextbox": ["ej.CurrencyTextbox", "e-currencytextbox"]
    },
    {
        element: null,

        model: null,
        validTags: ["input"],
        _addToPersist: ["value"],
        _setFirst: false,
        type: "editor",
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions'],
            requireFormatters: true,
            requireParser:true
        },

        defaults: {

            width: "",

            height: "",

            value: null,

            name: null,

            htmlAttributes: {},

            minValue: -(Number.MAX_VALUE),

            maxValue: Number.MAX_VALUE,

            incrementStep: 1,

            decimalPlaces: 0,

            validateOnType: false,

            cssClass: "",

            enablePersistence: false,

            showSpinButton: true,

            locale: "en-US",

            enableStrictMode: false,

            showRoundedCorner: false,

            readOnly: false,

            enabled: true,

            enableRTL: false,

            watermarkText: "Enter value",

            validationRules: null,

            validationMessage: null,

            groupSeparator: null,

            groupSize: null,

            positivePattern: null,

            currencySymbol:null,

            negativePattern: null,

            change: null,

            focusIn: null,

            focusOut: null,

            create: null,

            destroy: null
        },

        dataTypes: {
            minValue: "number",
            maxValue: "number",
            incrementStep: "number",
            decimalPlaces: "number",
            showSpinButton: "boolean",
            enableStrictMode: "boolean",
            showRoundedCorner: "boolean",
            enableRTL: "boolean",
            locale: "string",
            watermarkText: "string",
            cssClass: "string",
            readOnly: "boolean",
            enabled: "boolean",
            validationRules: "data",
            validationMessage: "data",
            htmlAttributes: "data",
            validateOnType: "boolean",
            groupSeparator: "string"
        },
        observables: ["value"],

        _setModel: function (jsondata) {
            var validate = false;
            for (var key in jsondata) {
                switch (key) {
                    case "value":
                        if (ej.isNullOrUndefined(jsondata["minValue"]) && ej.isNullOrUndefined(jsondata["maxValue"])) {
                            this._setValue(jsondata[key], true);
                            jsondata[key] = this.model.value;
                        }
                        else {
                            this.model.value = this._checkNumValue(jsondata[key]);
                            this._localizedFormat();
                            this._raiseChangeEvent(true);
                            validate = true;
                        }
                        break;
                    case "enableRTL": this._enableRTL(jsondata[key]); break;
                    case "width": this._setWidth(jsondata[key]); break;
                    case "height": this._setHeight(jsondata[key]); break;
                    case "validationRules":
                        if (this.model.validationRules != null) {
                            this.element.rules('remove');
                            this.model.validationMessage = null;
                        }
                        this.model.validationRules = jsondata[key];
                        if (this.model.validationRules != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "validationMessage":
                        this.model.validationMessage = jsondata[key];
                        if (this.model.validationRules != null && this.model.validationMessage != null) {
                            this._initValidator();
                            this._setValidation();
                        }
                        break;
                    case "minValue":
                        if (isNaN(jsondata[key])) return;
                        this.model.minValue = (this.model.decimalPlaces == -1) ? jsondata[key] : parseFloat(jsondata[key].toFixed(this.model.decimalPlaces));
                        validate = true;
                        break;
                    case "maxValue":
                        if (isNaN(jsondata[key])) return;
                        this.model.maxValue = (this.model.decimalPlaces == -1) ? jsondata[key] : parseFloat(jsondata[key].toFixed(this.model.decimalPlaces));
                        validate = true;
                        break;
                    case "incrementStep":
                        if (isNaN(jsondata[key])) return;
                        this.model.incrementStep = (this.model.decimalPlaces == -1) ? jsondata[key] : parseFloat(jsondata[key].toFixed(this.model.decimalPlaces));
                        break;
                    case "enableStrictMode": this.model.enableStrictMode = jsondata[key]; break;
                    case "showSpinButton": this._showSpin(jsondata[key]); break;
                    case "showRoundedCorner": this._roundedCorner(jsondata[key]); break;
                    case "locale":                        
                        this.model.decimalPlaces = ((ej.isNullOrUndefined(this._options.decimalPlaces)) && (this.model.decimalPlaces === this.culture.numberFormat.decimals))
                           ? -1 : (this._options.decimalPlaces === -1) ? -1 : this.model.decimalPlaces;
                        this._setLocalize(jsondata[key]);
                        this._options.decimalPlaces = this.model.decimalPlaces;
						jsondata[key] = this.model.locale;
						break;
                    case "decimalPlaces":
                        this._setDecimal(jsondata[key]);
                        if (ej.isNullOrUndefined(this._options)) this._options = {};
                        this._options["decimalPlaces"] = jsondata[key];
                        break;
                    case "cssClass": this._setSkin(jsondata[key]); break;
                    case "readOnly": this._setReadOnly(jsondata[key]); break;
                    case "enabled": if (jsondata[key]) this.enable(); else this.disable(); break;
                    case "watermarkText":
                        if(!ej.isNullOrUndefined(this._options)) this._options = [];
                        this._options["watermarkText"] = this.model.watermarkText = jsondata[key];
                        this._localizedLabels.watermarkText = this.model.watermarkText;						
						this._changeWatermark(jsondata[key]);
						break;
                    case "htmlAttributes": this._addAttr(jsondata[key]); break;
                    case "groupSeparator":
                        this._checkSeparator(jsondata[key]);
                        jsondata[key] = this.model.groupSeparator;
                        break;
                    case "positivePattern":
                    case "negativePattern":
                    case "groupSize":
                    case "currencySymbol":
                        this.model[key] = jsondata[key];
                        this._options[key] = jsondata[key];
                        this._initCustomValue();
                        jsondata[key] = this.model[key];
                        this._setValue(this.model.value, true);
                        break;                    
                }
            }
            if (validate) {
                this._validateMinMaxValue(true, true);
                jsondata["value"] = this.model.value;
                jsondata["maxValue"] = this.model.maxValue;
                jsondata["minValue"] = this.model.minValue;
                if (this.model.minValue != -(Number.MAX_VALUE)) this._startValue = this.model.minValue;
				this.wrapper.attr({ 'aria-valuemin': this.model.minValue, 'aria-valuemax': this.model.maxValue, 'aria-valuenow': this.model.value });
            }
            this._checkSeparator(this.model.groupSeparator);
            this.element.val(this._removeSeparator(this.model.value));
            this._updateSeparator();
            this._checkErrorClass();
        },


        _destroy: function () {
            if (this.wrapper) {
                this.element.insertBefore(this.wrapper);
                this.wrapper.remove();
            }
            if (this._isWatermark) this.element.removeAttr("placeholder");
            this.element.val("").removeClass('e-input e-disable').empty();
            this.element.removeAttr('disabled aria-disabled');
			this.wrapper.removeAttr('aria-valuemin aria-valuemax aria-valuenow aria-live');
            if (!(this._cloneElement).attr('role')) this.element.removeAttr('role');
            this.element.css("display", "block");
        },



        _init: function (options) {
            this._cloneElement = this.element.clone();
            this._options = ej.isNullOrUndefined(options) ? {} :options;
            if (this.element.is("input") && (this.element.is("input[type=text]") || this.element.is("input[type=number]") || !this.element.attr('type'))) {
                if(this.model.decimalPlaces > 0){
                    this.element[0].type = "text";
                }
                this._isWatermark = 'placeholder' in document.createElement('input');
                this.model.locale = ej.preferredCulture(this.model.locale).name == "en" ? "en-US" : ej.preferredCulture(this.model.locale).name;
                this._localizedLabels = this._getLocalizedLabels();
                this.culture = ej.preferredCulture(this.model.locale);
                this._browsername = ej.browserInfo().name;
                this._initCustomValue();
                this._prevSeparator = null;
                this._checkSeparator(this.model.groupSeparator);
                this._checkAttribute();
                this._renderControl();
                this._setValues();
                this._wireEvents();
                this._initObjects();
                this._addAttr(this.model.htmlAttributes);
                if (this.model.validationRules != null) {
                    this._initValidator();
                    this._setValidation();
                }
                this._updateSeparator();
                if (options && options.value != undefined) {
                    this._trigger("_change", { value: this.model.value });
                }
            }
            else {
                this._destroy();
                return false;
            }
        },
		
        _checkAttribute: function () {
            var attr = ["min", "max", "step", "readonly", "disabled", "placeholder"], propName = ["minValue", "maxValue", "incrementStep", "readOnly", "enabled", "watermarkText"], value, propValue;
            for (var i = 0; i < attr.length; i++) {
                value = this.element.attr(attr[i]); propValue = propName[i];
                if ((!ej.isNullOrUndefined(value)) && !ej.isNullOrUndefined(this._options) && (ej.isNullOrUndefined(this._options[propValue]))) {
                    if (propValue == "watermarkText") this._options[propValue] = value;
                    else this.model[propValue] = ((propValue != "disabled") && (propValue != "readOnly")) ? ej.parseFloat(value, this.model.locale) : propValue == "readOnly" ? this.element.is("[readonly]") : !this.element.is("[disabled]");
                }
            }
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
                var keyName = key.toLowerCase();
                if (keyName == "class") proxy.wrapper.addClass(value);
                else if (keyName == "accesskey") proxy._hiddenInput.attr(key, value);
                else if (keyName == "disabled" && value == "disabled") proxy.disable();
                else if (keyName == "readonly" && value == "readOnly") proxy._setReadOnly(true);
                else if (keyName == "tabindex") {
                    proxy._hiddenInput.attr(key, value);
                    proxy.element.attr(key, value);
                }
                else if (keyName == "style" || keyName == "id") proxy.wrapper.attr(key, value);
                else if (ej.isValidAttr(proxy.element[0], key)) proxy.element.attr(key, value);
                else proxy.wrapper.attr(key, value);
            });
        },

        _setValues: function () {
            this._id = this.element[0].id;
            this._textBox = this._hiddenInput[0];
            this._error = false;
            this._timeout = null;
            this.isValidState = true;
            this._allowkeyboard = true;
            this._validateOnType = false;
            this._focused = false;
            this._startValue = 0;
            if (this.sfType === "ej.CurrencyTextbox" && this.model.minValue == -(Number.MAX_VALUE))
                this.model.minValue = 0;
            if (ej.isNullOrUndefined(this.model.decimalPlaces)) {
                if (this.sfType === "ej.CurrencyTextbox")
                    this.model.decimalPlaces = ej.preferredCulture(this.model.locale).numberFormat.currency.decimals;
                else this.model.decimalPlaces = ej.preferredCulture(this.model.locale).numberFormat.decimals;

            }
            if (this.model.decimalPlaces >= 0) {
                this.model.minValue = parseFloat(this.model.minValue.toFixed(this.model.decimalPlaces));
                this.model.maxValue = parseFloat(this.model.maxValue.toFixed(this.model.decimalPlaces));
            }
            if (this.model.minValue != -(Number.MAX_VALUE)) this._startValue = this.model.minValue;
			if (!ej.isNullOrUndefined(this._options)) {
                if (!ej.isNullOrUndefined(this._options.watermarkText))
                    this._localizedLabels.watermarkText = this._options.watermarkText;
                
            }
            this._localizedLabelToModel();
            this._localizedFormat();
            this._validateMinMaxValue(true);
            this._updateSymbol(this.model.locale);
            var value;
            if (ej.isNullOrUndefined(this.model.value)) {
                value = this.model.value;
                this.wrapper.removeClass('e-valid');
            }
            else {
                value = (this.model.value.toString().indexOf('e') == -1) ? this._removeSeparator(this.model.value) : this._convertToExponetial(this.model.value).unformattedValue;
                this.wrapper.addClass('e-valid');
            }
           this.element.val(value);
        },

        _initValidator: function () {
            (!this.element.closest("form").data("validator")) && this.element.closest("form").validate();
        },
        _setValidation: function () {
            var rules = this.model.validationRules;
            this.element.rules("add", rules);
            var validator = this.element.closest("form").data("validator");
            validator = validator ? validator : this.element.closest("form").validate();
            name = this.element.attr("name");
            validator.settings.messages[name] = {};
            for (var ruleName in rules) {
                var message = null;
                if (!ej.isNullOrUndefined(rules[ruleName])) {
                    if (!ej.isNullOrUndefined(rules["messages"] && rules["messages"][ruleName]))
                        message = rules["messages"][ruleName];
                    else {
                        validator.settings.messages[name][ruleName] = $.validator.messages[ruleName];
                        for (var msgName in this.model.validationMessage)
                            ruleName == msgName ? (message = this.model.validationMessage[ruleName]) : "";
                    }
                    validator.settings.messages[name][ruleName] = message != null ? message : $.validator.messages[ruleName];
                }
            }
        },


        _renderControl: function () {
            this.wrapper = ej.buildTag("span.e-widget e-pinch");
            this.innerWrap = ej.buildTag("span.e-in-wrap e-box ");
            this.wrapper.attr("style", this.element.attr("style"));
            if (this.sfType === "ej.NumericTextbox")
                this.wrapper.addClass('e-numeric');
            else if (this.sfType === "ej.PercentageTextbox")
                this.wrapper.addClass('e-percent');
            else if (this.sfType === "ej.CurrencyTextbox")
                this.wrapper.addClass('e-currency');
            this.wrapper.append(this.innerWrap).insertAfter(this.element);
            this.innerWrap.append(this.element);
            this._hiddenInput = ej.buildTag("input", "", {}, { type: "text" }).insertBefore(this.element);
            this._hiddenInput.attr('data-role', 'none');

            this._hiddenInput[0].tabIndex = this.element[0].tabIndex;
            this._hiddenInput.attr("accesskey", this.element[0].accessKey);
            this.element[0].accessKey = "";

            this._hiddenInput.css("display", "block");
            this.element.css("display", "none");
            if (!this._isWatermark) {
                this._hiddenSpan = ej.buildTag("span.e-input e-placeholder ").insertAfter(this.element);
                this._hiddenSpan.text(this._localizedLabels.watermarkText);
                this._hiddenSpan.css("display", "none");
                this._on(this._hiddenSpan,"mousedown", this._focusIn);
                this._on(this._hiddenSpan,'mousewheel', this._mouseWheel);
                this._on(this._hiddenSpan,'DOMMouseScroll',this._mouseWheel);
            }
            this.model.name = this.element.attr("name") != null ? this.element.attr("name") : (this.model.name != null ? this.model.name : this.element[0].id);
            this.element.attr("name") == null ? this.element.attr("name", this.model.name) : "";
            this.element.addClass('e-input');
            if (ej.isNullOrUndefined(this.model.value) && this.element[0].value != "") {
                if (ej.preferredCulture(this.model.locale).numberFormat[','] == ".")
                    this.element[0].value = this.element[0].value.replace(".", ",");
                this.model.value = this._checkNumValue(this.element[0].value);
            }   
            else {
                if (typeof this.model.value== "string" && ej.preferredCulture(this.model.locale).numberFormat[','] == ".")
                    this.model.value = this.model.value.replace(".", ",");
                this.model.value = this._checkNumValue(this.model.value);
            }
            this._hiddenInput.attr({ 'value': this.model.value }).addClass('e-input');
			this.wrapper.attr({'role': 'spinbutton', 'aria-valuemin': this.model.minValue, 'aria-valuemax': this.model.maxValue, 'aria-valuenow': this.model.value,});
            this.element.attr({'aria-live': 'assertive', "value": this.model.value });
            var spinbutton = $('<span class="e-select"><span class="e-spin e-spin-up " role="button" aria-label="Increase Value" unselectable="on" /><span class="e-spin e-spin-down" role="button" aria-label="Decrease Value" unselectable="on" /></span>');
            spinbutton.find('.e-spin-up').append(ej.buildTag('span.e-icon e-arrow e-arrow-sans-up').attr({ 'role': 'presentation', 'unselectable': 'on' }));
            spinbutton.find('.e-spin-down').append(ej.buildTag('span.e-icon e-arrow e-arrow-sans-down').attr({ 'role': 'presentation', 'unselectable': 'on' }));
            this.innerWrap.append(spinbutton);
            this.spin = this.wrapper.find('.e-select');
            this.spinUp = this.wrapper.find('.e-spin-up');
            this.spinDown = this.wrapper.find('.e-spin-down');
            this._setWidth(this.model.width);
            this._setHeight(this.model.height);
            if (this.model.cssClass != "") this._setSkin(this.model.cssClass);
            this._showSpin(this.model.showSpinButton);
            if (this.model.showRoundedCorner) this._roundedCorner(this.model.showRoundedCorner);
            if (this.model.enableRTL) this._enableRTL(this.model.enableRTL);
            if (this.model.readOnly) this._setReadOnly(this.model.readOnly);
            if (!this.model.enabled) this.disable();
            else if (this.model.enabled && this.element.hasClass("e-disable")) this.enable();
        },


        _initObjects: function () {
            this._preVal = this.model.value;
            if (this.model.value === null) {
                this.isValidState = true;
                this._hiddenInput.val(null);
            }
            else if ((this.model.value < this.model.minValue) || (this.model.value > this.model.maxValue))
                this.isValidState = false;
            this._checkErrorClass();
            this._setWaterMark();
        },


        _showSpin: function (value) {
            if (!value) {
                if (this.spin) {
                    this.spin.hide();
                    this.innerWrap.removeClass('e-padding');
                }
                this._spinEvents("_off");
            }
            else {
                if (this.spin) {
                    this.spin.show();
                    this.innerWrap.addClass('e-padding');
                }
                this._spinEvents("_on");
            }
        },


        _roundedCorner: function (value) {
            if (value && !this.innerWrap.hasClass('e-corner')) {
                this.innerWrap.addClass('e-corner');
            } else if (this.innerWrap.hasClass('e-corner')) {
                this.innerWrap.removeClass('e-corner');
            }
        },


        _enableRTL: function (enableRTL) {
            if (enableRTL) {
                if (this.spin) {
                    this.wrapper.addClass("e-rtl");
                }
                else this.element.addClass("e-rtl");
            }
            else {
                if (this.spin) {
                    this.wrapper.removeClass("e-rtl");
                }
                else this.element.removeClass("e-rtl");
            }
        },


        _setWidth: function (value) {
            value != "" ? this.wrapper.width(value) : this.model.width = this.wrapper.outerWidth();
        },


        _setHeight: function (value) {
            value != "" ? this.wrapper.height(value) : this.model.height = this.wrapper.outerHeight();
        },


        _setSkin: function (skin) {
            this.wrapper.removeClass(this.model.cssClass);
            this.wrapper.addClass(skin);
        },


        _setValue: function (value, isCode) {
            if (!this._isWatermark)
                this._hiddenSpan.css("display", "none");
            this.model.value = this._checkNumValue(value);
            this._validateMinMaxValue(false);
            this._checkErrorClass();
            this._localizedFormat();
            this._raiseChangeEvent(isCode);
            this._setWaterMark();
        },

        _setLocalize: function (val) {
            var prevSeparator = ej.preferredCulture(this.model.locale).numberFormat[',']
            this.model.locale = ej.preferredCulture(val).name == "en" ? "en-US" : ej.preferredCulture(val).name;
            this.model.groupSeparator = ((ej.isNullOrUndefined(this._options.groupSeparator) && (prevSeparator === this.model.groupSeparator))) ?
                ej.preferredCulture(this.model.locale).numberFormat[','] : this.model.groupSeparator;
			this._localizedLabels = this._getLocalizedLabels();
            if (!ej.isNullOrUndefined(this._options)) {
                if (!ej.isNullOrUndefined(this._options.watermarkText))
                    this._localizedLabels.watermarkText = this._options.watermarkText;
            }
            this._localizedLabelToModel();
            this.culture = ej.preferredCulture(this.model.locale);
            this._initCustomValue();
            this._updateSymbol(this.model.locale);
            this._localizedFormat();
            this._changeWatermark(this.model.watermarkText);
            if (ej.isNullOrUndefined(this.model.value)) value = this.model.value;
            else value = (this.model.value.toString().indexOf('e') == -1) ? this._formatValue(this.model.value, "n",true) : this._convertToExponetial(this.model.value).unformattedValue;
            this.element.val(value);
			
        },
		 _localizedLabelToModel: function () {
            this.model.watermarkText = this._localizedLabels.watermarkText;
            
        },
        _updateSymbol: function (locale) {
            this._percentSymbol = ej.preferredCulture(locale).numberFormat.percent.symbol;
            this._currencySymbol = ej.preferredCulture(locale).numberFormat.currency.symbol;
        },

        _setDecimal: function (val) {
            this.model.decimalPlaces = val;
            this._localizedFormat();
        },


        _validateMinMaxValue: function (fromMinMax, isCode) {
            var valChange = false, value;
            if (this.model.minValue > this.model.maxValue) this.model.minValue = this.model.maxValue;
            if (!ej.isNullOrUndefined(this.model.value) && this.model.minValue > this.model.value) {
                if (this.model.enableStrictMode != true) {
                    this.isValidState = true;
                    this._startValue = this.model.value = this.model.minValue;
                }
                else this.isValidState = false;
                valChange = true;
            }
            else if (!ej.isNullOrUndefined(this.model.value) && this.model.maxValue < this.model.value) {
                if (this.model.enableStrictMode != true) {
                    this.isValidState = true;
                    this.model.value = this.model.maxValue;
                }
                else this.isValidState = false;
                valChange = true;
            }
            else this.isValidState = true;
            if (this.model.minValue == this.model.maxValue) this._startValue = this.model.minValue;
            if ((valChange && fromMinMax)) {
                value = this._formatValue(this.model.value, "n", true);
                this._hiddenInput.val(value);
                if (ej.isNullOrUndefined(this.model.value)) value = this.model.value;
                else value = (this.model.value.toString().indexOf('e') == -1) ? this._formatValue(this.model.value, "n", true) : this._convertToExponetial(this.model.value).unformattedValue;
                this.element.val(value);
                this._localizedFormat();
                this._raiseChangeEvent(isCode);
            }
        },

        _convertToExponetial: function (value) {
            var number = "", pattern, format;
            var negative = value < 0 ? true : false;
            value = value.toString();
            format = ej.preferredCulture(this.model.locale).numberFormat;
            value = value.replace(".", format["."]);
            unformattedValue = value;
            var length = null;
            if (this.sfType === "ej.NumericTextbox") {
                pattern = negative ? format.pattern[0] : ej.isNullOrUndefined(format.pattern[1]) ? "n" : format.pattern[1];
                value = negative ? value.replace("-", "") : value;
                symbol = "";
            }
            else if (this.sfType === "ej.PercentageTextbox") {
                pattern = negative ? format.percent.pattern[0] : format.percent.pattern[1];
                value = negative ? value.replace("-", "") : value;
                symbol = format.percent.symbol;
            }
            else if (this.sfType === "ej.CurrencyTextbox") {
                pattern = negative ? format.currency.pattern[0] : format.currency.pattern[1];
                value = negative ? value.replace("-", "") : value;
                symbol = format.currency.symbol;
            }
            for (idx = 0, length = pattern.length; idx < length; idx++) {
                ch = pattern.charAt(idx);
                (ch === "n") ? number += value : (ch === "$" || ch === "%") ? number += symbol : number += ch;
            }
            return { formattedValue: number, unformattedValue: unformattedValue }
        },

        _localizedFormat: function () {
            this.culture = ej.preferredCulture(this.model.locale);
            this._decimalSep = ej.preferredCulture(this.model.locale).numberFormat['.'];
            if (ej.isNullOrUndefined(this.model.value)) {
                this._textBox.value = "";
                return;
            }
            if (this.model.value.toString().indexOf('e') == -1) {
                this._textBox.value = this._removeSeparator(this.model.value)
                if (!this._focused && this._textBox.value != "") {
                    this._textBox.value = this._formatValue(this.model.value, "n", true);
					
                    if (this.sfType === "ej.PercentageTextbox") this._appendPercentSymbol(this._textBox.value);
                    else if (this.sfType === "ej.CurrencyTextbox") this._appendCurrencySymbol(this._textBox.value);


                    var symbolIndex = (this.sfType === "ej.CurrencyTextbox") ? this._textBox.value.indexOf(this._currencySymbol) : (this.sfType === "ej.PercentageTextbox") ? this._textBox.value.indexOf(this._percentSymbol) : -1;

                    if (this.model.decimalPlaces == -1) {
                        this._textBox.value = this._textBox.value.substr(0, this._textBox.value.lastIndexOf(this._decimalSep));
                        if (symbolIndex > 1 && (ej.isNullOrUndefined(this._afterDec) || this._afterDec == "")) {
                            if (this.sfType === "ej.CurrencyTextbox")
                                this._textBox.value = this._textBox.value + " " + this._currencySymbol;
                            if (this.sfType === "ej.PercentageTextbox")
                                this._textBox.value = this._textBox.value + " " + this._percentSymbol;
                        }
                        if (this.model.decimalPlaces == -1 && !ej.isNullOrUndefined(this._afterDec) && this._afterDec != "") {
                            var index = this._textBox.value.lastIndexOf(this._decimalSep);
                            if (index >= 0) {
                                this._textBox.value = this._textBox.value.substr(0, index);
                            }
                            var symbolPos = this._afterDec;
                            if (symbolIndex > 1) {
                                if (this.sfType === "ej.CurrencyTextbox")
                                    symbolPos = symbolPos + " " + this._currencySymbol;
                                if (this.sfType === "ej.PercentageTextbox")
                                    symbolPos = symbolPos + " " + this._percentSymbol;

                            }
                            this._textBox.value = this._textBox.value + this._decimalSep + symbolPos;
                        }
                    }
                }
                else {
                    var value = this._convertToExponetial(this.model.value);
                    this._textBox.value = value.unformattedValue;
                    if (!this._focused && this._textBox.value != "")
                        this._textBox.value = value.formattedValue;
                }
            }
        },

        _checkNumValue: function (value) {
            if (typeof value == "string")
                value = !this._changeSeparator ? value : this._replaceSeparator(value, this.model.groupSeparator, ej.preferredCulture(this.model.locale).numberFormat[',']);
            if (typeof value == "string" && !isNaN(this._parseValue(value))) {
                value = this._parseValue(value);
                return parseFloat(value);
            }
            else if ((typeof value == "number") && !isNaN(value))
                return value;
            else return null;
        },


        _setReadOnly: function (bool) {
            this.model.readOnly = bool;
            if (bool) {
                this.element.attr("readonly", true);
                this._hiddenInput.attr("readonly", true);
            }
            else {
                this.element.prop("readonly",false);
                this._hiddenInput.prop("readonly",false);
            }
        },


        _setWaterMark: function () {
            if ((this._localizedLabels.watermarkText != null) && (this._textBox.value === "") && $.trim(this._hiddenInput.val()) === "") {
                if (this._isWatermark) {
                    this._hiddenInput.attr("placeholder", this._localizedLabels.watermarkText);
                    this.element.attr("placeholder", this._localizedLabels.watermarkText);
                }
                else
                    this._hiddenSpan.css("display", "block").text(this._localizedLabels.watermarkText);
            }
        },


        _changeWatermark: function (text) {
            if (!this.model.enabled) return false;
            if (this._isWatermark) {
                this._hiddenInput.attr("placeholder", text);
                this.element.attr("placeholder", text);
            }
            else this._hiddenSpan.text(text);
        },


        _setSelectionRange: function (selectionStart, selectionEnd) {
            var input = this._textBox;
            try {
                if (input.setSelectionRange) {
                    if (this._browsername == "edge")  setTimeout(function () { input.setSelectionRange(selectionStart, selectionEnd) })
                    else input.setSelectionRange(selectionStart, selectionEnd);
                }
                else if (input.createTextRange) {
                    var range = input.createTextRange();
                    _setselction(range);
                }
            }
            catch (e) {
                var control = this;
                window.setTimeout(function () {
                    document.body.focus();
                    control._textBox.select();
                    if (document.selection) {
                        var range = document.selection.createRange();
                        _setselction(range);
                    }
                }, 1);
            }
            function _setselction(range) {
                range.collapse(true);
                range.moveEnd('character', selectionEnd);
                range.moveStart('character', selectionStart);
                range.select();
            }
        },


        _getSelection: function (value) {
            if (this._textBox.type != "number") {
                var oSel = null;
                if (document.selection) {
                    oSel = document.selection.createRange();
                    return (oSel.text === "" ? oSel.text : this._removeFormats(oSel.text));
                }
                else {
                    if (value == null)
                        return this.model.value;
                    else {
                        oSel = this._removeFormats(value.substring(this._textBox.selectionStart, this._textBox.selectionEnd));
                        return oSel;
                    }
                }
            }
        },


        _caretPosition: function () {
            var oField = this._textBox;
            var iCaretPos = 0;
            // IE Support
            if (oField.type != "number") {
                if (document.selection) {
                    oField.focus();
                    // To get cursor position, get empty selection range
                    var oSel = document.selection.createRange();
                    // Move selection start to 0 position
                    oSel.moveStart('character', -oField.value.length);
                    // The caret position is selection length
                    iCaretPos = oSel.text.length;
                }
                    // Firefox support
                else if (oField.selectionStart || oField.selectionStart == '0')
                    iCaretPos = oField.selectionEnd;
                return (iCaretPos);
            }  
        },


        _appendPercentSymbol: function (value) {
            if (this._percentSymbol) value = value.replace(this._percentSymbol, "");
            if (value.indexOf(ej.preferredCulture(this.model.locale).numberFormat.percent.symbol) < 0)
                this._textBox.value = this._formatValue(this._parseValue(value) / 100, "p", true);
            this._percentSymbol = ej.preferredCulture(this.model.locale).numberFormat.percent.symbol;
        },

        _appendCurrencySymbol: function (value) {
            if (this._currencySymbol) value = value.replace(this._currencySymbol, "");
            if (value.indexOf(ej.preferredCulture(this.model.locale).numberFormat.currency.symbol) < 0)
                this._textBox.value = this._formatValue(this._parseValue(value), "c", true);
            this._currencySymbol = ej.preferredCulture(this.model.locale).numberFormat.currency.symbol;

        },

        _removeFormats: function (val) {
            var grpSep = ej.preferredCulture(this.model.locale).numberFormat[","];
            if (val != null) {
                if (grpSep == ".")
                    return (val.toString().replace(/["."]/g, ""));
                else if (val.toString().match(new RegExp(grpSep, "g")))
                    return (val.toString().replace(new RegExp(grpSep, "g"), ""));
                else
                    return val;
            }
            else
                return null;
        },


        _checkErrorClass: function (obj) {
            if (this.isValidState) this.wrapper.removeClass("e-error");
            else this.wrapper.addClass("e-error");
        },
		


        enable: function () {
            this.model.enabled = true;
            this.element[0].disabled = false;
            this.element.prop("disabled",false);
            this._hiddenInput.prop("disabled", false);
            this.element.removeClass('e-disable').attr({ "aria-disabled": false });
            this._hiddenInput.removeClass('e-disable').attr({ "aria-disabled": false });
            this.wrapper.find(".e-select").removeClass('e-disable').attr({ "aria-disabled": false });
            this.wrapper.find(".e-select span.e-icon.e-arrow").removeClass('e-disable');
            this.wrapper.removeClass('e-disable-wrap');
        },


        disable: function () {
            this.model.enabled = false;
            this.element[0].disabled = true;
            this.element.attr("disabled", "disabled");
            this._hiddenInput.attr("disabled", "disabled");
            this.element.addClass('e-disable').attr({ "aria-disabled": true });
            this._hiddenInput.addClass('e-disable').attr({ "aria-disabled": true });
            this.wrapper.find(".e-select").addClass('e-disable').attr({ "aria-disabled": true });
            this.wrapper.find(".e-select span.e-icon.e-arrow").addClass('e-disable');
            this.wrapper.addClass('e-disable-wrap');
        },


        getValue: function () {
            return this.model.value;
        },

        _wireEvents: function () {
            this._on(this._hiddenInput, 'focus', this._focusIn);
            this._on(this.element, 'paste', this._paste);
            this._on(this.element, 'blur', this._focusOut);
            this._on(this.element, 'keydown', this._keyDown);
            this._on(this.element, 'keypress', this._keyPress);
            this._on(this.element, 'mousewheel', this._mouseWheel);
            this._on(this.element, 'DOMMouseScroll', this._mouseWheel);
        },

        _spinEvents: function (action) {
            this[action](this.spinUp, "mousedown mouseup touchstart touchend", this._spinUpClick);
            this[action](this.spinDown, "mousedown mouseup touchstart touchend", this._spinDownClick);
        },

        _isIE8: function () {
            var _ie8 = false, browserInfo = ej.browserInfo();
            if (browserInfo.name == 'msie' && browserInfo.version == "8.0") {
                _ie8 = true;
            }
            return _ie8;
        },

        _spinUpClick: function (event) {
            var isNotLeftClick = false;
            if (event.button)
                isNotLeftClick = this._isIE8() ? event.button != 1 : event.button != 0;
            else if (event.which)
                isNotLeftClick = (event.which == 3); //for Opera
            if (isNotLeftClick) return;
            var self = this;
            event.preventDefault();
            clearTimeout(this._timeout);
            if (!this.model.enabled || this.model.readOnly) return;
            this.wrapper.find(".e-animate").removeClass("e-animate");
            this.spinUp.addClass("e-animate");
            this._on(this.spinUp, 'mouseleave', this._mouseUpClick);
            this.spinUp.addClass("e-active");
            var self = this;
            if (event.type == "mouseup"|| event.type == "touchend") {
                this._updateInputField("increment");
                this.spinUp.removeClass("e-active");
                this._off($(document), 'mouseup', this._mouseUpClick);
            }
            else if (event.type == "mousedown"|| event.type == "touchstart") {
                if (!this._focused) this._hiddenInput[0].focus();
                this._timeout = setInterval(function () {
                    self._updateInputField("increment");
                }, 150);
                this._on($(document), 'mouseup', this._mouseUpClick);
            }
        },

        _spinDownClick: function (event) {
            var isNotLeftClick = false;
            if (event.button)
                isNotLeftClick = this._isIE8() ? event.button != 1 : event.button != 0;
            else if (event.which)
                isNotLeftClick = (event.which == 3); //for Opera
            if (isNotLeftClick) return;
            var self = this;
            event.preventDefault();
            clearTimeout(this._timeout);
            if (!this.model.enabled || this.model.readOnly) return;
            this.wrapper.find(".e-animate").removeClass("e-animate");
            this.spinDown.addClass("e-animate");
            this._on(this.spinDown, 'mouseleave', this._mouseUpClick);
            this.spinDown.addClass("e-active");
            if (event.type == "mouseup"|| event.type == "touchend") {
                this._updateInputField("decrement");
                this.spinDown.removeClass("e-active");
                this._off($(document), 'mouseup', this._mouseUpClick);
            }
            else if (event.type == "mousedown"|| event.type == "touchstart") {
                if (!this._focused) this._hiddenInput[0].focus()
                this._timeout = setInterval(function () {
                    self._updateInputField("decrement");
                }, 150);
                this._on($(document), 'mouseup', this._mouseUpClick);
            }
        },

        _mouseUpClick: function (event) {
            event.stopPropagation();
            clearTimeout(this._timeout);
            this._off(this.spinUp, 'mouseleave', this._mouseUpClick);
            this._off(this.spinDown, 'mouseleave', this._mouseUpClick);
            this.spinDown.removeClass("e-active");
            this.spinUp.removeClass("e-active");
        },

        _mouseWheel: function (event) {
            event.preventDefault();
            if (!this._focused) this.element[0].focus();
            if (!this.model.enabled || this.model.readOnly) return;
            var delta;
            var rawEvent = event.originalEvent;
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
                this._updateInputField("increment");
            else if (delta < 0)
                this._updateInputField("decrement");
            this._cancelEvent(event);
        },


        _numberValue: function () {
            var value = this._textBox.value;
            if (this.sfType === "ej.NumericTextbox")
                value = this._formatValue(this.model.value, "n", true);
            if (this.sfType === "ej.PercentageTextbox")
                value = this._formatValue(this.model.value, "n", true);
            else if (this.sfType === "ej.CurrencyTextbox")
                value = this._formatValue(this.model.value, "n", true);
            value = (typeof value == "string" && !isNaN(this._parseValue(value))) ? value : "";
            return value;
        },
        _formatValue: function (value, format,flag) {
            if(flag) this._updateCultureInfo();
            var value = ej.format(value, format + this.model.decimalPlaces, this.model.locale);
            if (flag) this._restCultureInfo();
            return value;
        },
        _parseValue: function (value) {
            this._updateCultureInfo();
            var value = ej.parseFloat(value, this.model.locale);
            this._restCultureInfo();
            return value;            
        },

        _initCustomValue: function () {
            var format, ctr = this.sfType == "ej.PercentageTextbox" ? "percent" : this.sfType == "ej.CurrencyTextbox" ? "currency" : "numeric";
            switch (ctr) {
                case "percent":
                case "currency":
                    format = this.culture.numberFormat[ctr];
                    if (ej.isNullOrUndefined(this._options.negativePattern)) this.model.negativePattern = format.pattern[0];
                    if (ej.isNullOrUndefined(this._options.positivePattern)) this.model.positivePattern = format.pattern[1];
                    if (ej.isNullOrUndefined(this._options.currencySymbol) && ctr == "currency") this.model.currencySymbol = format.symbol;
                    if (ej.isNullOrUndefined(this._options.groupSize)) this.model.groupSize = format.groupSizes[0];                    
                    break;
                case "numeric":
                    format = this.culture.numberFormat;
                    if (ej.isNullOrUndefined(this._options.negativePattern)) this.model.negativePattern = format.pattern[0];
                    if (ej.isNullOrUndefined(this._options.positivePattern)) this.model.positivePattern = ej.isNullOrUndefined(format.pattern[1]) ? "n" : format.pattern[1];
                    if (ej.isNullOrUndefined(this._options.groupSize)) this.model.groupSize = format.groupSizes[0];
                    break;
            }
        },

        _updateCultureInfo: function (flag) {
            var format, ctr = this.sfType == "ej.PercentageTextbox" ? "percent" : this.sfType == "ej.CurrencyTextbox" ? "currency" : "numeric";
            format = ctr == "numeric" ? this.culture.numberFormat : this.culture.numberFormat[ctr];
            this._oldNegativePattern = format.pattern[0];
            this._oldGroupSize = format.groupSizes[0];
            format.pattern[0] = this.model.negativePattern;
            format.groupSizes[0] = this.model.groupSize;
            this._oldPositivePattern = format.pattern[1];
            format.pattern[1] = this.model.positivePattern;
            if (ctr == "currency") {
                this._oldcurrencySymbol = format.symbol;
                format.symbol = this.model.currencySymbol;
            }
        },
        _restCultureInfo: function () {
            var format, ctr = this.sfType == "ej.PercentageTextbox" ? "percent" : this.sfType == "ej.CurrencyTextbox" ? "currency" : "numeric";
            format = ctr == "numeric" ? this.culture.numberFormat : this.culture.numberFormat[ctr];
            format.pattern[0] = this._oldNegativePattern;
            format.groupSizes[0] = this._oldGroupSize;
            format.pattern[1] = this._oldPositivePattern;
            if (ctr == "currency")
                format.symbol = this._oldcurrencySymbol;;
        },
        _toggleTextbox: function (toggle) {
            var proxy = this;
            proxy._hiddenInput.toggle(toggle);
            proxy.element.toggle(!toggle);
        },

        _paste: function (event) {
            var text;
            if (window.clipboardData && window.clipboardData.getData) { // IE
                text = window.clipboardData.getData('Text');
            }
            else if (event.originalEvent.clipboardData && event.originalEvent.clipboardData.getData) { // other browsers
                text = event.originalEvent.clipboardData.getData('text/plain');
            }
            var data = ej.parseFloat(text, this.model.locale);
            if (isNaN(data))
                this._cancelEvent(event)
            else {
                this.element.val(data);
                this._cancelEvent(event);
            }
        },
        _focusIn: function (event) {
            if (this.model.readOnly)
                return;
            this._focused = true;
            if(!ej.isNullOrUndefined(this.model.value)) this.element.val(this._removeSeparator(this.model.value));
            this._toggleTextbox(false);
            this._textBox = this.element[0];
            this.element[0].focus();
            this._preVal = this.model.value;
            if (!this._isWatermark)
                this._hiddenSpan.css("display", "none");
            this.wrapper.addClass("e-focus");
            this.wrapper.removeClass('e-error');
            if (!this._error) {
                if (this._textBox.value != "") {
                    var value = this._formatValue(this._textBox.value, "n", true);
                    if (this.model.decimalPlaces == -1) {
                        this._separateValue(this._textBox.value.toString(), true, true);
                        if (!ej.isNullOrUndefined(this._afterDec) && this._afterDec != "")
                            value = this._beforeDec + this._decimalSep + this._afterDec
                    }
                    this._textBox.value = value;
                    this._hiddenInput.val(value);
                }
                this._setSelectionRange(0, this._textBox.value.length);
            }
            this._trigger("focusIn", { value: this.model.value });
        },

        _separateValue: function (value, isDecimal, isgroupSep) {
            var index = (!isDecimal) ? value.lastIndexOf(".") : value.lastIndexOf(this._decimalSep);
            this._beforeDec = (index >= 0) ? value.substr(0, index) : value;
            if (!isDecimal && isgroupSep)
                this._afterDec = (index >= 0) ? value.substr(index + 1) : "";
        },

        _focusOut: function (event) {
            this._focused = false;
            this.wrapper.removeClass("e-focus");
            this._separateValue(this._textBox.value,false,true);
            if (!this._error) {
                if (this._textBox.value != "") {
                    var value = ej.parseFloat(this._textBox.value, this.model.locale);
                    if (value < this.model.minValue) {
                        if (!this.model.enableStrictMode)
                            this._textBox.value = this._formatValue(this.model.minValue, "n", false)
                        else
                            this.isValidState = false
                    }
                    else if (value > this.model.maxValue) {
                        if (!this.model.enableStrictMode)
                            this._textBox.value = this._formatValue(this.model.maxValue, "n", false);
                        else
                            this.isValidState = false;
                    }
                    this.model.value = (this.model.decimalPlaces == -1 && !ej.isNullOrUndefined(this._afterDec) && (this._textBox.value.lastIndexOf(this._decimalSep) == -1)) ? ej.parseFloat(this._textBox.value + this._decimalSep + this._afterDec, this.model.locale) : ej.parseFloat(this._textBox.value, this.model.locale);
                    if (isNaN(this.model.value) && !this.model.value) {
                        this.model.value = null;
                        this.isValidState = false;
                    }
                    this._toggleTextbox(true);
                    this._textBox = this._hiddenInput[0];
                    this._localizedFormat();
                    this._checkErrorClass();
                }
                else {
                    var value = this._textBox.value == "" ? null : this._textBox.value;
                    this.model.value = value;
                    this._hiddenInput.val(value);
                    this._toggleTextbox(true);
                    this._textBox = this._hiddenInput[0];
                }
                if (this.model.value === null || this.model.value >= this.model.minValue && this.model.value <= this.model.maxValue) this.isValidState = true;
                else if (this.model.enableStrictMode) this.isValidState = false;
                this._raiseChangeEvent();
                this._setWaterMark();
                if (ej.isNullOrUndefined(this.model.value)) value = this.model.value;
                else value = (this.model.value.toString().indexOf('e') == -1) ? this._removeSeparator(this.model.value) : this._convertToExponetial(this.model.value).unformattedValue;
                this.element.val(value);
                this._updateSeparator();
                this._trigger("focusOut", { value: this.model.value });
            }
            this._checkErrorClass();
            this._afterDec = "";
        },

        _cancelEvent: function (e) {
            e.cancelBubble = true;
            e.returnValue = false;
            e.stopPropagation();
            e.preventDefault();
            return false;
        },

        _updateInputField: function (operation) {
            this.isValidState = true;
            if (!this._focused) $(this._hiddenInput[0]).focus();
            var step = this.model.incrementStep;
            var itemValue = this.model.value;
            if (this._textBox.value === "") {
                this._textBox.value = this._formatValue(this._startValue, "n", true);
                step = 0;
            }
            else if (this._textBox.value.indexOf(" ") >= 0)
                this._textBox.value = this._textBox.value.replace(" ", "");
            if (this.sfType === "ej.PercentageTextbox" || this.sfType === "ej.CurrencyTextbox") {
                var editorvalue = this._textBox.value, value = editorvalue;
                if (editorvalue.indexOf(ej.preferredCulture(this.model.locale).numberFormat.percent.symbol) > -1)
                    value = editorvalue.substring(0, editorvalue.length - 1);
                this.model.value = this._parseValue(value);
            }
            else if (this.sfType == "ej.NumericTextbox")
                this.model.value = ej.parseFloat(this._textBox.value, this.model.locale);

            if (isNaN(this.model.value) && !this.model.value)
                this.model.value = this._startValue;

            if (this.model.value >= this.model.minValue && this.model.value > this.model.maxValue) {
                this.model.value = this.model.maxValue;
                this._setValue(this.model.value);
            }
            else if (this.model.value < this.model.minValue && this.model.value <= this.model.maxValue) {
                this.model.value = this.model.minValue;
                this._setValue(this.model.value);
            }
            else if (this.model.value >= this.model.minValue && this.model.value <= this.model.maxValue) {
                value = operation == "increment" ? this.model.value + step : this.model.value - step;
                 if(this.model.decimalPlaces == -1) value = parseFloat(value.toFixed(this._afterDec.length));
                if (value >= this.model.minValue && value <= this.model.maxValue)
                    this._setValue(value);
            }
            this._checkErrorClass();
        },

        _validateDecimal: function (e) {
            var char = String.fromCharCode(e.keyCode);
            char = e.keyCode == 188 ? "," : (e.keyCode == 190) ? "." : (e.keyCode == 110) ? ej.preferredCulture(this.model.locale).numberFormat["."] : char;
            if (ej.preferredCulture(this.model.locale).numberFormat["."].charCodeAt(0) == char.charCodeAt(0))
                return true;
            return false;
        },

        _allowKeyCodes: function (e) {
            var keys = new Array(38, 40, 35, 36, 109, 189, 46, 8, 127, 37, 39, 190, 9, 13, 16, 17, 18, 20, 110, 173, 86, 88, 67);
            for (var i = 0; i < keys.length; i++) {
                if (e.keyCode == keys[i] || (this._validateDecimal(e) && this.model.decimalPlaces != 0))
                    return true;
            }
            return false;
        },

        _raiseChangeEvent: function (isCode) {
            var currVal = this.model.value, value;
            if ((this._checkNumValue(this._preVal) !== this._checkNumValue(currVal))) {
                this._preVal = currVal;
                this.model.value = (this.model.decimalPlaces == -1 && !ej.isNullOrUndefined(this.model.value)) ? parseFloat(this.model.value) : this._checkNumValue(this._formatValue(this._preVal, "n", false));
                this._updateHiddenField();
                if (ej.isNullOrUndefined(this.model.value)) {
                    value = this.model.value;
                    this.wrapper.removeClass('e-valid');
                }
                else {
                    value = (this.model.value.toString().indexOf('e') == -1) ? this._removeSeparator(this.model.value) : this._convertToExponetial(this.model.value).unformattedValue;
                    if (this.model.decimalPlaces == -1) {
                        this._separateValue(this.model.value.toString(), false,true);
                        if (!ej.isNullOrUndefined(this._afterDec) && this._afterDec != "")
                            value = this._beforeDec + this._decimalSep + this._afterDec;
                    }
                    this.wrapper.addClass('e-valid');
                }
                this.element.val(value);
			    this.wrapper.attr('aria-valuenow', value);
                this._updateSeparator();
                // Trigger the Jquery change event for the input element.
                this.element.trigger("change");
                this._trigger("_change", { value: this.model.value, isInteraction: !isCode });
                this._trigger("change", { value: this.model.value, isInteraction: !isCode });
            }
        },
        _updateHiddenField: function () {
            var prevActive = this._textBox;
            this._textBox = this._hiddenInput[0];
            this._localizedFormat();
            this._textBox = prevActive;
        },
        _removeSeparator: function (number) {
            if (ej.isNullOrUndefined(number)) return;
            var value, format, tag;
            if (this.model.decimalPlaces == -1) {
                this._separateValue(number.toString(), false,true);
            }
            number = this._checkNumValue(this._formatValue(number, "n", false));
            value = number.toString();
            format = ej.preferredCulture(this.model.locale).numberFormat;
            value = value.replace(".", format["."]);
            return value;
        },
        _updateSeparator: function () {
            if (this._changeSeparator && this.model.value) {
                var formatValue;
                    if (this.sfType === "ej.NumericTextbox")
                        formatValue = this._formatValue(this.model.value, "n", true);
                    else if (this.sfType === "ej.PercentageTextbox")
                        formatValue = this._formatValue((this.model.value) / 100, "p", true);
                    else if (this.sfType === "ej.CurrencyTextbox")
                        formatValue = this._formatValue(this.model.value, "c", true);
                    if (this.model.decimalPlaces == -1) {
                        var index = formatValue.lastIndexOf(this._decimalSep);
                        var val = formatValue.substr(index + 1);
                        this._separateValue(formatValue, true, false);
                        var symbolIndex = (this.sfType === "ej.CurrencyTextbox") ? formatValue.indexOf(this._currencySymbol) : (this.sfType === "ej.PercentageTextbox") ? this._textBox.value.indexOf(this._percentSymbol) : -1;
                        var symbolPos = this._afterDec;
                         if (symbolIndex > 1) {
                           if (this.sfType === "ej.CurrencyTextbox")
                                symbolPos = symbolPos + " " + this._currencySymbol;
                            if (this.sfType === "ej.PercentageTextbox")
                                symbolPos = symbolPos + " " + this._percentSymbol;
                         }
                        if (!ej.isNullOrUndefined(this._afterDec) && this._afterDec != "")
                            formatValue = this._beforeDec + this._decimalSep + symbolPos;
                        if (!ej.isNullOrUndefined(this._afterDec) && this._afterDec == "")
                            formatValue = this._beforeDec + this._decimalSep + val;
                    }
                
                this._hiddenInput.val(this._replaceSeparator(formatValue, ej.preferredCulture(this.model.locale).numberFormat[","], this.model.groupSeparator));
            }
        },

        _replaceSeparator: function (value, find, replaceWith) {
            this._decimalSep = ej.preferredCulture(this.model.locale).numberFormat['.'];
            var reg = find === "" ? new RegExp("\\s", "g") : new RegExp("\\" + find, "g");
            if (this.model.groupSeparator == ej.preferredCulture(this.model.locale).numberFormat['.']) {
                var decimalpoints = this.model.decimalPlaces;
                if (this.model.decimalPlaces == -1) {
                    var index = value.lastIndexOf(this._decimalSep);
                    decimalpoints = value.substr(index + 1).length;
                 }
                var valuelength = value.length - decimalpoints - 1;
                return value.substring(0, valuelength).replace(reg, replaceWith) + value.substring(valuelength, value.length);
            }
            return value.replace(reg, replaceWith);
        },

        _checkSeparator: function (value) {
            this.model.groupSeparator = value != null ? this._validateSeparator(value) : ej.preferredCulture(this.model.locale).numberFormat[','];
            this._changeSeparator = ej.preferredCulture(this.model.locale).numberFormat[","] != this.model.groupSeparator ? true : false;
            this._prevSeparator = this.model.groupSeparator;
        },
        _validateSeparator: function (value) {
            var separator = value.toString();
            var reg = new RegExp("[a-zA-Z0-9]");
            separator = (separator.length > 1) ? separator[0] : separator;
            separator = (!reg.test(separator)) ? separator : this._prevSeparator != null ? this._prevSeparator : ej.preferredCulture(this.model.locale).numberFormat[','];
            return separator;
        },
        _keyPress: function (e) {
            if (e.which === 0 || e.metaKey || e.ctrlKey || e.keyCode === 8 || e.keyCode === 13)
                return;
            var proxy = this, regExp = null, point = ".", cursor, beforeCursor, afterCursor, numberFormat, value;
            cursor = this._caretPosition();
            beforeCursor = this._textBox.value.toString().substring(0, cursor);
            afterCursor = this._textBox.value.toString().substring(cursor);
            numberFormat = ej.preferredCulture(this.model.locale).numberFormat;

            var character = String.fromCharCode(e.which);
            value = beforeCursor + character + afterCursor;
            var separator = numberFormat[point];
            separator = (separator === point) ? "\\" + separator : separator;
            regExp = proxy.model.decimalPlaces === 0 ? new RegExp("^((-)?(\\d*)(-)?)?$") : new RegExp("^(-)?(((\\d+(" + separator + "\\d*)?)|(" + separator + "\\d*)))?((-)?)$");
            // Validate the textbox value 
            if (!regExp.test(value))
                return false;
        },
        _validateDecimalOnType: function (e) {
            var cursor, cancelEvent, beforeCursor, afterCursor, sel, temp;
            cursor = this._caretPosition();
            beforeCursor = this._textBox.value.toString().substring(0, cursor);
            afterCursor = this._textBox.value.toString().substring(cursor);
            sel = this._getSelection(this._textBox.value);
            var decSep = ej.preferredCulture(this.model.locale).numberFormat["."];
            temp = (ej.isNullOrUndefined(this.model.value)) ? "" : this.model.value.toString();
            if (this.model.decimalPlaces != 0) {
                var afterdeci = (this._textBox.value).split(decSep)[1];
                if (temp.indexOf(decSep) > 0) {
                    if ((temp.substring(temp.indexOf(decSep) + 1, temp.length)).length > this.model.decimalPlaces)
                        cancelEvent = true;
                    else if (sel.length == 0 && cursor > (this._textBox.value.indexOf(decSep)) && afterdeci && afterdeci.length >= this.model.decimalPlaces) cancelEvent = true;
                    else cancelEvent = false;
                }
                else if (sel.length == 0 && cursor > (this._textBox.value.indexOf(decSep)) && afterdeci && afterdeci.length >= this.model.decimalPlaces) cancelEvent = true;
                else
                    cancelEvent = false;
            }
            else
                cancelEvent = false;
            if (cancelEvent) {
                this._keypressFlag = false;
                this._cancelEvent(e);
                return false;
            }
        },

        _keyDown: function (e) {
            if (this.model.readOnly) return;
            this._CurrentCultureInfo = JSON.parse(JSON.stringify(ej.preferredCulture()));
            var cursor, cancelEvent, beforeCursor, afterCursor, sel;
            if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || this._allowKeyCodes(e)) {
                if (e.shiftKey && (e.keyCode == 35 || e.keyCode == 36 || e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 46 || e.keyCode == 127) || (e.ctrlKey && (e.keyCode == 86 || e.keyCode == 118 || e.keyCode == 67 || e.keyCode == 88)))
                    return true;
                if ((((e.ctrlKey == true) && (e.keyCode != 9 && e.keyCode != 17 && e.keyCode != 86 && e.keyCode != 67))) || (e.keyCode == 67 || e.keyCode == 86 || e.keyCode == 88)) {//Prevent Shift + Tab event
                    this._keypressFlag = false;
                    this._cancelEvent(e);
                    return false;
                }

                if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode >= 96 && e.keyCode <= 105 || e.keyCode == 110) {//Numbers from 0 to 9 in keyboard and numpad (110 for decimal)
                    cursor = this._caretPosition();
                    beforeCursor = this._textBox.value.toString().substring(0, cursor);
                    afterCursor = this._textBox.value.toString().substring(cursor);
                    sel = this._getSelection(this._textBox.value);
                    // For Numpad issue
                    if (e.keyCode >= 96 && e.keyCode <= 105)
                        e.keyCode -= 48;
                    if (this.model.validateOnType) this._validateDecimalOnType(e);
                    if (this._validateOnType) {
                        var decSep = ej.preferredCulture(this.model.locale).numberFormat["."];
                        var temp = this.model.value.toString();
                        var tempIndex = temp.indexOf(decSep);
                        var value = this.model.value;

                        var replaceminVal = (this.model.decimalPlaces == -1) ? this.model.minValue : this.model.minValue.toFixed(this.model.decimalPlaces);
                        var replacemaxVal = (this.model.decimalPlaces == -1) ? this.model.maxValue : this.model.maxValue.toFixed(this.model.decimalPlaces);
                        var exp = false;
                        if (replaceminVal.toString().indexOf("e") > 0 || replacemaxVal.toString().indexOf("e") > 0)
                            exp = true;
                        if (!exp) {
                            if (decSep != ".") {
                                temp = this._textBox.value.toString();
                                if (this.model.minValue.toString().match(new RegExp(".", "g")))
                                    replaceminVal = this.model.minValue.toString().replace(/["."]/g, decSep);
                                if (this.model.maxValue.toString().match(new RegExp(".", "g")))
                                    replacemaxVal = this.model.maxValue.toString().replace(/["."]/g, decSep);
                            }
                            if (replaceminVal.toString().indexOf(decSep) > 0)
                                minVal = Number(replaceminVal.toString().substring(0, replaceminVal.toString().indexOf(decSep)));
                            else
                                minVal = this.model.minValue;
                            if (replacemaxVal.toString().indexOf(decSep) > 0)
                                maxVal = Number(replacemaxVal.toString().toString().substring(0, replacemaxVal.toString().indexOf(decSep)));
                            else
                                maxVal = this.model.maxValue;
                            if (tempIndex > 0) {
                                value = Number(temp.substring(temp.indexOf(decSep) + 1, temp.toString().length));
                                if (replaceminVal.toString().indexOf(decSep) > 0)
                                    minVal = Number(replaceminVal.toString().substring(replaceminVal.toString().indexOf(decSep) + 1, replaceminVal.toString().length));
                                else
                                    minVal = 0;
                                if (replacemaxVal.toString().indexOf(decSep) > 0)
                                    maxVal = Number(replacemaxVal.toString().substring(replacemaxVal.toString().indexOf(decSep) + 1, replacemaxVal.toString().length));
                                else
                                    maxVal = 0;
                                var valb4Dec = Number(temp.substring(0, temp.indexOf(decSep)));
                                var minValb4Dec = Number(replaceminVal.toString().substring(0, replaceminVal.toString().indexOf(decSep)));
                                var maxValb4Dec = Number(replacemaxVal.toString().substring(0, replacemaxVal.toString().indexOf(decSep)));
                                if (!this._validateValue(value, minVal, maxVal, true, valb4Dec, minValb4Dec, maxValb4Dec))
                                    cancelEvent = true;
                                else
                                    cancelEvent = false;
                            }
                            else {
                                if (!this._validateValue(value, minVal, maxVal, false))
                                    cancelEvent = true;
                                else
                                    cancelEvent = false;
                            }
                        }
                        else if (this.model.decimalPlaces != 0) {
                            var afterdeci = (this._textBox.value).split(".")[1];
                            if (temp.indexOf(decSep) > 0 || (Number(temp) < Number(replaceminVal) || Number(temp) > Number(replacemaxVal))) {
                                if ((temp.substring(temp.indexOf(decSep) + 1, temp.length)).length > this.model.decimalPlaces)
                                    cancelEvent = true;
                                else if (sel.length == 0 && cursor > (this._textBox.value.indexOf(decSep)) && afterdeci && afterdeci.length >= this.model.decimalPlaces) cancelEvent = true;
                                else cancelEvent = false;
                            }
                            else if (sel.length == 0 && cursor > (this._textBox.value.indexOf(decSep)) && afterdeci && afterdeci.length >= this.model.decimalPlaces) cancelEvent = true;
                            else
                                cancelEvent = false;
                        }
                        else
                            cancelEvent = false;
                        if (cancelEvent) {
                            this._keypressFlag = false;
                            this._cancelEvent(e);
                            return false;
                        }
                    }

                }
                if (e.keyCode == 38 && this._allowkeyboard) {
                    this._updateInputField("increment");
                    this._cancelEvent(e);
                }

                if (e.keyCode == 40 && this._allowkeyboard) {
                    this._updateInputField("decrement");
                    this._cancelEvent(e);

                }
                if (e.keyCode == 8) {
                    cursor = this._caretPosition();
                    beforeCursor = this._textBox.value.substring(0, cursor);
                    afterCursor = this._textBox.value.substring(cursor);
                    sel = this._getSelection(this._textBox.value);
                }

                if (e.keyCode == 46 || e.keyCode == 127) {
                    cursor = this._caretPosition();
                    beforeCursor = this._textBox.value.substring(0, cursor);
                    afterCursor = this._textBox.value.substring(cursor);
                    sel = this._getSelection(this._textBox.value);
                }
                if (this._validateDecimal(e) && this.model.decimalPlaces != 0 && e.keyCode != 46) {
                    var decChar = ej.preferredCulture(this.model.locale).numberFormat["."];
                    var minVal, maxVal;
                    var dotSplit = this._textBox.value.split(decChar);
                    if (dotSplit[1] == undefined) {
                        var curPosition = this._caretPosition();
                        var strBeforeCursor = dotSplit[0].substring(0, curPosition);
                        var strAfterCursor = dotSplit[0].substring(curPosition);
                        if (this.model.minValue.toString().indexOf("e") > 0 || this.model.maxValue.toString().indexOf("e") > 0)
                            exp = true;
                        if (strAfterCursor.length > this.model.decimalPlaces && this.model.validateOnType == true) {
                            this._keypressFlag = false;
                            this._cancelEvent(e);
                            return false;
                        }
                        if (this._validateOnType && !exp) {
                            if (this.model.minValue.toString().match(new RegExp(".", "g")))
                                minVal = this.model.minValue.toString().replace(/["."]/g, decChar);
                            if (this.model.maxValue.toString().match(new RegExp(".", "g")))
                                maxVal = this.model.maxValue.toString().replace(/["."]/g, decChar);
                            if (minVal.indexOf(decChar) > 0)
                                minVal = Number(minVal.substring(0, minVal.indexOf(decChar)));
                            else
                                minVal = Number(minVal);
                            if (maxVal.indexOf(decChar) > 0)
                                maxVal = Number(maxVal.substring(0, maxVal.indexOf(decChar)));
                            else
                                maxVal = Number(maxVal);
                            if (this._validateValue(this.model.value, minVal, maxVal, "DecimalKeyPressed"))
                                this._textBox.value = strBeforeCursor + decChar + strAfterCursor;
                            else {
                                this._keypressFlag = false;
                                this._cancelEvent(e);
                                return false;
                            }
                        }
                        else
                            this._textBox.value = strBeforeCursor + decChar + strAfterCursor;
                        this._setSelectionRange(curPosition + 1, curPosition + 1);
                    }
                    this._cancelEvent(e);
                } else if (e.keyCode == 190 || e.keyCode == 110) {
                    this._cancelEvent(e);
                }
                if (e.keyCode == 109 || e.keyCode == 189 || e.keyCode == 173) { //'-' char key press.
                    if ((this._caretPosition() != 0 && this._getSelection(this._removeFormats(this._textBox.value)) != this.model.value) || (this.model.minValue >= 0 && !this.model.enableStrictMode) || (this._textBox.value.toString().match(new RegExp("-", "g")) && this._getSelection(this._textBox.value) === ""))
                        this._cancelEvent(e);

                    else if (this._getSelection() == this.model.value)
                        this.model.value = null;
                }

                if (e.keyCode == 13)
                    if ((this._checkNumValue(this._preVal) !== this._checkNumValue(this._textBox.value)))
                        this._setValue(this._textBox.value);
            }

            else if (e.keyCode != 27 && !e.ctrlKey || (e.ctrlKey && e.keyCode == 90 && $.trim(this._textBox.value) === "")) {
                this._keypressFlag = false;
                this._cancelEvent(e);
            }
        },
		_getLocalizedLabels: function(){
            return ej.getLocalizedConstants(this.sfType, this.model.locale);
        }
		
    });
	
    ej.NumericTextbox.Locale = ej.NumericTextbox.Locale || {} ;
    
    ej.NumericTextbox.Locale['default'] = ej.NumericTextbox.Locale['en-US'] = {
        watermarkText: "Enter value"
        
    };
	ej.PercentageTextbox.Locale = ej.PercentageTextbox.Locale || {} ;
    
    ej.PercentageTextbox.Locale['default'] = ej.PercentageTextbox.Locale['en-US'] = {
        watermarkText: "Enter value"
        
    };
	ej.CurrencyTextbox.Locale = ej.CurrencyTextbox.Locale || {} ;
    
    ej.CurrencyTextbox.Locale['default'] = ej.CurrencyTextbox.Locale['en-US'] = {
        watermarkText: "Enter value"
        
    };
	
		
})(jQuery, Syncfusion);;