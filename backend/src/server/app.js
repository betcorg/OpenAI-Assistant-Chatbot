import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { router } from '../routes/index.js'; // Asegúrate que la ruta sea correcta

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

export default expressApp; 
