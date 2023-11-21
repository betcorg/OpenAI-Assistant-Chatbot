const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({ authStrategy: new LocalAuth() });
const whatsapp = require('../modules/whatsapp');
const assistantResponse = require('../modules/assistant-logic');
const fs = require('fs');
const date = new Date;


let sessions = [];

async function listener() {
    
    client.on('message', async (msg) => {
        console.log(`User message:
        
        ${msg.body}\n`);
        const session = await whatsapp.sessionHandler(sessions, msg);
        const userMessage = msg.body;
        const response = await assistantResponse(session, userMessage);
        session.messages.push({system: response});
        client.sendMessage(msg.from, response);

        fs.writeFileSync('sessions/sessions.json', JSON.stringify(sessions));
    });
}

async function botInit() {

    fs.writeFileSync(`sessions-complete/sessions${date.getTime()}.json`, fs.readFileSync('sessions/sessions.json'));

    await whatsapp.init(client);

    await listener();
}

botInit();