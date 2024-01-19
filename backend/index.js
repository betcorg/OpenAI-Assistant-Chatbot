require('dotenv').config();
const mongoConnection = require('./src/database/mongoConnect');
const expressApp = require('./src/server/app');

const main = async () => {

    await mongoConnection();

    expressApp();
};

main();








