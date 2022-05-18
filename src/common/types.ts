export type CellIndex = string;

export interface User {
    token: string,
    color: string,
}

export interface ColoredCells {
    [index: CellIndex]: User["color"] | undefined
}
