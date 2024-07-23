import 'dotenv/config';
import Server from './server/app.js';
import DatabaseProvider from './database/connection/index.js';
import MongoDB from './database/providers/mongoDB.js';
import { PORT, MONGO_URI } from './configs/index.js';
import { router, chatwootRouter } from './routes/index.js';


const mongo = new MongoDB(MONGO_URI);
const dbProvider = new DatabaseProvider(mongo);
const port = PORT;
const routes = [
    ['/api/v1', router],
    ['/chatwoot', chatwootRouter],
];

const serverConf = {
    port,
    dbProvider,
    routes,
};

export const server = new Server(serverConf);
export const io = server.initSocket();

const main = async () => {
    await server.connectDB();
    server.start();
};

await main();
