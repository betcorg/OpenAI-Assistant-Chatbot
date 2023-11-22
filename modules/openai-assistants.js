const OpenAI = require('openai');
const openai = new OpenAI();
const fs = require('fs');


const errorLog = (operation, error) => {
    console.log(`Error during ${operation}: ${error.message || error}\n`);
};



/*/////////////////////////////// ASSISTANTS /////////////////////////////////*/



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



/*////////////////////////////// THREADS //////////////////////////////////*/



const threads = {
    // Creates a new thread with optional message
    create: async () => {
        try {
            return await openai.beta.threads.create();
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



/*///////////////////////////// MESSAGES ///////////////////////////////////*/



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



/*////////////////////////////// RUNS //////////////////////////////////*/



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



/*/////////////////////////////// FILE MANAGER /////////////////////////////////*/



const fileman = {
    // Uploads a file for assistant base knowlege
    upload: async (filePath) => {
        try {
            return await openai.files.create({
                file: fs.createReadStream(filePath),
                purpose: "assistants",
            });
        } catch (error) {
            errorLog("uploading file", error);
        }
    },

    // List uploaded files
    list: async () => {
        try {
            return await openai.files.list();
        } catch (error) {
            errorLog("listing files", error);
        }
    },
};


/*/////////////////////////////// SESSION MANAGER /////////////////////////////////*/


const session = {
    
    create: async (userId, userMessage, sessions) => {
        try {
            const assistantId = process.env.ASSISTANT_ID;
            const assistant = await assistants.retrieve(assistantId);
            const thread = await threads.create();
            const newSession = {
                "userId": userId,
                "assistant": assistant,
                "thread": thread,
                "runs": [],
                "messages": [
                    { "user": userMessage },
                ],
            }
            sessions.push(newSession);
            return newSession;
        } catch (error) {
            errorLog('creating a new session', error);
        }
    },

    update: async (userId, userMessage, sessions) => {
        try {
            let updatedSession = {};
            for (const session of sessions) {
                if (session.userId === userId) {
                    updatedSession = session;
                    sessions = sessions.filter(elem => elem !== session);
                    updatedSession.messages.push({ "user": userMessage });
                    sessions.push(updatedSession);
                }
            }
            return updatedSession;
        } catch (error) {
            errorLog('updating sessions', error);
        }
    }
}

module.exports = {
    assistants,
    threads,
    messages,
    runs,
    fileman,
    session,
};



