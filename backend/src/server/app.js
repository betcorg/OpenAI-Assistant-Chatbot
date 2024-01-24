const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { router } = require('../routes');
const PORT = process.env.PORT;

const expressApp = () => {

    const app = express()
        .use(cors())
        .use(bodyParser.json())
        .use(cookieParser())
        .use(morgan('dev'));

    app.use('/api/v1', router);

    app.listen(PORT, () => {
        console.log(`[*] Server listening at http://localhost:${PORT}`);
    });
};

module.exports = expressApp;