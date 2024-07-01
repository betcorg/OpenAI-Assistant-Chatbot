import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const v = ':remote-addr - :remote-user [:date[web]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

export default class Server {

    constructor({port, dbProvider, routes}) {
        this.app = express();
        this.dbProvider = dbProvider;
        this.routes = routes;
        this.port = port;
    }

    async connectDB() {
        await this.dbProvider.connect();
    }

    start() {

        this.app
            .use(cors())
            .use(bodyParser.json())
            .use(cookieParser())
            .use(morgan(v));

            for (const route of this.routes) {
                this.app.use(route[0], route[1]);
            }

            this.app.listen(this.port, () => {
                console.log(`[*] Server listening at port ${this.port}`);
            });
    }

}

