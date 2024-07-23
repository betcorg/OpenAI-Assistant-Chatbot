import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { createServer } from 'node:http';
import { Server as Io } from 'socket.io';

// const v = ':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

export default class Server {

    constructor({ port, dbProvider, routes }) {
        this.app = express();
        this.dbProvider = dbProvider;
        this.routes = routes;
        this.port = port;
        this.server = createServer(this.app);
        this.io = new Io(this.server);
    }

    async connectDB() {
        await this.dbProvider.connect();
    }

    start() {

        this.app
            .use(cors())
            .use(bodyParser.json())
            .use(cookieParser())
            .use(morgan('dev'))
            .use("/chatwoot/assets", express.static(process.cwd() + "/qr.ui/assets"));

        for (const route of this.routes) {
            this.app.use(route[0], route[1]);
        }

        this.server.listen(3002, () => {
            console.log(`[*] Server listening at port ${this.port}`);
        });
    }

    initSocket() {
        return this.io.on('connection', (socket) => socket);
    }

}

