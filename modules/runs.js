const OpenAI = require('openai');
const openai = new OpenAI();

const errorLog = (operation, error) => {
    console.log(`Error during ${operation}: ${error.message || error}\n`);
};

const runs = {

    // Creates  new run attached to an assistant
    create: async (threadId, assistantId) => {
        try {
            return await openai.beta.threads.runs.create(
                threadId,
                { assistant_id: assistantId }
            );
        } catch (error) {
            errorLog('creating a run', error);
        }
    },

    // Retrieves a run
    retrieve: async (threadId, runId) => {
        try {
            return await openai.beta.threads.runs.retrieve(
                threadId,
                runId,
            );
        } catch (error) {
            errorLog('retrieving a run', error);
        }
    },

    // Función incompleta
    update: async () => {
        try {
            return await openai.beta.threads.runs.update(
                "thread_abc123",
                "run_abc123",
                {
                    metadata: {
                        user_id: "user_abc123",
                    },
                });
        } catch (error) {
            errorLog('updating a run', error);
        }
    },

    // Lists runs attaches¡d to a thread
    list: async (threadId) => {
            try {
                return await openai.beta.threads.runs.list(
                    threadId,
                );
            } catch (error) {
                errorLog('listing run', error);
            }
    },
}

module.exports = runs;