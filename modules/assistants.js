const OpenAI = require('openai');
const openai = new OpenAI();


const errorLog = (operation, error) => {
    console.log(`Error during ${operation}: ${error.message || error}\n`);
};

const assistants = {

    // Creates new Assistant
    create: async (params) => {
        try {
            return await openai.beta.assistants.create(params);
        } catch (error) {
            errorLog('creating a new assistant', error);
        }
    },

    // Retrieves an existing assistant by the id
    retrieve: async (assistantId) => {
        try {
            return await openai.beta.assistants.retrieve(assistantId);
        } catch (error) {
            errorLog('retrieving an assistant', error);
        }
    },

    // Updates an assistant
    update: async (id, params) => {
        try {
            return await openai.beta.assistants.update(
                id,
                params,
            );
        } catch (error) {
            errorLog('updating an assistant', error);
        }
    },

    // Deletes an assistant by its id
    delete: async (assistantId) => {
        try {
            return await openai.beta.assistants.del(assistantId);
        } catch (error) {
            errorLog('deleting an assistant', error);
        }
    },

    // List existing assistants
    list: async () => {
        try {
            return await openai.beta.assistants.list({
                order: "desc",
                limit: "20",
            });
        } catch (error) {
            errorLog('listing assistants', error);
        }
    },
}

module.exports = assistants;



