const qrcode = require('qrcode-terminal');

async function waClientInit(client) {
    await client.on('qr', (qr) => {
        qrcode.generate(qr, { small: true });;
    });
    await client.on('ready', () => {
        console.log('Client is ready!');
    });
    await client.initialize();
}

module.exports = waClientInit;




