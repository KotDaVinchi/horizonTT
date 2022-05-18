import {CellIndex, ColoredCells, User} from "../../common/types";
import {UserModel, CellsModel, UserI, CellIPopulated} from "./models";
import {Types} from "mongoose";

interface UpdateHandlersI {
    coloredCells: Array<(coloredCells: ColoredCells) => void>
}

const updateHandlers: UpdateHandlersI = {
    coloredCells: [],
}

const handleColoredCellsUpdate = async () => {
    const coloredCells = await getColoredCells();

    for (let handler of updateHandlers.coloredCells) {
        handler(coloredCells);
    }
}

export const takeCell = async (key: CellIndex, user: Types.ObjectId): Promise<void> => {
    await CellsModel.create({
        key,
        user,
    }).catch(e => {
        if (e.code === 11000) {
            return; //suppress duplicate warnings
        }
        throw e;
    });
    await handleColoredCellsUpdate();
}

export const getUser = async (token: User["token"]): Promise<UserI> => {
    return UserModel.findOne({token}).lean();
}

export const setUser = async (token: User["token"], user: UserI): Promise<void> => {
    await UserModel.updateOne({token}, user, {upsert: true})
    await handleColoredCellsUpdate();
}

export const getColoredCells = async (): Promise<ColoredCells> => {
    return CellsModel
        .find({})
        .populate<{ user: UserI }>('user')
        .then(cells => {
            return cells && cells.reduce((acc: ColoredCells, cell: CellIPopulated) => {
                acc[cell.key] = cell.user.color;
                return acc
            }, {})
        })

}

export const onColoredCellsUpdate = (cb: UpdateHandlersI["coloredCells"][number]): void => {
    updateHandlers.coloredCells.push(cb)
}
