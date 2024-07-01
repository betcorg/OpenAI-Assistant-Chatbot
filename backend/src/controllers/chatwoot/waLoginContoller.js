import { whatsapp } from '../../services/baileys.js'

export const whatsappLoginController = async (req, res) => {


    await whatsapp.login( async (update) => {

        try {
            const { connection, lastDisconnect, qr } = update;
    
            if (connection === 'close') {
                console.log('Connection closed');
                await whatsapp.connectionKeeper(lastDisconnect);
    
            } else if (connection === 'open') {
                console.log('[*] Connection opened');
                res.status(200).json({status: 'connected'})
                
            } else if (qr) {
                console.log('[*] QR Code:', qr);
                res.status(200).json({status: 'connected', qr: qr})
            }
        } catch (error) {
            res.status(500).json({status: 'error', description: error})
        }
    });
}