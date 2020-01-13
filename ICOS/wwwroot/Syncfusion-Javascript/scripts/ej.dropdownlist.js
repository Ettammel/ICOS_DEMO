/*!
*  filename: ej.dropdownlist.js
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

    ej.widget("ejDropDownList", "ej.DropDownList", {
        element: null,

        model: null,
        validTags: ["select", "input"],
        _addToPersist: ["value", "text", "selectedIndex", "selectedItemIndex", "selectedItems", "selectedIndices", "popupWidth", "popupHeight", "itemValue"],
        _setFirst: false,

        _rootCSS: "e-dropdownlist",
        angular: {
            require: ['?ngModel', '^?form', '^?ngModelOptions']
        },
        _requiresID: true,
      


        defaults: {
            cssClass: "",

            value: null,

            htmlAttributes: {},

            text: null,

            itemValue: "",

            itemsCount: 0,

            dataSource: null,

            delimiterChar: ',',

            query: null,

            fields: {
                id: null,

                text: null,

                value: null,

                category: null,
                
                groupBy:null,

                imageUrl: null,

                imageAttributes: null,

                spriteCssClass: null,

                htmlAttributes: null,

                selected: null,

                tableName: null
            },
			
			locale: "en-US",

            watermarkText: null,

            height: "",

            width: "",

            popupHeight: "152px",

            popupWidth: "auto",

            maxPopupHeight: null,

            minPopupHeight: '20',

            maxPopupWidth: null,

            minPopupWidth: '0',

            targetID: null,

            template: null,

            headerTemplate: null,

            selectedItemIndex: -1,

            selectedIndex: -1,

            disableItemsByIndex: null,

            enableItemsByIndex: null,

            selectedItems: [],

            selectedIndices: [],

            cascadeTo: null,

            enablePopupResize: false,

            allowVirtualScrolling: false,

            virtualScrollMode: "normal",

            showRoundedCorner: false,

            showPopupOnLoad: false,

            enableRTL: false,

            enabled: true,

            filterType: "contains",

            sortOrder: "ascending",

            caseSensitiveSearch: false,

            showCheckbox: false,

            checkAll: false,

            uncheckAll: false,

            enablePersistence: false,

            enableFilterSearch: false,

            enableServerFiltering: false,

            enableIncrementalSearch: true,

            readOnly: false,

            enableAnimation: false,

            multiSelectMode: "none",

            allowGrouping: false,

            enableSorting: false,

            validationRules: null,

            validationMessage: null,

            actionBegin: null,

            actionComplete: null,

            actionFailure: null,

            actionSuccess: null,

            create: null,

            popupHide: null,

            popupShown: null,

            beforePopupShown: null,

            beforePopupHide: null,

            popupResizeStart: null,

            popupResize: null,

            popupResizeStop: null,

            change: null,

            select: null,

            dataBound: null,

            search: null,

            checkChange: null,

            cascade: null,

            destroy: null

        },

        dataTypes: {
            cssClass: "string",
            itemsCount: "number",
            watermarkText: "string",
            template: "string",
            disableItemsByIndex: "string",
            enableItemsByIndex: "string",
            enableIncrementalSearch: "boolean",
            cascadeTo: "string",
            delimiterChar: "string",
            showRoundedCorner: "boolean",
            showPopupOnLoad: "boolean",
            enableRTL: "boolean",
            enablePersistence: "boolean",
            allowVirtualScrolling: "boolean",
            virtualScrollMode: "enum",
            enabled: "boolean",
            readOnly: "boolean",
            multiSelectMode: "enum",
            dataSource: "data",
            query: "data",
            fields: "data",
            selectedItems: "array",
            enableAnimation: "boolean",
            allowGrouping: "boolean",
            enableSorting: "boolean",
            validationRules: "data",
            validationMessage: "data",
            htmlAttributes: "data",
			locale:"string"
        },

        observables: ["value", "selectedItemIndex", "selectedIndex"],
        value: ej.util.valueFunction("value"),
        selectedItemIndex: ej.util.valueFunction("selectedItemIndex"),
        selectedIndex: ej.util.valueFunction("selectedIndex"),
        

        enable: function () {
            if (this._visibleInput.hasClass("e-disable")) {
                this.target.disabled = false;
                this.model.enabled = true;
				this.container.removeClass('e-disable');
                this._visibleInput.removeClass('e-disable');
                this.dropdownbutton.removeClass('e-disable');
                this.popupListWrapper.removeClass('e-disable');
                if (this._isIE8) this.drpbtnspan.removeClass("e-disable");
                //Element not Maintain in Multiselection
                this.container.on("mousedown", $.proxy(this._OnDropdownClick, this));
                if (this.model.multiSelectMode == "visualmode") this._ulBox.removeClass("e-disable");
                this.wrapper.attr('tabindex', '0');
            }
            this._wireEvents();
        },

        disable: function () {
            if (!this._visibleInput.hasClass("e-disable")) {
                this.target.disabled = true;
                this.model.enabled = false;
				this.container.addClass('e-disable');
                this._visibleInput.addClass('e-disable');
                this.popupListWrapper.addClass('e-disable');
                this.dropdownbutton.addClass('e-disable');
                if (this._isIE8) this.drpbtnspan.addClass("e-disable");
                if (this.model.multiSelectMode == "visualmode") this._ulBox.addClass("e-disable");
                //Element not Maintain in Multiselection
                this.container.off("mousedown", $.proxy(this._OnDropdownClick, this));
                this._unwireEvents();
                this.wrapper.removeAttr('tabindex');
                if (this._isPopupShown()) this._hideResult();
            }
        },

        /* will deprecate with text property */
        getValue: function () {
			return this._visibleInput.val();
        },
        _setValue: function (value) {
            if (!ej.isNullOrUndefined(value)) {
                this._raiseEvents = false;
                if (!ej.isNullOrUndefined(this.model.text)) this.unselectItemByText(this.model.text);
                this._raiseEvents = true;
                this._addValue(value);
                this.selectItemByValue(value);
            }
        },
        _addValue: function (args) {
            if (this.model.itemsCount > 0 && args != "") {
                this._checkValue = true;
                var listitems = args.split(this.model.delimiterChar);
                var field = this.mapFld._value; 
                this._addListItems(listitems, this._rawList, "local");
                if (this._checkValue) {
                    var source = this.model.dataSource;
                    if (ej.DataManager && source instanceof ej.DataManager) {
                        if (source.dataSource.offline && (source.dataSource.json && source.dataSource.json.length > 0))
                            this._addListItems(listitems, source.dataSource.json,"remote");
                        else {
                            var proxy = this;
                            var value= args;
                                source.executeQuery(ej.Query()).done(function (e) {
                                proxy._addListItems(listitems, e.result, "remote");
                                proxy.selectItemByValue(value);
                            });
                        }
                    }
                    else
                        this._addListItems(listitems, source, "remote");
                }

            }
        },
        _addListItems: function (listitems, source, checkValue) {
            for (k = 0; k < listitems.length; k++) {
                for (var i = 0; i < source.length; i++) {
                    if (checkValue == "local" && source[i][this.mapFld._value] == listitems[k])
                        this._checkValue = false;
                    if (checkValue == "remote" && source[i][this.mapFld._value] == listitems[k])
                        this.addItem(source[i]);
                }
            }
        },
        _setText: function (text) {
            if (text) {
                this._raiseEvents = false;
                this.unselectItemByText(this.model.text);
                this._raiseEvents = true;
                this.selectItemByText(text);
            }
        },
        _setItemValue: function (itemValue) {
            this.model.itemValue = itemValue;
        },
        _changeWatermark: function (text) {
            if (!this.model.enabled) return false;
            if (this._isWatermark) this._visibleInput.attr("placeholder", text);
            else this._hiddenSpan.text(text);
        },

        hidePopup: function () {
            if (!this.model.enabled) return false;
            if (this.ultag.find('li').length > 0)
                this._hideResult();
        },

        showPopup: function () {
            if (!this.model.enabled) return false;
            if (this.ultag.find('li').length > 0)
                this._showResult();
        },

        clearText: function () {
            this._clearTextboxValue(); 
            if (!this._isWatermark)
                this._setWatermark();
        },

        addItem: function (itemTag) {
            if (!this.model.enabled || !itemTag) return false;
            this._mapFields();
            var list = $.isArray(itemTag) ? itemTag : [itemTag];
            if (list.length < 1) return false;
            var mapper = this.mapFld,
                mapFld = { _id: null, _imageUrl: null, _imageAttributes: null, _spriteCSS: null, _text: null, _value: null, _htmlAttributes: null, _selected: null, _category: null };
            mapFld._id = list[0][mapper._id] ? mapper._id : "id";
            mapFld._imageUrl = list[0][mapper._imageUrl] ? mapper._imageUrl : "imageUrl";
            mapFld._imageAttributes = list[0][mapper._imageAttributes] ? mapper._imageAttributes : "imageAttributes";
            mapFld._spriteCSS = list[0][mapper._spriteCSS] ? mapper._spriteCSS : "spriteCssClass";
            mapFld._text = list[0][mapper._text] ? mapper._text : "text";
            mapFld._value = list[0][mapper._value] ? mapper._value : "value";
            mapFld._htmlAttributes = list[0][mapper._htmlAttributes] ? mapper._htmlAttributes : "htmlAttributes";
            mapFld._selected = list[0][mapper._selected] ? mapper._selected : "selected";
            mapFld._category = list[0][mapper._category] ? mapper._category : "groupBy";
            this._generateLi(list, mapFld);
            
            var i, listItems = this.dummyUl;
            for (var i = 0; i < list.length; i++)
                this._listItem(list[i], "add");
            if (this.model.showCheckbox) {
                this._appendCheckbox(listItems, true);               
            }
            else if (!this._isSingleSelect()) this._multiItemSelection(listItems, true);
			this._virtualUl.append($(this.dummyUl).clone(true));
            this.ultag.append(this.dummyUl);

            if (this._isPopupShown()) {
                var scrollerPosition = this.scrollerObj ? this.scrollerObj.scrollTop() : 0;
                this._refreshScroller();
                if (this.scrollerObj) this.scrollerObj.option("scrollTop", scrollerPosition);
            }
        },

        _toArray: function (index, mode) {
            var items;
            if (typeof index == "function") index = ej.util.getVal(index);
            if ($.isArray(index)) items = index;
            else if (typeof index == "string") {
                if ((mode && (this.model.multiSelectMode == "visualmode" || this.model.multiSelectMode == "delimiter" || this.model.showCheckbox))) {
                    items = index.split(this.model.delimiterChar);
                    if (items.length == 0) items = [index];
                }
                else if (!mode) {
                    items = index.split(this.model.delimiterChar);
                    if (items.length == 0) items = [index];
                }
                else items = [index];
            } else items = [index];
            return items;
        },
        _trim: function (val) {
            return typeof val == "string" ? $.trim(val) : val;
        },
        /*will deprecate with selectItemsByIndices */
        selectItemByIndex: function (index) {
            this._selectItemByIndex(index);
        },

        selectItemsByIndices: function (index) {
            this._selectItemByIndex(index);
        },

        _selectItemByIndex: function (val) {
            this.listitems = this._getLi();
            this._selectedIndices = $.map(this._selectedIndices, function (a) { return parseInt(a); });
            this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
			if( parseInt(val) == -1 && this.model.selectedItems.length > 0) {
				this._clearTextboxValue();
				this._trigger("change",{ text: this._visibleInput[0].value, selectedText: "", selectedValue: "", value: "" });
			}
			else {
            var items = this._toArray(val, true), index;
            for (var k = 0; k < items.length; k++) {
                index = parseInt(items[k]);
                if (index != null && index >= 0) {
                    if ($.inArray(index, this._selectedIndices) == -1)
                        for (var i = 0; i < this.listitems.length; i++) {
                            if (!$(this.listitems[i]).hasClass('e-disable')) {
                                if (i == index) {
                                    this.selectedIndexValue = i;
                                    this._activeItem = index;
                                    this._enterTextBoxValue();
                                }
                            }
                        }
                } else if (!this.model.showCheckbox && this.model.multiSelectMode == "none" && this.model.selectedItems.length > 0) {
					this._clearTextboxValue();
				   this._trigger("change",{ text: this._visibleInput[0].value, selectedText: "", selectedValue: "", value: "" });
				} 
            }
			}
        },

        unselectItemsByIndices: function (val) { this._unselectItemByIndex(val); },

        /*will deprecate with unselectItemsByIndices method */
        unselectItemByIndex: function (val) { this._unselectItemByIndex(val); },

        _unselectItemByIndex: function (val) {
            this._selectedIndices = $.map(this._selectedIndices, function (a) { return parseInt(a); });
            this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
            var i, items = this._toArray(val, true), index;
            this.listitems = this._getLi();
            for (var k = 0; k < items.length; k++) {
                index = parseInt(items[k]);
                for (i = 0; i < this.listitems.length; i++) {
                    if (i == index) {
                        this.selectedIndexValue = i;
                        this._activeItem = index;
                        if (this._activeItem == this._aselectedItem) this._aselectedItem = null;
                        this._removeTextBoxValue();
                    }
                }
            }
        },

        /*Deprecated with selectedItemByValue */
        setSelectedValue: function (idvalue) { this.selectItemByValue(idvalue); },

        selectItemByValue: function (val) {
            var i, hidelement, items;
            this.listitems = this._getLi();
            if(this.inputSearch && this.inputSearch.val() != "" && this.model.enableServerFiltering && !ej.isNullOrUndefined(this._searchresult)){
                var field = (this.model.fields && this.model.fields.value) ? this.model.fields["value"] : "value";
                for(i=0; i< this._searchresult.length; i++){
                for (var j = 0; j < this.listitems.length; j++) {
					if ($(this.listitems[j]).attr("data-value") == this._searchresult[i][field]) {
						this._searchresult=null;
					}
                }
            }
                this.addItem(this._searchresult);
            }
            if (ej.isNullOrUndefined(val) || val === "") this._clearTextboxValue();
            else {
                items = this._toArray(val, true);
                for (var k = 0; k < items.length; k++) {
                    for (i = 0; i < this.listitems.length; i++) {
                        if (!$(this.listitems[i]).hasClass('e-disable')) {
                            var fieldValue = this._getAttributeValue(this.listitems[i]) || $(this.listitems[i]).text();
                            if (fieldValue) {
                                this._selectedValue = fieldValue;
                                if (this._selectedValue == items[k]) {
                                    this._activeItem = i;
                                    this._aselectedItem = this._activeItem;
                                    this._enterTextBoxValue();
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        },


        unselectItemByValue: function (val) {
            var i, hidelement, items = this._toArray(val, true);
            this.listitems = this._getLi();
            for (var k = 0; k < items.length; k++) {
                for (i = 0; i < this.listitems.length; i++) {
                    if (this._getAttributeValue(this.listitems[i])) {
                        this._selectedValue = this._getAttributeValue(this.listitems[i]);
                        if (this._selectedValue == items[k]) {
                            this._activeItem = i;
                            if (this._activeItem == this._aselectedItem) this._aselectedItem = null;
                            this._removeTextBoxValue();
                            break;
                        }
                    }
                }
            }
        },

        /* Deprecated with selectItemByText*/
        setSelectedText: function (value) { this.selectItemByText(value); },

        selectItemByText: function (val) {
            var i, hidelement, items;
            this.listitems = this._getLi();
            this._mapFields();
            if (ej.isNullOrUndefined(val) || val === "") this._clearTextboxValue();
            else {
                items = this._toArray(val, true);
                for (var k = 0; k < items.length; k++) {
                    for (i = 0; i < this.listitems.length; i++) {
                        if (!$(this.listitems[i]).hasClass('e-disable')) {
                            this.selectedTextValue = this._isPlainType(this.popupListItems) ? this.popupListItems[i] : this._getField(this.popupListItems[i], this.mapFld._text);
                            if (this.selectedTextValue == items[k]) {
                                this._activeItem = i;
                                this._aselectedItem = this._activeItem;
                                this._enterTextBoxValue();
                                break;
                            }
                        }
                    }
                }
            }
        },


        unselectItemByText: function (val) {
            var i, hidelement, items = this._toArray(val, true);
            this.listitems = this._getLi();
            this._mapFields();
            for (var k = 0; k < items.length; k++) {
                for (i = 0; i < this.listitems.length; i++) {
                    this.unselectedTextValue = this._isPlainType(this.popupListItems) ? this.popupListItems[i] : this._getField(this.popupListItems[i], this.mapFld._text);
                    if (this.unselectedTextValue == items[k]) {
                        this._activeItem = i;
                        if (this._activeItem == this._aselectedItem) this._aselectedItem = null;
                        this._removeTextBoxValue();
                        break;
                    }
                }
            }
        },

        getSelectedValue: function () {
			return this.element.val();
        },

        getSelectedItem: function () {
            var k, selected = [];
            this.listitems = this._getLi();
            for (k = 0; k < this._selectedIndices.length; k++) {
                selected.push(this.listitems[this._selectedIndices[k]]);
            }
            return selected;
        },
        getItemDataByValue: function (value) {
            var listitems = this._toArray(value, false);
			var rawList  = (!ej.isNullOrUndefined(this.resultList)) ? this._rawList.concat(this.resultList): this._rawList;
            var k, m, selected = [], field = (this.model.fields && this.model.fields.value) ? this.model.fields["value"] : "value";
            for (k = 0; k < listitems.length; k++) {
                for (m = 0; m < rawList.length; m++) {
                    if (rawList[m][field] == listitems[k])
                        selected.push(rawList[m]);
                }
            }
            return selected;
        },

        getListData: function () { return this._rawList; },

        /* will be deprecate in upcoming releases*/
        getSelectedItemsID: function () {
            return this._selectedItemsID;
        },

        disableItemsByIndices: function (value) { this._disableItemByIndex(value) },

        /*Deprecated with disableItemsByIndices method */
        disableItemByIndex: function (value) { this._disableItemByIndex(value) },

        _disableItemByIndex: function (value) {
            if (!this.model.enabled) return false;
            var listitems = this._toArray(value, false),index;
            for (var i = 0; i < listitems.length; i++) {
                if (listitems[i] != null && !isNaN(parseInt(listitems[i]))) {
                    if (listitems.length > 0 && !($.inArray(parseInt(listitems[i]), this._disabledItems) > -1)) {
                        index = $.inArray(listitems[i], this._disabledItems);
                        this._setClass(this._getLi()[parseInt(listitems[i])], "e-disable");
                        this._disabledItems.push(parseInt(listitems[i]));
                        this.model.disableItemsByIndex = String(this._disabledItems.join(","));
                    }
                }
            }
        },

        enableItemsByIndices: function (value) { this._enableItemByIndex(value) },

        /*Deprecated with enableItemsByIndices method */
        enableItemByIndex: function (value) { this._enableItemByIndex(value) },

        _enableItemByIndex: function (value) {
            var listitems = this._toArray(value, false), index;
            this.model.enableItemsByIndex = value;
            for (var i = 0; i < listitems.length; i++) {
                if (listitems.length > 0 && ($.inArray(parseInt(listitems[i]), this._disabledItems) > -1) &&  !isNaN(parseInt(listitems[i]))) {
                    index = $.inArray(parseInt(listitems[i]), this._disabledItems);
                    this._removeClass(this._getLi()[parseInt(listitems[i])], "e-disable");
                    this._disabledItems.splice(index, 1);
                }
            }
            this.model.enableItemsByIndex = null;
            this.model.disableItemsByIndex = this._disabledItems.join(this.model.delimiterChar);
        },
        _validateDelimiter: function (deli) {
            if (this._trim(deli).length == 1) {
                var RegEx = /^[a-zA-Z0-9]+$/;
                if (!RegEx.test(deli)) return deli;
            }
            return ",";
        },

        _removeText: function (currentValue) {
            var eleVal = this.element[0].value.split(this.model.delimiterChar), hidVal = this._visibleInput[0].value.split(this.model.delimiterChar),
            index = $.inArray(currentValue, eleVal);
            if (index >= 0) {
                eleVal.splice(index, 1);
                hidVal.splice(index, 1);
            }
            this.element[0].value = eleVal.join(this.model.delimiterChar);
            this._visibleInput[0].value = hidVal.join(this.model.delimiterChar);
        },
        _addText: function (currentValue) {
            if (this._checkContains(this._hiddenValue)) return false;
            var ele = ["element", "_visibleInput"], val;
            for (var i = 0; i < ele.length; i++) {
                val = ele[i] == "element" ? this._hiddenValue : currentValue;
                if (this[ele[i]][0].value && this[ele[i]][0].value != "") {
                    var splitedText = this[ele[i]][0].value.split(this.model.delimiterChar);
                    splitedText.push(val);
                    this[ele[i]][0].value = splitedText.join(this.model.delimiterChar);
                } else this[ele[i]][0].value = val;
            }
        },
        _checkContains: function (chkValue) {
            var values = this.element[0].value.split(this.model.delimiterChar);
            this.contains = false;
            for (var i = 0; i < values.length; i++) {
                values[i] = isNaN(parseInt(values[i])) || (typeof(this._rawList[i][this.mapFld._value]) == 'string') ? values[i] : parseInt(values[i]);
                if (values[i] === chkValue) {
                    this.contains = true;
                    break;
                }
            }
            return this.contains;
        },
        _updateLocalConstant: function () {
            this._localizedLabels = ej.getLocalizedConstants("ej.DropDownList", this.model.locale);
        },
        _init: function () {
            var browserInfo = ej.browserInfo();
            this._updateLocalConstant();
            this._isIE8 = (browserInfo.name == 'msie' && browserInfo.version == '8.0');
            this._textContent = this._isIE8 ? "innerText" : "textContent";
            if ((this.element.is("input") && (this.element.is("input[type=text]") || !this.element.attr('type'))) || this.element.is("select")) {
                this._isWatermark = 'placeholder' in $(document.createElement('input')).attr("placeholder", '')[0];
                this._id = this.element[0].id;
                this._initialize();
                this._render();
                this._addAttr(this.model.htmlAttributes);
                this._enabled(this.model.enabled);
                this._initValue = false;
                this._checkboxValue = false;
                if (this.model.validationRules != null) {
                    this._initValidator();
                    this._setValidation();
                }
            }
        },

        _initValidator: function () {
            (!this.element.closest("form").data("validator")) && this.element.closest("form").validate();
        },
        _setValidation: function () {
            if (this.element.closest("form").length != 0) {
                this.element.rules("add", this.model.validationRules);
                var validator = this.element.closest("form").data("validator");
                if (!validator) validator = this.element.closest("form").validate();
                var name = this.element.attr("name");
                validator.settings.messages[name] = {};
                for (var ruleName in this.model.validationRules) {
                    var message = null;
                    if (!ej.isNullOrUndefined(this.model.validationRules[ruleName])) {
                        if (!ej.isNullOrUndefined(this.model.validationRules["messages"] && this.model.validationRules["messages"][ruleName]))
                            message = this.model.validationRules["messages"][ruleName];
                        else {
                            validator.settings.messages[name][ruleName] = $.validator.messages[ruleName];
                            for (var msgName in this.model.validationMessage)
                                ruleName == msgName ? (message = this.model.validationMessage[ruleName]) : "";
                        }
                        validator.settings.messages[name][ruleName] = message != null ? message : $.validator.messages[ruleName];
                    }
                }
            }
        },

        _setInitialPopup: function (value) {
            if (this.model.enabled && !this.model.readOnly)
                value == false ? this._hideResult() : this._showResult();
        },
        _changeSkin: function (skin) {
            this.wrapper.removeClass(this.model.cssClass).addClass(skin);
            this.popupListWrapper.removeClass(this.model.cssClass).addClass(skin);
        },

        _setRTL: function (val) {
            if (this.model.enableRTL != val) {
                this.model.enableRTL = val;
                this._RightToLeft();
                this._dropbtnRTL();
            }
        },

        _changeHeight: function (height) {
            this.wrapper.height(height);
            this._setListHeight();
        },
        _changeWidth: function (width) {
            this.wrapper.width(width);
            this._setListWidth();
        },

        _setModel: function (options) {
            var option;
            for (option in options) {
                switch (option) {
                    case "dataSource": if (!this._isEqualDataSource(options[option])) this._checkModelDataBinding(options[option], this.model.query); break;
                    case "query": this._checkModelDataBinding(this.model.dataSource, options[option]); break;
                    case "fields": this.model.fields = $.extend(this.model.fields, options[option]); this._checkModelDataBinding(this.model.dataSource, this.model.query); break;
                    case "itemsCount": this.model.itemsCount = options[option]; this._checkModelDataBinding(this.model.dataSource, this.model.query);; break;
                    case "template": this.model.template = options[option]; this._checkModelDataBinding(this.model.dataSource, this.model.query); break;
                    case "value": 
					var optionValue = ej.util.getVal(options[option]);
					if (ej.isNullOrUndefined(optionValue) || optionValue === "") this._clearTextboxValue();
					if (ej.isNullOrUndefined(optionValue) || optionValue === "") this._clearTextboxValue();
                    else { this._setValue(ej.util.getVal(options[option])); options[option] = this.model.value; } break;
                    case "delimiterChar": 
						var delchar = this.model.delimiterChar; 
						options[option] = this._validateDelimiter(options[option]);
                        this.model.delimiterChar = options[option];
                        if (!this._isSingleSelect()) {
						if (this.model.text) {
							this.model.text = this.model.text.split(delchar).join(this.model.delimiterChar);
							this._visibleInput.val(this.model.text);							
						}
						if(!ej.isNullOrUndefined(this.value())) {
							this.value(this.value().split(delchar).join(this.model.delimiterChar));
							this.element.val(this.value());	
						}
                    }
                        break;
                    case "text": if (ej.isNullOrUndefined(options[option]) || options[option] === "") this._clearTextboxValue();
                    else { this._setText(options[option]); options[option] = this.model.text; } break;
                    case "itemValue": this._setItemValue(options[option]); break;
                    case "enableRTL": this._setRTL(options[option]); break;
                    case "enabled": this._enabled(options[option]); break;
                    case "height": this._changeHeight(options[option]); break;
                    case "width": this._changeWidth(options[option]); break;
                    case "popupHeight": this.model.popupHeight = options[option]; this._setListHeight(options[option]); break;
                    case "popupWidth": this.model.popupWidth = options[option]; this._setListWidth(); break;
                    case "minPopupHeight": this.model.minPopupHeight = options[option]; this._setListHeight(options[option]); break;
                    case "minPopupWidth": this.model.minPopupWidth = options[option]; this._setListWidth(); break;
                    case "maxPopupHeight": this.model.maxPopupHeight = options[option]; this._setListHeight(options[option]); break;
                    case "maxPopupWidth": this.model.maxPopupWidth = options[option]; this._setListWidth(); break;
                    case "cssClass": this._changeSkin(options[option]); break;
                    case "showCheckbox": this.model.showCheckbox = options[option];
                        var _text = this.model.text;
                        var _textes = this.model.text ? this.model.text.split(this.model.delimiterChar) : this.model.text;
                        this._raiseEvents = false;
                        this._clearTextboxValue();
                        this._raiseEvents = true;
                        this._checkboxHideShow(options[option]);
                        if (this.model.showCheckbox || (this.model.multiSelectMode != "none")) {
                            if (this.model.multiSelectMode == "visualmode")
                                this._renderBoxModel();
                            this._setText(_text);
                        }
                        else if (_textes && _textes.length)
                            this._setText(_textes[0]);
                        if (this._isPopupShown())
                            this._setListPosition();
                        break;
                        /* will depreciate with checkAll  Method*/
                    case "checkAll": this._setCheckAll(options[option]); return false; break;
                        /* will depreciate with uncheckAll  Method*/
                    case "uncheckAll": this._setUncheckAll(options[option]); return false; break;
                    case "watermarkText": this._changeWatermark(options[option]); break;
                    case "validationRules":
                        if (this.element.closest("form").length != 0) {
                            if (this.model.validationRules != null) {
                                this.element.rules('remove');
                                this.model.validationMessage = null;
                            }
                            this.model.validationRules = options[option];
                            if (this.model.validationRules != null) {
                                this._initValidator();
                                this._setValidation();
                            }
                        }
                        break;
                    case "locale":
                        this.model.locale = options[option];
                        this._updateLocalConstant();
                        break;
                    case "validationMessage":
                        if (this.element.closest("form").length != 0) {
                            this.model.validationMessage = options[option];
                            if (this.model.validationRules != null && this.model.validationMessage != null) {
                                this._initValidator();
                                this._setValidation();
                            }
                        }
                        break;
                    case "showRoundedCorner": this._roundedCorner(options[option]); this.model.showRoundedCorner = options[option]; break;
                    case "showPopupOnLoad": this._setInitialPopup(options[option]); break;
                    case "targetID": this.model.targetID = options[option]; this._showFullList(); break;
                        /* will depreciate with selectedIndex  Method*/
                    case "selectedItemIndex":
                    case "selectedIndex":
                        this._selectItemByIndex(options[option]);
                        this.model.selectedItemIndex = this.model.selectedIndex = options[option];
                        break;
                        /* will depreciate with unselectItemByIndex API Method*/
                    case "unselectItemByIndex": this._unselectItemByIndex(options[option]); break;
                        /* will depreciate with disableItemsByIndex API Method*/
                    case "disableItemsByIndex": this._disableItemByIndex(options[option]); break;
                        /* will depreciate with enableItemsByIndex API Method*/
                    case "enableItemsByIndex": this._enableItemByIndex(options[option]); break;
                        /* will depreciate with selectedIndices  Method*/
                    case "selectedItems":
                    case "selectedIndices":
                        this._selectCheckedItem(options[option]);
                        options[option] = this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
                        break;
                    case "multiSelectMode":
                        if (this.model.multiSelectMode == "visualmode") {
                            this._swapUlandInput(false);
                            this._ulBox.remove();                         
                            this._ulBox = null;                     
                        }
                        this.model.multiSelectMode = options[option];
                        var _text = this.model.text;
                        var _textes = this.model.text ? this.model.text.split(this.model.delimiterChar) : this.model.text;
                        this._raiseEvents = false;
                        this._clearTextboxValue();
                        this._raiseEvents = true;
                        if (this.model.showCheckbox || (this.model.multiSelectMode != "none")) {
                            if (this.model.multiSelectMode == "visualmode")
                                this._renderBoxModel();
                            this._setText(_text);
                        }
                        else {
                            this._setText(_textes[0]);
                            this.wrapper.find("input[name=" + this._name + "]").remove();
                        }
                        if (this._isPopupShown())
                            this._setListPosition();
                        break;
                        /* will deprecate with fields.groupBy and e-category element in target element binding */
                    case "allowGrouping":
                        this._setGroupingAndSorting("allowGrouping", options[option]);
                        break;
                    case "enableSorting":
                        this._setGroupingAndSorting("enableSorting", options[option]);
                        break;
                    case "htmlAttributes": this._addAttr(options[option]); break;
                    case "enablePopupResize": this.model.enablePopupResize = options[option];
                        (options[option]) ? this._enablePopupResize() : this.popupListWrapper.removeClass("e-resizable").find(".e-resizebar").remove() && this._hideResult();
                        break;
                    case "enableFilterSearch":
                        if (!options[option]) this._removeSearch();
                        else {
                            this.model.enableFilterSearch = true;
                            this._enableSearch();
                            break;
                        }
                        case "enableServerFiltering": 
                            this._enableSearch();
                            break; 
                }
            }
        },

        _clearTextboxValue: function () {
            this.element.val("");
            this._visibleInput.val("");
            this._updateValue("");
            this.selectedTextValue = this._selectedValue = this._hiddenValue = this.model.itemValue = "";
            this._updateText();
            this.selectedIndexValue = this._hiddenDelimiterIndex = this._activeItem = -1;
            this._selectedItemsID = []; this._selectedIndices = [];
            this.model.selectedItems = [];
            this.model.selectedIndices = [];
            this.selectedIndex(null);
            this.ultag.children("li").removeClass('e-hover').removeClass('e-active');
            if (this.model.showCheckbox) this._resetCheck();
            if (this.wrapper.find('ul.e-ul.e-boxes').length != 0) {
                this._ulBox.children("li").remove();
                if (this._name === "")
                    this.wrapper.find("input:hidden[id^='#']").remove();
                else
                    this.wrapper.find("input:hidden[id^='#'][name=" + this._name + "]").remove();
                $(this.element).attr("name", this._name);
            }
        },

        _destroy: function () {
            if( this.selectOptions) {
                if (!this.model.dataSource && this.docbdy ) 
                    this.docbdy.append(this.selectOptions.removeClass("e-dropdownlist e-js").show()).show();
                else this.selectOptions.insertAfter(this.wrapper).removeClass("e-dropdownlist e-js").show();
                this.element.remove();
            }
            else {
                this.element.insertAfter(this.wrapper);
                this.element.width(this.element.width() + this.dropdownbutton.outerWidth());
                this._visibleInput.removeClass("e-input ");
                this._setAttr( this.element[0], { 'accesskey': this.wrapper.attr('accesskey'), type:"text" });
                if (this._isWatermark) this._visibleInput.removeAttr("placeholder");
                this.element[0].value = "";
                this.element.removeAttr("aria-expanded aria-autocomplete aria-haspopup aria-owns accesskey role").css({"width": "", "display": "block"});
                (!this.model.dataSource) && this.docbdy && this.ultag.find("li").removeClass("e-active") && this.docbdy.append(this.ultag.html()).show();
            }
            this.wrapper.remove();
            this.container.off("mousedown", $.proxy(this._OnDropdownClick, this));
            this._hideResult();
            this.popupPanelWrapper.remove();
			this._unwireEvents();
        },


        _finalize: function () {
            if (this.value() == "" && this._visibleInput[0].value !== "")
                this._updateValue(this.element[0].value);
            if (this.value() !== this.element.val())
                this._setValue(this.value());
            if (this.model.text != this._visibleInput.val())
                this._setText(this.model.text);
            this.selectedIndex((this.selectedIndex() != -1) ? this.selectedIndex() : this.selectedItemIndex());
            if (this.selectedIndex() != -1) {
                this._selectItemByIndex(this.selectedIndex());
            } else if (this._selectedIndices.length > 0) {
                this._selectCheckedItem(this._selectedIndices);
            } if (this.model.disableItemsByIndex != null)
                this._disableItemByIndex(this.model.disableItemsByIndex);
            if (this.model.enableItemsByIndex != null)
                this._enableItemByIndex(this.model.enableItemsByIndex);
        },


        _initialize: function () {
            this._selectedIndices = this.model.selectedIndices.length > 0 ? this.model.selectedIndices : this.model.selectedItems;
            this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
            this.model.selectedIndex = this.model.selectedIndex != -1 ? this.model.selectedIndex : this.model.selectedItemIndex;
            if (this.element.is("select")) {
                this.selectelement = true;
                this._renderSelectToDropdown();
            }
            this._selectedItemsID = [];
            this.target = this.element[0];
            this._disabledItems = new Array();
            this._queryString = null;
            this.suggLen = 0;
            this._itemId = null;
            this.checkedStatus = false;
            this._incqueryString = "";
            this._activeItem = null;
            this.ddWidth = 0;
            this._initValue = true;
            this._virtualCount = 0;
            this._raiseEvents = true;
        },
        _renderSelectToDropdown: function () {
            var i, optionLength, optionText, item;
            this.inputElement = ej.buildTag("input.e-dropdownlist#" + this._id + "_input", "", {}, { "type": "text", "data-role": "none" });
            this.inputElement.insertAfter(this.element);
			if (this.element.attr("name")) {
                this.inputElement.attr("name", this.element.attr("name"));
                this.element.removeAttr("name");
            }
			this.selectOptions = this.element;
            this.selectOptions.attr('id', this._id);
			if( this.model.dataSource == null ) {
            this.optionDiv = ej.buildTag("div#" + this._id + "_list");
            this.optionDiv.insertAfter(this.inputElement);
            this.optionUl = ej.buildTag("ul");
            this.optionDiv.append(this.optionUl);

            this.selectOptionItems = this.element.children("option");
            optionLength = this.selectOptionItems.length;
            this.optionDummyUl = $();

            for (i = 0; i < optionLength; i++) {
                item = this.selectOptionItems[i], optionText = $(item).attr('label') ? $(item).attr('label') : item.innerHTML;
                if (optionText != null) {
                    this.optionLi = ej.buildTag("li", optionText, {}, { 'data-value': item.value, "unselectable": "on" });
                    this.optionDummyUl.push(this.optionLi[0]);
                    if ($(item).attr("selected")) {
                        if (this.model.showCheckbox)
                            if ($.inArray(i, this._selectedIndices) == -1) {
                                this._selectedIndices.push(i);
                                this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
                            }
                            else if (ej.isNullOrUndefined(this.selectedIndex())) this.selectedIndex(i);
                    }
                }
            }
            this.optionUl.append(this.optionDummyUl);

			}
            this.element.css('display', 'none');
            this.element = this.inputElement;
        },


        _render: function () {
            this._renderDropdown();
            this._setWatermark();
            this._renderPopupPanelWrapper();
            this._showFullList();
            this._roundedCorner(this.model.showRoundedCorner);
            //To call finalize() only local data source
            var source = this.model.dataSource;
            if (ej.DataManager && source instanceof ej.DataManager) {
                if (source.dataSource.offline && (source.dataSource.json && source.dataSource.json.length > 0)) {
                    var proxy = this;
                    proxy._finalize();
                }               
            }
            else this._finalize();
            if (!(ej.DataManager && this.model.dataSource instanceof ej.DataManager)){
                
                 this._finalize();
            }               
            this._setCheckAll(this.model.checkAll);
            if(this.element.attr("disabled") || $(this.selectOptions).attr("disabled"))this.disable();
        },

        _isEqualDataSource: function (source) {
            if (!this.model.dataSource || !source || !(this.model.dataSource.length === source.length) || (ej.DataManager && source instanceof ej.DataManager)) return false;
            var equal = true;
            for (var i = 0, len = this.model.dataSource.length; i < len; i++) {
                if (this.model.dataSource[i] !== source[i]) {
                    equal = false;
                    break;
                }
            }
            return equal;
        },

        _checkModelDataBinding: function (source, query) {
            this.element.val("");
            this._visibleInput.val("");
            this._updateValue("");
            this.selectedTextValue = this._selectedValue = this._hiddenValue = "";
            this._updateText();
            this.selectedIndexValue = this._hiddenDelimiterIndex = this._activeItem = -1;
            this._selectedItemsID = [];
            this.model.selectedItems = this.model.selectedIndices = this._selectedIndices = [];
            this.model.selectedIndex = this.model.selectedItemIndex = -1;
            if (this.model.multiSelectMode == "visualmode") this._destroyBoxModel();
            this.model.dataSource = source;
            this.model.query = query;
            this.ultag.empty();
            this._showFullList();
        },
        _initDataSource: function (source) {
            var proxy = this;
            if (ej.DataManager && source instanceof ej.DataManager) {
                proxy._addLoadingClass();
                if (!proxy._trigger("actionBegin", { requestFrom: "default" })) {
                    var queryPromise = source.executeQuery(this._getQuery());
                    queryPromise.done(function (e) {
                        proxy._trigger("actionSuccess", { e: e, requestFrom: "default" });
                        proxy._totalCount = e.count;
                        proxy._listItem(e.result);
                        proxy._removeLoadingClass();
                        proxy._renderPopupList();
                        proxy._finalize();

                    }).fail(function (e) {
                        proxy.model.dataSource = null;
                        proxy._addLoadingClass();
                        proxy._trigger("actionFailure", { e: e, requestFrom: "default" });
                    }).always(function (e) {
                        proxy._trigger("actionComplete", { e: e, requestFrom: "default" });
                    });
                }
            }
        },
        _listItem: function (list, type) {
            if (type == "add") {
                this.popupListItems.push(list);
                this._rawList.push(list);
            } else if ($.isArray(list)) {
                this.popupListItems = list.slice(0);
                this._rawList = list.slice(0);
            }
        },
        _getQuery: function (isLocal) {
            var remoteUrl, mapper = this.model.fields, queryManager = ej.Query();
            if (ej.isNullOrUndefined(this.model.query) && !this.model.template && !isLocal) {
                var column = [];
                for (var col in mapper) {
                    if (col !== "tableName" && mapper[col])
                        column.push(mapper[col]);
                }
                if (column.length > 0)
                    queryManager.select(column);
            }
            else if (this.model.query) queryManager = this.model.query.clone();

            if (this.model.allowVirtualScrolling) queryManager.requiresCount();
            if (this.model.itemsCount > 0) queryManager.take(this.model.itemsCount);

            remoteUrl = this.model.dataSource.dataSource;
            if (mapper)
                if ((remoteUrl && remoteUrl.url && !remoteUrl.url.match(mapper.tableName + "$")) || (remoteUrl && !remoteUrl.url) || (!remoteUrl))
                    !ej.isNullOrUndefined(mapper.tableName) && queryManager.from(mapper.tableName);

            return queryManager;
        },

        _addLoadingClass: function () {
            if (this._isPopupShown()) {
                this.popupListWrapper.addClass("e-load");
            } else {
                this.dropdownbutton.addClass("e-load");
                this.drpbtnspan.removeClass("e-icon e-arrow-sans-down");
            }
            this._readOnly = true;
        },
        _removeLoadingClass: function () {
            this.dropdownbutton.removeClass("e-load");
            this.drpbtnspan.addClass("e-icon e-arrow-sans-down");
            this._readOnly = false;
            this.popupListWrapper.removeClass("e-load");
        },

        _renderDropdown: function () {
            this.wrapper = ej.buildTag("span.e-ddl e-widget " + this.model.cssClass + "#" + this._id + "_wrapper", "", {}, { "tabindex": "0", "accesskey": this.element.attr("accesskey") });
            this.container = ej.buildTag("span.e-in-wrap e-box " + "#" + this._id + "_container");
            this.element.removeAttr('accesskey');            
			if(this.model.value == null && this.element.attr("value") != null)
				this.model.value = this.element.attr("value");				
			this.element.attr("value","").val("");
            if(!this._isIE8)
            this._setAttr(this.element[0], { "type":"hidden","role": "combobox", "aria-expanded": false, "aria-autocomplete": "list", "aria-haspopup": true, "aria-owns": this._id + "_popup" }).element.hide();
			else
			this._setAttr(this.element[0], {"role": "combobox", "aria-expanded": false, "aria-autocomplete": "list", "aria-haspopup": true, "aria-owns": this._id + "_popup" }).element.hide();			
            this.drpbtnspan = ej.buildTag("span.e-icon e-arrow-sans-down", "", {}, { "aria-label": "select", "unselectable": "on" });
            this.dropdownbutton = ej.buildTag("span.e-select#" + this._id + "_dropdown", "", {}, { "role": "button", "unselectable": "on" }).append(this.drpbtnspan);
            this.container.insertAfter(this.element);
            this.container.append(this.element);
            this.container.append(this.dropdownbutton);
            this.wrapper.insertBefore(this.container);
            this.wrapper.append(this.container);
            if (this.selectelement) {
                this.selectOptions.insertBefore(this.element);
            }
            this._visibleInput = ej.buildTag("input#" + this._id + "_hidden", "", {}).insertAfter(this.element);
            this._visibleInput.addClass("e-input ");
			this._setAttr(this._visibleInput[0],{ "readonly": "readonly", "tabindex": -1,"data-role": "none" });        
            if (!this._isWatermark) {
				var watermark=(this.model.watermarkText != null)? this.model.watermarkText:this._localizedLabels.watermarkText;
                this._hiddenSpan = ej.buildTag("span.e-input e-placeholder ").insertAfter(this.element);
                this._hiddenSpan.text(watermark);
                this._hiddenSpan.css("display", "none");
                this._hiddenSpan.on("mousedown", $.proxy(this._OnDropdownClick, this));
            }
            this._checkNameAttr();
            this._setDimentions();
            this._RightToLeft();
            this.ddWidth = (this.dropdownbutton.outerWidth() > 0) ? this.dropdownbutton.outerWidth() : 24;
            //Element not Maintain in Multiselection
            this.container.on("mousedown", $.proxy(this._OnDropdownClick, this));
        },

        _checkNameAttr: function () {
            this._name = ej.isNullOrUndefined(this.element.attr("name")) ? this._id : this.element.attr("name");
            this.element.attr("name", this._name);
        },
        _addAttr: function (htmlAttr) {
            var proxy = this;
            $.map(htmlAttr, function (value, key) {
				var keyName = key.toLowerCase();
                if (keyName == "class") proxy.wrapper.addClass(value); 
                else if (keyName == "disabled" && value == "disabled") proxy.disable();
                else if (keyName == "readOnly" && value == "readOnly") proxy.model.readOnly = true; 
                else if (keyName == "style") proxy.wrapper.attr(key, value);
				else if (ej.isValidAttr(proxy._visibleInput[0], key)) $(proxy._visibleInput).attr(key, value);
                else proxy.wrapper.attr(key, value)
            });
        },
        _renderBoxModel: function () {
            if (!ej.isNullOrUndefined(this._ulBox) || this.model.multiSelectMode != "visualmode") return false;
            this._ulBox = ej.buildTag("ul.e-ul e-boxes");
            this.container.prepend(this._ulBox);
            this._ulBox.css('min-height', '30px');
            this._ulBox.css('display', 'none');
            this._on(this.container, "click", function (e) {
                if (!this.model.enabled) return false;
                var $target = $(e.target);
                if ($target.hasClass("e-options")) {
                    if (!e.ctrlKey && $target.siblings().hasClass("e-active")) this._removeActive();
                    if ($target.hasClass("e-active")) $target.removeClass("e-active");
                    else $target.addClass("e-active");
                }
                if (!e.ctrlKey && ($target.hasClass("e-boxes"))) this._removeActive();
            });
        },

        _renderPopupPanelWrapper: function () {
            var oldWrapper = $("#" + this.element[0].id + "_popup_wrapper").get(0);
            if (oldWrapper)
                $(oldWrapper).remove();
            this.popupPanelWrapper = ej.buildTag("div#" + this._id + "_popup_wrapper");
            $('body').append(this.popupPanelWrapper);
            this.popupListWrapper = ej.buildTag("div.e-ddl-popup e-box e-widget  e-popup#" + this._id + "_popup_list_wrapper", "", { display: "none", overflow: "hidden" });
            this.popupList = ej.buildTag("div#" + this._id + "_popup", { "tabIndex": 0 });
            this.popupListWrapper.addClass(this.model.cssClass);
            this.popup = this.popupList;
            this.popupScroller = ej.buildTag("div"); this.ultag = ej.buildTag("ul.e-ul", "", {}, { "role": "listbox" });
            this.popupScroller.append(this.ultag);
            this.popupList.append(this.popupScroller);
            if (this.model.headerTemplate) {
                this.headerTemplate = $("<div>").append(this.model.headerTemplate);
                this.popupListWrapper.append(this.headerTemplate);
            }
            this.popupListWrapper.append(this.popupList);
            this.popupPanelWrapper.append(this.popupListWrapper);
            this.ultag.on({ mouseenter: $.proxy(this._OnMouseEnter, this), mouseleave: $.proxy(this._OnMouseLeave, this), click: $.proxy(this._OnMouseClick, this)}, "li:not('.e-category')");
            if (ej.isTouchDevice())
             {
             this.ultag.on({tap:$.proxy(this._OnMouseEnter, this) }, "li:not('.e-category')");
               }
            $(window).on("resize", $.proxy(this._OnWindowResize, this));

        },

        _updateText: function () {
            this.model.text = this._visibleInput.val() == "" ? null : this._visibleInput.val();
        },
        _updateValue: function (val) {
            this.value(val == "" ? null : val);
        },
        _setGroupingAndSorting: function (prop, value) {
            this.model[prop] = value;
            var oldValue = this.model.text;
            this._updateValue("");
            this._selectedIndices = [];
            this.ultag.empty();
            this._showFullList();
            if (this.model.showCheckbox && oldValue) {
                var values = oldValue.split(this.model.delimiterChar);
                for (var i = 0; i < values.length; i++)
                    this.selectItemByText(values[i]);
            }
            else
                this.selectItemByText(oldValue);
        },
        _setSortingList: function () {
            var sortedlist = document.createElement("ul"), i, sortitems;
            $(sortedlist).append(this.itemsContainer.children());
            if (this.model.allowGrouping || $(sortedlist).find(">.e-category").length > 0) {
                this.popupListWrapper.addClass("e-atc-popup");
                for (i = 0; i < $(sortedlist).find(">.e-category").length; i++) {
                    sortitems = $(sortedlist).find(">.e-category").eq(0).first().nextUntil(".e-category").get();
                    this._setSortList(sortedlist, sortitems);
                }
            }
            else {
                $(sortedlist).children('>.e-category').remove();
                sortitems = $(sortedlist).children('li').get();
                this._setSortList(sortedlist, sortitems);
            }
            this.itemsContainer = $(sortedlist);
        },
        _setSortList: function (sortedlist, sortitems) {
            sortitems.sort(function (objA, objB) {
                var sortA = $(objA).text().toUpperCase();
                var sortB = $(objB).text().toUpperCase();
                return (sortA < sortB) ? -1 : (sortA > sortB) ? 1 : 0;
            });
            if (this.model.sortOrder == "descending") sortitems.reverse();
            if (this.model.allowGrouping || $(sortedlist).find(">.e-category").length > 0) {
                $(sortedlist).append($("<li>").text($(sortedlist).find(">.e-category").eq(0).text()).addClass("e-category"));
                $(sortedlist).find(">.e-category").eq(0).remove();
            }
            $.each(sortitems, function (index, item) {
                $(sortedlist).append(item);
            });
        },

        _renderPopupList: function () {
            this._doDataBind();
            this._renderRemaining();
        },
        _renderRemaining: function () {
            var proxy = this;
            this._dropbtnRTL();
            if (this.model.enableFilterSearch) this._enableSearch();
            if (this.model.enablePopupResize) this._enablePopupResize();
            if (this.model.allowVirtualScrolling && this.model.virtualScrollMode == "normal") {
                if (this._totalCount && this._totalCount > 0) {
                    this._totalHeight = this._totalCount * 29;
                    this._totalPages = this._totalCount / (this.model.itemsCount * 29);
                    this._loadedItemHeight =  this._getLi().length * 29;
                    this._getLi().attr("page", 0);
                    this._virtualPages = [0];
                    this.ultag.append($("<span>").addClass("e-virtual").css({ "height": this._totalHeight - this._loadedItemHeight, "display": "block" }));
                }
            }
            this._virtualUl = this.ultag.clone(true);
            this._setListWidth();
            this._setListHeight();
			if (!this._isSingleSelect()) {
                if (this.model.showCheckbox) this._checkboxHideShow(this.model.showCheckbox);
                else this._multiItemSelection(this._getLi());
            }
            this._setUncheckAll(this.model.uncheckAll);
            this.popupScroller.css({ "height": "", "width": "" });
            this.popupList.ejScroller({
                height: this._getPopupHeight(), width: 0, scrollerSize: 20, scroll: function (e) {
                    if (proxy.model.allowVirtualScrolling) proxy._onScroll(e);
                }
            });
            this.scrollerObj = this.popupList.ejScroller("instance");
            this.popupList.find("div.e-scrollbar div").attr("unselectable", "on");
			this._setListPosition();
            this.popupListWrapper.css({ 'display': 'none', 'visibility': 'visible' });
            this._changeSkin(this.model.cssClass);
            this.model.showPopupOnLoad && this._showResult();
           
        },

        _enableSearch: function () {
            if (this.model.enableFilterSearch)
                if (!this.inputSearch) {
                    this.inputSearch = ej.buildTag("input#" + this._id + "_inputSearch.e-input", "", {}, { "type": "text", "data-role": "none" });
                    this.popupListWrapper.prepend($("<span>").addClass("e-atc e-search").append($("<span>").addClass("e-in-wrap ").append(this.inputSearch).append($("<span>").addClass(" e-icon e-search"))));
                    var debounceListener = (this.model.enableServerFiltering) ? this._debounce(this._OnSearchEnter, 200): this._OnSearchEnter;
                    this._on(this.inputSearch, "keyup", debounceListener)._on(this.inputSearch, "keydown", function(args){
						var keyCode = args.keyCode || args.which; 
						  if (keyCode == 9) { 
						    args.preventDefault(); 
						    this.wrapper.focus();
							this._hideResult();
						  } 
					});
                }
        },
        _removeSearch: function () {
            this.model.enableFilterSearch = false;
            this.popupListWrapper.find(".e-atc.e-search").remove();
            if (this._isPopupShown()) this.hidePopup();
            this.inputSearch = null;
        },

        _OnSearchEnter: function (e) {
            var proxy = this;
            if ($.inArray(e.keyCode, [38, 40, 13]) != -1 && this.ultag.find("li.e-nosuggestion").length <= 0) {
                if (e.keyCode == 13) this._OnKeyUp(e);
                else this._OnKeyDown(e);
            }
            else {
                this._activeItem = -1;
                this._queryString = this.inputSearch.val();
                if (this._queryString == "" && this._virtualUl) {
                    var args = { searchString: this._queryString, searchQuery: null, items: this._rawList };
                    this._trigger("search", args);
                    this._resetList();
                    this._updateSelectedIndexByValue(this.value());
                    this._refreshScroller();
                    this._setListPosition();
                } else {
                    this._mapFields();
                    var searchQuery = this._addSearchQuery(ej.Query(), !this._isPlainType(this._rawList));
                    var args = { searchString: this._queryString, items: this._rawList, searchQuery: searchQuery };
                    this.popupListWrapper.find(".e-atc.e-search .e-search").addClass("e-cross-circle").removeClass("e-search");
                    this._on(this.popupListWrapper.find(".e-atc.e-search .e-cross-circle"), "mousedown", this._refreshSearch);
                    if (!this._trigger("search", args)){ 
                        proxy._onActionComplete(args); 
                }
                  
                }
            } 
        },
     _debounce: function(eventFunction, delay) { 
         var out;
         var proxy = this;
        return function (){
            var args= arguments;
            var later = function(){
                out = null;
                return eventFunction.apply(proxy, args);
            };
            clearTimeout(out);
            out = setTimeout(later, delay);
        };
    },


        _onActionComplete: function(args){
            var proxy = this; 
            this._queryString = this.inputSearch.val();
                        var searchQuery = this._addSearchQuery(ej.Query(), !this._isPlainType(this._rawList));
                    var args = { searchString: this._queryString, items: this._rawList, searchQuery: searchQuery }; 
                if(ej.DataManager && this.model.dataSource instanceof ej.DataManager && this.model.enableServerFiltering && window.getSelection().type == "Caret"){
                        var searchQuery = args.searchQuery.clone();
                        var queryPromise = proxy.model.dataSource.executeQuery(searchQuery);
                        queryPromise.done(function (e) { 
                        proxy._filterSearch(args.searchQuery, e); 
                    });
                        }
                        else{
                            proxy._filterSearch(searchQuery, args);
                        }
        },
        _refreshSearch: function () {
            this._resetSearch();
            this._refreshPopup();
        },
        _filterSearch: function (searchQuery, args) {
            var flag = false; 
            this.resultList = args.result ? args.result : ej.DataManager(this._rawList).executeLocal(searchQuery);
            if (this.resultList.length == 0) {
                flag = true;
                this.resultList.push(this._getLocalizedLabels("emptyResultText"));
            }
            this.popupListItems = this.resultList;
            this.ultag.empty();
            this._isPlainType(this.popupListItems) ? this._plainArrayTypeBinding(this.resultList) :
            this._objectArrayTypeBinding(this.resultList, "search");
            if (flag && this.ultag.find("li").length == 1) {
                this.ultag.find("li").eq(0).addClass("e-nosuggestion");
            }
            if (this.model.showCheckbox && !flag) {
                this._appendCheckbox( this._getLi());
            }
            this._onSearch = true;
            var value = this.value(), visibleText = this._visibleInput[0].value;
            this._setValue(this.value());
			var checkVal = typeof this.model.value === "function" ? this.model.value() : this.model.value;
			if(checkVal != value){
				this.element[0].value = value;
				this._visibleInput[0].value = visibleText;
				this.model.text = visibleText == "" ? null : visibleText;
				if (this.value() != value && !(this.value() == null && value =="" )) {
					this._updateValue(value);
				}
			}
            this._onSearch = false;
            this._updateSelectedIndexByValue(this.value());
            this._refreshScroller();
            this._setListPosition();
        },
        _updateSelectedIndexByValue: function (value) {
            if (!value || !this.model.enableFilterSearch) return;
            this._selectedIndices = this.model.selectedItems = this.model.selectedIndices = [];
            this._virtualList = this._virtualUl.children("li:not('.e-category')");
            var item = this._toArray(value);
            for (var k = 0; k < item.length; k++) {
                for (var m = 0; m < this._virtualList.length; m++) {
                    if (item[k] == this._getIndexedValue(this._virtualList[m])) {
                        this._selectedIndices.push(m);
                        break;
                    }
                }
            }
            this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
        },
        _getIndexedValue: function (item) {
            return this._getAttributeValue(item) ? this._getAttributeValue(item) : item.innerText;
        },

        _resetSearch: function () {
            if (!this.inputSearch || !(this.model && this.model.enableFilterSearch)) return;
            if (this.inputSearch.val() != "" && this._virtualUl) {
                this.inputSearch.val("");
                this._resetList();
            }
        },
        _resetList: function () {
            if (this.popupListWrapper.find(".e-atc.e-search .e-cross-circle").length == 1) {
                this.popupListWrapper.find(".e-atc.e-search .e-cross-circle").addClass("e-search").removeClass("e-cross-circle");
                this._off(this.popupListWrapper.find(".e-atc.e-search .e-cross-circle"), "mousedown", this._refreshSearch);
            }
            if(this.model.enableServerFiltering){
			var field = (this.model.fields && this.model.fields.value) ? this.model.fields["value"] : "value";
			for (var i=0; i< this._rawList.length; i++){
				if(this._rawList[i][field] == this._selectedValue)
					this._searchresult= null;
			} 
			if(!ej.isNullOrUndefined(this._searchresult) && !(this.model.allowVirtualScrolling && this.model.virtualScrollMode == "normal"))
                this.addItem(this._searchresult);
            }
            this._listItem(this._rawList);
            this.ultag.empty().append(this._virtualUl.children().clone(true));           
            // this._onSearch variable will restrict the change and select event on searching
            this._onSearch = true;
            this._setValue(this.value());
            this._onSearch = false;
			this._searchresult = [];
        },

       
        _addSearchQuery: function (query, checkMapper) {
            var bindTo = "";
            if (checkMapper) {
                var mapper = this.model.fields;
                bindTo = (mapper && mapper.text) ? mapper["text"] : "text";
            }
            if (this._queryString) query.where(bindTo, this.model.filterType, this._queryString, !this.model.caseSensitiveSearch);
            if (this.model.itemsCount > 0) query.take(this.model.itemsCount);
            return query;
        },

        _targetElementBinding: function () {
            var predecessor = this.element.parents().last();
            this.docbdy = this.model.targetID ? predecessor.find("#" + this.model.targetID) : this.optionDiv ? this.optionDiv : null;
            if (!this.docbdy) return false;
            this.itemsContainer = this.docbdy[0].nodeName == "UL" ? this.docbdy : this.docbdy.children("ol,ul");
            if ((this.model.allowGrouping || this.itemsContainer.find(">.e-category").length > 0) && !this.model.enableSorting) {
                this.popupListWrapper.addClass("e-atc-popup");
                for (var k = 0; k < this.itemsContainer.find(">.e-category").length; k++) {
                    var ele = this.itemsContainer.find(">.e-category").eq(k);
                    ele.replaceWith($("<li>").text(ele.text()).addClass("e-category"));
                }
            }
            else if (this.model.enableSorting) this._setSortingList();
            this.itemsContainer.children("ol,ul").remove();
            this.items = this.itemsContainer.children('li');
            this.items.children("img,div").addClass("e-align");
            this._listItem([]);
            for (var i = 0; i < this.items.length; i++) {
                var fieldText = $(this.items[i]).text(), fieldValue = this._getAttributeValue(this.items[i]);
                if(!$(this.items[i]).attr("data-value")) $(this.items[i]).attr("data-value", fieldValue ? fieldValue : fieldText);
                this._listItem({ text: fieldText, value: fieldValue ? fieldValue : fieldText }, "add");
            }
            //This will append the list with the popup wrapper
            this.ultag.empty().append(this.itemsContainer.children());
			this.ultag.children('li').attr("role", "option").attr("unselectable", "on");		
            this.docbdy.css({ 'display': 'none' }).children("ol,ul").remove();
        },
        _plainArrayTypeBinding: function (list) {
            this.dummyUl = $();
            if (this.model.enableSorting) {
                list.sort();
                if (this.model.sortOrder == "descending") list.reverse();
            }
            if (list.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    if (!ej.isNullOrUndefined(list[i])) {
                        var litag = ej.buildTag("li", list[i], {}, { 'data-value': list[i], "unselectable": "on" });
                        this.dummyUl.push(litag[0]);
                    }
                }
                this.ultag.append(this.dummyUl);
                this._trigger('dataBound', { data: list });
            }

        },
        _mapFields: function () {
            this.model.fields.groupBy = this.model.fields.groupBy ? this.model.fields.groupBy : this.model.fields.category;
            var mapper = this.model.fields;
            this.mapFld = { _id: null, _imageUrl: null, _imageAttributes: null, _spriteCSS: null, _text: null, _value: null, _htmlAttributes: null, _selected: null };
            this.mapFld._id = (mapper && mapper.id) ? mapper["id"] : "id";
            this.mapFld._imageUrl = (mapper && mapper.imageUrl) ? mapper["imageUrl"] : "imageUrl";
            this.mapFld._imageAttributes = (mapper && mapper.imageAttributes) ? mapper["imageAttributes"] : "imageAttributes";
            this.mapFld._spriteCSS = (mapper && mapper.spriteCssClass) ? mapper["spriteCssClass"] : "spriteCssClass";
            this.mapFld._text = (mapper && mapper.text) ? mapper["text"] : "text";
            this.mapFld._value = (mapper && mapper.value) ? mapper["value"] : "value";
            this.mapFld._htmlAttributes = (mapper && mapper.htmlAttributes) ? mapper["htmlAttributes"] : "htmlAttributes";
            this.mapFld._selected = (mapper && mapper.selected) ? mapper["selected"] : "selected";
            this.mapFld._category = (mapper && mapper.groupBy) ? mapper["groupBy"] : "groupBy";
        },
        _doDataBind: function () {
            var source = this.model.dataSource, list = this.popupListItems;
            !source || !list || !list.length || list.length < 1 ? this._targetElementBinding()
            : this._isPlainType(list) ? this._plainArrayTypeBinding(list)
            : this._objectArrayTypeBinding(list);
        },
        _isPlainType: function (list) {
            return typeof list[0] != "object";
        },
        _objectArrayTypeBinding: function (list, from) {
            this.dummyUl = $();
            this._mapFields();
            if (this.model.enableSorting) {
                var sortQuery = ej.Query().sortBy(this.mapFld._text, this.model.sortOrder, true);
                list = ej.DataManager(list).executeLocal(sortQuery);
				this.popupListItems = list;
            }
            if (this.model.allowGrouping || this.model.fields.groupBy) {
                this.popupListWrapper.addClass("e-atc-popup");
                var mapCateg = this.mapFld._category, groupedList, groupQuery;
                groupQuery = ej.Query().group(mapCateg);
                if (!this.model.enableSorting) groupQuery.queries.splice(0, 1);
                groupedList = ej.DataManager(list).executeLocal(groupQuery);
                this._swapUnCategorized(groupedList);
                (from == "search") ? this.popupListItems = [] : this._listItem([]);
                for (var i = 0; i < groupedList.length; i++) {
                    if (groupedList[i].key)
                        this.ultag.append(ej.buildTag("li.e-category", groupedList[i].key).attr("role", "option")[0]);
                    this._generateLi(groupedList[i].items, this.mapFld);
                    this.ultag.append(this.dummyUl);
                    for (var j = 0; j < groupedList[i].items.length; j++) {
                        (from == "search") ? this.popupListItems.push(groupedList[i].items[j]) : this._listItem(groupedList[i].items[j], "add");
                    }
                }
            }
            else {
                this._generateLi(list, this.mapFld);
                this.ultag.append(this.dummyUl);//ko binding
            }
            this._trigger('dataBound', { data: list });
        },
        _onScroll: function (e) {
            if (!e.scrollTop) return;
            var scrollerPositon = e.scrollTop, proxy = this;
            var source = this.model.dataSource;
            if (proxy.model.allowVirtualScrolling && proxy.model.virtualScrollMode == "continuous") {
                var list, queryPromise, skipQuery = ej.Query().skip(proxy._rawList.length).take(proxy.model.itemsCount).clone();
                if (scrollerPositon >= Math.round($(proxy.popupList).find("ul,ol").height() - $(proxy.popupList).height()) && proxy._rawList.length < proxy._totalCount) {
                    proxy._addLoadingClass();
                    if (ej.DataManager && proxy.model.dataSource instanceof ej.DataManager && !ej.isNullOrUndefined(proxy.model.dataSource.dataSource.url)) {
                        if (proxy.inputSearch && proxy.inputSearch.val() != "" && this.model.enableServerFiltering) 
                         skipQuery = proxy._addSearchQuery(ej.Query(), !proxy._isPlainType(proxy._rawList)).skip(proxy._getLi().length).clone();
                        else
                        skipQuery = proxy._getQuery().skip(proxy._rawList.length).take(proxy.model.itemsCount).clone();
                        if (!proxy._trigger("actionBegin", { requestFrom: "scroll" })) {
                            queryPromise = proxy.model.dataSource.executeQuery(skipQuery);
                            queryPromise.done(function (e) {
                                if (!ej.isNullOrUndefined(proxy.model.value) && proxy.model.enableServerFiltering)
                                    e.result = proxy._removeSelectedValue(e.result);
                                proxy.addItem(e.result);
                                proxy._removeLoadingClass();
                                proxy._trigger("actionSuccess", { e: e, requestFrom: "scroll" });
                            }).fail(function () {
                                proxy.model.dataSource = null;
                                proxy._removeLoadingClass();
                                proxy._trigger("actionFailure", { e: e, requestFrom: "scroll" });
                            }).always(function (e) {
                                proxy._trigger("actionComplete", { e: e, requestFrom: "scroll" });
                            });
                        }
                    }
                    else if (ej.DataManager && source instanceof ej.DataManager && source.dataSource.offline && (source.dataSource.json && source.dataSource.json.length > 0)) {
                                proxy.addItem(this._localDataVirtualScroll());
                                window.setTimeout(function () {
                                proxy._removeLoadingClass();
                            }, 100);
                    }
                    else {
                        list = ej.DataManager(proxy.model.dataSource).executeLocal(skipQuery);
                        proxy.addItem(proxy._removeSelectedValue(list));
                        proxy._removeLoadingClass();
                    }
                }
            } else if (proxy.model.allowVirtualScrolling && proxy.model.virtualScrollMode == "normal") {

                window.setTimeout(function () {
                    if (proxy._virtualCount == 0) {
                        proxy._loadList();
                    }
                }, 300);

            }

        },
        _localDataVirtualScroll: function () {
            var proxy = this;
            var selectValue = (!ej.isNullOrUndefined(proxy.value())) ? proxy.value().split(proxy.model.delimiterChar).length : 0;
            var _rawlist = (proxy._checkValue) ? proxy._rawList.length - selectValue : proxy._rawList.length;
            var queryPromise = ej.DataManager(proxy.model.dataSource.dataSource.json).executeLocal(ej.Query().skip(_rawlist).take(proxy.model.itemsCount).clone());
            return proxy._removeSelectedValue(queryPromise); 
        },
        _removeSelectedValue: function (data) { 
            if (!ej.isNullOrUndefined(this.value())) {
                var listitems = this.value().split(this.model.delimiterChar);
                for (var k = 0; k < listitems.length; k++) {
                    for (var m = 0; m < data.length; m++) {
                        if (data[m][this.mapFld._value] == listitems[k]) 
                            data.splice(data.indexOf(data[m]), 1);
                    }
                }
                return data;
            }
            else
                return data;
        },
        _loadList: function () {
            this._virtualCount++;
            var source = this.model.dataSource;
            var top = this.scrollerObj.scrollTop(), proxy = this, prevIndex = 0, prevPageLoad, nextIndex = null;
            this._currentPage = Math.round(top / (29 * this.model.itemsCount));
            if (($.inArray(this._currentPage, this._virtualPages.sort(function (a, b) { return a - b; }))) != -1) {
                if (this._currentPage == 0) {
                    if (($.inArray(this._currentPage + 1, this._virtualPages)) != -1) {
                        this._virtualCount--;
                        return false;
                    } else {
                        this._currentPage = this._currentPage + 1;
                    }
                }
                else if (($.inArray(this._currentPage - 1, this._virtualPages)) != -1) {
                    if (($.inArray(this._currentPage + 1, this._virtualPages)) != -1) {
                        this._virtualCount--;
                        return false;
                    } else {
                        this._currentPage = this._currentPage + 1;
                    }
                }
                else {
                    this._currentPage = this._currentPage - 1;
                }
            }
            prevPageLoad = !($.inArray(this._currentPage - 1, this._virtualPages) != -1);
            this._addLoadingClass();
            for (var i = this._virtualPages.length - 1; i >= 0; i--) {
                if (this._virtualPages[i] < this._currentPage) {
                    prevIndex = this._virtualPages[i];
                    if (!(i + 1 == this._virtualPages.length))
                        nextIndex = this._virtualPages[i + 1];
                    break;
                }
            }

            var firstArg = prevPageLoad ? (this._currentPage - 1) * this.model.itemsCount : this._currentPage * this.model.itemsCount;
            var skipQuery = ej.Query().range(firstArg, this._currentPage * this.model.itemsCount + this.model.itemsCount), queryPromise, list;
            if (ej.DataManager && proxy.model.dataSource instanceof ej.DataManager && !ej.isNullOrUndefined(proxy.model.dataSource.dataSource.url)) {
                var skipParam = prevPageLoad ? (this._currentPage - 1) * this.model.itemsCount : this._currentPage * this.model.itemsCount;
                skipQuery = this._getQuery().skip(skipParam);
                if (prevPageLoad) {
                    for (i = 0; i < skipQuery.queries.length; i++) {
                        if (skipQuery.queries[i].fn == "onTake") {
                            skipQuery.queries.splice(i, 1);
                            break;
                        }
                    }
                    skipQuery.take(2 * this.model.itemsCount);
                }
                if (!proxy._trigger("actionBegin", { requestFrom: "scroll" })) {
                   if (proxy.inputSearch && proxy.inputSearch.val() != "" && this.model.enableServerFiltering) var skipQuery = proxy._addSearchQuery(ej.Query(), !proxy._isPlainType(proxy._rawList)).skip(proxy._getLi().length).clone();
                    queryPromise = proxy.model.dataSource.executeQuery(skipQuery);
                    queryPromise.done(function (e) {
                        e.result = proxy._removeSelectedValue(e.result);
                        proxy._appendVirtualList(e.result, prevIndex, proxy._currentPage, nextIndex, prevPageLoad);
                        proxy._removeLoadingClass();
                        proxy._trigger("actionSuccess", { e: e, requestFrom: "scroll" });
                    }).fail(function (e) {
                        proxy._virtualCount--;
                        proxy._removeLoadingClass();
                        proxy._trigger("actionFailure", { e: e, requestFrom: "scroll" });
                    }).always(function (e) {
                        proxy._trigger("actionComplete", { e: e, requestFrom: "scroll" });
                    });
                }
            }
            else if (ej.DataManager && source instanceof ej.DataManager && source.dataSource.offline && (source.dataSource.json && source.dataSource.json.length > 0)) {
                proxy._appendVirtualList(this._localDataVirtualScroll(), prevIndex, proxy._currentPage, nextIndex, prevPageLoad);
                window.setTimeout(function () {
                    proxy._removeLoadingClass();
                }, 100);
            }
            else {
                list = ej.DataManager(proxy.model.dataSource).executeLocal(skipQuery);
                proxy._appendVirtualList(proxy._removeSelectedValue(list), prevIndex, proxy._currentPage, nextIndex, prevPageLoad);
                proxy._removeLoadingClass();
            }
        },
        _appendVirtualList: function (list, prevIndex, currentIndex, nextIndex, prevPageLoad) {
            this._virtualCount--;
            this.ultag.find("span.e-virtual").remove();
            if (!ej.isNullOrUndefined(this.activeItem)) this.activeItem.attr("page", "0");
            if (($.inArray(currentIndex, this._virtualPages.sort(function (a, b) { return a - b; }))) != -1) return false;
            if (prevPageLoad && ($.inArray(currentIndex - 1, this._virtualPages.sort()) != -1)) {
                list.splice(0, this.model.itemsCount);
                prevPageLoad = false;
            }
            var items = this.model.itemsCount, tempUl = $("<ul>"), firstVirtualHeight, secondVirtualHeight;
            firstVirtualHeight = prevPageLoad ? ((currentIndex - 1) * items * 29) - (prevIndex * items + items) * 29 : (currentIndex * items * 29) - (prevIndex * items + items) * 29;
            if (firstVirtualHeight != 0) tempUl.append($("<span>").addClass("e-virtual").css({ display: "block", height: firstVirtualHeight }));
            this._mapFields();
            this._generateLi(list, this.mapFld);
            $(this.dummyUl).attr("page", currentIndex);
            if (prevPageLoad) {
                $(this.dummyUl).slice(0, items).attr("page", currentIndex - 1);
            }
            if (this.model.showCheckbox) {
                this._appendCheckbox(this.dummyUl);
            }
            tempUl.append(this.dummyUl);
            secondVirtualHeight = (currentIndex * items + items) * 29;
            if (nextIndex != null) secondVirtualHeight = (nextIndex * items * 29) - secondVirtualHeight;
            else secondVirtualHeight = this.ultag.height() - secondVirtualHeight;
            if (secondVirtualHeight != 0) tempUl.append($("<span>").addClass("e-virtual").css({ display: "block", height: secondVirtualHeight }));
            if (this.model.itemsCount > 0 && this.value() != "" && (this.model.dataSource instanceof ej.DataManager && this.model.dataSource.dataSource.offline))
                var selector = this.ultag.find("li").last();
            else
                var selector = this.ultag.find("li[page=" + prevIndex + "]").last();
            selector.next().remove();
            tempUl.children().insertAfter(selector);
            this._virtualPages.push(currentIndex);
            if (prevPageLoad) this._virtualPages.push(currentIndex - 1);
            for (var i = 0; i < list.length; i++) {
                this._listItem(list[i], "add");
            }
            this._virtualUl = this.ultag.clone(true);
            this._renderBoxModel();
        },

        _generateLi: function (list, mapFld) {
            this.mapFld = mapFld;
            this.dummyUl = [];
            if (!list || !list.length || list.length < 1) return false;
            for (var i = 0; i < list.length; i++) {
                var _did = this._getField(list[i], this.mapFld._id),
                    _dimageUrl = this._getField(list[i], this.mapFld._imageUrl),
                    _dimageAttributes = this._getField(list[i], this.mapFld._imageAttributes),
                    _dspriteCss = this._getField(list[i], this.mapFld._spriteCSS),
                    _dtext = this._getField(list[i], this.mapFld._text),
                    _dvalue = this._getField(list[i], this.mapFld._value),
                    _dhtmlAttributes = this._getField(list[i], this.mapFld._htmlAttributes),
                    _dselected = this._getField(list[i], this.mapFld._selected),
                    litag = document.createElement("li");

                if (!ej.isNullOrUndefined(_dvalue) && _dvalue.toString().length > 0) {
                    litag.setAttribute('data-value', typeof _dvalue == "object" ? JSON.stringify(_dvalue) : _dvalue);
                }
                else {
                     litag.setAttribute('data-value', _dtext);
                }
                if (!ej.isNullOrUndefined(_did) && (_did !== ""))
                    litag.setAttribute('id', _did);
                if (!ej.isNullOrUndefined(_dhtmlAttributes) && (_dhtmlAttributes != "")) {
                    this._setAttr(litag, _dhtmlAttributes);
                }

                if (this.model.template) {
                    $(litag).append(this._getTemplatedString(list[i]));
                } else {
                    if (!ej.isNullOrUndefined(_dimageUrl) && (_dimageUrl != "")) {
                        var imgtag = document.createElement("img");
                        this._setClass(imgtag, "e-align")._setAttr(imgtag, { 'src': _dimageUrl, 'alt': _dtext });
                        if ((_dimageAttributes) && (_dimageAttributes != "")) {
                            this._setAttr(imgtag, _dimageAttributes);
                        }
                        litag.appendChild(imgtag);
                    }
                    if (!ej.isNullOrUndefined(_dspriteCss) && (_dspriteCss != "")) {
                        var divtag = document.createElement("div");
                        this._setClass(divtag, 'div.e-align ' + _dspriteCss + ' sprite-image');
                        litag.appendChild(divtag);
                    }
                    if (_dselected) {
                        this._setClass(litag, "chkselect");
                    }
                    {
                        if (ej.isNullOrUndefined(_dtext)) _dtext = String(_dtext);
                        var textEle = document.createElement("span");
                        textEle.innerHTML = _dtext;                      
                        this._setClass(textEle, "e-ddltxt");
                        litag.innerHTML += textEle.outerHTML;
                    }
                }
                this._setAttr(litag, { "role": "option", "unselectable": "on" });
                this.dummyUl.push(litag);
             
            }
        },

        _setAttr: function (element, attrs) {
            if (typeof attrs == "string") {
                var sAttr = attrs.replace(/['"]/g, "").split("=");
                if (sAttr.length == 2) element.setAttribute(sAttr[0], sAttr[1]);
            }
            else {
                for (var idx in attrs) {
                    if ((idx == 'styles' || idx == 'style') && typeof attrs[idx] == 'object') {
                        for (var prop in attrs[idx]) {
                            element.style[prop] = attrs[idx][prop];
                        }
                    }
                    else
                        element.setAttribute(idx, attrs[idx]);
                }
            }
            return this;
        },
        _setClass: function (element, classNme) {
            element.className += " " + classNme;
            return this;
        },
        _removeClass: function (element, classNme) {
            var index = element.className.indexOf(classNme);
            if (index >= 0) {
                if (index != 0 && element.className[index - 1] === " ")
                    element.className = element.className.replace(" " + classNme, "");
                else element.className = element.className.replace(classNme, "");
            }
            return this;
        },
        _hasClass: function (element, classNme) {
            return element.className.indexOf(classNme) >= 0;
        },
        _swapUnCategorized: function (list) {
            $(list).each(function (i, obj) {
                if (!obj.key) {
                    for (var j = i; j > 0; j--) {
                        list[j] = list[j - 1];
                    }
                    list[j] = obj;
                    return false;
                }
            });
        },

        _getField: function (obj, fieldName) {
            return ej.pvt.getObject(fieldName, obj);
        },

        _getTemplatedString: function (list) {

            var str = this.model.template, start = str.indexOf("${"), end = str.indexOf("}");
            while (start != -1 && end != -1) {
                var content = str.substring(start, end + 1);
                var field = content.replace("${", "").replace("}", "");
                str = str.replace(content, this._getField(list, field));
                start = str.indexOf("${"), end = str.indexOf("}");
            }
            return str;
        },

        _setWatermark: function () {
            if ((this.element.val() == "") && this._trim(this._visibleInput.val()) == "") {
				var watermark=(this.model.watermarkText != null)? this.model.watermarkText:this._localizedLabels.watermarkText;
                if (this._isWatermark)
                    this._visibleInput.attr("placeholder", watermark);
                else
                    this._hiddenSpan.css("display", "block").text(watermark);
                //In visual mode, to show watermark text when no items selected.
                if (this.model.multiSelectMode == "visualmode" && this._ulBox && this._ulBox.find('li').length == 0) this._swapUlandInput(false);
            }
        },

        _checkboxHideShow: function (value) {
            if (value) {
                this.listitems = this._getLi();
                var chklist = this.listitems.find('input[type=checkbox]');
                if (chklist.length == 0) {
                    this._appendCheckbox(this.listitems);
                }
            }

            else
                this._removeCheck(this.popupList);
            this.model.showCheckbox = value;
			this._virtualUl = this.ultag.clone(true);
        },
        
        _setCheckAll: function (value) {
            if (!this._isSingleSelect() && (value))
                this.checkAll();
            else this.model.checkAll = false;
        },
        _setUncheckAll: function (value) {
            if (!this._isSingleSelect() && (value))
                this.uncheckAll();
            else this.model.uncheckAll = false;
        },

        checkAll: function () {
            var _nodes = this._selectedIndices, isAlreadySelected = false;
            this._mapFields();
            this.listitems = this._getLi();
            if (!this._isWatermark)
                this._hiddenSpan.css("display", "none");
            if (!this._isSingleSelect()) {
                for (var i = 0; i < this.listitems.length; i++) {
                    this._currentText = this._isPlainType(this.popupListItems) ? this.popupListItems[i] : this._getField(this.popupListItems[i], this.mapFld._text);
                    this._hiddenValue = this._getAttributeValue(this.listitems[i]) || this._currentText;
                    if(!this._checkContains(this._hiddenValue))
                    if (this.model.showCheckbox) {
                        var checkboxWrap = $(this.listitems[i]).children(".e-checkwrap")[0];
                        if (checkboxWrap && !this._isChecked(checkboxWrap)) {
                            this._setClass(checkboxWrap, "e-check-act");
							this._setAttr(checkboxWrap,{"aria-checked":true});
                            checkboxWrap.firstChild.checked = true;
                            isAlreadySelected = false;
                        }
                        else isAlreadySelected = true;
                    }
                    else {
                        isAlreadySelected = false;
                        $(this.listitems[i]).addClass("e-active");
                    }
                    else isAlreadySelected = true;
                    
                    if (!isAlreadySelected) {
						this.checkedStatus = true;
                        this._itemID = $(this.listitems[i]).attr("id");
                        if (!ej.isNullOrUndefined(this._itemID) && this._itemID != "")
                            this._selectedItemsID.push(this._itemID);
                        this._createListHidden(this._hiddenValue);
                        if (this.model.multiSelectMode == "visualmode") {
                            this._ulBox.append(this._createBox(this._currentText,this._hiddenValue));
                            if (this._isPopupShown()) this._setListPosition();
                        }
                        this._addText(this._currentText);
                        if ($.inArray(i, _nodes) == -1) {
                            this._selectedIndices.push(i);
                            this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
                        }
                        this._selectedValue = this._getAttributeValue(this.listitems[i]) || "";
                        if (!this._initValue)
                            this._trigger('checkChange', { isChecked: this.checkedStatus, data: this.model });
                        var args = { text: this._visibleInput[0].value, selectedText: this._currentText, itemId: i, selectedValue: this._selectedValue, value: this._selectedValue, isChecked: this.checkedStatus };
                        this._updateValue(this.element.val());
                        this._updateText();
                        if (!this._initValue)
                            this._trigger("change", args);
                        this._activeItem = i;
                        this.activeItem = this._getActiveItem();
                        this._cascadeAction();
                    }
                }
                this.model.itemValue = this._selectedValue;
                this.model.uncheckAll = false;
                this.model.checkAll = true;
                this._activeItem = -1;
                this._setWatermark();
            }
        },
        _createListHidden: function (value) {
            var arrayHidden = document.createElement("input");
			var quote = /'/;
			if(quote.test(value))
			   value =value.replace(quote,"&apos;")
            this._setAttr(arrayHidden, { type: "hidden", name: this._name, value: value, id: "#" + value });
            this.container.append(arrayHidden);
            $(this.element).attr("name", "hiddenEle");
        },
        _removeListHidden: function (value) {
			var quote = /'/;
			if(quote.test(value))
			     value =value.replace(quote,"&apos;")
            var arrayEle = this.container.find("[id='#" + value + "']");
            $(arrayEle).remove();
			if (!this._isSingleSelect())this.element.attr("name", this._name);
        },
        _getAttributeValue: function (val) {
            return val ? val.getAttribute("data-value") || val.getAttribute("value") : null;
        },
       
        _selectCheckedItem: function (chkitems) {
            for (var i = 0; i < chkitems.length; i++) {
                this._activeItem = chkitems[i];
                this._enterTextBoxValue();
            }
        },

        /* will deprecate with uncheckAll method */
        unCheckAll: function () { this.uncheckAll(); },

        uncheckAll: function () {
            var isAlreadySelected = false;
            this.listitems = this._getLi();
            this._mapFields();
            if (!this._isSingleSelect()) {
                for (var i = 0; i < this.listitems.length; i++) {
                    this._currentText = this._isPlainType(this.popupListItems) ? this.popupListItems[i] : this._getField(this.popupListItems[i], this.mapFld._text);
                    this._hiddenValue = this._getAttributeValue(this.listitems[i]) || this._currentText;
                    if(this._checkContains(this._hiddenValue))
                    if (this.model.showCheckbox) {
                        var checkboxWrap = $(this.listitems[i]).children(".e-checkwrap")[0];
                        if (checkboxWrap && this._isChecked(checkboxWrap)) {
                            this._removeClass(checkboxWrap, "e-check-act");
							this._setAttr(checkboxWrap,{"aria-checked":false});
                            checkboxWrap.firstChild.checked = false;
                            isAlreadySelected = true;
                        }
                        else isAlreadySelected = false;
                    }
                    else {
                        $(this.listitems[i]).removeClass("e-active");
                        isAlreadySelected = true;
                    }
                    else isAlreadySelected = false;
                    
                    if (isAlreadySelected) {
                        this.checkedStatus = false;
                        this._activeItem = i;
                        this.activeItem = this._getActiveItem();
                        this._removeText(this._hiddenValue);
                        this._removeListHidden(this._hiddenValue);
                        var _nodes = this._selectedIndices;
                        if ($.inArray(i, _nodes) > -1) {
                            this._selectedIndices.splice($.inArray(i, _nodes), 1);
                            this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
                        }
                        this._selectedValue = this._getAttributeValue(this.listitems[i]) || "";
                        this._itemID = $(this.listitems[i]).attr("id");
                        if (!ej.isNullOrUndefined(this._itemID) && this._itemID != "")
                            this._removeSelectedItemsID();
                        if (!this._initValue)
                            this._trigger('checkChange', { isChecked: this.checkedStatus, data: this.model });
                        var args = { text: this._visibleInput[0].value, selectedText: this._currentText, itemId: i, selectedValue: this._selectedValue, value: this._selectedValue, isChecked: this.checkedStatus };
                        this._updateValue(this.element.val());
                        this._updateText();
                        if (!this._initValue)
                            this._trigger("change", args);
                        this._cascadeAction();
                        if (this.model.multiSelectMode == "visualmode") {
                            this._deleteBoxCheck(this._hiddenValue);
                            if (this._isPopupShown())
                                this._setListPosition();
                        }
                    }
                    
                }
                this.model.itemValue = this._selectedValue;
                this.model.checkAll = false;
                this.model.uncheckAll = true;
                this._setWatermark();
                this._activeItem = -1;
            }

        },
        _removeSelectedItemsID: function () {
            var itemToRemove;
            itemToRemove = this._selectedItemsID.indexOf(this._itemID);
            this._selectedItemsID.splice(itemToRemove, 1);
            this._itemID = "";
        },


        _refreshScroller: function () {
            if (!this.model.enablePopupResize) { // to set popup height as per the no.of list items
                this.popupList.css("height", "auto");
                this.popupListWrapper.css("height", "auto");
            }
            this.popupList.find(".e-content, .e-vhandle").removeAttr("style");
            this.popupList.find(".e-vhandle div").removeAttr("style");
            this.popupList.children(".e-content").removeClass("e-content");
            var flag = this._isPopupShown();
            this.popupListWrapper.css("display", "block");
            this.popupList.css({ "display": "block" });  // For get the height of the popup
            this.scrollerObj.model.height = Math.ceil(this._getPopupHeight());
            this.scrollerObj.refresh();
            if (!this.model.enablePopupResize) { // to set popup height as per the no.of list items
                this.popupList.css("height", "auto");
                this.popupListWrapper.css("height", "auto");
            }
            this.scrollerObj.option("scrollTop", 0);
            if (!flag) this.popupListWrapper.css("display", "none");
        },
        _enablePopupResize: function () {
            if (this.model.enablePopupResize) {
                this.popupListWrapper.addClass("e-resizable").append(ej.buildTag("div.e-resizebar").append(ej.buildTag("div.e-icon e-resize-handle")))
                .find(".e-resize-handle").addClass((this.model.enableRTL) ? "e-rtl-resize" : "");
                this._resizePopup();
            }
        },


        _resizePopup: function () {
            var proxy = this, started = false;
            this.popupListWrapper.find("div.e-resize-handle").ejResizable(
                {
                    minHeight: proxy._validatePixelData(proxy.model.minPopupHeight),
                    minWidth:  proxy._validatePixelData(proxy.model.minPopupWidth),
                    maxHeight: proxy._validatePixelData(proxy.model.maxPopupHeight),
                    maxWidth:  proxy._validatePixelData(proxy.model.maxPopupWidth),
                    handle: "e-ddl-popup",
                    resizeStart: function (event) {
                        if (!proxy.model.enabled)
                            return false;
                        !started && proxy._trigger("popupResizeStart", { event: event });
                        started = true;
                    },
                    resize: function (event) {
                        var reElement = $(event.element).parents("div.e-ddl-popup");
                        proxy._refreshPopupOnResize($(reElement).outerHeight(), $(reElement).outerWidth());
                        proxy._trigger("popupResize", { event: event });
                    },
                    resizeStop: function (event) {
                        if (started) {
                            proxy._refreshPopupOnResize(proxy.model.popupHeight, proxy.model.popupWidth);
                            started && proxy._trigger("popupResizeStop", { event: event });
                            started = false;
                        }
                    },
                    helper: function (event) {
                        var reElement = $(event.element).parents("div.e-ddl-popup");
                        proxy._refreshPopupOnResize($(reElement).outerHeight(), $(reElement).outerWidth());
                        return $(proxy.popupListWrapper);
                    }
                });
        },

        _refreshPopupOnResize: function (currHeight, currWidth) {
            if (currHeight) this.model.popupHeight = currHeight;
            if (currWidth) this.model.popupWidth = currWidth;
            this.popupListWrapper.css({ "height": this._validatePixelData(this.model.popupHeight), "min-height": this._validatePixelData(this.model.minPopupHeight), "max-height": this._validatePixelData(this.model.maxPopupHeight) });
            this._setListWidth();
            this._refreshScroller();
        },

        _setListWidth: function () {
            var width = this.model.popupWidth;
            if (width != "auto") this.popupListWrapper.css({ "width": width });
            else this.popupListWrapper.css({ "min-width": this._validatePixelData(this.model.minPopupWidth) });
            this.popupListWrapper.css({ "max-width": this._validatePixelData(this.model.maxPopupWidth) });
        },

        _setListHeight: function () {
            if (this.model.enablePopupResize && this.model.enableFilterSearch && this.model.minPopupHeight && this.model.minPopupHeight.toString().indexOf("%") <0 && this._validatePixelData(this.model.minPopupHeight) == 20)
                this.model.minPopupHeight = '65'; /* adding default height of search box*/
            this.model.enablePopupResize ? this.popupListWrapper.css({ "min-height": this._validatePixelData(this.model.minPopupHeight), "max-height": this._validatePixelData(this.model.maxPopupHeight), "height": this._validatePixelData(this.model.popupHeight) }) :
            this.popupListWrapper.css({ "max-height": this._validatePixelData(this.model.popupHeight), "min-height": this._validatePixelData(this.model.minPopupHeight) });
        },
		_validatePixelData: function (data) {			
			return (data && !isNaN(data))? Number(data):data;
		},
        _getPopupHeight: function () {
            var wrap = this.popupListWrapper.height();
            if (this.model.enablePopupResize) wrap -= this.popupListWrapper.find(">div.e-resizebar").height();
            if (this.model.headerTemplate && this.headerTemplate) wrap -= this.headerTemplate.height();
            if (this.model.enableFilterSearch && this.inputSearch) {
                var ele = this.inputSearch.parent(".e-in-wrap");
                wrap -= (parseInt(ele.css("height")) + parseInt(ele.css('margin-top')) + parseInt(ele.css('margin-bottom')));
            }
            return wrap;
        },

        _refreshPopup: function () {
            if (this.model.popupWidth == "auto" && !this._validatePixelData(this.model.minPopupWidth)) this.popupListWrapper.css({ "min-width": this.wrapper.width() });
			else if(this._validatePixelData(this.model.minPopupWidth))this.popupListWrapper.css({ "min-width": this._validatePixelData(this.model.minPopupWidth) });
            if(this.scrollerObj != undefined) this._refreshScroller();
            this._setListPosition();
        },

        _setListPosition: function () {
            var elementObj = this.wrapper, pos = this._getOffset(elementObj), winWidth,
            winBottomHeight = $(document).scrollTop() + $(window).height() - (pos.top + $(elementObj).outerHeight()),
            winTopHeight = pos.top - $(document).scrollTop(),
            popupHeight = this.popupListWrapper.outerHeight(),
            popupWidth = this.popupListWrapper.outerWidth(),
            left = pos.left,
            totalHeight = elementObj.outerHeight(),
            border = (totalHeight - elementObj.height()) / 2,
            maxZ = this._getZindexPartial(), popupmargin = 3,
            topPos = ((popupHeight < winBottomHeight || popupHeight > winTopHeight) ? pos.top + totalHeight + popupmargin : pos.top - popupHeight - popupmargin) - border;
            winWidth = $(document).scrollLeft() + $(window).width() - left;
            if (this.model.enableRTL || popupWidth > winWidth && (popupWidth < left + elementObj.outerWidth())) left -= this.popupListWrapper.outerWidth() - elementObj.outerWidth();
            this.popupListWrapper.css({
                "left": left + "px",
                "top": topPos + "px",
                "z-index": maxZ
            });

        },

        _getOffset: function (ele) {
            return ej.util.getOffset(ele);
        },

        _getZindexPartial: function () {
            return ej.util.getZindexPartial(this.element, this.popupListWrapper);
        },


        _showResult: function () {
            var proxy = this;
            var args = { text: this._visibleInput[0].value, value: this._selectedValue, refreshPopup: true };
            if (this._trigger("beforePopupShown", args)) return;
            if (args.refreshPopup) this._refreshPopup();
            $(this.popupListWrapper).slideDown(this.model.enableAnimation ? 200 : 1, function () {
                $(document).on("mousedown", $.proxy(proxy._OnDocumentClick, proxy));
                if(!(ej.isDevice()))
                proxy._on(ej.getScrollableParents(proxy.wrapper), "scroll", proxy._hideResult);
            });
            this.element[0].setAttribute("aria-expanded", true);
            this._listSize =  this._getLi().length;
            this.wrapper.addClass("e-popactive");
            this._trigger("popupShown", { text: this._visibleInput[0].value, value: this._selectedValue });
            this.scrollerObj.setModel({ scrollTop: this._calcScrollTop('active') });
        },

        _OnWindowResize: function (e) {
            if (!ej.isNullOrUndefined(this.model) && this._isPopupShown()) {
                this._refreshPopup();
            }
        },
        _hideResult: function (e) {
            if (this.model && this._isPopupShown()) {
				if (!ej.isNullOrUndefined(e) && !ej.isNullOrUndefined(this.inputSearch) && $(this.inputSearch).is(":focus")){
					if(e.type == "scroll" && ej.isTouchDevice())
						return false;
				}
                var proxy = this;
                if (this._trigger("beforePopupHide", { text: this._visibleInput[0].value, value: this._selectedValue })) return;
                $(this.popupListWrapper).slideUp(this.model.enableAnimation ? 100 : 0, function () {
                    $(document).off("mousedown", $.proxy(proxy._OnDocumentClick, proxy));
                });
                if (this.element != null)
                    this.element.attr( "aria-expanded", false );
				if(!(ej.isDevice()))
                this._off(ej.getScrollableParents(this.wrapper), "scroll", this._hideResult);
                if (this._visibleInput != null)
                this.wrapper.removeClass("e-popactive");
                    this._trigger("popupHide", { text: this._visibleInput[0].value, value: this._selectedValue });

                setTimeout(function () {
                    proxy._resetSearch();                 
                }, 100);
				this._getLi().find(".e-ddl-anim").removeClass("e-ddl-anim");
            }
        },

        _isPopupShown: function () {
            return (this.popupListWrapper.css("display") == "block");
        },

        _enterTextBoxValue: function () {
            var args, valueModified = true;
            this.removeID = false;
			this.checkedStatus = false;
            if (!this._isWatermark)
                this._hiddenSpan.css("display", "none");
            this._chooseSelectionType();
			if (this._activeItem >=0 || this._activeItem != null) {
				if (this.model.showCheckbox) {
					var checkboxEle = this.activeItem.find('.e-checkwrap')[0];
					$(checkboxEle).removeClass('e-check-inact');
					this.checkedStatus = this._isChecked(checkboxEle);                   
				}
				else{
					this.checkedStatus = this.activeItem.hasClass('e-active')
				}            
			}
            args = { text: this._currentText, selectedText: this._currentText, itemId: this.selectedIndexValue, value: this._selectedValue, isChecked: this.checkedStatus, isInteraction: !!this._uiInteract };
            if (!this._initValue && !this._onSearch && this._raiseEvents){ 
                if(this._trigger("select", args)) {
                    this._setWatermark();
                    return;
                }
            }
            if (this._activeItem >=0 || this._activeItem != null) {
                if (!this._isSingleSelect() && !this._checkContains(this._selectedValue)) {                   
                    if (this.model.showCheckbox) {
                        var checkboxEle = this.activeItem.find('.e-checkwrap')[0];
                        if (!this._isChecked(checkboxEle)) {
							this._removeClass(checkboxEle, "e-ddl-anim");	
                            this._setClass(checkboxEle, "e-check-act e-ddl-anim");
                            this._setAttr(checkboxEle,{"aria-checked":true});
                            $(checkboxEle).find(".e-check-input")[0].checked = true;
                        }
                    }
                    else {
                        this.activeItem.addClass('e-active');
                    }
                    if (this.model.multiSelectMode == "visualmode") {
                        this._ulBox.append(this._createBox(this._currentText, this._selectedValue));
                        if (this._isPopupShown())
                            this._setListPosition();
                    }

                    this._maintainHiddenValue();
                    this._addText(this._currentText);
                    this._createListHidden(this._hiddenValue);
                    if ($.inArray(this.selectedIndexValue, this._selectedIndices) == -1) {
                        this._selectedIndices.push(this.selectedIndexValue);
                        this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
                    }                
                } else if( this._isSingleSelect()){
                    this.ultag.children("li").removeClass('e-hover').removeClass('e-active');
                    this.activeItem.addClass('e-active');                    
                    this._maintainHiddenValue();
                    this._visibleInput.val(this._currentText);
                    this.element.val(this._hiddenValue);
                    this.selectedItemIndex(this.selectedIndexValue);
                    this.selectedIndex(this.selectedIndexValue);
                    this._selectedIndices[0] = this.selectedIndexValue;
                }
                else valueModified = false;
                if(valueModified) {
					this.checkedStatus = true;
                    this._onValueChange();
                    this._cascadeAction();
                    if (this.selectelement) {
                    if ($("#" + this._id).children().length > this.selectedIndexValue)
                        $("#" + this._id).children()[this.selectedIndexValue].selected = true;
                    }
                }
            }
            this.model.uncheckAll = false;
            this._setWatermark();
			this._uiInteract = false;
        },
        _onValueChange: function () {
            this.model.itemValue = this._selectedValue;
            this._updateText();
            if (this.value() != this.element.val() && !(this.value() == null && this.element.val() =="" )) {
                this._updateSelectedIndexByValue(this.element.val());
                this._updateValue(this.element.val());
				if (!this.model.showCheckbox && this.model.multiSelectMode == "none" && (this.model.value == null || this.model.value == "")){
					this.model.itemValue = "";
				}
               var args = { text: this._visibleInput[0].value, selectedText: this._currentText, itemId: this.selectedIndexValue, selectedValue: this._selectedValue, value: this._selectedValue, isChecked: this.checkedStatus, isInteraction: !!this._uiInteract };

                if (!this._initValue && !this._onSearch && this._raiseEvents) {
					if(typeof this.model._change == "function") this._trigger("_change", { isChecked: this.checkedStatus, text: this._visibleInput.val(), itemId: this.selectedIndexValue, selectedText: this._currentText, selectedValue: this._selectedValue, value: this.value(), data: this.model, isInteraction: !!this._uiInteract  });
                    this._trigger("change", args);
                    if (this.model.showCheckbox)
                        this._trigger('checkChange', { isChecked: this.checkedStatus, text: this._visibleInput.val(), itemId: this.selectedIndexValue, selectedText: this._currentText, selectedValue: this._selectedValue, value: this._selectedValue, data: this.model });
                }
                this._uiInteract = false;
                if(this.model.enableFilterSearch && this.model.enableServerFiltering){
				this._searchresult = [];
                this._searchresult = this.getItemDataByValue(this.value());
                }
                
            }
        },
        _decode: function (val) {
            return $("<span>").html(val).text();
        },
        _chooseSelectionType: function () {
            this.activeItem = this._getActiveItem();
            this.selectedIndexValue = this._activeItem;
            this._mapFields();
            if (this.model.dataSource != null && (!this._isPlainType(this.model.dataSource) || !this._isPlainType(this.popupListItems))) {
                this._currentText = this._decode(this._getField(this.popupListItems[this._activeItem], this.mapFld._text));
                this._currentText = (this._currentText === "" || this._currentText == null) ? this.activeItem.text() : this._currentText;
                this._selectedValue = this._getField(this.popupListItems[this._activeItem], this.mapFld._value);
                this._selectedValue = (this._selectedValue != null) ? this._selectedValue : this._currentText;
                this._itemID = this._getField(this.popupListItems[this._activeItem], this.mapFld._id);
            } else {
                this._currentText = this.activeItem.text();
                if (this._getAttributeValue(this.activeItem[0]))
                    this._selectedValue = this._getAttributeValue(this.activeItem[0]);
                else {
                    if (this._currentText != null) {
                        if(!ej.isNullOrUndefined(this.activeItem[0]))this.activeItem[0].setAttribute("value", this._currentText);
                        this._selectedValue = this._currentText;
                    }
                    else
                        this._selectedValue = "";
                }
                this._itemID = $(this.activeItem).attr("id");
            }
            if (!ej.isNullOrUndefined(this._itemID) && this._itemID != "") {
                if (!this.model.showCheckbox) {
                    this._selectedItemsID = [];
                    !this.removeID && this._selectedItemsID.push(this._itemID);
                }
                else
                    !this.removeID ? this._selectedItemsID.push(this._itemID) : this._removeSelectedItemsID();
            }
            this.selectedTextValue = this._currentText;
        },
        _maintainHiddenValue: function () {
            this._hiddenValue = this._getAttributeValue(this.activeItem[0]) || this._currentText;
        },
        _removeTextBoxValue: function (delvalue) {
            this._uiInteract = true;
            this.removeID = true;
			this.checkedStatus = true;
			if(this._isFilterInput()){
				for (var j = 0; j < this._getLi().length; j++) {
					if ($(this._getLi()[j]).attr("data-value") == delvalue) {
						this._activeItem = j;
					}
				}
			}
            this._chooseSelectionType();
			if (this._activeItem >=0 || this._activeItem != null) {
				if (this.model.showCheckbox) {
					var checkboxEle = this.activeItem.find('.e-checkwrap')[0];
					$(checkboxEle).removeClass('e-ddl-anim').addClass('e-check-inact e-ddl-anim');
					this.checkedStatus = this._isChecked(checkboxEle);                   
				}
				else{
					this.checkedStatus = this.activeItem.hasClass('e-active')
				}            
			}			
            var args = { text: this._currentText, selectedText: this._currentText, itemId: this.selectedIndexValue, value: this._selectedValue, isChecked: this.checkedStatus };
            if (!this._initValue && !this._onSearch && this._raiseEvents){
                if(this._trigger("select", args)){
                    this._setWatermark();
                    return;
                }
            }                
            this._maintainHiddenValue();
			this._hiddenValue = this._isFilterInput() && !ej.isNullOrUndefined(delvalue) ? delvalue : this._hiddenValue;
            this._removeText(this._hiddenValue);
            this._removeListHidden(this._hiddenValue);
			if(this._isFilterInput() && !this.activeItem.attr("data-value") == delvalue)
				this.activeItem.removeClass('e-active');
            if (!this._isSingleSelect()) {
                if (this.model.showCheckbox) {
                    var checkboxEle = this.activeItem.find('.e-checkwrap')[0];
                    if (this._isChecked(checkboxEle)) {
                        this._removeClass(checkboxEle, "e-check-act");
						this._setAttr(checkboxEle,{"aria-checked":false});
                        $(checkboxEle).find(".e-check-input")[0].checked = true;
                    }
                }
                else this.activeItem.removeClass('e-active');

                if ($.inArray(this.selectedIndexValue, this._selectedIndices) > -1) {
                    this._selectedIndices.splice($.inArray(this.selectedIndexValue, this._selectedIndices), 1);
                    this.model.selectedItems = this.model.selectedIndices = this._selectedIndices;
                }
                if (this.model.multiSelectMode == "visualmode") {
                    this._deleteBoxCheck(this._hiddenValue);
                    if (this._isPopupShown())
                        this._setListPosition();
                }
            }
			this.checkedStatus = false;            
            this._onValueChange();
            if ((this.model.cascadeTo != null) && !this._isSingleSelect() && !this._initValue ) this._cascadeAction();
            this.model.checkAll = false;
            this._setWatermark();
        },


        _createBox: function (text, value) {
            if (!this._checkContains(value)) {

                if (this._ulBox.css('display') == "none" && this._visibleInput.css('display') != "none") this._swapUlandInput(true);
                var span = ej.buildTag("span.e-icon e-close", "", {}, { "unselectable": "on" });
                var li = ej.buildTag("li.e-options").text(text).attr("data-value",value).append(span);
                this._on(span, "click", function (e) {
                    if (!this.model.enabled) return false;
                    this._deleteBox($(e.target).parent());                   
                });
                return li;
            }
        },
        _deleteBoxCheck: function (val) {
            var items = this._ulBox.children('li');
            for (var i = 0; i < items.length; i++) {
                if ($(items[i]).attr("data-value") == val) {
                    $(items[i]).remove();
                }
            }
        },
        _deleteLastBox: function () {
            var items = this._ulBox.children("li:not(.e-search-box)");
            var item = items.last();
            if (item.hasClass("e-active")) this._deleteBox(item);
            else {
                this._removeActive();
                item.addClass("e-active");
            }
        },
        _deleteBox: function (items) {
            for (var i = 0; i < items.length; i++) {              
                var deltext = $(items[i]).attr("data-value");
                if(this._isFilterInput()){ 
                    var datalist = this.getListData();
                    for (var j = 0; j < datalist.length; j++) {
                        var val = this._getField(datalist[j], this.mapFld._value) ? this._getField(datalist[j], this.mapFld._value): this._getField(datalist[j], this.mapFld._text);
                        if (val == deltext) {
                            this._removeTextBoxValue(deltext);
                            break;
                        }
                    }
				}else{
					var listItems = this._getLi();
					for (var j = 0; j < listItems.length; j++) {
						if ($(listItems[j]).attr("data-value") == deltext) {
							this._activeItem = j;
							this._removeTextBoxValue();
							break;
						}
					}
				}
            }
            if (!this._isFocused && !this._isPopupShown())
                this._setWatermark();
        },
        _isFilterInput: function(){
            if(this.model.enableFilterSearch){
                if(!this.inputSearch.val() == ""){
                       return true; 
                }
            }else{
                return false;
            }
        },
        _swapUlandInput: function (inputHide) {
            if (inputHide) {
                this._visibleInput.css('display', 'none');
                this._ulBox.css('display', 'block');
                this.wrapper.css({ 'height': 'auto' });
            }
            else {
                this._visibleInput.css('display', 'block');
                this._ulBox.css('display', 'none');
                this.wrapper.css({ 'height': this.model.height });
            }
        },
        _removeActive: function () {
            this._ulBox.children("li").removeClass("e-active");
        },
        _adjustWidth: function () {
            var tempSpan = ej.buildTag("span", this._visibleInput.val());
            this.container.append(tempSpan);
            this._visibleInput.width(tempSpan.width() + 30);
            tempSpan.remove();
        },
        _destroyBoxModel: function () {
            this._visibleInput.css('display', 'block');
            this.wrapper.height(this.model.height);
            this._ulBox.remove();
			this._ulBox = null;
            this._off(this.container, "click");
        },

        _removeListHover: function () {
            this.ultag.children("li").removeClass("e-hover");
        },

        _addListHover: function () {
            var activeItem = this._getActiveItem();
            activeItem.addClass("e-hover");
            this.scrollerObj.setModel({ "scrollTop": this._calcScrollTop('hover') });
            activeItem.focus();
        },
        _getLi: function () {
            return this.ultag.children("li:not('.e-category'):not('.e-nosuggestion')");
        },
        _calcScrollTop: function (val) {
            var ulH = this.ultag.outerHeight(), li = this.ultag.find("li"), liH = 0, index, top, i;
            if (this._selectedIndices && this._selectedIndices.length > 0 && val == "active") {
                var getLi = this._getLi();
                index = this._selectedIndices.length == getLi.length ? 0
                : this._selectedIndices[this._selectedIndices.length - 1];
                if (this.model.fields.groupBy != null || this.ultag.find("li.e-category").length > 0) {
                    index = $.inArray(getLi.eq(index)[0], li);
                }
            }
            else index = this.ultag.find("li.e-" + val).index();

            for (i = 0; i < index; i++) { liH += li.eq(i).outerHeight(true); }
            top = liH - ((this.popupList.outerHeight() - li.eq(index).outerHeight(true)) / 2);
            return top < 0 ? 0 : top;
        },
        _getActiveItem: function () {
            return this._getLi().eq(this._activeItem);
        },
        _setDimentions: function () {
            if (this.model.height)
                this.wrapper.height(this.model.height);
            if (this.model.width)
                this.wrapper.width(this.model.width);
        },


        _roundedCorner: function (val) {
            if (val) {
                this.container.addClass("e-corner");
                this.popupListWrapper.addClass("e-corner");
                if (this.inputSearch) this.inputSearch.parent('.e-in-wrap').addClass("e-corner");
            }
            else {
                this.container.removeClass("e-corner");
                this.popupListWrapper.removeClass("e-corner");
                if (this.inputSearch) this.inputSearch.parent('.e-in-wrap').removeClass("e-corner");
            }

        },

        _enabled: function (boolean) {
            if (boolean) this.enable();
            else this.disable();
        },

        _RightToLeft: function () {
            if (this.model.enableRTL) {
                this.wrapper.addClass("e-rtl");
            }
            else {
                this.wrapper.removeClass("e-rtl");
            }

        },
        _dropbtnRTL: function () {
            if (this.model.enableRTL) {
                this.popupListWrapper.addClass("e-rtl").find(".e-resize-handle").addClass("e-rtl-resize");
                this.popupList.addClass("e-rtl");
            }
            else {
                this.popupListWrapper.removeClass("e-rtl").find(".e-resize-handle").removeClass("e-rtl-resize");
                this.popupList.removeClass("e-rtl");
            }
        },
        _OnDropdownClick: function (e) {
            this._preventDefaultAction(e);
            if (($(e.target).is("li") && $(e.target).parent().hasClass("e-boxes")) || ($(e.target).parents("ul").hasClass("e-boxes") && $(e.target).hasClass("e-icon e-close")))
                return false;
            if (this.model.readOnly || this._readOnly) return false;
            if (this.ultag.find('li').length > 0 && ((e.which && e.which == 1 ) ||(e.button && e.button == 0) )) {
                this._OnPopupHideShow();
            }
        },
        _OnPopupHideShow: function () {
            if (this._isPopupShown()) {
                this._hideResult();
            }
            else {
				this._showResult();
				if (this.model.enableFilterSearch){
					if(this.getSelectedItem().length == 0)
						this.ultag.find("li:first").addClass("e-hover");
					else{
						var length = this.getSelectedItem().length;
						$(this.getSelectedItem()[length -1]).addClass("e-hover");
					}
                    $(this.inputSearch).focus();
				}
				else
					this.wrapper.focus();
            }
        },

        _showFullList: function () {
            var source = this.model.dataSource;
            if (ej.DataManager && source instanceof ej.DataManager) {
                if (!source.dataSource.offline && !(source.dataSource.json && source.dataSource.json.length > 0)) {
                    var proxy = this;
                    proxy._initDataSource(source);
                }
                else this._getFilteredList(source.dataSource.json);
            }
            else this._getFilteredList(source);
        },
        _getFilteredList: function (list) {
            if (!list || !list.length || list.length < 1) {
                this._targetElementBinding();
                this._renderRemaining();
            }
            else {
                var listItem = ej.DataManager(list).executeLocal(this._isPlainType(list) ? ej.Query() : this._getQuery(true));
                this._totalCount = listItem.count;
                this._listItem(listItem.result ? listItem.result : listItem);
                this._renderPopupList();
                this._rawList =  this.popupListItems.slice();
            }
        },

        _cascadeAction: function () {
            if (this.model.cascadeTo) {
                var citem = this.model.cascadeTo.split(","), i;
                for (i = 0; i < citem.length; i++) {
                    if ($('#' + citem[i]).hasClass("e-dropdownlist")) {
                        this._doCascadeAction(citem[i], this, this.checkedStatus);
                    }
                    else {
                        $('#' + citem[i]).on("ejDropDownListcreate", { Obj: this, status: this.checkedStatus }, function (e) {
                            if (!ej.isNullOrUndefined(e.data.Obj.getValue()) && e.data.Obj.getValue() != "") {
                                e.data.Obj._doCascadeAction(this.id, e.data.Obj, e.data.status);
                            }
                        });
                    }
                }
            }
        },
        _doCascadeAction: function (id, parentObj, status) {
            parentObj._currentValue = parentObj._getField(parentObj.popupListItems[parentObj._activeItem], parentObj.mapFld._value);
            parentObj.selectDropObj = $('#' + id).ejDropDownList('instance');
            var args = { cascadeModel: parentObj.selectDropObj.model, cascadeValue: parentObj._currentValue, setCascadeModel:{}, requiresDefaultFilter: true };
            this._trigger("cascade", args);
            parentObj.selectDropObj._setCascadeModel = args.setCascadeModel;
            if (ej.isNullOrUndefined(parentObj[id])) {
                parentObj[id] = parentObj.selectDropObj.model.dataSource;
            }
            (ej.DataManager && parentObj[id] instanceof ej.DataManager) ?
                parentObj._cascadeOdataInit(parentObj[id], args.requiresDefaultFilter, status, args.cascadeQuery) :
            parentObj._cascadeJsonInit(parentObj.selectDropObj, parentObj[id], parentObj.mapFld._value, args.requiresDefaultFilter, status, args.cascadeQuery);
        },
        _cascadeOdataInit: function (_dSource, requiresFilter, status, cascadeQuery) {
            var proxy = this, queryPromise, tempQuery;
            proxy._dQuery = this.selectDropObj._getQuery().clone();
            tempQuery = proxy._dQuery.clone();
            requiresFilter ? tempQuery.where(proxy.mapFld._value, "equal", proxy._currentValue) : tempQuery = cascadeQuery;
            proxy.selectDropObj._addLoadingClass();
            if (!proxy._trigger("actionBegin", { requestFrom: "cascade" })) {
                queryPromise = _dSource.executeQuery(tempQuery);
                queryPromise.fail(function (e) {
                    proxy._changedSource = null;
                    proxy.selectDropObj.setModel({ dataSource: proxy._changedSource, enabled: false });
                    proxy._trigger("actionFailure", { e: e, requestFrom: "cascade" });
                }).done(function (e) {
                    proxy._trigger("actionSuccess", { e: e, requestFrom: "cascade" });
                    proxy._cascadeDataBind(proxy.selectDropObj, e.result, status);
                    proxy.selectDropObj._removeLoadingClass();
                }).always(function (e) {
                    proxy._trigger("actionComplete", { e: e, requestFrom: "cascade" });
                });
            }
        },

        _cascadeJsonInit: function (cascadeDropDownObj, _dSource, mapFld, requiresFilter, status, cascadeQuery) {           
            var tempQuery = requiresFilter ? ej.Query().where(mapFld, "==", this._currentValue) : cascadeQuery
            var changedSource = ej.DataManager(_dSource).executeLocal(tempQuery);
            this._cascadeDataBind(cascadeDropDownObj, changedSource, status);
        },

        _cascadeDataBind: function (cascadeDropDownObj, changedSource, status) {
			var cascadeVal  = cascadeDropDownObj.value();
            if ((this.model.showCheckbox && status) || (this.model.multiSelectMode != "none" && this.activeItem.hasClass("e-active"))) {
                this._changedSource = (!ej.isNullOrUndefined(this._changedSource)) ? this._changedSource.concat(changedSource) : changedSource;
            }
            else if (!this.model.showCheckbox && this.model.multiSelectMode == "none") this._changedSource = changedSource;
            else {
                for (var i = 0; i < changedSource.length; i++) {
                    if (this._isPlainType(changedSource) && this._isPlainType(this._changedSource)) this._changedSource.splice(this._changedSource.indexOf(changedSource[i]), 1);
                    else {
                        for (var j = 0; j < this._changedSource.length; j++) {
                            if (JSON.stringify(this._changedSource[j]) == JSON.stringify(changedSource[i]))
                                this._changedSource.splice(j, 1);
                        }

                    }
                }
                cascadeDropDownObj.setModel({ dataSource: null });
            }
			var cascadeValFn = cascadeDropDownObj.model.value;
            var cascadeModel = JSON.parse(JSON.stringify(cascadeDropDownObj.model)),enable;
            cascadeDropDownObj.setModel({ dataSource: this._changedSource, enabled: this._changedSource.length > 0 });
			if( !this._isSingleSelect() ) cascadeDropDownObj.selectItemByValue(cascadeVal);
            if (cascadeDropDownObj.model.showCheckbox || cascadeDropDownObj.model.multiSelectMode != "none") {
                $("input:hidden[id^='#'][name=" + cascadeDropDownObj._id + "]").remove();
            }
            
            if (!cascadeDropDownObj._setSelectedItem) {
                var selectProp = ["value", "text", "selectedIndex", "selectedIndices"];
                for (var m = 0; m < selectProp.length ; m++)
                    cascadeDropDownObj.model[selectProp[m]] = cascadeModel[selectProp[m]];
				cascadeDropDownObj.model["value"] = cascadeValFn;
                cascadeDropDownObj._finalize();                
            }            
            else {                                               
               cascadeDropDownObj.setModel(cascadeDropDownObj._setCascadeModel);
            }
            cascadeDropDownObj._setSelectedItem = true;
        },        

        _OnMouseEnter: function (e) {
            if (!this.model.enabled || this.model.readOnly || this._readOnly) return false;
            var targetEle;
            this.ultag.children("li").removeClass("e-hover");
            if ($(e.target).is("li:not('.e-category')")) { $(e.target).addClass("e-hover"); }
            if ($(e.target).hasClass("e-disable"))
                $(e.target).removeClass('e-hover');
            else if (e.target.tagName != "li") {
                targetEle = $(e.target).parents("li:not('.e-category')");
                $(targetEle).addClass("e-hover");
            }
            var activeItem;
            this.ultag.children("li:not('.e-category')").each(function (index) {
                if ($(this).hasClass("e-hover")) {
                    activeItem = index;
                    return false;
                }
            });
            this._activeItem = activeItem;
        },
        _OnMouseLeave: function (e) {
            if (!this.model.enabled || this.model.readOnly || this._readOnly) return false;
            this.ultag.children("li").removeClass("e-hover");
        },
        _OnMouseClick: function (e) {
            this._uiInteract = true;
            if (!this.model.enabled || this.model.readOnly || this._readOnly) return false;
            if (this.model.enableFilterSearch && $(e.target).is("li") && $(e.target).hasClass('e-nosuggestion')) return false;
            else if (($(e.target).is("li") && !$(e.target).hasClass('e-disable')) || (!$(e.target).is("li") && !$(e.target).closest("li").hasClass('e-disable'))) {
                if (this._isSingleSelect()) {
                    this._enterTextBoxValue();
                    this._hideResult();
                } else {
                    if (this.model.showCheckbox) {
                        var liEle = e.target.nodeName === "LI" ? e.target : $(e.target).parents("li.e-hover"),
                        checkboxEle = $(liEle).find('.e-checkwrap')[0];
                        this._onCheckChange({ target: checkboxEle });
                    }
                    else {
                        var ele = $(e.target).is("li") ? e.target : $(e.target).closest("li")[0];
                        this._activeItem = $.inArray(ele, this._getLi());
                        if ($(ele).hasClass("e-active")) this._removeTextBoxValue();
                        else this._enterTextBoxValue();
                    }
                   
                }
            }
        },        

        _OnDocumentClick: function (e) {
            if (this.model && (!this.model.enabled || this.model.readOnly || this._readOnly)) return false;
            if (!$(e.target).is(this.popupList) && !$(e.target).parents(".e-ddl-popup").is(this.popupListWrapper) &&
                !$(e.target).is(this._visibleInput) && !$(e.target).parents(".e-ddl").is(this.wrapper)) {
                this._hideResult();
            }
            else if ($(e.target).is(this.inputSearch)) {
                this.inputSearch.focus();
            }
            else if ($(e.target).is(this.popupList) || $(e.target).parents(".e-ddl-popup").is(this.popupListWrapper))
                this._preventDefaultAction(e);
        },

        _OnKeyPress: function (e) {
            if (this.model.enableIncrementalSearch && e.keyCode != 13) {
                this._OnTextEnter((ej.browserInfo().name == "mozilla") ? e.charCode : e.keyCode);
            }
            if (e.keyCode == 32) this._preventDefaultAction(e);
        },
        _OnTextEnter: function (from) {
            var proxy = this;
            this._incqueryString += String.fromCharCode(from);
            if (this._incqueryString.length > 0) {
                setTimeout(function () { proxy._incqueryString = ""; }, 1000);
            }
            var list = this._getLi(), i,
            caseSence = this.model.caseSensitiveSearch,            
            str, queryStr = this._incqueryString,
            querylength = this._incqueryString.length, searchflag = false;

            if (!caseSence) queryStr = queryStr.toLowerCase();

            for (i = 0; i < list.length; i++) {
                str = $(list[i]).text();
                str = caseSence ? str : str.toLowerCase();
                if (str.substr(0, querylength) == queryStr) {
                    this._activeItem = i;
                    if (this._isSingleSelect()){
						this._enterTextBoxValue();
						this.scrollerObj.setModel({ scrollTop: this._calcScrollTop('active') });
					}
                    else if (this._isPopupShown()) {
                        this._removeListHover();                      
                        this._addListHover();
                    } 
                    searchflag = true;
                }                 
                if (searchflag) break;
            }

        },

        _selectItem: function (current) {
            if (!this._isSingle) this._clearTextboxValue();
            this._activeItem = current;
            this._addListHover();
            this._enterTextBoxValue();
        },
        _focusItem: function (current) {
            this._removeListHover();
            this._activeItem = current;
            this._addListHover();
        },
        _selectFocusedItem: function (current) {
            this._focusItem(current);
            this._enterTextBoxValue();
        },
        
        _selectShiftDown: function (start, stop, isCtrl) {
            if (!isCtrl) this._clearTextboxValue();
            for (var n = start; n <= stop; n++) {
                if ($.inArray(n, this._disabledItems) < 0 && $.inArray(n, this.model.selectedIndices) < 0) {
                    this._selectFocusedItem(n);
                }
            }
        },
        _selectShiftUp: function (start, stop, isCtrl) {
            if (!isCtrl) this._clearTextboxValue();
            for (var n = stop; n >= start ; n--) {
                if ($.inArray(n, this._disabledItems) < 0 && $.inArray(n, this.model.selectedIndices) < 0) {
                    this._selectFocusedItem(n);
                }
            }
        },
        _selectShiftHome: function (current, stop, isCtrl) {
            if (!isCtrl) this._clearTextboxValue();
            if (current >= 0 && current <= this._listSize - 1) {
                if (current == 0) this._clearTextboxValue();
                else {
                    for (var n = current; n >= stop ; n--) {
                        if ($.inArray(n, this._disabledItems) < 0 && $.inArray(n, this.model.selectedIndices) < 0) {
                            this._activeItem = n;
                            this._enterTextBoxValue();
                        }
                    }
                }
                this._activeItem = current;
                if (current == 0) this._enterTextBoxValue();
                this.scrollerObj.setModel({ "scrollTop": 0 });
            }
        },
        _selectShiftEnd: function (current, stop, isCtrl) {
            if (!isCtrl) this._clearTextboxValue();
            if (current <= this._listSize - 1) {
                if (current == stop) this._clearTextboxValue();
                else 
                for (var n = current; n <= stop; n++) {
                    if ($.inArray(n, this._disabledItems) < 0 && $.inArray(n, this.model.selectedIndices) < 0) {
                        this._activeItem = n;
                        this._enterTextBoxValue();
                    }
                }
                this._activeItem = current;
                if (current == stop) this._enterTextBoxValue();
                this.scrollerObj.setModel({ "scrollTop": this.ultag.outerHeight() });
            }
        },


        _getLastFocusedLi: function () {
            return this._selectedIndices && this._selectedIndices.length > 0 ? this._selectedIndices[this._selectedIndices.length - 1] : null;
        },

        _getLastShiftFocusedLi: function (index, isDown) {
            var step = isDown ? index - 1 : index + 1;
            if ($.inArray(step, this._selectedIndices) < 0) {
                return index;
            }
            else {
                return this._getLastShiftFocusedLi(step, isDown);
            }
        },

        _shiftUp: function (current, step, isCtrl) {
            if (current == null || current < 0) {
                this._checkDisableStep(0, step, false, false, true);
            }
            else if (current > 0 && current <= this._listSize - 1) {

                var select = this._disableItemSelectUp(current - step)
                if (select != null) {
                    if (this._getLastFocusedLi() != null) {
                        if (this._selectedIndices.length > 1 && current - 1 == this._selectedIndices[this._selectedIndices.length - 2])
                            for (var s = 1; s <= step; s++) {
                                if (current - s == this._selectedIndices[this._selectedIndices.length - 2]) {
                                    this._activeItem = current + 1 -s;
                                    this._removeTextBoxValue();
                                    this._focusItem(current - s);
                                }
                                else break;
                            }
                        else {
                            var next = this._getLastShiftFocusedLi(this._getLastFocusedLi(), false);
                            this._selectShiftUp(select, next, isCtrl);
                        }
                    }
                    else {
                        this._moveUp(current, step, false);
                    }

                }

            }
        },

        _shiftDown: function (current, step, isCtrl) {
            if (current == null || current < 0) {
                this._checkDisableStep(-1, step, true, false, true);
            }
            else if (current < this._listSize - 1) {
                var select = this._disableItemSelectDown(current + step)
                if (select != null) {
                    if (this._getLastFocusedLi() != null) {
                        if (this._selectedIndices.length > 1 && current + 1 == this._selectedIndices[this._selectedIndices.length - 2]) {
                           for (var s = 1; s <= step; s++) {
                                if (current + s == this._selectedIndices[this._selectedIndices.length - 2]) {
                                    this._activeItem = current - 1 +s;
                                    this._removeTextBoxValue();
                                    this._focusItem(current + s);
                                }
                                else break;
                            }
                        }
                        else {
                            var start = this._getLastShiftFocusedLi(this._getLastFocusedLi(), true);
                            this._selectShiftDown(start, select, isCtrl);
                        }
                    }
                    else {
                        this._moveDown(current, step, false);
                    }
                }

            }
        },
        _moveUp: function (current, step, isMulti) {
            if (current == null || current <= 0) {
                this._checkDisableStep(0, step, false, isMulti);
            }
            else if (current > this._listSize - 1) {
                this._checkDisableStep(this._listSize - 1, step, false, isMulti);
            }
            else if (current > 0 && current <= this._listSize - 1) {
                this._checkDisableStep(current, step, false, isMulti);
            }
        },
        _moveDown: function (current, step, isMulti) {
            if (current == null || current < 0) {
                this._checkDisableStep(-1, step, true, isMulti);
            }
            else if (current == 0) {
                this._checkDisableStep(0, step, true, isMulti);
            }
            else if (current >= this._listSize - 1) {
                this._checkDisableStep(this._listSize - 1, step, true, isMulti);
            }
            else if (current < this._listSize - 1) {
                this._checkDisableStep(current, step, true, isMulti);
            }
        },
        _checkDisableStep: function (current, step, isdown, isMulti, shift) {
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
            if (select != null) {
                isMulti ? this._focusItem(select) : this._selectItem(select);
                if (shift && isMulti) this._enterTextBoxValue();
            }

        },
        _disableItemSelectDown: function (current) {
            if (current == null || current < 0) current = 0;
            if (current < this._listSize) {
                if ($.inArray(current, this._disabledItems) < 0) {
                    return current;
                }
                else {
                    return this._disableItemSelectDown(current + 1);
                }
            }
            else return this._listSize - 1;
        },

        _disableItemSelectUp: function (current) {
            if (current == null || current < 0) current = 0;
            if (current < this._listSize) {
                if ($.inArray(current, this._disabledItems) < 0) {
                    return current;
                }
                else {
                    if (current > 0) {
                        return this._disableItemSelectUp(current - 1);
                    }
                }
            }
        },

        _preventDefaultAction: function (e, stopBubble) {
            e.preventDefault ? e.preventDefault() : (e.returnValue = false);
            if (stopBubble) {
                e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = true);
            }
        },

        _OnKeyDown: function (e) {
            this._uiInteract = true;
            if (this.model.enabled) {
                this._itemId = null;
                var _popupListItems = this._getLi(), liH, popupH, activeitem, flag;
                this._listSize = _popupListItems.length;                
                popupH = this.popupList.height();
                liH = this.ultag.children("li").outerHeight();
                activeitem = Math.round(popupH / liH) != 0 ? Math.round(popupH / liH) : 5;
                this._isSingle = this._isSingleSelect();
                if (this._isSingle) {
                    switch (e.keyCode) {
                        case 38: /* up arrow*/
                            if (e.altKey) {
                                if (this.ultag.find('li').length > 0)
                                    this._hideResult();
                                break;
                            }
                        case 33: /* page up */
                            var step = e.keyCode == 33 ? activeitem : 1;
                            this._moveUp(this._activeItem, step);
                            this._preventDefaultAction(e,true);
                            break;
					    case 8:
                            this._preventDefaultAction(e);
                            break;
                        case 40: /* down arrow*/
                            if (e.altKey) {
                                if (this.ultag.find('li').length > 0)
                                    this._showResult();
                                break;
                            }
                        case 34: /* page down */
                            var step = e.keyCode == 34 ? activeitem : 1;
                            this._moveDown(this._activeItem, step);
                            this._preventDefaultAction(e,true);
                            break;
                        case 37 /* left arrow*/:
                            if (this.model.enableRTL) this._moveDown(this._activeItem, 1);
                            else this._moveUp(this._activeItem, 1);
                            this._preventDefaultAction(e);
                            break;
                        case 39 /* right arrow */:
                            if (this.model.enableRTL) this._moveUp(this._activeItem, 1);
                            else this._moveDown(this._activeItem, 1);
                            this._preventDefaultAction(e);
                            break;
                        case 9 /* Tab */:
                        case 27 /*ESC*/:
                            if (this._isPopupShown()) this._hideResult();
                            break;
                        case 35 /*End*/:
                            this._moveDown(this._listSize - 1, 0);
                            this._preventDefaultAction(e);
                            break;
                        case 36 /*Home*/:
                            var step = this._activeItem != null ? this._activeItem : this._listSize - 1;
                            this._moveUp(step, step);
                            this._preventDefaultAction(e);
                            break;
                    }
                }
                else {
                    switch (e.keyCode) {
                        
                        case 38: /* up arrow*/
                            if (e.altKey) {
                                if (this.ultag.find('li').length > 0)
                                    this._hideResult();
                            }
                            else if (e.shiftKey) {
                                this._shiftUp(this._activeItem, 1, e.ctrlKey);
                            }
                            else this._moveUp(this._activeItem, 1, e.ctrlKey);

                            this._preventDefaultAction(e);
                            break;
                        case 33: /* page up */
                            if (e.shiftKey) {
                                this._shiftUp(this._activeItem, activeitem, e.ctrlKey);
                            }
                            else this._moveUp(this._activeItem, activeitem, e.ctrlKey);

                            this._preventDefaultAction(e);
                            break;
						case 8:
                            this._preventDefaultAction(e);
                            break;
                        case 40: /* down arrow*/
                            if (e.altKey) {
                                if (this.ultag.find('li').length > 0)
                                    this._showResult();
                            }
                            else if (e.shiftKey) {
                                this._shiftDown(this._activeItem, 1, e.ctrlKey);
                            }
                            else this._moveDown(this._activeItem, 1, e.ctrlKey);

                            this._preventDefaultAction(e);
                            break;

                        case 34: /* page down */

                            if (e.shiftKey) {
                                this._shiftDown(this._activeItem, activeitem, e.ctrlKey);
                            }
                            else this._moveDown(this._activeItem, activeitem, e.ctrlKey);
                            this._preventDefaultAction(e);
                            break;
                        case 37 /* left arrow*/:
                            if (this.model.enableRTL) this._moveDown(this._activeItem, 1, false);
                            else this._moveUp(this._activeItem, 1, false);
                            this._preventDefaultAction(e);
                            break;
                        case 39 /* right arrow */:
                            if (this.model.enableRTL) this._moveUp(this._activeItem, 1, false);
                            else this._moveDown(this._activeItem, 1, false);
                            this._preventDefaultAction(e);
                            break;
                        case 9 /* Tab */:
                        case 27 /*ESC*/:
                            if (this._isPopupShown()) this._hideResult();
                            break;
                        case 35 /*End*/:
                            if (e.shiftKey) {
                                this._selectShiftEnd(this._activeItem, this._listSize - 1, e.ctrlKey);
                            }
                            else this._moveDown(this._activeItem, this._listSize, e.ctrlKey);

                            this._preventDefaultAction(e);
                            break;
                        case 36 /*Home*/:
                            var step = this._activeItem != null ? this._activeItem : this._listSize - 1;
                            if (e.shiftKey) {
                                this._selectShiftHome(this._activeItem, 0, e.ctrlKey);
                            }
                            else this._moveUp(this._activeItem, step, e.ctrlKey);

                            this._preventDefaultAction(e);
                            break;
                    }
                }
            }
        },

        _OnKeyUp: function (e) {
            if (this.model.enabled) {
                this._preventDefaultAction(e);
                var target = e.target;
                if (this._activeItem == null) {
                    this._activeItem = this._getLi().index(this.popupList.find("ol,ul").children("li.e-hover"));
                }
                if (this._trim(this._visibleInput.val()) == "" && e.keyCode == 38 && e.keyCode == 40) {
                    this._hideResult();
                    return false;
                }

                switch (e.keyCode) {
                    case 38: break;
                    case 40: break;
                    case 37: break;
                    case 39: break;

                    case 20: break;
                    case 16: break;
                    case 17: break;
                    case 18: break;
                    case 35: break;
                    case 36: break;
                    case 144: break;
                    case 27: break;
                    case 9: break;

                    case 13 /*Enter*/:
                        if (!this._isSingle && this._isPopupShown() && (e.ctrlKey || e.shiftKey) && this._activeItem >= 0) 
                            this._selectAndUnselect();
                        else if (this._isPopupShown() && !e.ctrlKey && !e.shiftKey){
							if(!ej.isNullOrUndefined(this.inputSearch)){
								if(this.getSelectedItem().length == 0) {
									this.selectItemByIndex(0);
									$(this.listitems[0]).removeClass("e-hover");
								}
								else {		
									var focusedItems = this._getLastFocusedLi();
                                    if(this.model.multiSelectMode  != "none" || this.model.showCheckbox) {
										this.unselectItemByIndex(focusedItems);
										$(this.listitems[focusedItems]).removeClass("e-hover");
									}
								}
							}
							this._hideResult();
						}
						else if (this._isPopupShown()) this._hideResult();
                        this._preventDefaultAction(e);
                        break;

                    case 32 /*spacebar*/:
                        if (this._isPopupShown() && this._isSingle) this._hideResult();
                        if (!this._isSingle && this._isPopupShown() && this._activeItem >= 0) {
                            this._selectAndUnselect();
                        }
                        this._preventDefaultAction(e);
                        break;
                    case 8 /*backspace*/:
                        if(this.model.multiSelectMode =="visualmode") this._deleteLastBox();                        
                        this._preventDefaultAction(e);
                        break;
                    case 46 /*Del*/:
                        if (this.model.multiSelectMode == "visualmode" || this.model.showCheckbox) {
                            this._deleteBox(this._ulBox.children("li.e-active"));
                            break;
                        }
                }
            }
        },

        _isSingleSelect: function () {
            return !this.model.showCheckbox && this.model.multiSelectMode == "none";
        },

        _selectAndUnselect: function () {
            if (this.model.showCheckbox) {
                this._isChecked(this._getActiveItem().find(".e-checkwrap")[0]) ?
                        this._removeTextBoxValue() : this._enterTextBoxValue();
            }
            else if (this.model.MultiSelectMode != "none") {
                this._getActiveItem().hasClass("e-active") ? this._removeTextBoxValue() : this._enterTextBoxValue();
            }
        },

        _targetFocus: function () {
            if (this.model.enabled && !this._isFocused) {
                if (!this._isWatermark)
                    this._hiddenSpan.css("display", "none");
                this.wrapper.addClass("e-focus e-popactive");
                this._isFocused = true;
                this._trigger("focusIn");
            }
        },

        _targetBlur: function () {
            if (this.model.enabled) {
                this._isFocused = false;
                this.wrapper.removeClass("e-focus e-popactive");
                this._setWatermark();
                this._trigger("focusOut");
            }
        },

		_getLocalizedLabels: function (property) {
            return this._localizedLabels[property] === undefined ? ej.DropDownList.Locale["en-US"][property] : this._localizedLabels[property]
        },
        _wireEvents: function () {
            this._on(this.wrapper, "focus", this._targetFocus);
            this._on(this.wrapper, "blur", this._targetBlur);
            this._on(this.wrapper, "keydown", this._OnKeyDown);
            this._on(this.popupList, "keydown", this._OnKeyDown);
            this._on(this.popupList, "keyup", this._OnKeyUp);
            this._on(this.wrapper, "keyup", this._OnKeyUp);
            this._on(this.popupList, "keypress", this._OnKeyPress);
            this._on(this.wrapper, "keypress", this._OnKeyPress);
        },

        _unwireEvents: function () {
            this._off(this.wrapper, "focus", this._targetFocus);
            this._off(this.wrapper, "blur", this._targetBlur);
            this._off(this.wrapper, "keydown", this._OnKeyDown);
            this._off(this.popupList, "keydown", this._OnKeyDown);
            this._off(this.popupList, "keyup", this._OnKeyUp);
            this._off(this.wrapper, "keyup", this._OnKeyUp);
            this._off(this.popupList, "keypress", this._OnKeyPress);
            this._off(this.wrapper, "keypress", this._OnKeyPress);
			$(window).off("resize", $.proxy(this._OnWindowResize, this));
        },

        _multiItemSelection: function (listItems, isAddItem) {
            if (!this._ulBox && this.model.multiSelectMode == "visualmode") this._renderBoxModel();
            for (var i = 0; i < listItems.length; i++) {
                var index = isAddItem ? this._rawList.length - (listItems.length - i) : i;
                if (this._hasClass(listItems[i], "chkselect")) {
                    this._activeItem = index;
                    this._enterTextBoxValue();
                    this._removeClass(listItems[i], "chkselect");
                }
            }
            this._setWatermark();
        },
        _appendCheckbox: function (listItems, isAddItem) {
            if (!this._ulBox && this.model.multiSelectMode == "visualmode") this._renderBoxModel();
            for (var i = 0; i < listItems.length; i++) {
                var index = isAddItem ? this._rawList.length - (listItems.length - i) : i,
                $checkbox = document.createElement("input"),
                $spanCheck = document.createElement("span");
                this._setAttr($checkbox, { type: "checkbox", name: "list" + index, "data-role": "none", id: this._id + "_" + "check" + index })
                    ._setClass($checkbox, "e-check-input")
                    ._setAttr($spanCheck, { name: "list" + index + "_wrap", "data-role": "none", id: this._id + "_" + "check" + index + "wrap", unselectable: "on", "aria-checked": false})
                    ._setClass($spanCheck, "e-checkwrap e-icon ");
                $spanCheck.appendChild($checkbox);
                listItems[i].insertBefore($spanCheck, listItems[i].childNodes[0]);
                if (this._hasClass(listItems[i], "chkselect")) {
                    this._activeItem = index;
                    this._enterTextBoxValue();
                    this._removeClass(listItems[i], "chkselect");
                }
            }
            this._setWatermark();
        },

        _onCheckChange: function (e) {
            var curEle = e.target.nodeName === "INPUT" ? e.target.parentElement : e.target;
            this._activeItem = $.inArray($(curEle).parents("li")[0], this._getLi());
            if (!this._hasClass(curEle, "e-check-act")) {
                this._enterTextBoxValue();
            }
            else {
                this._removeTextBoxValue();
            }
        },
        _isChecked: function (checkEle) {
            return (this._hasClass(checkEle, "e-check-act") && $(checkEle).children(".e-check-input")[0].checked == true);
        },
        _removeCheck: function () {
            this._getLi().find(".e-checkwrap").remove();
        },
        _resetCheck: function () {
            var getLi = this._getLi(), checkEle;
            getLi.find(".e-check-act").removeClass("e-check-act").attr("aria-checked",false);
            checkEle = getLi.find(".e-check-input:checked");
            for (var e = 0; e < checkEle.length; e++) {
                checkEle[e].checked = false;
            }
        }

    });
	ej.DropDownList.Locale = ej.DropDownList.Locale || {};
    ej.DropDownList.Locale["default"] = ej.DropDownList.Locale["en-US"] = {        
        emptyResultText: "No suggestions",  
		watermarkText:""
    };
    ej.MultiSelectMode = {
        /** Supports to selection mode with none only */
        None: "none",
        /** Supports to selection mode with delimitter only */
        Delimiter: "delimiter",
        /** Supports to selection mode with visualmode only */
        VisualMode: "visualmode"
    };
    ej.VirtualScrollMode = {      
        /** Make virtual scrollbar in normal mode */
        Normal: "normal",
        /** Make virtual scrollbar in continuous mode*/
        Continuous: "continuous"
    };
    
})(jQuery, Syncfusion);;
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