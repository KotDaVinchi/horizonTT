import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import {createServer} from "http";
import {dbConnect} from "./db";
import {Server as IOServer} from "socket.io";

import socketApi from './api';
import {userMiddleware} from "./middlewares";

const app = express();
app.use(cookieParser());

app.use(userMiddleware);
app.use(express.static('public'));

let server = createServer(app);
const io = new IOServer(server, {
    path: '/api/',
    cookie: true,
});
io.on('connection', socketApi(io));

const port = process.env.PORT || 3000;
dbConnect().then(() => {
    server.listen(port, () => console.log(`Server listening on port: ${port}`));
})
