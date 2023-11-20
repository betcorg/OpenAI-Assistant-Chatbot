const { Client, LocalAuth } = require('whatsapp-web.js');
const client = new Client({ authStrategy: new LocalAuth() });

const whatsapp = require('../modules/whatsapp-client');
const assistants = require('../modules/assistants');
const threads = require('../modules/threads');
const messages = require('../modules/messages');
const runs = require('../modules/runs');





async function assistantResponse(msg) {

    const assistant = await assistants.retrieve('asst_gATYLXwr2ccD9pk8I9sPyCpz');
    console.log(assistant);

    const thread = await threads.create();
    console.log(thread);

    await messages.create(thread.id, msg.body);

    const run = await runs.create(thread.id, assistant.id);

    let runStatus = await runs.retrieve(thread.id, run.id);

    while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        runStatus = await runs.retrieve(thread.id, run.id);
    }

    const messageList = await messages.list(thread.id);

    const lastMessage = await messageList.data
        .filter(
            (message) => message.run_id === run.id && message.role === "assistant"
        )
        .pop();


    if (lastMessage) {
        client.sendMessage(msg.from, lastMessage.content[0].text.value);
    }
}


async function messageHandler() {

    client.on('message', async (msg) => {

        console.log(msg.body);

        assistantResponse(msg);

    });
}



async function main() {

    await whatsapp.init(client);

    messageHandler();
}

main();