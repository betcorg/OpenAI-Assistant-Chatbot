const OpenAI = require('openai');
const openai = new OpenAI();

const errorLog = (operation, error) => {
    console.log(`Error during ${operation}: ${error.message || error}\n`);
};

const messages = {

    create: async (threadId, messages) => {
        try {
            return await openai.beta.threads.messages.create(
                threadId,
                { role: "user", content: messages },
            );
        } catch (error) {
            errorLog('creating a message', error);
        }
    },

    retrieve: async (threadId, messageId) => {
        try {
            return await openai.beta.threads.messages.retrieve(
                threadId,
                messageId,
            );
        } catch (error) {
            errorLog('retrieving messages', error);
        }
    },

    // Falta documentación. funcion incompleta
    update: async () => {
        try {
            return await openai.beta.threads.messages.update(
                "thread_abc123",
                "msg_abc123",
                {
                    metadata: {
                        modified: "true",
                        user: "abc123",
                    },
                }
            )
        } catch (error) {
            errorLog('updating message', error);
        }
    },


    list: async (threadId) => {
        try {
            return await openai.beta.threads.messages.list(
                threadId,
            );
        } catch (error) {
            errorLog('listing messages', error);
        }
    }
}

module.exports = messages;