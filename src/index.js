const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({ authStrategy: new LocalAuth() });
const whatsapp = require('../modules/whatsapp');
const assistantResponse = require('../modules/assistant-logic');
const fs = require('fs');
const date = new Date;

let sessions = [];
let inbox = [];
let queuedMessage = [];

async function responder(session, userMessage) {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const response = await assistantResponse(session, userMessage);
    client.sendMessage(session.from, response);
    session.messages.push({ system: response });
    fs.writeFileSync('sessions/sessions.json', JSON.stringify(sessions));
}

async function listener() {

    client.on('message', async (msg) => {
        console.log(`User message: ${msg.body}\n`);

        const session = await whatsapp.sessionHandler(sessions, msg);
        inbox.push(session);

        // Process the first message and respond, then check if there are queued messages and respond them
        if (inbox.length === 1) {
            await responder(inbox[0], msg.body);
            inbox.shift();
            if (queuedMessage.length > 0) {
                userMessage = queuedMessage[0].messages.filter((obj) => obj.hasOwnProperty('user')).pop();
                console.log('Responding to queued message: ', userMessage.user);
                await responder(queuedMessage[0], userMessage.user);
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
                        currentSession.messages.push({ "user": `${inboxMessage.user} ${sessionMessage.user}` });

                    } else {
                        queuedMessage.push(inbox[0]);
                    }
                }
            }
        }
    });
}

async function botInit() {

    fs.writeFileSync(`sessions-complete/sessions${date.getTime()}.json`, fs.readFileSync('sessions/sessions.json'));

    await whatsapp.init(client);

    await listener();
}

botInit();