const openai = require('./openai-assistants');
const fs = require('fs');

async function assistantResponse(session, userMessage) {

    // Create a new message attached to a thread and then create a run from current thread
    const assistant = await session.assistant;
    const thread = await session.thread;
    await openai.messages.create(thread.id, userMessage);
    const run = await openai.runs.create(thread.id, assistant.id);
    session.runs.push(run);

    // Polling mechanism
    let currentRun = await openai.runs.retrieve(thread.id, run.id);
    while (currentRun.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        currentRun = await openai.runs.retrieve(thread.id, run.id);
        console.log('Processing answer...\n');
    }

    // Extract text from the last assistant response
    const messageList = await openai.messages.list(thread.id);
    fs.writeFileSync(`messages/message-list-${session.userId}.json`, JSON.stringify(messageList));
    const lastMessage = await messageList.data
        .filter((message) =>
            message.run_id === run.id
            && message.role === "assistant"
        ).pop();
    let response = lastMessage.content[0].text.value;

    // Obtain annotations from the response and elminate them if they exist. 
    let annotations = lastMessage.content[0].text.annotations[0];
    
    if (typeof (annotations) === 'undefined' && response) {
        console.log(`Response: ${response}\n`);
        return response;
    } else {
        response = response.replace(annotations.text, '');
        console.log(`Response: ${response}\n
        Annotations: ${annotations.text}\n`);
        return response;
    }
}

module.exports = assistantResponse;


