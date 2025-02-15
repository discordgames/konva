"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layer = void 0;
const Util_1 = require("./Util");
const Container_1 = require("./Container");
const Node_1 = require("./Node");
const Factory_1 = require("./Factory");
const Canvas_1 = require("./Canvas");
const Validators_1 = require("./Validators");
const Shape_1 = require("./Shape");
const Global_1 = require("./Global");
var HASH = '#', BEFORE_DRAW = 'beforeDraw', DRAW = 'draw', INTERSECTION_OFFSETS = [
    { x: 0, y: 0 },
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: 1, y: 1 },
    { x: -1, y: 1 },
], INTERSECTION_OFFSETS_LEN = INTERSECTION_OFFSETS.length;
class Layer extends Container_1.Container {
    constructor(config) {
        super(config);
        this.canvas = new Canvas_1.SceneCanvas();
        this.hitCanvas = new Canvas_1.HitCanvas({
            pixelRatio: 1,
        });
        this._waitingForDraw = false;
        this._executeBatchDraw = undefined;
        this.on('visibleChange.konva', this._checkVisibility);
        this._checkVisibility();
        this.on('imageSmoothingEnabledChange.konva', this._setSmoothEnabled);
        this._setSmoothEnabled();
        const refresh = this.refresh.bind(this);
        this.on('add', refresh);
        this.on('destroy', refresh);
        this._executeBatchDraw =
            (() => {
                this.draw();
                this._waitingForDraw = false;
            }).bind(this);
    }
    createPNGStream() {
        const c = this.canvas._canvas;
        return c.createPNGStream();
    }
    getCanvas() {
        return this.canvas;
    }
    getNativeCanvasElement() {
        return this.canvas._canvas;
    }
    getHitCanvas() {
        return this.hitCanvas;
    }
    getContext() {
        return this.getCanvas().getContext();
    }
    clear(bounds) {
        this.getContext().clear(bounds);
        this.getHitCanvas().getContext().clear(bounds);
        return this;
    }
    setZIndex(index) {
        super.setZIndex(index);
        var stage = this.getStage();
        if (stage && stage.content) {
            stage.content.removeChild(this.getNativeCanvasElement());
            if (index < stage.children.length - 1) {
                stage.content.insertBefore(this.getNativeCanvasElement(), stage.children[index + 1].getCanvas()._canvas);
            }
            else {
                stage.content.appendChild(this.getNativeCanvasElement());
            }
        }
        return this;
    }
    moveToTop() {
        Node_1.Node.prototype.moveToTop.call(this);
        var stage = this.getStage();
        if (stage && stage.content) {
            stage.content.removeChild(this.getNativeCanvasElement());
            stage.content.appendChild(this.getNativeCanvasElement());
        }
        return true;
    }
    moveUp() {
        var moved = Node_1.Node.prototype.moveUp.call(this);
        if (!moved) {
            return false;
        }
        var stage = this.getStage();
        if (!stage || !stage.content) {
            return false;
        }
        stage.content.removeChild(this.getNativeCanvasElement());
        if (this.index < stage.children.length - 1) {
            stage.content.insertBefore(this.getNativeCanvasElement(), stage.children[this.index + 1].getCanvas()._canvas);
        }
        else {
            stage.content.appendChild(this.getNativeCanvasElement());
        }
        return true;
    }
    moveDown() {
        if (Node_1.Node.prototype.moveDown.call(this)) {
            var stage = this.getStage();
            if (stage) {
                var children = stage.children;
                if (stage.content) {
                    stage.content.removeChild(this.getNativeCanvasElement());
                    stage.content.insertBefore(this.getNativeCanvasElement(), children[this.index + 1].getCanvas()._canvas);
                }
            }
            return true;
        }
        return false;
    }
    moveToBottom() {
        if (Node_1.Node.prototype.moveToBottom.call(this)) {
            var stage = this.getStage();
            if (stage) {
                var children = stage.children;
                if (stage.content) {
                    stage.content.removeChild(this.getNativeCanvasElement());
                    stage.content.insertBefore(this.getNativeCanvasElement(), children[1].getCanvas()._canvas);
                }
            }
            return true;
        }
        return false;
    }
    getLayer() {
        return this;
    }
    remove() {
        var _canvas = this.getNativeCanvasElement();
        Node_1.Node.prototype.remove.call(this);
        if (_canvas && _canvas.parentNode && Util_1.Util._isInDocument(_canvas)) {
            _canvas.parentNode.removeChild(_canvas);
        }
        return this;
    }
    getStage() {
        return this.parent;
    }
    setSize({ width, height }) {
        this.canvas.setSize(width, height);
        this.hitCanvas.setSize(width, height);
        this._setSmoothEnabled();
        return this;
    }
    _validateAdd(child) {
        var type = child.getType();
        if (type !== 'Group' && type !== 'Shape') {
            Util_1.Util.throw('You may only add groups and shapes to a layer.');
        }
    }
    _toKonvaCanvas(config) {
        config = config || {};
        config.width = config.width || this.getWidth();
        config.height = config.height || this.getHeight();
        config.x = config.x !== undefined ? config.x : this.x();
        config.y = config.y !== undefined ? config.y : this.y();
        return Node_1.Node.prototype._toKonvaCanvas.call(this, config);
    }
    _checkVisibility() {
        const visible = this.visible();
        if (visible) {
            this.canvas._canvas.style.display = 'block';
        }
        else {
            this.canvas._canvas.style.display = 'none';
        }
    }
    _setSmoothEnabled() {
        this.getContext()._context.imageSmoothingEnabled =
            this.imageSmoothingEnabled();
    }
    getWidth() {
        if (this.parent) {
            return this.parent.width();
        }
    }
    setWidth() {
        Util_1.Util.warn('Can not change width of layer. Use "stage.width(value)" function instead.');
    }
    getHeight() {
        if (this.parent) {
            return this.parent.height();
        }
    }
    setHeight() {
        Util_1.Util.warn('Can not change height of layer. Use "stage.height(value)" function instead.');
    }
    batchDraw() {
        if (!this._waitingForDraw && this._executeBatchDraw) {
            this._waitingForDraw = true;
            Util_1.Util.requestAnimFrame(this._executeBatchDraw);
        }
        return this;
    }
    getIntersection(pos) {
        var _a;
        if (!this.isListening() || !this.isVisible()) {
            return null;
        }
        if (Global_1.Konva.hitTestEnableBoxTest) {
            const obj = this._getIntersection(pos, true);
            return (_a = obj === null || obj === void 0 ? void 0 : obj.shape) !== null && _a !== void 0 ? _a : null;
        }
        var spiralSearchDistance = 1;
        var continueSearch = false;
        while (true) {
            for (let i = 0; i < INTERSECTION_OFFSETS_LEN; i++) {
                const intersectionOffset = INTERSECTION_OFFSETS[i];
                const obj = this._getIntersection({
                    x: pos.x + intersectionOffset.x * spiralSearchDistance,
                    y: pos.y + intersectionOffset.y * spiralSearchDistance,
                });
                const shape = obj.shape;
                if (shape) {
                    return shape;
                }
                continueSearch = !!obj.antialiased;
                if (!obj.antialiased) {
                    break;
                }
            }
            if (continueSearch) {
                spiralSearchDistance += 1;
            }
            else {
                return null;
            }
        }
    }
    _getIntersection(pos, boxFilter = false) {
        if (!boxFilter) {
            const ratio = this.hitCanvas.pixelRatio;
            const p = this.hitCanvas.context.getImageData(Math.round(pos.x * ratio), Math.round(pos.y * ratio), 1, 1).data;
            if (p[3] === 255) {
                const colorKey = Util_1.Util._rgbToHex(p[0], p[1], p[2]);
                const shape = Shape_1.shapes[HASH + colorKey];
                if (shape) {
                    return {
                        shape: shape,
                    };
                }
            }
        }
        else {
            const ratio = this.hitCanvas.pixelRatio;
            const sampledBox = this.hitCanvas.context.getImageData(Math.round(pos.x * ratio) - 1, Math.round(pos.y * ratio) - 1, 3, 3).data;
            for (const sample of [4, 0, 2, 6, 8]) {
                const p = new Uint8ClampedArray(sampledBox.buffer, sample * 4, 4);
                if (p[3] === 255) {
                    const colorKey = Util_1.Util._rgbToHex(p[0], p[1], p[2]);
                    const shape = Shape_1.shapes[HASH + colorKey];
                    if (shape) {
                        return {
                            shape: shape,
                        };
                    }
                }
            }
        }
        return {};
    }
    drawScene(can, top) {
        var layer = this.getLayer(), canvas = can || (layer && layer.getCanvas());
        this._fire(BEFORE_DRAW, {
            node: this,
        });
        if (this.clearBeforeDraw()) {
            canvas.getContext().clear();
        }
        Container_1.Container.prototype.drawScene.call(this, canvas, top);
        this._fire(DRAW, {
            node: this,
        });
        return this;
    }
    drawHit(can, top) {
        var layer = this.getLayer(), canvas = can || (layer && layer.hitCanvas);
        if (layer && layer.clearBeforeDraw()) {
            layer.getHitCanvas().getContext().clear();
        }
        Container_1.Container.prototype.drawHit.call(this, canvas, top);
        return this;
    }
    enableHitGraph() {
        this.hitGraphEnabled(true);
        return this;
    }
    disableHitGraph() {
        this.hitGraphEnabled(false);
        return this;
    }
    setHitGraphEnabled(val) {
        Util_1.Util.warn('hitGraphEnabled method is deprecated. Please use layer.listening() instead.');
        this.listening(val);
    }
    getHitGraphEnabled(val) {
        Util_1.Util.warn('hitGraphEnabled method is deprecated. Please use layer.listening() instead.');
        return this.listening();
    }
    toggleHitCanvas() {
        if (!this.parent || !this.parent['content']) {
            return;
        }
        var parent = this.parent;
        var added = !!this.hitCanvas._canvas.parentNode;
        if (added) {
            parent.content.removeChild(this.hitCanvas._canvas);
        }
        else {
            parent.content.appendChild(this.hitCanvas._canvas);
        }
    }
    destroy() {
        Util_1.Util.releaseCanvas(this.getNativeCanvasElement(), this.getHitCanvas()._canvas);
        return super.destroy();
    }
}
exports.Layer = Layer;
Layer.prototype.nodeType = 'Layer';
(0, Global_1._registerNode)(Layer);
Factory_1.Factory.addGetterSetter(Layer, 'imageSmoothingEnabled', true);
Factory_1.Factory.addGetterSetter(Layer, 'clearBeforeDraw', true);
Factory_1.Factory.addGetterSetter(Layer, 'hitGraphEnabled', true, (0, Validators_1.getBooleanValidator)());
