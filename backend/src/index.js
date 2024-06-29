import 'dotenv/config';
import {connectDatabase} from './database/mongoConnect.js'; 
import expressApp from './server/app.js'; 

const main = async () => {
    await connectDatabase();
    expressApp();
};

main();
