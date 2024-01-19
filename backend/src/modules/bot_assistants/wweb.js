require('dotenv').config();
const qrcode = require('qrcode-terminal');


const errorLog = (operation, error) => {
    console.log(`Error during ${operation}: ${error.message || error}\n`);
};


const chatbot = {

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

    // listen: async (client) => {

    //     // Listen to the incoming messages
    //     client.on('message', async (msg) => {

    //         console.log(`User message: ${msg.body}\n`);

    //         const session = await whatsapp.sessionHandler(sessions, msg);
    //         inbox.push(session);

    //         // Process the first message and respond, then check if there are queued messages and respond them
    //         if (inbox.length === 1) {
    //             await bot.responder(inbox[0], msg.body);
    //             inbox.shift();
    //             if (queuedMessage.length > 0) {
    //                 const userMessage = queuedMessage[0].messages.filter((obj) => obj.hasOwnProperty('user')).pop();
    //                 console.log('Responding to queued message: ', userMessage.user);
    //                 await bot.responder(queuedMessage[0], userMessage.user);
    //                 queuedMessage = [];
    //                 inbox = [];
    //             }

    //             // If there is a message being processed, then queue the incoming message
    //         } else {
    //             if (queuedMessage.length === 0) {
    //                 inbox.shift();
    //                 queuedMessage.push(inbox[0]);

    //                 // Check if there is a queued message from the same user. If there's a queued message then concatenate the new message to the last one, if there's not, add a new queued message
    //             } else {
    //                 inbox.shift();
    //                 for (const currentSession of queuedMessage) {
    //                     if (currentSession.from === inbox[0].from) {
    //                         const sessionMessage = currentSession.messages.pop();
    //                         const inboxMessage = inbox[0].messages.pop();
    //                         currentSession.messages.push({ 'user': `${inboxMessage.user} ${sessionMessage.user}` });

    //                     } else {
    //                         queuedMessage.push(inbox[0]);
    //                     }
    //                 }
    //             }
    //         }
    //     });
    // },

    // responder: async (session, userMessage) => {

    //     await new Promise((resolve) => setTimeout(resolve, 3000));
    //     const response = await openai.assistants.response(session, userMessage);
    //     client.sendMessage(session.from, response);
    //     session.messages.push({ system: response });
    // }

};

module.exports = {chatbot};




