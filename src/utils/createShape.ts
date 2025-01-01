import {Shapes} from "./types.ts";
import {TOOLS} from "../constants.ts";

export const createShape = (tool: string, id: string, x: number, y: number, selectColor: string, strokeWidth: number, points: number[]): Shapes => {
    switch (tool) {
        case TOOLS.RECT:
            return {id, x, y, fill: selectColor, strokeWidth, stroke: "black", type: 'rect', width: 0, height: 0};
        case TOOLS.CIRCLE:
            return {id, x, y, fill: selectColor, strokeWidth, stroke: "black", type: 'circle', radius: 0};
        case TOOLS.ARROW:
            return {id, points, fill: selectColor, strokeWidth: strokeWidth * 2, stroke: selectColor, type: 'arrow'};
        case TOOLS.PENCIL:
            return {id, points, fill: selectColor, strokeWidth, stroke: selectColor, type: 'pencil'};
        case TOOLS.TRIANGLE:
            return {
                id,
                x,
                y,
                fill: selectColor,
                strokeWidth,
                stroke: "black",
                type: 'triangle',
                radius: 0,
                sides: 3
            };
        default:
            return;
    }
};