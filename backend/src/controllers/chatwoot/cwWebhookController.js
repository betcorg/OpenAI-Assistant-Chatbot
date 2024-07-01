
import fs from 'fs';
import { whatsapp } from '../../services/baileys.js';

export const webhookController = async (req, res) => {


    const payload = req.body;

    console.log(payload);
   


    res.send('ok');

}