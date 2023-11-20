const qrcode = require('qrcode-terminal');
const openai = require('./openai-assistants');
require('dotenv').config();

const assistantId = process.env.ASSISTANT_ID;

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
                console.log('WhatsApp client is ready!');
            });
            await client.initialize();
        } catch (error) {
            errorLog('initializing WhatsApp client', error);
        }
    },

    sessionHandler: async (sessions, msg) => {

        const userId =  msg.from.toString().match(/\d+/g)[0];

        const existingSession = await isSessionActive(sessions, userId);
        try {
            if (existingSession) {
                console.log('existing session');
                let updatedSession = {};
                for (const session of sessions) {
                    if (session.userId === userId) {
                        updatedSession = session;
                        sessions = sessions.filter(elem => elem !== session);
                        updatedSession.messages.push({ user: msg.body });
                        sessions.push(updatedSession);
                    }
                }
                return updatedSession;
    
            } else {
                console.log('No sesion existing, creating a new one');

                const assistant = await openai.assistants.retrieve(assistantId);
                const thread = await openai.threads.create();
                const newSession = {
                    userId: userId,
                    assistant: assistant,
                    thread: thread,
                    messages: [
                        { user: msg.body },
                    ],
                }
                sessions.push(newSession);
                return newSession;
            }  
        } catch (error) {
            errorLog('processing sessions', error);
        }
    }
}

module.exports = whatsapp;




