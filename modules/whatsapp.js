const qrcode = require('qrcode-terminal');
const openai = require('./openai-assistants');
require('dotenv').config();



const errorLog = (operation, error) => {
    console.log(`Error during ${operation}: ${error.message || error}\n`);
};


async function isSessionActive(sessions, userId) {
    let active = false;
    for (const session of sessions) {
        if (session.userId.includes(userId)) active = true;
    }
    return active;
}

const whatsapp = {

    init: async (client) => {
        try {
            await client.on('qr', (qr) => {
                qrcode.generate(qr, { small: true });
            });
            await client.on('ready', () => {
                console.log('WhatsApp client is ready!\n');
            });
            await client.initialize();
        } catch (error) {
            errorLog('initializing WhatsApp client', error);
        }
    },

    sessionHandler: async (sessions, msg) => {

        const userId = msg.from.toString().match(/\d+/g)[0];

        const existingSession = await isSessionActive(sessions, userId);

        if (existingSession) {
            console.log('Active session\n');
            return await openai.session.update(userId, msg.body, sessions);

        } else {
            console.log('Creating a new sessions\n');
            return await openai.session.create(userId, msg.body, sessions); 
        }

    }
}

module.exports = whatsapp;




