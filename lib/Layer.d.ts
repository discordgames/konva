import { Container, ContainerConfig } from './Container.js';
import { Node } from './Node.js';
import { SceneCanvas, HitCanvas } from './Canvas.js';
import { Stage } from './Stage.js';
import { GetSet, Vector2d } from './types.js';
import { Group } from './Group.js';
import { Shape } from './Shape.js';
export interface LayerConfig extends ContainerConfig {
    clearBeforeDraw?: boolean;
    hitGraphEnabled?: boolean;
    imageSmoothingEnabled?: boolean;
}
export declare class Layer extends Container<Group | Shape> {
    canvas: SceneCanvas;
    hitCanvas: HitCanvas;
    _waitingForDraw: boolean;
    _executeBatchDraw: () => void;
    constructor(config?: LayerConfig);
    createPNGStream(): any;
    getCanvas(): SceneCanvas;
    getNativeCanvasElement(): HTMLCanvasElement;
    getHitCanvas(): HitCanvas;
    getContext(): import("./Context.js").Context;
    clear(bounds?: any): this;
    setZIndex(index: any): this;
    moveToTop(): boolean;
    moveUp(): boolean;
    moveDown(): boolean;
    moveToBottom(): boolean;
    getLayer(): this;
    remove(): this;
    getStage(): Stage;
    setSize({ width, height }: {
        width: any;
        height: any;
    }): this;
    _validateAdd(child: any): void;
    _toKonvaCanvas(config: any): any;
    _checkVisibility(): void;
    _setSmoothEnabled(): void;
    getWidth(): number;
    setWidth(): void;
    getHeight(): number;
    setHeight(): void;
    batchDraw(): this;
    getIntersection(pos: Vector2d): Shape<import("./Shape.js").ShapeConfig>;
    _getIntersection(pos: Vector2d, boxFilter?: boolean): {
        shape?: Shape;
        antialiased?: boolean;
    };
    drawScene(can?: SceneCanvas, top?: Node): this;
    drawHit(can?: HitCanvas, top?: Node): this;
    enableHitGraph(): this;
    disableHitGraph(): this;
    setHitGraphEnabled(val: any): void;
    getHitGraphEnabled(val: any): boolean;
    toggleHitCanvas(): void;
    destroy(): this;
    hitGraphEnabled: GetSet<boolean, this>;
    clearBeforeDraw: GetSet<boolean, this>;
    imageSmoothingEnabled: GetSet<boolean, this>;
}
