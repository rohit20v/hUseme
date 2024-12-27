export interface shape {
    id: string;
    x?: number;
    y?: number;
    fill: string
    strokeWidth: number;
    stroke: string;
    type: string;
}


export interface Rectangle extends shape {
    type: 'rect';
    width: number;
    height: number;
}

export interface Circle extends shape {
    type: 'circle';
    radius: number;
}

export interface Triangle extends shape {
    type: 'triangle';
    radius: number;
    sides: number;
}

export interface Arrow extends shape {
    type: 'arrow';
    a: number;
    b: number;
}

export type Shapes = Rectangle | Circle | Triangle | Arrow;