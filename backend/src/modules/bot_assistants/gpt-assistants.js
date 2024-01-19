require('dotenv/config');
const {Client} = require('whatsapp-web.js');
const BotSession = require('../../database/models/bot-sessions-schema');
const whatsapp = require('./wweb');

const waClient = new Client();
// const mongoose = require('mongoose');


async function botInit() {

    // inicializa el cliente de whatsapp
    await whatsapp.chatbot.init(waClient);

    async function listen(client) {
        // Listen to the incoming messages
        client.on('message', async (message) => {

            const session = await whatsapp.sessionHandler(sessions, msg);

            inbox.push(session);

            // Process the first message and respond, then check if there are queued messages and respond them
            if (inbox.length === 1) {
                await bot.responder(inbox[0], msg.body);
                inbox.shift();
                if (queuedMessage.length > 0) {
                    const userMessage = queuedMessage[0].messages.filter((obj) => obj.hasOwnProperty('user')).pop();
                    console.log('Responding to queued message: ', userMessage.user);
                    await bot.responder(queuedMessage[0], userMessage.user);
                    queuedMessage = [];
                    inbox = [];
                }

                // If there is a message being processed, then queue the incoming message
            } else {
                if (queuedMessage.length === 0) {
                    inbox.shift();
                    queuedMessage.push(inbox[0]);

                    // Check if there is a queued message from the same user. If there's a queued message then concatenate the new message to the last one, if there's not, add a new queued message
                } else {
                    inbox.shift();
                    for (const currentSession of queuedMessage) {
                        if (currentSession.from === inbox[0].from) {
                            const sessionMessage = currentSession.messages.pop();
                            const inboxMessage = inbox[0].messages.pop();
                            currentSession.messages.push({ 'user': `${inboxMessage.user} ${sessionMessage.user}` });

                        } else {
                            queuedMessage.push(inbox[0]);
                        }
                    }
                }
            }
        });
    }
    

}
botInit();









// async function dbSessionHandler(session) {

//     // const db = await mongoose.connection;

//     const userExist = BotSession.findById(user_id);
//     if (!userExist) {
//         newUser = new BotSession({
//             'phone_number': String,
//             'assistant': String,
//             'thread': String,
//             'runs': Array,
//             'messages': Array
//         });


    
// }


// dbSessionHandler(session);
