import * as React from 'react';
import {Socket, io} from "socket.io-client";

import Cells from "./Components/Cells"
import {cellKey} from "../common";

import {CellIndex, ColoredCells, User} from '../common/types'
import {ServerToClientEvents, ClientToServerEvents} from "../common/api.types";

type ApiSocket = Socket<ServerToClientEvents, ClientToServerEvents>

function useApi() {
    const socket = React.useRef<ApiSocket|null>(null);
    const [user, setUser] = React.useState<User|{}>({});
    const [coloredCells, setColoredCells] = React.useState<ColoredCells>({});

    React.useEffect(() => {
        const socketInstance: ApiSocket = io('', {path: '/api/'});

        socketInstance.on('user', (user: User) => {
            setUser(user);
        })

        socketInstance.on('updateCells', (cells: ColoredCells) => {
            setColoredCells(cells);
        })

        socket.current = socketInstance;
    }, [])

    const updateColor = React.useCallback(() => {
        setUser({color: undefined});
        socket.current.emit('regenColor');
    }, [setUser])

    const takeCell = React.useCallback((cellIndex: CellIndex) => {
        if('color' in user && user.color){
            socket.current.emit('takeCell', cellIndex);
        }
    }, [user])

    return {
        color: 'color' in user ? user.color : undefined,
        updateColor,
        coloredCells,
        takeCell,
    }
}

const App = () => {
    const {
        color: userColor,
        updateColor: updateUserColor,
        coloredCells,
        takeCell,
    } = useApi();

    const addCeilInField = React.useCallback((rowIdx: number, columnIdx: number): void => {
        takeCell(cellKey(rowIdx, columnIdx));
    }, [takeCell]);

    return <div>
        <span
            className="userStateLine"
            onClick={updateUserColor}
            // style={{opacity: userColor ? 1 : 0}}
        >
            Your current color is: <b style={{color: userColor}}>{userColor}</b>
        </span>
        <Cells
            coloredCells={coloredCells}
            onChoose={addCeilInField}
            cursorColor={userColor}
        />
    </div>
};

export default App;
