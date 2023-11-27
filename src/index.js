const express = require('express');
const apiRoute = require('./routes/route');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', apiRoute);

app.listen(PORT, () => {
    console.log('Linstening on port: ' + PORT);
});

