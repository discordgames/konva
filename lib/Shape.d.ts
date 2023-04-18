import { Node, NodeConfig } from './Node.js';
import { Context } from './Context.js';
import { GetSet, Vector2d } from './types.js';
import { HitCanvas, SceneCanvas } from './Canvas.js';
export type ShapeConfigHandler<TTarget> = {
    bivarianceHack(ctx: Context, shape: TTarget): void;
}['bivarianceHack'];
export type LineJoin = 'round' | 'bevel' | 'miter';
export type LineCap = 'butt' | 'round' | 'square';
export interface ShapeConfig extends NodeConfig {
    fill?: string;
    fillPatternImage?: HTMLImageElement;
    fillPatternX?: number;
    fillPatternY?: number;
    fillPatternOffset?: Vector2d;
    fillPatternOffsetX?: number;
    fillPatternOffsetY?: number;
    fillPatternScale?: Vector2d;
    fillPatternScaleX?: number;
    fillPatternScaleY?: number;
    fillPatternRotation?: number;
    fillPatternRepeat?: string;
    fillLinearGradientStartPoint?: Vector2d;
    fillLinearGradientStartPointX?: number;
    fillLinearGradientStartPointY?: number;
    fillLinearGradientEndPoint?: Vector2d;
    fillLinearGradientEndPointX?: number;
    fillLinearGradientEndPointY?: number;
    fillLinearGradientColorStops?: Array<number | string>;
    fillRadialGradientStartPoint?: Vector2d;
    fillRadialGradientStartPointX?: number;
    fillRadialGradientStartPointY?: number;
    fillRadialGradientEndPoint?: Vector2d;
    fillRadialGradientEndPointX?: number;
    fillRadialGradientEndPointY?: number;
    fillRadialGradientStartRadius?: number;
    fillRadialGradientEndRadius?: number;
    fillRadialGradientColorStops?: Array<number | string>;
    fillEnabled?: boolean;
    fillPriority?: string;
    stroke?: string | CanvasGradient;
    strokeWidth?: number;
    fillAfterStrokeEnabled?: boolean;
    hitStrokeWidth?: number | string;
    strokeScaleEnabled?: boolean;
    strokeHitEnabled?: boolean;
    strokeEnabled?: boolean;
    lineJoin?: LineJoin;
    lineCap?: LineCap;
    sceneFunc?: (con: Context, shape: Shape) => void;
    hitFunc?: (con: Context, shape: Shape) => void;
    shadowColor?: string;
    shadowBlur?: number;
    shadowOffset?: Vector2d;
    shadowOffsetX?: number;
    shadowOffsetY?: number;
    shadowOpacity?: number;
    shadowEnabled?: boolean;
    shadowForStrokeEnabled?: boolean;
    dash?: number[];
    dashOffset?: number;
    dashEnabled?: boolean;
    perfectDrawEnabled?: boolean;
}
export interface ShapeGetClientRectConfig {
    skipTransform?: boolean;
    skipShadow?: boolean;
    skipStroke?: boolean;
    relativeTo?: Node;
}
export declare const shapes: {
    [key: string]: Shape;
};
export declare class Shape<Config extends ShapeConfig = ShapeConfig> extends Node<Config> {
    _centroid: boolean;
    colorKey: string;
    _fillFunc: (ctx: Context) => void;
    _strokeFunc: (ctx: Context) => void;
    _fillFuncHit: (ctx: Context) => void;
    _strokeFuncHit: (ctx: Context) => void;
    constructor(config?: Config);
    getContext(): Context;
    getCanvas(): SceneCanvas;
    getSceneFunc(): any;
    getHitFunc(): any;
    hasShadow(): any;
    _hasShadow(): boolean;
    _getFillPattern(): any;
    __getFillPattern(): CanvasPattern;
    _getLinearGradient(): any;
    __getLinearGradient(): CanvasGradient;
    _getRadialGradient(): any;
    __getRadialGradient(): CanvasGradient;
    getShadowRGBA(): any;
    _getShadowRGBA(): string;
    hasFill(): any;
    hasStroke(): any;
    hasHitStroke(): any;
    intersects(point: any): boolean;
    destroy(): this;
    _useBufferCanvas(forceFill?: boolean): boolean;
    setStrokeHitEnabled(val: number): void;
    getStrokeHitEnabled(): boolean;
    getSelfRect(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    getClientRect(config?: ShapeGetClientRectConfig): {
        width: number;
        height: number;
        x: number;
        y: number;
    };
    drawScene(can?: SceneCanvas, top?: Node): this;
    drawHit(can?: HitCanvas, top?: Node, skipDragCheck?: boolean): this;
    drawHitFromCache(alphaThreshold?: number): this;
    hasPointerCapture(pointerId: number): boolean;
    setPointerCapture(pointerId: number): void;
    releaseCapture(pointerId: number): void;
    draggable: GetSet<boolean, this>;
    embossBlend: GetSet<boolean, this>;
    dash: GetSet<number[], this>;
    dashEnabled: GetSet<boolean, this>;
    dashOffset: GetSet<number, this>;
    fill: GetSet<string, this>;
    fillEnabled: GetSet<boolean, this>;
    fillLinearGradientColorStops: GetSet<Array<number | string>, this>;
    fillLinearGradientStartPoint: GetSet<Vector2d, this>;
    fillLinearGradientStartPointX: GetSet<number, this>;
    fillLinearGradientStartPointY: GetSet<number, this>;
    fillLinearGradientEndPoint: GetSet<Vector2d, this>;
    fillLinearGradientEndPointX: GetSet<number, this>;
    fillLinearGradientEndPointY: GetSet<number, this>;
    fillLinearRadialStartPoint: GetSet<Vector2d, this>;
    fillLinearRadialStartPointX: GetSet<number, this>;
    fillLinearRadialStartPointY: GetSet<number, this>;
    fillLinearRadialEndPoint: GetSet<Vector2d, this>;
    fillLinearRadialEndPointX: GetSet<number, this>;
    fillLinearRadialEndPointY: GetSet<number, this>;
    fillPatternImage: GetSet<HTMLImageElement | HTMLCanvasElement, this>;
    fillRadialGradientStartRadius: GetSet<number, this>;
    fillRadialGradientEndRadius: GetSet<number, this>;
    fillRadialGradientColorStops: GetSet<Array<number | string>, this>;
    fillRadialGradientStartPoint: GetSet<Vector2d, this>;
    fillRadialGradientStartPointX: GetSet<number, this>;
    fillRadialGradientStartPointY: GetSet<number, this>;
    fillRadialGradientEndPoint: GetSet<Vector2d, this>;
    fillRadialGradientEndPointX: GetSet<number, this>;
    fillRadialGradientEndPointY: GetSet<number, this>;
    fillPatternOffset: GetSet<Vector2d, this>;
    fillPatternOffsetX: GetSet<number, this>;
    fillPatternOffsetY: GetSet<number, this>;
    fillPatternRepeat: GetSet<string, this>;
    fillPatternRotation: GetSet<number, this>;
    fillPatternScale: GetSet<Vector2d, this>;
    fillPatternScaleX: GetSet<number, this>;
    fillPatternScaleY: GetSet<number, this>;
    fillPatternX: GetSet<number, this>;
    fillPatternY: GetSet<number, this>;
    fillPriority: GetSet<string, this>;
    hitFunc: GetSet<ShapeConfigHandler<this>, this>;
    lineCap: GetSet<LineCap, this>;
    lineJoin: GetSet<LineJoin, this>;
    perfectDrawEnabled: GetSet<boolean, this>;
    sceneFunc: GetSet<ShapeConfigHandler<this>, this>;
    shadowColor: GetSet<string, this>;
    shadowEnabled: GetSet<boolean, this>;
    shadowForStrokeEnabled: GetSet<boolean, this>;
    shadowOffset: GetSet<Vector2d, this>;
    shadowOffsetX: GetSet<number, this>;
    shadowOffsetY: GetSet<number, this>;
    shadowOpacity: GetSet<number, this>;
    shadowBlur: GetSet<number, this>;
    stroke: GetSet<string, this>;
    strokeEnabled: GetSet<boolean, this>;
    fillAfterStrokeEnabled: GetSet<boolean, this>;
    strokeScaleEnabled: GetSet<boolean, this>;
    strokeHitEnabled: GetSet<boolean, this>;
    strokeWidth: GetSet<number, this>;
    hitStrokeWidth: GetSet<number | 'auto', this>;
    strokeLinearGradientStartPoint: GetSet<Vector2d, this>;
    strokeLinearGradientEndPoint: GetSet<Vector2d, this>;
    strokeLinearGradientColorStops: GetSet<Array<number | string>, this>;
}
