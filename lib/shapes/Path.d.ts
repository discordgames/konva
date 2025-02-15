import { Shape, ShapeConfig } from '../Shape.js';
import { GetSet, PathSegment } from '../types.js';
export interface PathConfig extends ShapeConfig {
    data?: string;
}
export declare class Path extends Shape<PathConfig> {
    dataArray: any[];
    pathLength: number;
    constructor(config?: PathConfig);
    _readDataAttribute(): void;
    _sceneFunc(context: any): void;
    getSelfRect(): {
        x: any;
        y: any;
        width: number;
        height: number;
    };
    getLength(): number;
    getPointAtLength(length: any): any;
    data: GetSet<string, this>;
    static getLineLength(x1: any, y1: any, x2: any, y2: any): number;
    static getPathLength(dataArray: PathSegment[]): number;
    static getPointAtLengthOfDataArray(length: number, dataArray: any): any;
    static getPointOnLine(dist: any, P1x: any, P1y: any, P2x: any, P2y: any, fromX?: any, fromY?: any): any;
    static getPointOnCubicBezier(pct: any, P1x: any, P1y: any, P2x: any, P2y: any, P3x: any, P3y: any, P4x: any, P4y: any): {
        x: number;
        y: number;
    };
    static getPointOnQuadraticBezier(pct: any, P1x: any, P1y: any, P2x: any, P2y: any, P3x: any, P3y: any): {
        x: number;
        y: number;
    };
    static getPointOnEllipticalArc(cx: any, cy: any, rx: any, ry: any, theta: any, psi: any): {
        x: any;
        y: any;
    };
    static parsePathData(data: any): PathSegment[];
    static calcLength(x: any, y: any, cmd: any, points: any): any;
    static convertEndpointToCenterParameterization(x1: any, y1: any, x2: any, y2: any, fa: any, fs: any, rx: any, ry: any, psiDeg: any): any[];
}
