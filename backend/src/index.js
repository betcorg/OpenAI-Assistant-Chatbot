require('dotenv').config();
const mongoConnection = require('./database/mongoConnect');
const expressApp = require('./server/app');

const main = async () => {

    await mongoConnection();

    expressApp();
};

main();








