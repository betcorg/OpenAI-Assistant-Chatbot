const express = require('express');
const waRouter = require('./src/routes/wa-router');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use('/webhook', waRouter);

app.listen(PORT, () => {
    console.log('Linstening on port: ' + PORT);
});

