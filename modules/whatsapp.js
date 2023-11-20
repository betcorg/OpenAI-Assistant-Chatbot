const qrcode = require('qrcode-terminal');

const whatsapp = {

    init: async (client) => {
        try {
            await client.on('qr', (qr) => {
                qrcode.generate(qr, { small: true });
            });
            await client.on('ready', () => {
                console.log('WhatsApp client is ready!');
            });
            await client.initialize();
        } catch (error) {
            console.log('Error during initializing whatsapp client: ', error.message || error);
        }
    }
}

module.exports = whatsapp;




