require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const routerV1 = require('./routes/v1');

const app = express();
const PORT = process.env.PORT;
const DB_URL = process.env.MONGO_LSESSIONS;

app.use(express.json());

// Conexión a db local
mongoose.connect(DB_URL)
    .then(() => {
        console.log('Connection to MongoDB is ready');
    }).catch(err => console.log('Error during database connection: ', err));

app.use('/api/v1', routerV1);


app.listen(PORT, () => {
    console.log('Listening at http://localhost:', PORT);
});









