import {Model, model, Schema, Types} from "mongoose";
import {CellIndex, User} from "../../common/types";

export interface CellI {
    key: CellIndex,
    user: Types.ObjectId,
}

export interface UserI extends User {
    _id?: Types.ObjectId
}

export interface CellIPopulated extends Omit<CellI, 'user'> {
    user: UserI
}

export const CellsModel: Model<CellI> = model(
    'ColoredCell',
    new Schema<CellI>({
        key: {
            type: String,
            required: true,
            unique: true
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    })
);

export const UserModel: Model<UserI> = model(
    'User',
    new Schema<UserI>({
        token: {
            type: String,
            required: true,
            unique: true
        },
        color: {
            type: String,
            required: true
        },
    })
);
