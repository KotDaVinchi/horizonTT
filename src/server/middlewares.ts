import {Request, Response, NextFunction} from "express";
import {setUser} from "./db";
import {getRandomColor} from "../common";

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    let userToken = req.cookies['user_token'];
    if (!userToken) {
        userToken = require('crypto').createHash('md5').update(Date.now().toString()).digest("hex");
        await setUser(userToken, {token: userToken, color: getRandomColor()});
        res.cookie('user_token', userToken);
    }

    next();
}
