/*! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/
var Kinetic = {};
! function () {
    Kinetic.version = "4.6.0", Kinetic.Filters = {}, Kinetic.Node = function (a) {
        this._init(a)
    }, Kinetic.Shape = function (a) {
        this.__init(a)
    }, Kinetic.Container = function (a) {
        this.__init(a)
    }, Kinetic.Stage = function (a) {
        this.___init(a)
    }, Kinetic.Layer = function (a) {
        this.___init(a)
    }, Kinetic.Group = function (a) {
        this.___init(a)
    }, Kinetic.Global = {
        stages: [],
        idCounter: 0,
        ids: {},
        names: {},
        shapes: {},
        listenClickTap: !1,
        inDblClickWindow: !1,
        dblClickWindow: 400,
        isDragging: function () {
            var a = Kinetic.DD;
            return a ? a.isDragging : !1
        },
        isDragReady: function () {
            var a = Kinetic.DD;
            return a ? !! a.node : !1
        },
        _addId: function (a, b) {
            void 0 !== b && (this.ids[b] = a)
        },
        _removeId: function (a) {
            void 0 !== a && delete this.ids[a]
        },
        _addName: function (a, b) {
            void 0 !== b && (void 0 === this.names[b] && (this.names[b] = []), this.names[b].push(a))
        },
        _removeName: function (a, b) {
            if (void 0 !== a) {
                var c = this.names[a];
                if (void 0 !== c) {
                    for (var d = 0; d < c.length; d++) {
                        var e = c[d];
                        e._id === b && c.splice(d, 1)
                    }
                    0 === c.length && delete this.names[a]
                }
            }
        }
    }
}(),
function (a, b) {
    "object" == typeof exports ? module.exports = b() : "function" == typeof define && define.amd ? define(b) : a.returnExports = b()
}(this, function () {
    return Kinetic
}); /*! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/
! function () {
    Kinetic.Collection = function () {
        var a = [].slice.call(arguments),
            b = a.length,
            c = 0;
        for (this.length = b; b > c; c++) this[c] = a[c];
        return this
    }, Kinetic.Collection.prototype = [], Kinetic.Collection.prototype.each = function (a) {
        for (var b = 0; b < this.length; b++) a(this[b], b)
    }, Kinetic.Collection.prototype.toArray = function () {
        var a, b = [],
            c = this.length;
        for (a = 0; c > a; a++) b.push(this[a]);
        return b
    }, Kinetic.Collection.toCollection = function (a) {
        var b, c = new Kinetic.Collection,
            d = a.length;
        for (b = 0; d > b; b++) c.push(a[b]);
        return c
    }, Kinetic.Collection.mapMethods = function (a) {
        var b, c = a.length;
        for (b = 0; c > b; b++)! function (b) {
            var c = a[b];
            Kinetic.Collection.prototype[c] = function () {
                var a, b = this.length;
                for (args = [].slice.call(arguments), a = 0; b > a; a++) this[a][c].apply(this[a], args)
            }
        }(b)
    }
}(),
function () {
    Kinetic.Transform = function () {
        this.m = [1, 0, 0, 1, 0, 0]
    }, Kinetic.Transform.prototype = {
        translate: function (a, b) {
            this.m[4] += this.m[0] * a + this.m[2] * b, this.m[5] += this.m[1] * a + this.m[3] * b
        },
        scale: function (a, b) {
            this.m[0] *= a, this.m[1] *= a, this.m[2] *= b, this.m[3] *= b
        },
        rotate: function (a) {
            var b = Math.cos(a),
                c = Math.sin(a),
                d = this.m[0] * b + this.m[2] * c,
                e = this.m[1] * b + this.m[3] * c,
                f = this.m[0] * -c + this.m[2] * b,
                g = this.m[1] * -c + this.m[3] * b;
            this.m[0] = d, this.m[1] = e, this.m[2] = f, this.m[3] = g
        },
        getTranslation: function () {
            return {
                x: this.m[4],
                y: this.m[5]
            }
        },
        skew: function (a, b) {
            var c = this.m[0] + this.m[2] * b,
                d = this.m[1] + this.m[3] * b,
                e = this.m[2] + this.m[0] * a,
                f = this.m[3] + this.m[1] * a;
            this.m[0] = c, this.m[1] = d, this.m[2] = e, this.m[3] = f
        },
        multiply: function (a) {
            var b = this.m[0] * a.m[0] + this.m[2] * a.m[1],
                c = this.m[1] * a.m[0] + this.m[3] * a.m[1],
                d = this.m[0] * a.m[2] + this.m[2] * a.m[3],
                e = this.m[1] * a.m[2] + this.m[3] * a.m[3],
                f = this.m[0] * a.m[4] + this.m[2] * a.m[5] + this.m[4],
                g = this.m[1] * a.m[4] + this.m[3] * a.m[5] + this.m[5];
            this.m[0] = b, this.m[1] = c, this.m[2] = d, this.m[3] = e, this.m[4] = f, this.m[5] = g
        },
        invert: function () {
            var a = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]),
                b = this.m[3] * a,
                c = -this.m[1] * a,
                d = -this.m[2] * a,
                e = this.m[0] * a,
                f = a * (this.m[2] * this.m[5] - this.m[3] * this.m[4]),
                g = a * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
            this.m[0] = b, this.m[1] = c, this.m[2] = d, this.m[3] = e, this.m[4] = f, this.m[5] = g
        },
        getMatrix: function () {
            return this.m
        },
        setAbsolutePosition: function (a, b) {
            var c = this.m[0],
                d = this.m[1],
                e = this.m[2],
                f = this.m[3],
                g = this.m[4],
                h = this.m[5],
                i = (c * (b - h) - d * (a - g)) / (c * f - d * e),
                j = (a - g - e * i) / c;
            this.translate(j, i)
        }
    }
}(),
function () {
    var a = "canvas",
        b = "2d",
        c = "[object Array]",
        d = "[object Number]",
        e = "[object String]",
        f = Math.PI / 180,
        g = 180 / Math.PI,
        h = "#",
        i = "",
        j = "0",
        k = "Kinetic warning: ",
        l = "Kinetic error: ",
        m = "rgb(",
        n = {
            aqua: [0, 255, 255],
            lime: [0, 255, 0],
            silver: [192, 192, 192],
            black: [0, 0, 0],
            maroon: [128, 0, 0],
            teal: [0, 128, 128],
            blue: [0, 0, 255],
            navy: [0, 0, 128],
            white: [255, 255, 255],
            fuchsia: [255, 0, 255],
            olive: [128, 128, 0],
            yellow: [255, 255, 0],
            orange: [255, 165, 0],
            gray: [128, 128, 128],
            purple: [128, 0, 128],
            green: [0, 128, 0],
            red: [255, 0, 0],
            pink: [255, 192, 203],
            cyan: [0, 255, 255],
            transparent: [255, 255, 255, 0]
        }, o = /rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/;
    Kinetic.Util = {
        _isElement: function (a) {
            return !(!a || 1 != a.nodeType)
        },
        _isFunction: function (a) {
            return !!(a && a.constructor && a.call && a.apply)
        },
        _isObject: function (a) {
            return !!a && a.constructor == Object
        },
        _isArray: function (a) {
            return Object.prototype.toString.call(a) == c
        },
        _isNumber: function (a) {
            return Object.prototype.toString.call(a) == d
        },
        _isString: function (a) {
            return Object.prototype.toString.call(a) == e
        },
        _hasMethods: function (a) {
            var b, c = [];
            for (b in a) this._isFunction(a[b]) && c.push(b);
            return c.length > 0
        },
        _isInDocument: function (a) {
            for (; a = a.parentNode;)
                if (a == document) return !0;
            return !1
        },
        _getXY: function (a) {
            if (this._isNumber(a)) return {
                x: a,
                y: a
            };
            if (this._isArray(a)) {
                if (1 === a.length) {
                    var b = a[0];
                    if (this._isNumber(b)) return {
                        x: b,
                        y: b
                    };
                    if (this._isArray(b)) return {
                        x: b[0],
                        y: b[1]
                    };
                    if (this._isObject(b)) return b
                } else if (a.length >= 2) return {
                    x: a[0],
                    y: a[1]
                }
            } else if (this._isObject(a)) return a;
            return null
        },
        _getSize: function (a) {
            if (this._isNumber(a)) return {
                width: a,
                height: a
            };
            if (this._isArray(a))
                if (1 === a.length) {
                    var b = a[0];
                    if (this._isNumber(b)) return {
                        width: b,
                        height: b
                    };
                    if (this._isArray(b)) {
                        if (b.length >= 4) return {
                            width: b[2],
                            height: b[3]
                        };
                        if (b.length >= 2) return {
                            width: b[0],
                            height: b[1]
                        }
                    } else if (this._isObject(b)) return b
                } else {
                    if (a.length >= 4) return {
                        width: a[2],
                        height: a[3]
                    };
                    if (a.length >= 2) return {
                        width: a[0],
                        height: a[1]
                    }
                } else if (this._isObject(a)) return a;
            return null
        },
        _getPoints: function (a) {
            var b, c, d = [];
            if (void 0 === a) return [];
            if (c = a.length, this._isArray(a[0])) {
                for (b = 0; c > b; b++) d.push({
                    x: a[b][0],
                    y: a[b][1]
                });
                return d
            }
            if (this._isObject(a[0])) return a;
            for (b = 0; c > b; b += 2) d.push({
                x: a[b],
                y: a[b + 1]
            });
            return d
        },
        _getImage: function (c, d) {
            var e, f, g, h;
            c ? this._isElement(c) ? d(c) : this._isString(c) ? (e = new Image, e.onload = function () {
                d(e)
            }, e.src = c) : c.data ? (f = document.createElement(a), f.width = c.width, f.height = c.height, g = f.getContext(b), g.putImageData(c, 0, 0), h = f.toDataURL(), e = new Image, e.onload = function () {
                d(e)
            }, e.src = h) : d(null) : d(null)
        },
        _rgbToHex: function (a, b, c) {
            return ((1 << 24) + (a << 16) + (b << 8) + c).toString(16).slice(1)
        },
        _hexToRgb: function (a) {
            a = a.replace(h, i);
            var b = parseInt(a, 16);
            return {
                r: 255 & b >> 16,
                g: 255 & b >> 8,
                b: 255 & b
            }
        },
        getRandomColor: function () {
            for (var a = (16777215 * Math.random() << 0).toString(16); a.length < 6;) a = j + a;
            return h + a
        },
        getRGB: function (a) {
            var b;
            return a in n ? (b = n[a], {
                r: b[0],
                g: b[1],
                b: b[2]
            }) : a[0] === h ? this._hexToRgb(a.substring(1)) : a.substr(0, 4) === m ? (b = o.exec(a.replace(/ /g, "")), {
                r: parseInt(b[1], 10),
                g: parseInt(b[2], 10),
                b: parseInt(b[3], 10)
            }) : {
                r: 0,
                g: 0,
                b: 0
            }
        },
        _merge: function (a, b) {
            var c = this._clone(b);
            for (var d in a) c[d] = this._isObject(a[d]) ? this._merge(a[d], c[d]) : a[d];
            return c
        },
        _clone: function (a) {
            var b = {};
            for (var c in a) b[c] = this._isObject(a[c]) ? this._clone(a[c]) : a[c];
            return b
        },
        _degToRad: function (a) {
            return a * f
        },
        _radToDeg: function (a) {
            return a * g
        },
        _capitalize: function (a) {
            return a.charAt(0).toUpperCase() + a.slice(1)
        },
        error: function (a) {
            throw new Error(l + a)
        },
        warn: function (a) {
            window.console && console.warn && console.warn(k + a)
        },
        extend: function (a, b) {
            for (var c in b.prototype) c in a.prototype || (a.prototype[c] = b.prototype[c])
        },
        addMethods: function (a, b) {
            var c;
            for (c in b) a.prototype[c] = b[c]
        },
        _getControlPoints: function (a, b, c, d) {
            var e = a.x,
                f = a.y,
                g = b.x,
                h = b.y,
                i = c.x,
                j = c.y,
                k = Math.sqrt(Math.pow(g - e, 2) + Math.pow(h - f, 2)),
                l = Math.sqrt(Math.pow(i - g, 2) + Math.pow(j - h, 2)),
                m = d * k / (k + l),
                n = d * l / (k + l),
                o = g - m * (i - e),
                p = h - m * (j - f),
                q = g + n * (i - e),
                r = h + n * (j - f);
            return [{
                x: o,
                y: p
            }, {
                x: q,
                y: r
            }]
        },
        _expandPoints: function (a, b) {
            var c, d, e = a.length,
                f = [];
            for (c = 1; e - 1 > c; c++) d = Kinetic.Util._getControlPoints(a[c - 1], a[c], a[c + 1], b), f.push(d[0]), f.push(a[c]), f.push(d[1]);
            return f
        },
        _removeLastLetter: function (a) {
            return a.substring(0, a.length - 1)
        }
    }
}(); /*! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/
! function () {
    var a = document.createElement("canvas"),
        b = a.getContext("2d"),
        c = window.devicePixelRatio || 1,
        d = b.webkitBackingStorePixelRatio || b.mozBackingStorePixelRatio || b.msBackingStorePixelRatio || b.oBackingStorePixelRatio || b.backingStorePixelRatio || 1,
        e = c / d;
    Kinetic.Canvas = function (a) {
        this.init(a)
    }, Kinetic.Canvas.prototype = {
        init: function (a) {
            a = a || {};
            var b = a.width || 0,
                c = a.height || 0,
                d = a.pixelRatio || e,
                f = a.contextType || "2d";
            this.pixelRatio = d, this.element = document.createElement("canvas"), this.element.style.padding = 0, this.element.style.margin = 0, this.element.style.border = 0, this.element.style.background = "transparent", this.element.style.position = "absolute", this.element.style.top = 0, this.element.style.left = 0, this.context = this.element.getContext(f), this.setSize(b, c)
        },
        getElement: function () {
            return this.element
        },
        getContext: function () {
            return this.context
        },
        setWidth: function (a) {
            this.width = this.element.width = a * this.pixelRatio, this.element.style.width = a + "px"
        },
        setHeight: function (a) {
            this.height = this.element.height = a * this.pixelRatio, this.element.style.height = a + "px"
        },
        getWidth: function () {
            return this.width
        },
        getHeight: function () {
            return this.height
        },
        setSize: function (a, b) {
            this.setWidth(a), this.setHeight(b)
        },
        clear: function (a) {
            var b, c, d = this.getContext();
            a ? (b = Kinetic.Util._getXY(a), c = Kinetic.Util._getSize(a), d.clearRect(b.x || 0, b.y || 0, c.width, c.height)) : d.clearRect(0, 0, this.getWidth(), this.getHeight())
        },
        toDataURL: function (a, b) {
            try {
                return this.element.toDataURL(a, b)
            } catch (c) {
                try {
                    return this.element.toDataURL()
                } catch (d) {
                    return Kinetic.Util.warn("Unable to get data URL. " + d.message), ""
                }
            }
        },
        fill: function (a) {
            a.getFillEnabled() && this._fill(a)
        },
        stroke: function (a) {
            a.getStrokeEnabled() && this._stroke(a)
        },
        fillStroke: function (a) {
            var b = a.getFillEnabled();
            b && this._fill(a), a.getStrokeEnabled() && this._stroke(a, a.hasShadow() && a.hasFill() && b)
        },
        applyShadow: function (a, b) {
            var c = this.context;
            c.save(), this._applyShadow(a), b(), c.restore(), b()
        },
        _applyLineCap: function (a) {
            var b = a.getLineCap();
            b && (this.context.lineCap = b)
        },
        _applyOpacity: function (a) {
            var b = a.getAbsoluteOpacity();
            1 !== b && (this.context.globalAlpha = b)
        },
        _applyLineJoin: function (a) {
            var b = a.getLineJoin();
            b && (this.context.lineJoin = b)
        },
        _applyAncestorTransforms: function (a) {
            var b = a.getAbsoluteTransform().getMatrix();
            this.context.transform(b[0], b[1], b[2], b[3], b[4], b[5])
        },
        _clip: function (a) {
            var b = this.getContext(),
                c = a.getClipX() || 0,
                d = a.getClipY() || 0,
                e = a.getClipWidth(),
                f = a.getClipHeight();
            b.save(), this._applyAncestorTransforms(a), b.beginPath(), b.rect(c, d, e, f), b.clip(), b.setTransform(1, 0, 0, 1, 0, 0)
        }
    }, Kinetic.SceneCanvas = function (a) {
        Kinetic.Canvas.call(this, a)
    }, Kinetic.SceneCanvas.prototype = {
        setWidth: function (a) {
            var b = this.pixelRatio;
            Kinetic.Canvas.prototype.setWidth.call(this, a), this.context.scale(b, b)
        },
        setHeight: function (a) {
            var b = this.pixelRatio;
            Kinetic.Canvas.prototype.setHeight.call(this, a), this.context.scale(b, b)
        },
        _fillColor: function (a) {
            var b = this.context,
                c = a.getFill();
            b.fillStyle = c, a._fillFunc(b)
        },
        _fillPattern: function (a) {
            var b = this.context,
                c = a.getFillPatternImage(),
                d = a.getFillPatternX(),
                e = a.getFillPatternY(),
                f = a.getFillPatternScale(),
                g = a.getFillPatternRotation(),
                h = a.getFillPatternOffset(),
                i = a.getFillPatternRepeat();
            (d || e) && b.translate(d || 0, e || 0), g && b.rotate(g), f && b.scale(f.x, f.y), h && b.translate(-1 * h.x, -1 * h.y), b.fillStyle = b.createPattern(c, i || "repeat"), b.fill()
        },
        _fillLinearGradient: function (a) {
            var b = this.context,
                c = a.getFillLinearGradientStartPoint(),
                d = a.getFillLinearGradientEndPoint(),
                e = a.getFillLinearGradientColorStops(),
                f = b.createLinearGradient(c.x, c.y, d.x, d.y);
            if (e) {
                for (var g = 0; g < e.length; g += 2) f.addColorStop(e[g], e[g + 1]);
                b.fillStyle = f, b.fill()
            }
        },
        _fillRadialGradient: function (a) {
            for (var b = this.context, c = a.getFillRadialGradientStartPoint(), d = a.getFillRadialGradientEndPoint(), e = a.getFillRadialGradientStartRadius(), f = a.getFillRadialGradientEndRadius(), g = a.getFillRadialGradientColorStops(), h = b.createRadialGradient(c.x, c.y, e, d.x, d.y, f), i = 0; i < g.length; i += 2) h.addColorStop(g[i], g[i + 1]);
            b.fillStyle = h, b.fill()
        },
        _fill: function (a, b) {
            var c = this.context,
                d = a.getFill(),
                e = a.getFillPatternImage(),
                f = a.getFillLinearGradientColorStops(),
                g = a.getFillRadialGradientColorStops(),
                h = a.getFillPriority();
            c.save(), !b && a.hasShadow() && this._applyShadow(a), d && "color" === h ? this._fillColor(a) : e && "pattern" === h ? this._fillPattern(a) : f && "linear-gradient" === h ? this._fillLinearGradient(a) : g && "radial-gradient" === h ? this._fillRadialGradient(a) : d ? this._fillColor(a) : e ? this._fillPattern(a) : f ? this._fillLinearGradient(a) : g && this._fillRadialGradient(a), c.restore(), !b && a.hasShadow() && this._fill(a, !0)
        },
        _stroke: function (a, b) {
            var c = this.context,
                d = a.getStroke(),
                e = a.getStrokeWidth(),
                f = a.getDashArray();
            (d || e) && (c.save(), a.getStrokeScaleEnabled() || c.setTransform(1, 0, 0, 1, 0, 0), this._applyLineCap(a), f && a.getDashArrayEnabled() && (c.setLineDash ? c.setLineDash(f) : "mozDash" in c ? c.mozDash = f : "webkitLineDash" in c && (c.webkitLineDash = f)), !b && a.hasShadow() && this._applyShadow(a), c.lineWidth = e || 2, c.strokeStyle = d || "black", a._strokeFunc(c), c.restore(), !b && a.hasShadow() && this._stroke(a, !0))
        },
        _applyShadow: function (a) {
            var b = this.context;
            if (a.hasShadow() && a.getShadowEnabled()) {
                var c = a.getAbsoluteOpacity(),
                    d = a.getShadowColor() || "black",
                    e = a.getShadowBlur() || 5,
                    f = a.getShadowOffset() || {
                        x: 0,
                        y: 0
                    };
                a.getShadowOpacity() && (b.globalAlpha = a.getShadowOpacity() * c), b.shadowColor = d, b.shadowBlur = e, b.shadowOffsetX = f.x, b.shadowOffsetY = f.y
            }
        }
    }, Kinetic.Util.extend(Kinetic.SceneCanvas, Kinetic.Canvas), Kinetic.HitCanvas = function (a) {
        Kinetic.Canvas.call(this, a)
    }, Kinetic.HitCanvas.prototype = {
        _fill: function (a) {
            var b = this.context;
            b.save(), b.fillStyle = a.colorKey, a._fillFuncHit(b), b.restore()
        },
        _stroke: function (a) {
            var b = this.context,
                c = a.getStroke(),
                d = a.getStrokeWidth();
            (c || d) && (this._applyLineCap(a), b.lineWidth = d || 2, b.strokeStyle = a.colorKey, a._strokeFuncHit(b))
        }
    }, Kinetic.Util.extend(Kinetic.HitCanvas, Kinetic.Canvas)
}(); /*! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/
! function () {
    var a = "add",
        b = "b",
        c = "Deg",
        d = "g",
        e = "get",
        f = "#",
        g = "r",
        h = "RGB",
        i = "set",
        j = "B",
        k = "G",
        l = "Height",
        m = "R",
        n = "Width",
        o = "X",
        p = "Y";
    Kinetic.Factory = {
        addGetterSetter: function (a, b, c) {
            this.addGetter(a, b, c), this.addSetter(a, b)
        },
        addPointGetterSetter: function (a, b, c) {
            this.addPointGetter(a, b, c), this.addPointSetter(a, b), this.addGetter(a, b + o, c), this.addGetter(a, b + p, c), this.addSetter(a, b + o), this.addSetter(a, b + p)
        },
        addBoxGetterSetter: function (a, b, c) {
            this.addBoxGetter(a, b, c), this.addBoxSetter(a, b), this.addGetter(a, b + o, c), this.addGetter(a, b + p, c), this.addGetter(a, b + n, c), this.addGetter(a, b + l, c), this.addSetter(a, b + o), this.addSetter(a, b + p), this.addSetter(a, b + n), this.addSetter(a, b + l)
        },
        addPointsGetterSetter: function (a, b) {
            this.addPointsGetter(a, b), this.addPointsSetter(a, b), this.addPointAdder(a, b)
        },
        addRotationGetterSetter: function (a, b, c) {
            this.addRotationGetter(a, b, c), this.addRotationSetter(a, b)
        },
        addColorGetterSetter: function (a, c) {
            this.addGetter(a, c), this.addSetter(a, c), this.addColorRGBGetter(a, c), this.addColorComponentGetter(a, c, g), this.addColorComponentGetter(a, c, d), this.addColorComponentGetter(a, c, b), this.addColorRGBSetter(a, c), this.addColorComponentSetter(a, c, g), this.addColorComponentSetter(a, c, d), this.addColorComponentSetter(a, c, b)
        },
        addColorRGBGetter: function (a, b) {
            var c = e + Kinetic.Util._capitalize(b) + h;
            a.prototype[c] = function () {
                return Kinetic.Util.getRGB(this.attrs[b])
            }
        },
        addColorComponentGetter: function (a, b, c) {
            var d = e + Kinetic.Util._capitalize(b),
                f = d + Kinetic.Util._capitalize(c);
            a.prototype[f] = function () {
                return this[d + h]()[c]
            }
        },
        addPointsGetter: function (a, b) {
            var c = e + Kinetic.Util._capitalize(b);
            a.prototype[c] = function () {
                var a = this.attrs[b];
                return void 0 === a ? [] : a
            }
        },
        addGetter: function (a, b, c) {
            var d = e + Kinetic.Util._capitalize(b);
            a.prototype[d] = function () {
                var a = this.attrs[b];
                return void 0 === a ? c : a
            }
        },
        addPointGetter: function (a, b) {
            var c = e + Kinetic.Util._capitalize(b);
            a.prototype[c] = function () {
                var a = this;
                return {
                    x: a[c + o](),
                    y: a[c + p]()
                }
            }
        },
        addBoxGetter: function (a, b) {
            var c = e + Kinetic.Util._capitalize(b);
            a.prototype[c] = function () {
                var a = this;
                return {
                    x: a[c + o](),
                    y: a[c + p](),
                    width: a[c + n](),
                    height: a[c + l]()
                }
            }
        },
        addRotationGetter: function (a, b, d) {
            var f = e + Kinetic.Util._capitalize(b);
            a.prototype[f] = function () {
                var a = this.attrs[b];
                return void 0 === a && (a = d), a
            }, a.prototype[f + c] = function () {
                var a = this.attrs[b];
                return void 0 === a && (a = d), Kinetic.Util._radToDeg(a)
            }
        },
        addColorRGBSetter: function (a, b) {
            var c = i + Kinetic.Util._capitalize(b) + h;
            a.prototype[c] = function (a) {
                var c = a && void 0 !== a.r ? 0 | a.r : this.getAttr(b + m),
                    d = a && void 0 !== a.g ? 0 | a.g : this.getAttr(b + k),
                    e = a && void 0 !== a.b ? 0 | a.b : this.getAttr(b + j);
                this._setAttr(b, f + Kinetic.Util._rgbToHex(c, d, e))
            }
        },
        addColorComponentSetter: function (a, b, c) {
            var d = i + Kinetic.Util._capitalize(b),
                e = d + Kinetic.Util._capitalize(c);
            a.prototype[e] = function (a) {
                var b = {};
                b[c] = a, this[d + h](b)
            }
        },
        addPointsSetter: function (a, b) {
            var c = i + Kinetic.Util._capitalize(b);
            a.prototype[c] = function (a) {
                var b = Kinetic.Util._getPoints(a);
                this._setAttr("points", b)
            }
        },
        addSetter: function (a, b) {
            var c = i + Kinetic.Util._capitalize(b);
            a.prototype[c] = function (a) {
                this._setAttr(b, a)
            }
        },
        addPointSetter: function (a, b) {
            var c = i + Kinetic.Util._capitalize(b);
            a.prototype[c] = function () {
                var a = Kinetic.Util._getXY([].slice.call(arguments)),
                    d = this.attrs[b],
                    e = 0,
                    f = 0;
                a && (e = a.x, f = a.y, this._fireBeforeChangeEvent(b, d, a), void 0 !== e && this[c + o](e), void 0 !== f && this[c + p](f), this._fireChangeEvent(b, d, a))
            }
        },
        addBoxSetter: function (a, b) {
            var c = i + Kinetic.Util._capitalize(b);
            a.prototype[c] = function () {
                var a, d, e, f, g = [].slice.call(arguments),
                    h = Kinetic.Util._getXY(g),
                    i = Kinetic.Util._getSize(g),
                    j = Kinetic.Util._merge(h, i),
                    k = this.attrs[b];
                j && (a = j.x, d = j.y, e = j.width, f = j.height, this._fireBeforeChangeEvent(b, k, j), void 0 !== a && this[c + o](a), void 0 !== d && this[c + p](d), void 0 !== e && this[c + n](e), void 0 !== f && this[c + l](f), this._fireChangeEvent(b, k, j))
            }
        },
        addRotationSetter: function (a, b) {
            var d = i + Kinetic.Util._capitalize(b);
            a.prototype[d] = function (a) {
                this._setAttr(b, a)
            }, a.prototype[d + c] = function (a) {
                this._setAttr(b, Kinetic.Util._degToRad(a))
            }
        },
        addPointAdder: function (b, c) {
            var d = a + Kinetic.Util._removeLastLetter(Kinetic.Util._capitalize(c));
            b.prototype[d] = function () {
                var a = Kinetic.Util._getXY([].slice.call(arguments)),
                    b = this.attrs[c];
                a && (this._fireBeforeChangeEvent(c, b, a), this.attrs[c].push(a), this._fireChangeEvent(c, b, a))
            }
        }
    }
}(); /*! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/
! function () {
    var a = "absoluteOpacity",
        b = "absoluteTransform",
        c = "before",
        d = "Change",
        e = "children",
        f = ".",
        g = "",
        h = "get",
        i = "id",
        j = "kinetic",
        k = "listening",
        n = "name",
        o = "set",
        p = "Shape",
        q = " ",
        r = "stage",
        s = "transform",
        u = "Stage",
        v = "visible",
        w = ["xChange.kinetic", "yChange.kinetic", "scaleXChange.kinetic", "scaleYChange.kinetic", "skewXChange.kinetic", "skewYChange.kinetic", "rotationChange.kinetic", "offsetXChange.kinetic", "offsetYChange.kinetic"].join(q);
    Kinetic.Util.addMethods(Kinetic.Node, {
        _init: function (c) {
            var d = this;
            this._id = Kinetic.Global.idCounter++, this.eventListeners = {}, this.attrs = {}, this.cache = {}, this.setAttrs(c), this.on(w, function () {
                this._clearCache(s), d._clearSelfAndChildrenCache(b)
            }), this.on("visibleChange.kinetic", function () {
                d._clearSelfAndChildrenCache(v)
            }), this.on("listeningChange.kinetic", function () {
                d._clearSelfAndChildrenCache(k)
            }), this.on("opacityChange.kinetic", function () {
                d._clearSelfAndChildrenCache(a)
            })
        },
        clearCache: function () {
            this.cache = {}
        },
        _clearCache: function (a) {
            delete this.cache[a]
        },
        _getCache: function (a, b) {
            var c = this.cache[a];
            return void 0 === c && (this.cache[a] = b.call(this)), this.cache[a]
        },
        _clearSelfAndChildrenCache: function (a) {
            this._clearCache(a), this.children && this.getChildren().each(function (b) {
                b._clearSelfAndChildrenCache(a)
            })
        },
        on: function (a, b) {
            var c, d, e, h, i, j = a.split(q),
                k = j.length;
            for (c = 0; k > c; c++) d = j[c], e = d.split(f), h = e[0], i = e[1] || g, this.eventListeners[h] || (this.eventListeners[h] = []), this.eventListeners[h].push({
                name: i,
                handler: b
            });
            return this
        },
        off: function (a) {
            var b, c, d, e, g, h = a.split(q),
                i = h.length;
            for (b = 0; i > b; b++)
                if (c = h[b], d = c.split(f), e = d[0], g = d[1], e) this.eventListeners[e] && this._off(e, g);
                else
                    for (t in this.eventListeners) this._off(t, g);
            return this
        },
        remove: function () {
            var c = this.getParent();
            return c && c.children && (c.children.splice(this.index, 1), c._setChildrenIndices(), delete this.parent), this._clearSelfAndChildrenCache(r), this._clearSelfAndChildrenCache(b), this._clearSelfAndChildrenCache(v), this._clearSelfAndChildrenCache(k), this._clearSelfAndChildrenCache(a), this
        },
        destroy: function () {
            var a = Kinetic.Global;
            a._removeId(this.getId()), a._removeName(this.getName(), this._id), this.remove()
        },
        getAttr: function (a) {
            var b = h + Kinetic.Util._capitalize(a);
            return Kinetic.Util._isFunction(this[b]) ? this[b]() : this.attrs[a]
        },
        getAncestors: function () {
            for (var a = this.getParent(), b = new Kinetic.Collection; a;) b.push(a), a = a.getParent();
            return b
        },
        setAttr: function () {
            var a = Array.prototype.slice.call(arguments),
                b = a[0],
                c = o + Kinetic.Util._capitalize(b),
                d = this[c];
            return a.shift(), Kinetic.Util._isFunction(d) ? d.apply(this, a) : this.attrs[b] = a[0], this
        },
        getAttrs: function () {
            return this.attrs || {}
        },
        setAttrs: function (a) {
            var b, c;
            if (a)
                for (b in a) b === e || (c = o + Kinetic.Util._capitalize(b), Kinetic.Util._isFunction(this[c]) ? this[c](a[b]) : this._setAttr(b, a[b]));
            return this
        },
        isListening: function () {
            return this._getCache(k, this._isListening)
        },
        _isListening: function () {
            var a = this.getListening(),
                b = this.getParent();
            return a && b && !b.isListening() ? !1 : a
        },
        isVisible: function () {
            return this._getCache(v, this._isVisible)
        },
        _isVisible: function () {
            var a = this.getVisible(),
                b = this.getParent();
            return a && b && !b.isVisible() ? !1 : a
        },
        show: function () {
            return this.setVisible(!0), this
        },
        hide: function () {
            return this.setVisible(!1), this
        },
        getZIndex: function () {
            return this.index || 0
        },
        getAbsoluteZIndex: function () {
            function a(i) {
                for (b = [], c = i.length, d = 0; c > d; d++) e = i[d], h++, e.nodeType !== p && (b = b.concat(e.getChildren().toArray())), e._id === g._id && (d = c);
                b.length > 0 && b[0].getLevel() <= f && a(b)
            }
            var b, c, d, e, f = this.getLevel(),
                g = this,
                h = 0;
            return g.nodeType !== u && a(g.getStage().getChildren()), h
        },
        getLevel: function () {
            for (var a = 0, b = this.parent; b;) a++, b = b.parent;
            return a
        },
        setPosition: function () {
            var a = Kinetic.Util._getXY([].slice.call(arguments));
            return this.setX(a.x), this.setY(a.y), this
        },
        getPosition: function () {
            return {
                x: this.getX(),
                y: this.getY()
            }
        },
        getAbsolutePosition: function () {
            var a = this.getAbsoluteTransform(),
                b = this.getOffset();
            return a.translate(b.x, b.y), a.getTranslation()
        },
        setAbsolutePosition: function () {
            var a, b = Kinetic.Util._getXY([].slice.call(arguments)),
                c = this._clearTransform();
            return this.attrs.x = c.x, this.attrs.y = c.y, delete c.x, delete c.y, a = this.getAbsoluteTransform(), a.invert(), a.translate(b.x, b.y), b = {
                x: this.attrs.x + a.getTranslation().x,
                y: this.attrs.y + a.getTranslation().y
            }, this.setPosition(b.x, b.y), this._setTransform(c), this
        },
        _setTransform: function (a) {
            var c;
            for (c in a) this.attrs[c] = a[c];
            this._clearCache(s), this._clearSelfAndChildrenCache(b)
        },
        _clearTransform: function () {
            var a = {
                x: this.getX(),
                y: this.getY(),
                rotation: this.getRotation(),
                scaleX: this.getScaleX(),
                scaleY: this.getScaleY(),
                offsetX: this.getOffsetX(),
                offsetY: this.getOffsetY(),
                skewX: this.getSkewX(),
                skewY: this.getSkewY()
            };
            return this.attrs.x = 0, this.attrs.y = 0, this.attrs.rotation = 0, this.attrs.scaleX = 1, this.attrs.scaleY = 1, this.attrs.offsetX = 0, this.attrs.offsetY = 0, this.attrs.skewX = 0, this.attrs.skewY = 0, this._clearCache(s), this._clearSelfAndChildrenCache(b), a
        },
        move: function () {
            var a = Kinetic.Util._getXY([].slice.call(arguments)),
                b = this.getX(),
                c = this.getY();
            return void 0 !== a.x && (b += a.x), void 0 !== a.y && (c += a.y), this.setPosition(b, c), this
        },
        _eachAncestorReverse: function (a, b) {
            var c, d, e = [],
                f = this.getParent();
            for (b && e.unshift(this); f;) e.unshift(f), f = f.parent;
            for (c = e.length, d = 0; c > d; d++) a(e[d])
        },
        rotate: function (a) {
            return this.setRotation(this.getRotation() + a), this
        },
        rotateDeg: function (a) {
            return this.setRotation(this.getRotation() + Kinetic.Util._degToRad(a)), this
        },
        moveToTop: function () {
            var a = this.index;
            return this.parent.children.splice(a, 1), this.parent.children.push(this), this.parent._setChildrenIndices(), !0
        },
        moveUp: function () {
            var a = this.index,
                b = this.parent.getChildren().length;
            return b - 1 > a ? (this.parent.children.splice(a, 1), this.parent.children.splice(a + 1, 0, this), this.parent._setChildrenIndices(), !0) : !1
        },
        moveDown: function () {
            var a = this.index;
            return a > 0 ? (this.parent.children.splice(a, 1), this.parent.children.splice(a - 1, 0, this), this.parent._setChildrenIndices(), !0) : !1
        },
        moveToBottom: function () {
            var a = this.index;
            return a > 0 ? (this.parent.children.splice(a, 1), this.parent.children.unshift(this), this.parent._setChildrenIndices(), !0) : !1
        },
        setZIndex: function (a) {
            var b = this.index;
            return this.parent.children.splice(b, 1), this.parent.children.splice(a, 0, this), this.parent._setChildrenIndices(), this
        },
        getAbsoluteOpacity: function () {
            return this._getCache(a, this._getAbsoluteOpacity)
        },
        _getAbsoluteOpacity: function () {
            var a = this.getOpacity();
            return this.getParent() && (a *= this.getParent().getAbsoluteOpacity()), a
        },
        moveTo: function (a) {
            return Kinetic.Node.prototype.remove.call(this), a.add(this), this
        },
        toObject: function () {
            var a, b, c = Kinetic.Util,
                d = {}, e = this.getAttrs();
            d.attrs = {};
            for (a in e) b = e[a], c._isFunction(b) || c._isElement(b) || c._isObject(b) && c._hasMethods(b) || (d.attrs[a] = b);
            return d.className = this.getClassName(), d
        },
        toJSON: function () {
            return JSON.stringify(this.toObject())
        },
        getParent: function () {
            return this.parent
        },
        getLayer: function () {
            return this.getParent().getLayer()
        },
        getStage: function () {
            return this._getCache(r, this._getStage)
        },
        _getStage: function () {
            var a = this.getParent();
            return a ? a.getStage() : void 0
        },
        fire: function (a, b, c) {
            return c ? this._fireAndBubble(a, b || {}) : this._fire(a, b || {}), this
        },
        getAbsoluteTransform: function () {
            return this._getCache(b, this._getAbsoluteTransform)
        },
        _getAbsoluteTransform: function () {
            var a, b = new Kinetic.Transform;
            return this._eachAncestorReverse(function (c) {
                a = c.getTransform(), b.multiply(a)
            }, !0), b
        },
        _getTransform: function () {
            var a = new Kinetic.Transform,
                b = this.getX(),
                c = this.getY(),
                d = this.getRotation(),
                e = this.getScaleX(),
                f = this.getScaleY(),
                g = this.getSkewX(),
                h = this.getSkewY(),
                i = this.getOffsetX(),
                j = this.getOffsetY();
            return (0 !== b || 0 !== c) && a.translate(b, c), 0 !== d && a.rotate(d), (0 !== g || 0 !== h) && a.skew(g, h), (1 !== e || 1 !== f) && a.scale(e, f), (0 !== i || 0 !== j) && a.translate(-1 * i, -1 * j), a
        },
        clone: function (a) {
            var b, c, d, e, f, g = this.getClassName(),
                h = new Kinetic[g](this.attrs);
            for (b in this.eventListeners)
                for (c = this.eventListeners[b], d = c.length, e = 0; d > e; e++) f = c[e], f.name.indexOf(j) < 0 && (h.eventListeners[b] || (h.eventListeners[b] = []), h.eventListeners[b].push(f));
            return h.setAttrs(a), h
        },
        toDataURL: function (a) {
            a = a || {};
            var b = a.mimeType || null,
                c = a.quality || null,
                d = this.getStage(),
                e = a.x || 0,
                f = a.y || 0,
                g = new Kinetic.SceneCanvas({
                    width: a.width || d.getWidth(),
                    height: a.height || d.getHeight(),
                    pixelRatio: 1
                }),
                h = g.getContext();
            return h.save(), (e || f) && h.translate(-1 * e, -1 * f), this.drawScene(g), h.restore(), g.toDataURL(b, c)
        },
        toImage: function (a) {
            Kinetic.Util._getImage(this.toDataURL(a), function (b) {
                a.callback(b)
            })
        },
        setSize: function () {
            var a = Kinetic.Util._getSize(Array.prototype.slice.call(arguments));
            return this.setWidth(a.width), this.setHeight(a.height), this
        },
        getSize: function () {
            return {
                width: this.getWidth(),
                height: this.getHeight()
            }
        },
        getWidth: function () {
            return this.attrs.width || 0
        },
        getHeight: function () {
            return this.attrs.height || 0
        },
        getClassName: function () {
            return this.className || this.nodeType
        },
        getType: function () {
            return this.nodeType
        },
        _get: function (a) {
            return this.nodeType === a ? [this] : []
        },
        _off: function (a, b) {
            var c, d, e = this.eventListeners[a];
            for (c = 0; c < e.length; c++)
                if (d = e[c].name, !("kinetic" === d && "kinetic" !== b || b && d !== b)) {
                    if (e.splice(c, 1), 0 === e.length) {
                        delete this.eventListeners[a];
                        break
                    }
                    c--
                }
        },
        _fireBeforeChangeEvent: function (a, b, e) {
            this._fire(c + Kinetic.Util._capitalize(a) + d, {
                oldVal: b,
                newVal: e
            })
        },
        _fireChangeEvent: function (a, b, c) {
            this._fire(a + d, {
                oldVal: b,
                newVal: c
            })
        },
        setId: function (a) {
            var b = this.getId(),
                c = Kinetic.Global;
            return c._removeId(b), c._addId(this, a), this._setAttr(i, a), this
        },
        setName: function (a) {
            var b = this.getName(),
                c = Kinetic.Global;
            return c._removeName(b, this._id), c._addName(this, a), this._setAttr(n, a), this
        },
        _setAttr: function (a, b) {
            var c;
            void 0 !== b && (c = this.attrs[a], this._fireBeforeChangeEvent(a, c, b), this.attrs[a] = b, this._fireChangeEvent(a, c, b))
        },
        _fireAndBubble: function (a, b, c) {
            var d = !0;
            b && this.nodeType === p && (b.targetNode = this), d && (this._fire(a, b), b && !b.cancelBubble && this.parent && (c && c.parent ? this._fireAndBubble.call(this.parent, a, b, c.parent) : this._fireAndBubble.call(this.parent, a, b)))
        },
        _fire: function (a, b) {
            var c, d, e = this.eventListeners[a];
            if (e)
                for (c = e.length, d = 0; c > d; d++) e[d].handler.call(this, b)
        },
        draw: function () {
            return this.drawScene(), this.drawHit(), this
        },
        shouldDrawHit: function () {
            return this.isListening() && this.isVisible() && !Kinetic.Global.isDragging()
        },
        isDraggable: function () {
            return !1
        },
        getTransform: function () {
            return this._getCache(s, this._getTransform)
        }
    }), Kinetic.Node.create = function (a, b) {
        return this._createNode(JSON.parse(a), b)
    }, Kinetic.Node._createNode = function (a, b) {
        var c, d, e, f = Kinetic.Node.prototype.getClassName.call(a),
            g = a.children;
        if (b && (a.attrs.container = b), c = new Kinetic[f](a.attrs), g)
            for (d = g.length, e = 0; d > e; e++) c.add(this._createNode(g[e]));
        return c
    }, Kinetic.Factory.addGetterSetter(Kinetic.Node, "x", 0), Kinetic.Factory.addGetterSetter(Kinetic.Node, "y", 0), Kinetic.Factory.addGetterSetter(Kinetic.Node, "opacity", 1), Kinetic.Factory.addGetter(Kinetic.Node, "name"), Kinetic.Factory.addGetter(Kinetic.Node, "id"), Kinetic.Factory.addRotationGetterSetter(Kinetic.Node, "rotation", 0), Kinetic.Factory.addPointGetterSetter(Kinetic.Node, "scale", 1), Kinetic.Factory.addPointGetterSetter(Kinetic.Node, "skew", 0), Kinetic.Factory.addPointGetterSetter(Kinetic.Node, "offset", 0), Kinetic.Factory.addSetter(Kinetic.Node, "width"), Kinetic.Factory.addSetter(Kinetic.Node, "height"), Kinetic.Factory.addGetterSetter(Kinetic.Node, "listening", !0), Kinetic.Factory.addGetterSetter(Kinetic.Node, "visible", !0), Kinetic.Collection.mapMethods(["on", "off", "remove", "destroy", "show", "hide", "move", "rotate", "moveToTop", "moveUp", "moveDown", "moveToBottom", "moveTo", "fire", "draw"])
}(); /*! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/
! function () {
    function a(a) {
        window.setTimeout(a, 1e3 / 60)
    }
    var b = 500;
    Kinetic.Animation = function (a, b) {
        this.func = a, this.setLayers(b), this.id = Kinetic.Animation.animIdCounter++, this.frame = {
            time: 0,
            timeDiff: 0,
            lastTime: (new Date).getTime()
        }
    }, Kinetic.Animation.prototype = {
        setLayers: function (a) {
            var b = [];
            b = a ? a.length > 0 ? a : [a] : [], this.layers = b
        },
        getLayers: function () {
            return this.layers
        },
        addLayer: function (a) {
            var b, c, d = this.layers;
            if (d) {
                for (b = d.length, c = 0; b > c; c++)
                    if (d[c]._id === a._id) return !1
            } else this.layers = [];
            return this.layers.push(a), !0
        },
        isRunning: function () {
            for (var a = Kinetic.Animation, b = a.animations, c = 0; c < b.length; c++)
                if (b[c].id === this.id) return !0;
            return !1
        },
        start: function () {
            this.stop(), this.frame.timeDiff = 0, this.frame.lastTime = (new Date).getTime(), Kinetic.Animation._addAnimation(this)
        },
        stop: function () {
            Kinetic.Animation._removeAnimation(this)
        },
        _updateFrameObject: function (a) {
            this.frame.timeDiff = a - this.frame.lastTime, this.frame.lastTime = a, this.frame.time += this.frame.timeDiff, this.frame.frameRate = 1e3 / this.frame.timeDiff
        }
    }, Kinetic.Animation.animations = [], Kinetic.Animation.animIdCounter = 0, Kinetic.Animation.animRunning = !1, Kinetic.Animation._addAnimation = function (a) {
        this.animations.push(a), this._handleAnimation()
    }, Kinetic.Animation._removeAnimation = function (a) {
        for (var b = a.id, c = this.animations, d = c.length, e = 0; d > e; e++)
            if (c[e].id === b) {
                this.animations.splice(e, 1);
                break
            }
    }, Kinetic.Animation._runFrames = function () {
        var a, b, c, d, e, f, g, h, i = {}, j = this.animations;
        for (d = 0; d < j.length; d++) {
            for (a = j[d], b = a.layers, c = a.func, a._updateFrameObject((new Date).getTime()), f = b.length, e = 0; f > e; e++) g = b[e], void 0 !== g._id && (i[g._id] = g);
            c && c.call(a, a.frame)
        }
        for (h in i) i[h].draw()
    }, Kinetic.Animation._animationLoop = function () {
        var a = this;
        this.animations.length > 0 ? (this._runFrames(), Kinetic.Animation.requestAnimFrame(function () {
            a._animationLoop()
        })) : this.animRunning = !1
    }, Kinetic.Animation._handleAnimation = function () {
        var a = this;
        this.animRunning || (this.animRunning = !0, a._animationLoop())
    }, RAF = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || a
    }(), Kinetic.Animation.requestAnimFrame = function (b) {
        var c = Kinetic.DD && Kinetic.DD.isDragging ? a : RAF;
        c(b)
    };
    var c = Kinetic.Node.prototype.moveTo;
    Kinetic.Node.prototype.moveTo = function (a) {
        c.call(this, a)
    }, Kinetic.Layer.prototype.batchDraw = function () {
        var a = this;
        this.batchAnim || (this.batchAnim = new Kinetic.Animation(function () {
            a.lastBatchDrawTime && (new Date).getTime() - a.lastBatchDrawTime > b && a.batchAnim.stop()
        }, this)), this.lastBatchDrawTime = (new Date).getTime(), this.batchAnim.isRunning() || (this.draw(), this.batchAnim.start())
    }, Kinetic.Stage.prototype.batchDraw = function () {
        this.getChildren().each(function (a) {
            a.batchDraw()
        })
    }
}(); /*! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/
! function () {
    var a = {
        node: 1,
        duration: 1,
        easing: 1,
        onFinish: 1,
        yoyo: 1
    }, b = 1,
        c = 2,
        d = 3,
        e = 0;
    Kinetic.Tween = function (b) {
        var c, d = this,
            g = b.node,
            h = g._id,
            i = b.duration || 1,
            j = b.easing || Kinetic.Easings.Linear,
            k = !! b.yoyo;
        this.node = g, this._id = e++, this.anim = new Kinetic.Animation(function () {
            d.tween.onEnterFrame()
        }, g.getLayer() || g.getLayers()), this.tween = new f(c, function (a) {
            d._tweenFunc(a)
        }, j, 0, 1, 1e3 * i, k), this._addListeners(), Kinetic.Tween.attrs[h] || (Kinetic.Tween.attrs[h] = {}), Kinetic.Tween.attrs[h][this._id] || (Kinetic.Tween.attrs[h][this._id] = {}), Kinetic.Tween.tweens[h] || (Kinetic.Tween.tweens[h] = {});
        for (c in b) void 0 === a[c] && this._addAttr(c, b[c]);
        this.reset(), this.onFinish = b.onFinish, this.onReset = b.onReset
    }, Kinetic.Tween.attrs = {}, Kinetic.Tween.tweens = {}, Kinetic.Tween.prototype = {
        _addAttr: function (a, b) {
            var c, d, e, f, g, h, i, j = this.node,
                k = j._id;
            if (e = Kinetic.Tween.tweens[k][a], e && delete Kinetic.Tween.attrs[k][e][a], c = j.getAttr(a), Kinetic.Util._isArray(b))
                for (b = Kinetic.Util._getPoints(b), d = [], g = b.length, f = 0; g > f; f++) h = c[f], i = b[f], d.push({
                    x: i.x - h.x,
                    y: i.y - h.y
                });
            else d = b - c;
            Kinetic.Tween.attrs[k][this._id][a] = {
                start: c,
                diff: d
            }, Kinetic.Tween.tweens[k][a] = this._id
        },
        _tweenFunc: function (a) {
            var b, c, d, e, f, g, h, i, j, k = this.node,
                l = Kinetic.Tween.attrs[k._id][this._id];
            for (b in l) {
                if (c = l[b], d = c.start, e = c.diff, Kinetic.Util._isArray(d))
                    for (f = [], h = d.length, g = 0; h > g; g++) i = d[g], j = e[g], f.push({
                        x: i.x + j.x * a,
                        y: i.y + j.y * a
                    });
                else f = d + e * a;
                k.setAttr(b, f)
            }
        },
        _addListeners: function () {
            var a = this;
            this.tween.onPlay = function () {
                a.anim.start()
            }, this.tween.onReverse = function () {
                a.anim.start()
            }, this.tween.onPause = function () {
                a.anim.stop()
            }, this.tween.onFinish = function () {
                a.onFinish && a.onFinish()
            }, this.tween.onReset = function () {
                a.onReset && a.onReset()
            }
        },
        play: function () {
            return this.tween.play(), this
        },
        reverse: function () {
            return this.tween.reverse(), this
        },
        reset: function () {
            var a = this.node;
            return this.tween.reset(), (a.getLayer() || a.getLayers()).draw(), this
        },
        seek: function (a) {
            var b = this.node;
            return this.tween.seek(1e3 * a), (b.getLayer() || b.getLayers()).draw(), this
        },
        pause: function () {
            return this.tween.pause(), this
        },
        finish: function () {
            var a = this.node;
            return this.tween.finish(), (a.getLayer() || a.getLayers()).draw(), this
        },
        destroy: function () {
            var a, b = this.node._id,
                c = this._id,
                d = Kinetic.Tween.tweens[b];
            this.pause();
            for (a in d) delete Kinetic.Tween.tweens[b][a];
            delete Kinetic.Tween.attrs[b][c]
        }
    };
    var f = function (a, b, c, d, e, f, g) {
        this.prop = a, this.propFunc = b, this.begin = d, this._pos = d, this.duration = f, this._change = 0, this.prevPos = 0, this.yoyo = g, this._time = 0, this._position = 0, this._startTime = 0, this._finish = 0, this.func = c, this._change = e - this.begin, this.pause()
    };
    f.prototype = {
        fire: function (a) {
            var b = this[a];
            b && b()
        },
        setTime: function (a) {
            a > this.duration ? this.yoyo ? (this._time = this.duration, this.reverse()) : this.finish() : 0 > a ? this.yoyo ? (this._time = 0, this.play()) : this.reset() : (this._time = a, this.update())
        },
        getTime: function () {
            return this._time
        },
        setPosition: function (a) {
            this.prevPos = this._pos, this.propFunc(a), this._pos = a
        },
        getPosition: function (a) {
            return void 0 === a && (a = this._time), this.func(a, this.begin, this._change, this.duration)
        },
        play: function () {
            this.state = c, this._startTime = this.getTimer() - this._time, this.onEnterFrame(), this.fire("onPlay")
        },
        reverse: function () {
            this.state = d, this._time = this.duration - this._time, this._startTime = this.getTimer() - this._time, this.onEnterFrame(), this.fire("onReverse")
        },
        seek: function (a) {
            this.pause(), this._time = a, this.update(), this.fire("onSeek")
        },
        reset: function () {
            this.pause(), this._time = 0, this.update(), this.fire("onReset")
        },
        finish: function () {
            this.pause(), this._time = this.duration, this.update(), this.fire("onFinish")
        },
        update: function () {
            this.setPosition(this.getPosition(this._time))
        },
        onEnterFrame: function () {
            var a = this.getTimer() - this._startTime;
            this.state === c ? this.setTime(a) : this.state === d && this.setTime(this.duration - a)
        },
        pause: function () {
            this.state = b, this.fire("onPause")
        },
        getTimer: function () {
            return (new Date).getTime()
        }
    }, Kinetic.Easings = {
        BackEaseIn: function (a, b, c, d) {
            var e = 1.70158;
            return c * (a /= d) * a * ((e + 1) * a - e) + b
        },
        BackEaseOut: function (a, b, c, d) {
            var e = 1.70158;
            return c * ((a = a / d - 1) * a * ((e + 1) * a + e) + 1) + b
        },
        BackEaseInOut: function (a, b, c, d) {
            var e = 1.70158;
            return (a /= d / 2) < 1 ? c / 2 * a * a * (((e *= 1.525) + 1) * a - e) + b : c / 2 * ((a -= 2) * a * (((e *= 1.525) + 1) * a + e) + 2) + b
        },
        ElasticEaseIn: function (a, b, c, d, e, f) {
            var g = 0;
            return 0 === a ? b : 1 == (a /= d) ? b + c : (f || (f = .3 * d), !e || e < Math.abs(c) ? (e = c, g = f / 4) : g = f / (2 * Math.PI) * Math.asin(c / e), -(e * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - g) * 2 * Math.PI / f)) + b)
        },
        ElasticEaseOut: function (a, b, c, d, e, f) {
            var g = 0;
            return 0 === a ? b : 1 == (a /= d) ? b + c : (f || (f = .3 * d), !e || e < Math.abs(c) ? (e = c, g = f / 4) : g = f / (2 * Math.PI) * Math.asin(c / e), e * Math.pow(2, -10 * a) * Math.sin((a * d - g) * 2 * Math.PI / f) + c + b)
        },
        ElasticEaseInOut: function (a, b, c, d, e, f) {
            var g = 0;
            return 0 === a ? b : 2 == (a /= d / 2) ? b + c : (f || (f = d * .3 * 1.5), !e || e < Math.abs(c) ? (e = c, g = f / 4) : g = f / (2 * Math.PI) * Math.asin(c / e), 1 > a ? -.5 * e * Math.pow(2, 10 * (a -= 1)) * Math.sin((a * d - g) * 2 * Math.PI / f) + b : .5 * e * Math.pow(2, -10 * (a -= 1)) * Math.sin((a * d - g) * 2 * Math.PI / f) + c + b)
        },
        BounceEaseOut: function (a, b, c, d) {
            return (a /= d) < 1 / 2.75 ? c * 7.5625 * a * a + b : 2 / 2.75 > a ? c * (7.5625 * (a -= 1.5 / 2.75) * a + .75) + b : 2.5 / 2.75 > a ? c * (7.5625 * (a -= 2.25 / 2.75) * a + .9375) + b : c * (7.5625 * (a -= 2.625 / 2.75) * a + .984375) + b
        },
        BounceEaseIn: function (a, b, c, d) {
            return c - Kinetic.Easings.BounceEaseOut(d - a, 0, c, d) + b
        },
        BounceEaseInOut: function (a, b, c, d) {
            return d / 2 > a ? .5 * Kinetic.Easings.BounceEaseIn(2 * a, 0, c, d) + b : .5 * Kinetic.Easings.BounceEaseOut(2 * a - d, 0, c, d) + .5 * c + b
        },
        EaseIn: function (a, b, c, d) {
            return c * (a /= d) * a + b
        },
        EaseOut: function (a, b, c, d) {
            return -c * (a /= d) * (a - 2) + b
        },
        EaseInOut: function (a, b, c, d) {
            return (a /= d / 2) < 1 ? c / 2 * a * a + b : -c / 2 * (--a * (a - 2) - 1) + b
        },
        StrongEaseIn: function (a, b, c, d) {
            return c * (a /= d) * a * a * a * a + b
        },
        StrongEaseOut: function (a, b, c, d) {
            return c * ((a = a / d - 1) * a * a * a * a + 1) + b
        },
        StrongEaseInOut: function (a, b, c, d) {
            return (a /= d / 2) < 1 ? c / 2 * a * a * a * a * a + b : c / 2 * ((a -= 2) * a * a * a * a + 2) + b
        },
        Linear: function (a, b, c, d) {
            return c * a / d + b
        }
    }
}(); /*! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/
! function () {
    Kinetic.Util.addMethods(Kinetic.Container, {
        __init: function (a) {
            this.children = new Kinetic.Collection, Kinetic.Node.call(this, a)
        },
        getChildren: function () {
            return this.children
        },
        hasChildren: function () {
            return this.getChildren().length > 0
        },
        removeChildren: function () {
            for (var a, b = this.children; b.length > 0;) a = b[0], a.hasChildren() && a.removeChildren(), a.remove();
            return this
        },
        destroyChildren: function () {
            for (var a = this.children; a.length > 0;) a[0].destroy();
            return this
        },
        add: function (a) {
            var b = (Kinetic.Global, this.children);
            return this._validateAdd(a), a.index = b.length, a.parent = this, b.push(a), this._fire("add", {
                child: a
            }), this
        },
        destroy: function () {
            this.hasChildren() && this.destroyChildren(), Kinetic.Node.prototype.destroy.call(this)
        },
        get: function (a) {
            var b, c, d, e, f, g, h, i = [],
                j = a.replace(/ /g, "").split(","),
                k = j.length;
            for (b = 0; k > b; b++)
                if (d = j[b], "#" === d.charAt(0)) f = this._getNodeById(d.slice(1)), f && i.push(f);
                else if ("." === d.charAt(0)) e = this._getNodesByName(d.slice(1)), i = i.concat(e);
            else
                for (g = this.getChildren(), h = g.length, c = 0; h > c; c++) i = i.concat(g[c]._get(d));
            return Kinetic.Collection.toCollection(i)
        },
        _getNodeById: function (a) {
            var b = Kinetic.Global,
                c = b.ids[a];
            return void 0 !== c && this.isAncestorOf(c) ? c : null
        },
        _getNodesByName: function (a) {
            var b = Kinetic.Global,
                c = b.names[a] || [];
            return this._getDescendants(c)
        },
        _get: function (a) {
            for (var b = Kinetic.Node.prototype._get.call(this, a), c = this.getChildren(), d = c.length, e = 0; d > e; e++) b = b.concat(c[e]._get(a));
            return b
        },
        toObject: function () {
            var a = Kinetic.Node.prototype.toObject.call(this);
            a.children = [];
            for (var b = this.getChildren(), c = b.length, d = 0; c > d; d++) {
                var e = b[d];
                a.children.push(e.toObject())
            }
            return a
        },
        _getDescendants: function (a) {
            for (var b = [], c = a.length, d = 0; c > d; d++) {
                var e = a[d];
                this.isAncestorOf(e) && b.push(e)
            }
            return b
        },
        isAncestorOf: function (a) {
            for (var b = a.getParent(); b;) {
                if (b._id === this._id) return !0;
                b = b.getParent()
            }
            return !1
        },
        clone: function (a) {
            var b = Kinetic.Node.prototype.clone.call(this, a);
            return this.getChildren().each(function (a) {
                b.add(a.clone())
            }), b
        },
        getAllIntersections: function () {
            for (var a = Kinetic.Util._getXY(Array.prototype.slice.call(arguments)), b = [], c = this.get("Shape"), d = c.length, e = 0; d > e; e++) {
                var f = c[e];
                f.isVisible() && f.intersects(a) && b.push(f)
            }
            return b
        },
        _setChildrenIndices: function () {
            for (var a = this.children, b = a.length, c = 0; b > c; c++) a[c].index = c
        },
        drawScene: function (a) {
            var b, c, d, e = this.getLayer(),
                f = this.getClipWidth() && this.getClipHeight();
            if (!a && e && (a = e.getCanvas()), this.isVisible()) {
                for (f && a._clip(this), b = this.children, d = b.length, c = 0; d > c; c++) b[c].drawScene(a);
                f && a.getContext().restore()
            }
            return this
        },
        drawHit: function () {
            var a, b = this.getClipWidth() && this.getClipHeight() && "Stage" !== this.nodeType,
                c = 0,
                d = 0,
                e = [];
            if (this.shouldDrawHit()) {
                for (b && (a = this.getLayer().hitCanvas, a._clip(this)), e = this.children, d = e.length, c = 0; d > c; c++) e[c].drawHit();
                b && a.getContext().restore()
            }
            return this
        }
    }), Kinetic.Util.extend(Kinetic.Container, Kinetic.Node), Kinetic.Factory.addBoxGetterSetter(Kinetic.Container, "clip")
}(); /*! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/
! function () {
    function a(a) {
        a.fill()
    }

    function b(a) {
        a.stroke()
    }

    function c(a) {
        a.fill()
    }

    function d(a) {
        a.stroke()
    }

    function e() {
        this._clearCache(f)
    }
    var f = "hasShadow";
    Kinetic.Util.addMethods(Kinetic.Shape, {
        __init: function (f) {
            this.nodeType = "Shape", this._fillFunc = a, this._strokeFunc = b, this._fillFuncHit = c, this._strokeFuncHit = d;
            for (var g, h = Kinetic.Global.shapes;;)
                if (g = Kinetic.Util.getRandomColor(), g && !(g in h)) break;
            this.colorKey = g, h[g] = this, Kinetic.Node.call(this, f), this._setDrawFuncs(), this.on("shadowColorChange.kinetic shadowBlurChange.kinetic shadowOffsetChange.kinetic shadowOpacityChange.kinetic", e)
        },
        hasChildren: function () {
            return !1
        },
        getChildren: function () {
            return []
        },
        getContext: function () {
            return this.getLayer().getContext()
        },
        getCanvas: function () {
            return this.getLayer().getCanvas()
        },
        hasShadow: function () {
            return this._getCache(f, this._hasShadow)
        },
        _hasShadow: function () {
            return 0 !== this.getShadowOpacity() && !! (this.getShadowColor() || this.getShadowBlur() || this.getShadowOffsetX() || this.getShadowOffsetY())
        },
        hasFill: function () {
            return !!(this.getFill() || this.getFillPatternImage() || this.getFillLinearGradientColorStops() || this.getFillRadialGradientColorStops())
        },
        _get: function (a) {
            return this.className === a || this.nodeType === a ? [this] : []
        },
        intersects: function () {
            var a = Kinetic.Util._getXY(Array.prototype.slice.call(arguments)),
                b = this.getStage(),
                c = b.hitCanvas;
            c.clear(), this.drawScene(c);
            var d = c.context.getImageData(0 | a.x, 0 | a.y, 1, 1).data;
            return d[3] > 0
        },
        enableFill: function () {
            return this._setAttr("fillEnabled", !0), this
        },
        disableFill: function () {
            return this._setAttr("fillEnabled", !1), this
        },
        enableStroke: function () {
            return this._setAttr("strokeEnabled", !0), this
        },
        disableStroke: function () {
            return this._setAttr("strokeEnabled", !1), this
        },
        enableStrokeScale: function () {
            return this._setAttr("strokeScaleEnabled", !0), this
        },
        disableStrokeScale: function () {
            return this._setAttr("strokeScaleEnabled", !1), this
        },
        enableShadow: function () {
            return this._setAttr("shadowEnabled", !0), this
        },
        disableShadow: function () {
            return this._setAttr("shadowEnabled", !1), this
        },
        enableDashArray: function () {
            return this._setAttr("dashArrayEnabled", !0), this
        },
        disableDashArray: function () {
            return this._setAttr("dashArrayEnabled", !1), this
        },
        destroy: function () {
            return Kinetic.Node.prototype.destroy.call(this), delete Kinetic.Global.shapes[this.colorKey], this
        },
        drawScene: function (a) {
            a = a || this.getLayer().getCanvas();
            var b = this.getDrawFunc(),
                c = a.getContext();
            return b && this.isVisible() && (c.save(), a._applyOpacity(this), a._applyLineJoin(this), a._applyAncestorTransforms(this), b.call(this, a), c.restore()), this
        },
        drawHit: function () {
            var a = this.getAttrs(),
                b = a.drawHitFunc || a.drawFunc,
                c = this.getLayer().hitCanvas,
                d = c.getContext();
            return b && this.shouldDrawHit() && (d.save(), c._applyLineJoin(this), c._applyAncestorTransforms(this), b.call(this, c), d.restore()), this
        },
        _setDrawFuncs: function () {
            !this.attrs.drawFunc && this.drawFunc && this.setDrawFunc(this.drawFunc), !this.attrs.drawHitFunc && this.drawHitFunc && this.setDrawHitFunc(this.drawHitFunc)
        }
    }), Kinetic.Util.extend(Kinetic.Shape, Kinetic.Node), Kinetic.Factory.addColorGetterSetter(Kinetic.Shape, "stroke"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "lineJoin"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "lineCap"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "strokeWidth"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "drawFunc"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "drawHitFunc"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "dashArray"), Kinetic.Factory.addColorGetterSetter(Kinetic.Shape, "shadowColor"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "shadowBlur"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "shadowOpacity"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "fillPatternImage"), Kinetic.Factory.addColorGetterSetter(Kinetic.Shape, "fill"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "fillPatternX"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "fillPatternY"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "fillLinearGradientColorStops"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "fillRadialGradientStartRadius"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "fillRadialGradientEndRadius"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "fillRadialGradientColorStops"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "fillPatternRepeat"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "fillEnabled", !0), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "strokeEnabled", !0), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "shadowEnabled", !0), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "dashArrayEnabled", !0), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "fillPriority", "color"), Kinetic.Factory.addGetterSetter(Kinetic.Shape, "strokeScaleEnabled", !0), Kinetic.Factory.addPointGetterSetter(Kinetic.Shape, "fillPatternOffset", 0), Kinetic.Factory.addPointGetterSetter(Kinetic.Shape, "fillPatternScale", 1), Kinetic.Factory.addPointGetterSetter(Kinetic.Shape, "fillLinearGradientStartPoint", 0), Kinetic.Factory.addPointGetterSetter(Kinetic.Shape, "fillLinearGradientEndPoint", 0), Kinetic.Factory.addPointGetterSetter(Kinetic.Shape, "fillRadialGradientStartPoint", 0), Kinetic.Factory.addPointGetterSetter(Kinetic.Shape, "fillRadialGradientEndPoint", 0), Kinetic.Factory.addPointGetterSetter(Kinetic.Shape, "shadowOffset", 0), Kinetic.Factory.addRotationGetterSetter(Kinetic.Shape, "fillPatternRotation", 0)
}(); /*! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/
! function () {
    function a(a, b) {
        a.content.addEventListener(b, function (c) {
            a[x + b](c)
        }, !1)
    }
    var b = "Stage",
        c = "string",
        d = "px",
        l = "click",
        m = "dblclick",
        n = "touchstart",
        o = "touchend",
        p = "tap",
        q = "dbltap",
        r = "touchmove",
        s = "div",
        t = "relative",
        u = "inline-block",
        v = "kineticjs-content",
        w = " ",
        x = "_",
        y = "container",
        z = "",
        A = [n, r, o],
        B = A.length;
    Kinetic.Util.addMethods(Kinetic.Stage, {
        ___init: function (a) {
            Kinetic.Container.call(this, a), this.nodeType = b, this._id = Kinetic.Global.idCounter++, this._buildDOM(), this._bindContentEvents(), Kinetic.Global.stages.push(this)
        },
        _validateAdd: function (a) {
            "Layer" !== a.getType() && Kinetic.Util.error("You may only add layers to the stage.")
        },
        setContainer: function (a) {
            return typeof a === c && (a = document.getElementById(a)), this._setAttr(y, a), this
        },
        draw: function () {
            return Kinetic.Node.prototype.draw.call(this), this
        },
        setHeight: function (a) {
            return Kinetic.Node.prototype.setHeight.call(this, a), this._resizeDOM(), this
        },
        setWidth: function (a) {
            return Kinetic.Node.prototype.setWidth.call(this, a), this._resizeDOM(), this
        },
        clear: function () {
            var a, b = this.children,
                c = b.length;
            for (a = 0; c > a; a++) b[a].clear();
            return this
        },
        destroy: function () {
            var a = this.content;
            Kinetic.Container.prototype.destroy.call(this), a && Kinetic.Util._isInDocument(a) && this.getContainer().removeChild(a)
        },
        getMousePosition: function () {
            return this.mousePos
        },
        getTouchPosition: function () {
            return this.touchPos
        },
        getPointerPosition: function () {
            return this.getTouchPosition() || this.getMousePosition()
        },
        getStage: function () {
            return this
        },
        getContent: function () {
            return this.content
        },
        toDataURL: function (a) {
            function b(e) {
                var f = i[e],
                    j = f.toDataURL(),
                    k = new Image;
                k.onload = function () {
                    h.drawImage(k, 0, 0), e < i.length - 1 ? b(e + 1) : a.callback(g.toDataURL(c, d))
                }, k.src = j
            }
            a = a || {};
            var c = a.mimeType || null,
                d = a.quality || null,
                e = a.x || 0,
                f = a.y || 0,
                g = new Kinetic.SceneCanvas({
                    width: a.width || this.getWidth(),
                    height: a.height || this.getHeight(),
                    pixelRatio: 1
                }),
                h = g.getContext(),
                i = this.children;
            (e || f) && h.translate(-1 * e, -1 * f), b(0)
        },
        toImage: function (a) {
            var b = a.callback;
            a.callback = function (a) {
                Kinetic.Util._getImage(a, function (a) {
                    b(a)
                })
            }, this.toDataURL(a)
        },
        getIntersection: function () {
            var a, b, c = Kinetic.Util._getXY(Array.prototype.slice.call(arguments)),
                d = this.getChildren(),
                e = d.length,
                f = e - 1;
            for (a = f; a >= 0; a--)
                if (b = d[a].getIntersection(c)) return b;
            return null
        },
        _resizeDOM: function () {
            if (this.content) {
                var a, b, c = this.getWidth(),
                    e = this.getHeight(),
                    f = this.getChildren(),
                    g = f.length;
                for (this.content.style.width = c + d, this.content.style.height = e + d, this.bufferCanvas.setSize(c, e, 1), this.hitCanvas.setSize(c, e), a = 0; g > a; a++) b = f[a], b.getCanvas().setSize(c, e), b.hitCanvas.setSize(c, e), b.draw()
            }
        },
        add: function (a) {
            return Kinetic.Container.prototype.add.call(this, a), a.canvas.setSize(this.attrs.width, this.attrs.height), a.hitCanvas.setSize(this.attrs.width, this.attrs.height), a.draw(), this.content.appendChild(a.canvas.element), this
        },
        getParent: function () {
            return null
        },
        getLayer: function () {
            return null
        },
        getLayers: function () {
            return this.getChildren()
        },
        _setPointerPosition: function (a) {
            a || (a = window.event), this._setMousePosition(a), this._setTouchPosition(a)
        },
        _bindContentEvents: function () {
            var b;
            for (b = 0; B > b; b++) a(this, A[b])
        },
        _touchstart: function (a) {
            this._setPointerPosition(a);
            var b = Kinetic.Global,
                c = this.getIntersection(this.getPointerPosition()),
                d = c && c.shape ? c.shape : this;
            b.listenClickTap = !0, this.tapStartShape = d, d._fireAndBubble(n, a), d.isListening() && a.preventDefault && a.preventDefault()
        },
        _touchend: function (a) {
            this._setPointerPosition(a);
            var b = Kinetic.Global,
                c = this.getIntersection(this.getPointerPosition()),
                d = c && c.shape ? c.shape : this;
            d._fireAndBubble(o, a), b.listenClickTap && d._id === this.tapStartShape._id && (d._fireAndBubble(p, a), b.inDblClickWindow ? (d._fireAndBubble(q, a), b.inDblClickWindow = !1) : b.inDblClickWindow = !0, setTimeout(function () {
                b.inDblClickWindow = !1
            }, b.dblClickWindow)), b.listenClickTap = !1, d.isListening() && a.preventDefault && a.preventDefault()
        },
        _touchmove: function (a) {
            this._setPointerPosition(a);
            var b = Kinetic.DD,
                c = this.getIntersection(this.getPointerPosition()),
                d = c && c.shape ? c.shape : this;
            d._fireAndBubble(r, a), b && b._drag(a), d.isListening() && a.preventDefault && a.preventDefault()
        },
        _setMousePosition: function (a) {
            var b = a.clientX - this._getContentPosition().left,
                c = a.clientY - this._getContentPosition().top;
            this.mousePos = {
                x: b,
                y: c
            }
        },
        _setTouchPosition: function (a) {
            var b, c, d;
            void 0 !== a.touches && 1 === a.touches.length && (b = a.touches[0], c = b.clientX - this._getContentPosition().left, d = b.clientY - this._getContentPosition().top, this.touchPos = {
                x: c,
                y: d
            })
        },
        _getContentPosition: function () {
            var a = this.content.getBoundingClientRect();
            return {
                top: a.top,
                left: a.left
            }
        },
        _buildDOM: function () {
            var a = this.getContainer();
            a.innerHTML = z, this.content = document.createElement(s), this.content.style.position = t, this.content.style.display = u, this.content.className = v, a.appendChild(this.content), this.bufferCanvas = new Kinetic.SceneCanvas, this.hitCanvas = new Kinetic.HitCanvas, this._resizeDOM()
        },
        _onContent: function (a, b) {
            var c, d, e = a.split(w),
                f = e.length;
            for (c = 0; f > c; c++) d = e[c], this.content.addEventListener(d, b, !1)
        }
    }), Kinetic.Util.extend(Kinetic.Stage, Kinetic.Container), Kinetic.Factory.addGetter(Kinetic.Stage, "container")
}(); /*! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/
! function () {
    var a = "#",
        b = "beforeDraw",
        c = "draw";
    Kinetic.Util.addMethods(Kinetic.Layer, {
        ___init: function (a) {
            this.nodeType = "Layer", this.canvas = new Kinetic.SceneCanvas, this.hitCanvas = new Kinetic.HitCanvas, Kinetic.Container.call(this, a)
        },
        _validateAdd: function (a) {
            var b = a.getType();
            "Group" !== b && "Shape" !== b && Kinetic.Util.error("You may only add groups and shapes to a layer.")
        },
        getIntersection: function () {
            var b, c, d, e = Kinetic.Util._getXY(Array.prototype.slice.call(arguments));
            if (this.isVisible() && this.isListening()) {
                if (b = this.hitCanvas.context.getImageData(0 | e.x, 0 | e.y, 1, 1).data, 255 === b[3]) return c = Kinetic.Util._rgbToHex(b[0], b[1], b[2]), d = Kinetic.Global.shapes[a + c], {
                    shape: d,
                    pixel: b
                };
                if (b[0] > 0 || b[1] > 0 || b[2] > 0 || b[3] > 0) return {
                    pixel: b
                }
            }
            return null
        },
        drawScene: function (a) {
            return a = a || this.getCanvas(), this._fire(b, {
                node: this
            }), this.getClearBeforeDraw() && a.clear(), Kinetic.Container.prototype.drawScene.call(this, a), this._fire(c, {
                node: this
            }), this
        },
        drawHit: function () {
            var a = this.getLayer();
            return a && a.getClearBeforeDraw() && a.getHitCanvas().clear(), Kinetic.Container.prototype.drawHit.call(this), this
        },
        getCanvas: function () {
            return this.canvas
        },
        getHitCanvas: function () {
            return this.hitCanvas
        },
        getContext: function () {
            return this.getCanvas().getContext()
        },
        clear: function (a) {
            return this.getCanvas().clear(a), this
        },
        setVisible: function (a) {
            return Kinetic.Node.prototype.setVisible.call(this, a), a ? (this.getCanvas().element.style.display = "block", this.hitCanvas.element.style.display = "block") : (this.getCanvas().element.style.display = "none", this.hitCanvas.element.style.display = "none"), this
        },
        setZIndex: function (a) {
            Kinetic.Node.prototype.setZIndex.call(this, a);
            var b = this.getStage();
            return b && (b.content.removeChild(this.getCanvas().element), a < b.getChildren().length - 1 ? b.content.insertBefore(this.getCanvas().element, b.getChildren()[a + 1].getCanvas().element) : b.content.appendChild(this.getCanvas().element)), this
        },
        moveToTop: function () {
            Kinetic.Node.prototype.moveToTop.call(this);
            var a = this.getStage();
            a && (a.content.removeChild(this.getCanvas().element), a.content.appendChild(this.getCanvas().element))
        },
        moveUp: function () {
            if (Kinetic.Node.prototype.moveUp.call(this)) {
                var a = this.getStage();
                a && (a.content.removeChild(this.getCanvas().element), this.index < a.getChildren().length - 1 ? a.content.insertBefore(this.getCanvas().element, a.getChildren()[this.index + 1].getCanvas().element) : a.content.appendChild(this.getCanvas().element))
            }
        },
        moveDown: function () {
            if (Kinetic.Node.prototype.moveDown.call(this)) {
                var a = this.getStage();
                if (a) {
                    var b = a.getChildren();
                    a.content.removeChild(this.getCanvas().element), a.content.insertBefore(this.getCanvas().element, b[this.index + 1].getCanvas().element)
                }
            }
        },
        moveToBottom: function () {
            if (Kinetic.Node.prototype.moveToBottom.call(this)) {
                var a = this.getStage();
                if (a) {
                    var b = a.getChildren();
                    a.content.removeChild(this.getCanvas().element), a.content.insertBefore(this.getCanvas().element, b[1].getCanvas().element)
                }
            }
        },
        getLayer: function () {
            return this
        },
        remove: function () {
            var a = this.getStage(),
                b = this.getCanvas(),
                c = b.element;
            return Kinetic.Node.prototype.remove.call(this), a && b && Kinetic.Util._isInDocument(c) && a.content.removeChild(c), this
        },
        getStage: function () {
            return this.parent
        }
    }), Kinetic.Util.extend(Kinetic.Layer, Kinetic.Container), Kinetic.Factory.addGetterSetter(Kinetic.Layer, "clearBeforeDraw", !0)
}(); /*! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/
! function () {
    Kinetic.Util.addMethods(Kinetic.Group, {
        ___init: function (a) {
            this.nodeType = "Group", Kinetic.Container.call(this, a)
        },
        _validateAdd: function (a) {
            var b = a.getType();
            "Group" !== b && "Shape" !== b && Kinetic.Util.error("You may only add groups and shapes to groups.")
        }
    }), Kinetic.Util.extend(Kinetic.Group, Kinetic.Container)
}(); /*! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/
! function () {
    Kinetic.Rect = function (a) {
        this.___init(a)
    }, Kinetic.Rect.prototype = {
        ___init: function (a) {
            Kinetic.Shape.call(this, a), this.className = "Rect"
        },
        drawFunc: function (a) {
            var b = a.getContext(),
                c = this.getCornerRadius(),
                d = this.getWidth(),
                e = this.getHeight();
            b.beginPath(), c ? (b.moveTo(c, 0), b.lineTo(d - c, 0), b.arc(d - c, c, c, 3 * Math.PI / 2, 0, !1), b.lineTo(d, e - c), b.arc(d - c, e - c, c, 0, Math.PI / 2, !1), b.lineTo(c, e), b.arc(c, e - c, c, Math.PI / 2, Math.PI, !1), b.lineTo(0, c), b.arc(c, c, c, Math.PI, 3 * Math.PI / 2, !1)) : b.rect(0, 0, d, e), b.closePath(), a.fillStroke(this)
        }
    }, Kinetic.Util.extend(Kinetic.Rect, Kinetic.Shape), Kinetic.Factory.addGetterSetter(Kinetic.Rect, "cornerRadius", 0)
}(); /*! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/
! function () {
    Kinetic.Wedge = function (a) {
        this.___init(a)
    }, Kinetic.Wedge.prototype = {
        ___init: function (a) {
            Kinetic.Shape.call(this, a), this.className = "Wedge"
        },
        drawFunc: function (a) {
            var b = a.getContext();
            b.beginPath(), b.arc(0, 0, this.getRadius(), 0, this.getAngle(), this.getClockwise()), b.lineTo(0, 0), b.closePath(), a.fillStroke(this)
        }
    }, Kinetic.Util.extend(Kinetic.Wedge, Kinetic.Shape), Kinetic.Factory.addGetterSetter(Kinetic.Wedge, "radius", 0), Kinetic.Factory.addRotationGetterSetter(Kinetic.Wedge, "angle", 0), Kinetic.Factory.addGetterSetter(Kinetic.Wedge, "clockwise", !1)
}(); /*! KineticJS v4.6.0 2013-08-12 http://www.kineticjs.com by Eric Rowell @ericdrowell - MIT License https://github.com/ericdrowell/KineticJS/wiki/License*/
! function () {
    var a = "Image",
        b = "set";
    Kinetic.Image = function (a) {
        this.___init(a)
    }, Kinetic.Image.prototype = {
        ___init: function (b) {
            Kinetic.Shape.call(this, b), this.className = a
        },
        drawFunc: function (a) {
            var b, c, d = this.getWidth(),
                e = this.getHeight(),
                f = this,
                g = a.getContext(),
                h = this.getCropX() || 0,
                i = this.getCropY() || 0,
                j = this.getCropWidth(),
                k = this.getCropHeight();
            this.getFilter() && this._applyFilter && (this.applyFilter(), this._applyFilter = !1), c = this.filterCanvas ? this.filterCanvas.getElement() : this.getImage(), g.beginPath(), g.rect(0, 0, d, e), g.closePath(), a.fillStroke(this), c && (b = j && k ? [c, h, i, j, k, 0, 0, d, e] : [c, 0, 0, d, e], this.hasShadow() ? a.applyShadow(this, function () {
                f._drawImage(g, b)
            }) : this._drawImage(g, b))
        },
        drawHitFunc: function (a) {
            var b = this.getWidth(),
                c = this.getHeight(),
                d = this.imageHitRegion,
                e = a.getContext();
            d ? (e.drawImage(d, 0, 0, b, c), e.beginPath(), e.rect(0, 0, b, c), e.closePath(), a.stroke(this)) : (e.beginPath(), e.rect(0, 0, b, c), e.closePath(), a.fillStroke(this))
        },
        applyFilter: function () {
            var a, b, c, d = this.getImage(),
                e = this.getWidth(),
                f = this.getHeight(),
                g = this.getFilter();
            a = this.filterCanvas ? this.filterCanvas : this.filterCanvas = new Kinetic.SceneCanvas({
                width: e,
                height: f
            }), b = a.getContext();
            try {
                this._drawImage(b, [d, 0, 0, e, f]), c = b.getImageData(0, 0, a.getWidth(), a.getHeight()), g.call(this, c), b.putImageData(c, 0, 0)
            } catch (h) {
                this.clearFilter(), Kinetic.Util.warn("Unable to apply filter. " + h.message)
            }
        },
        clearFilter: function () {
            this.filterCanvas = null, this._applyFilter = !1
        },
        createImageHitRegion: function (a) {
            var b, c, d, e, f, g = this,
                h = this.getWidth(),
                i = this.getHeight(),
                j = new Kinetic.Canvas({
                    width: h,
                    height: i
                }),
                k = j.getContext(),
                l = this.getImage();
            k.drawImage(l, 0, 0);
            try {
                for (b = k.getImageData(0, 0, h, i), c = b.data, d = Kinetic.Util._hexToRgb(this.colorKey), e = 0, f = c.length; f > e; e += 4) c[e + 3] > 0 && (c[e] = d.r, c[e + 1] = d.g, c[e + 2] = d.b);
                Kinetic.Util._getImage(b, function (b) {
                    g.imageHitRegion = b, a && a()
                })
            } catch (m) {
                Kinetic.Util.warn("Unable to create image hit region. " + m.message)
            }
        },
        clearImageHitRegion: function () {
            delete this.imageHitRegion
        },
        getWidth: function () {
            var a = this.getImage();
            return this.attrs.width || (a ? a.width : 0)
        },
        getHeight: function () {
            var a = this.getImage();
            return this.attrs.height || (a ? a.height : 0)
        },
        _drawImage: function (a, b) {
            5 === b.length ? a.drawImage(b[0], b[1], b[2], b[3], b[4]) : 9 === b.length && a.drawImage(b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7], b[8])
        }
    }, Kinetic.Util.extend(Kinetic.Image, Kinetic.Shape), Kinetic.Factory.addFilterGetterSetter = function (a, b, c) {
        this.addGetter(a, b, c), this.addFilterSetter(a, b)
    }, Kinetic.Factory.addFilterSetter = function (a, c) {
        var d = b + Kinetic.Util._capitalize(c);
        a.prototype[d] = function (a) {
            this._setAttr(c, a), this._applyFilter = !0
        }
    }, Kinetic.Factory.addGetterSetter(Kinetic.Image, "image"), Kinetic.Factory.addBoxGetterSetter(Kinetic.Image, "crop"), Kinetic.Factory.addFilterGetterSetter(Kinetic.Image, "filter")
}();