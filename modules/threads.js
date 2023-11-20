const OpenAI = require('openai');
const openai = new OpenAI();

const errorLog = (operation, error) => {
    console.log(`Error during ${operation}: ${error.message || error}\n`);
};

const threads = {
    // Creates a new thread with optional message
    create: async (messages) => {
        try {
            return await openai.beta.threads.create(messages);
        } catch (error) {
            errorLog('creating thread', error);
        }
    },

    // Update the thread metadata
    update: async (threadId, metadata) => {
        try {
            return await openai.beta.threads.update(
                threadId,
                metadata,
            );
        } catch (error) {
            errorLog('updating a thread', error);
        }
    },

    // retrieves a thread
    retrieve: async (threadId) => {
        try {
            return await openai.beta.threads.retrieve(threadId);
        } catch (error) {
            errorLog('retrieving a thread', error);
        }
    },

    // Deletes a thread
    delete: async (threadId) => {
        try {
            return await openai.beta.threads.del(threadId);
        } catch (error) {
            errorLog('deleting a thread', error);
        }
    },
}

module.exports = threads;