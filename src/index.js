const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({ authStrategy: new LocalAuth() });

const whatsapp = require('../modules/whatsapp');
const chatCompletion = require('../modules/chat-completion');
const fs = require('fs');

let sessions = []

// let sessions = [
//     {
//         userId: '5212283619628',
//         thread: {},
//         messages: [
//             { user: 'Hola' },
//             { system: 'Hola' },
//         ],
//     },
//     {
//         userId: '5212283619625',
//         thread: {},
//         messages: [
//             { user: 'Hola' },
//             { system: 'Hola' },
//         ],
//     },
//     {
//         userId: '5212283619623',
//         thread: {},
//         messages: [
//             { user: 'Hola' },
//             { system: 'Hola' },
//         ],
//     },
// ];


function isSessionActive(userId) {
    let active = false;
    for (const session of sessions) {
        if (session.userId.includes(userId)) active = true;
    }
    return active;
}


async function sessionHandler(msg) {
    // Creates user id
    const userId = msg.from.toString().match(/\d+/g)[0];
    // Check if theres an existing session by userId
    const existingSession = isSessionActive(userId);

    if (existingSession) {
        console.log('existing session');
        let updatedSession = {};
        for (const session of sessions) {
            if (session.userId === userId) {
                updatedSession = session;
                sessions = sessions.filter(elem => elem !== session);
                updatedSession.messages.push({user: msg.body});
                sessions.push(updatedSession);
            }
        }
        return updatedSession;

    } else {
        console.log('No sesion existing, creating a new one');
        
        const thread = 'New thread created'; // await threads.create();
        const newSession = {
            userId: userId,
            thread: thread,
            messages: [
                { user: msg.body },
            ],
        }
        sessions.push(newSession);
        return newSession;
    }
}





async function listener() {
    client.on('message', async (msg) => {

        const session = await sessionHandler(msg);

        const userMessage = msg.body;
        
        const response = await chatCompletion(userMessage);

        session.messages.push({system: response});

        client.sendMessage(msg.from, response);

        fs.writeFileSync('sessions/sessions.json', JSON.stringify(sessions));
    });
}






async function main() {

    await whatsapp.init(client);

    await listener();

 

}

main();