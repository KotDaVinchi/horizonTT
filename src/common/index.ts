import {CellIndex} from "./types";

export const cellKey = (rowIdx: number, columnIdx?: number): CellIndex => {
    return `${rowIdx}_${columnIdx === undefined ? '' : columnIdx}`
}

export const cellIndexes = (ceilKey: CellIndex): [number, number] => {
    const indexes = ceilKey.split('_');
    if (indexes.length === 2) {
        return indexes.map(idx => parseInt(idx)) as [number, number];
    }
    throw new Error('Broken key');

}

export const inRange = (x: number, min: number, max: number): boolean => {
    return min <= x && x <=max;
}

export const getRandomColor = (): string => `#${
    (new Array(3))
        .fill('')
        .map(() => Math.floor((Math.random() * 256))
            .toString(16)
            .padEnd(2, '0')
        ).join('')
}`
