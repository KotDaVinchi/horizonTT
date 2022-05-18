import {Server as IOServer, Socket} from "socket.io";
import {parse} from "cookie";

import {getColoredCells, getUser, onColoredCellsUpdate, setUser, takeCell} from "./db";
import {cellIndexes, getRandomColor, inRange} from "../common";

import {ClientToServerEvents, ServerToClientEvents} from "../common/api.types";
import {UserI} from "./db/models";
import {CellIndex, User} from "../common/types";
import {FIELD_HEIGHT, FIELD_WIDTH, TAKE_CALL_THROTTLE} from "../common/constants";

export interface SocketData {
    user: UserI
}

const lastUserAttempt: {
    takeCell: { [index: User["token"]]: number },
} = {
    takeCell: {}
};

function throttle(type: keyof typeof lastUserAttempt, key: User["token"], fn: () => void) {
    const callTime = Date.now();
    if (callTime - (lastUserAttempt[type][key] || 0) > TAKE_CALL_THROTTLE) {
        lastUserAttempt[type][key] = callTime;
        fn();
    }
}

export default (io: IOServer<ClientToServerEvents, ServerToClientEvents, {}, SocketData>) => {
    io.use(async (socket, next) => {
        let userToken = parse(socket.request.headers.cookie)?.user_token;
        let user = await getUser(userToken);
        if (!userToken || !user) {
            next(new Error('Unknown user'))
        }
        socket.data = {...socket.data, user};
        next()
    });

    onColoredCellsUpdate((field) => {
        io.emit("updateCells", field);
    })

    return (socket: Socket<ClientToServerEvents, ServerToClientEvents, {}, SocketData>) => {
        getColoredCells().then((coloredCells) => socket.emit('updateCells', coloredCells))
        socket.emit('user', socket.data.user);

        socket.on('regenColor', async () => {
            const user = socket.data.user

            const newUser = {...user, color: getRandomColor()}
            await setUser(user.token, newUser);

            socket.emit('user', newUser);
        })

        socket.on('takeCell', async (cellIndex: CellIndex) => {
            throttle("takeCell", socket.data.user.token, async () => {
                const indexes = cellIndexes(cellIndex);
                if (
                    inRange(indexes[0], 0, FIELD_HEIGHT - 1) &&
                    inRange(indexes[1], 0, FIELD_WIDTH - 1)
                ) {
                    await takeCell(cellIndex, socket.data.user._id);
                }
            })
        })
    }
}
