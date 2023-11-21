const openai = require('./openai-assistants');
const fs = require('fs');

async function assistantResponse(session, userMessage) {

    const assistant = await session.assistant;
    const thread = await session.thread;
    await openai.messages.create(thread.id, userMessage);
    const run = await openai.runs.create(thread.id, assistant.id);
    let runStatus = await openai.runs.retrieve(thread.id, run.id);
    while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        runStatus = await openai.runs.retrieve(thread.id, run.id);
        console.log('Processing answer...\n');
    }
    const messageList = await openai.messages.list(thread.id);
    fs.writeFileSync(`sessions/message-list-${thread.id}.json`, JSON.stringify(messageList));

    const lastMessage = await messageList.data
        .filter((message) => 
            message.run_id === run.id 
            && message.role === "assistant"
        ).pop();
    let response = lastMessage.content[0].text.value;
    let annotations = lastMessage.content[0].text.annotations[0];
    if (typeof(annotations) === 'undefined' && response) {
        console.log(`Response:

        ${response}\n`);
        return response;
    } else {
        response = response.replace(annotations.text, '');
        console.log(`Response:

        ${response}
        
        Annotations: 
        
        ${annotations.text}\n`);
        return response;
    }
}

module.exports = assistantResponse;


