import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { router } from '../routes/index.js'; 
import { configs } from '../configs/index.js';
import Database from '../database/connection/index.js';
import MongoDB from '../database/providers/mongoDB.js';

const dbProvider = new Database(MongoDB, configs.MONGO_URI);

class Server {

    constructor(configs, dbProvider, router,) {
        this.app = express();
        this.configs = configs;
        this.dbProvider = dbProvider;
        this.router = router;
        this.port = configs.PORT;
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

            .use('/api/v1', this.router)
            .listen(this.port, () => {
                console.log(`[*] Server listening at port ${this.port}`);
            });
    }
}

export default new Server(configs, dbProvider, router);
