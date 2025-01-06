export interface shape {
    id: string;
    x?: number;
    y?: number;
    fill: string
    strokeWidth: number;
    stroke: string;
    type: string;
    width?: number;
    height?: number;
}


export interface Rectangle extends shape {
    type: 'rect';
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
    points: number[]
}

export interface Pencil extends shape {
    type: 'pencil';
    points: number[]
}

export type Shapes = Rectangle | Circle | Triangle | Arrow | Pencil;