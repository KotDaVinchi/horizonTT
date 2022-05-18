import * as React from 'react';
import {cellKey} from "../../common";
import {useCallback} from "react";
import {ColoredCells} from "../../common/types";
import {FIELD_HEIGHT, FIELD_WIDTH} from "../../common/constants";

type Field = null[][];

interface CellsPropsI {
    coloredCells: ColoredCells,
    onChoose: (rowIdx: number, columnIdx: number) => void,
    cursorColor: string
}

const field = (new Array(FIELD_HEIGHT)).fill((new Array(FIELD_WIDTH)).fill(null)) as Field;

const Cells = ({coloredCells, onChoose, cursorColor}: CellsPropsI) => {

    const cells = field.map((row: Field[number], rowIdx: number) => {
        return <tr key={rowIdx} className='row'>{
            row.map((_, columnIdx: number) => {
                const key = cellKey(rowIdx, columnIdx);
                const color = coloredCells[key];
                const onClick = useCallback(
                    () => onChoose(rowIdx, columnIdx),
                    [onChoose, rowIdx, columnIdx]
                )

                return <td
                    key={key}
                    className='ceil'
                    onClick={onClick}
                    style={{backgroundColor: color}}
                />
            })
        }</tr>
    })

    const tableStyle = (cursorColor ? {'--cursorColor': cursorColor} : {}) as React.CSSProperties;
    return <table
        className='field'
        style={tableStyle}
    >
        <tbody>
        {cells}
        </tbody>
    </table>
}

export default Cells;
