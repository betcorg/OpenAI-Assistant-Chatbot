import { whatsapp } from '../../services/baileys.js'
import { io } from '../../index.js';
import qrcode from 'qrcode';


export const whatsappLoginController = async (req, res) => {
    
    try {
        if (req?.query?.login) {
            
            await whatsapp.login(async (update) => {
                
                const { connection, lastDisconnect, qr } = update;
                
                if (connection === 'close') {
                    console.log('Connection closed');
                    await whatsapp.connectionKeeper(lastDisconnect);

                } else if (connection === 'open') {
                    console.log('[*] Connection opened');
                    
                } else if (qr) {
                    console.log('==> Generando qr url');
                    console.log({ update });
                    
                    qrcode.toDataURL(qr, async (error, url) => {
                        io.emit('qr', url);
                    });
                }
            });
            
        } else {
            console.log(req.query);
            const root = process.cwd();
            res.status(200).sendFile(`${root}/qr.ui/index.html`);

        }


    } catch (error) {
        res.status(500).json({ status: 'error', description: error })
    }

}





