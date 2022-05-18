import {CellIndex, ColoredCells, User} from "./types";

export interface ServerToClientEvents {
    updateCells: (coloredCells: ColoredCells) => void,
    user: (user: User) => void,
}

export interface ClientToServerEvents {
    regenColor: () => void;
    takeCell: (cellIndex: CellIndex) => void,
}
