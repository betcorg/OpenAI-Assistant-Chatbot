const openai = require('./openai-assistants');


async function assistantResponse(session, userMessage) {

    const assistant = await session.assistant;

    const thread =  await session.thread;
    
    await openai.messages.create(thread.id, userMessage);

    const run =  await openai.runs.create(thread.id, assistant.id);

    let runStatus = await openai.runs.retrieve(thread.id, run.id);

    while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        runStatus = await openai.runs.retrieve(thread.id, run.id);
        console.log('Processing answer...');
    }

    const messageList = await openai.messages.list(thread.id);

    const lastMessage = await messageList.data
        .filter(
            (message) => message.run_id === run.id && message.role === "assistant"
        )
        .pop();

    if (lastMessage) {
        return lastMessage.content[0].text.value;
    }
}

module.exports = assistantResponse;


