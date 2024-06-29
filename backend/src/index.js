import 'dotenv/config';
import server from './server/app.js'; 

const main = async () => {
    await server.connectDB();
    server.start();
};

await main();
