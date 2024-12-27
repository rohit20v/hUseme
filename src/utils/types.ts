export type shape = {
    id: string;
    x?: number;
    y?: number;
    height?: number;
    width?: number;
    fill: string
    strokeWidth: number;
    stroke: string;
    sides?: number;
    radius?: number;
    type?: string;
}
//
// type ShapeType = 'rect' | 'circle' | 'arrow' | 'line' | 'text'; // add any shape types
//
// export type BaseShape = {
//     id: string;
//     x: number;
//     y: number;
//     fill: string;
//     strokeWidth: number;
//     strokeColor: string;
//     type: ShapeType;
// }
//
// export type RectShape = BaseShape & {
//     type: 'rect';
//     width: number;
//     height: number;
// }
//
// export type CircleShape = BaseShape & {
//     type: 'circle';
//     radius: number;
// }
//
// export type ArrowShape = BaseShape & {
//     type: 'arrow';
//     points: number[];
// }
//
// export type Shape = RectShape | CircleShape | ArrowShape;