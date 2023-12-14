/* The above code is a module that provides functions for interacting with the OpenAI API.
It includes functions for chat completion, creating and managing assistants, creating and managing
threads, creating and managing messages, creating and managing runs, uploading files, and managing
sessions. The code exports these functions so that they can be used in other JavaScript files. */
const OpenAI = require('openai');
const openai = new OpenAI();
const fs = require('fs');
require('dotenv').config();


const errorLog = (operation, error) => {
    console.log(`Error during ${operation}: ${error.message || error}\n`);
};



/*/////////////////////////////// CHAT COMPLETION/////////////////////////////////*/



const chat = {
    completion: async (instructions, userMessage) => {
        
        const MODEL = process.env.MODEL;
        const MAX_TOKENS = parseInt(process.env.MAX_TOKENS);

        const params = {
            messages: [
                { role: 'system', content: instructions },
                { role: 'user', content: userMessage },
            ],
            model: MODEL,
            max_tokens: MAX_TOKENS,
        };

        try {
            const completion = await openai.chat.completions.create(params);
            return completion.choices[0].message.content;

        } catch (error) {
            console.log('Error while creating chat completion\n', error.message);
        }

    }
};



/*/////////////////////////////////////// THREADS ///////////////////////////////////////*/



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
};



/*///////////////////////////// MESSAGES ///////////////////////////////////*/



const messages = {

    create: async (threadId, messages) => {
        try {
            return await openai.beta.threads.messages.create(
                threadId,
                { role: 'user', content: messages },
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
                'thread_abc123',
                'message_abc123',
                {
                    metadata: 
                    {
                        modified: 'true',
                        user: 'abc123',
                    },
                }
            );
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
};



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
                'thread_abc123',
                'run_abc123',
                {
                    metadata: {
                        user_id: 'user_abc123',
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
};



/*////////////////////////////// ASSISTANTS //////////////////////////////////*/



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
                order: 'desc',
                limit: '20',
            });
        } catch (error) {
            errorLog('listing assistants', error);
        }
    },

    response: async (session, userMessage) => {
        try {
            // Create a new message attached to a thread and then create a run from current thread
            const assistant = await session.assistant;
            const thread = await session.thread;
            await messages.create(thread.id, userMessage);
            const run = await runs.create(thread.id, assistant.id);
            session.runs.push(run);

            // Polling mechanism
            let currentRun = await runs.retrieve(thread.id, run.id);
            while (currentRun.status !== 'completed') {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                currentRun = await openai.runs.retrieve(thread.id, run.id);
                console.log('Processing answer...\n');
            }

            // Extract text from the last assistant response
            const messageList = await messages.list(thread.id);
            const lastMessage = await messageList.data
                .filter((message) =>
                    message.run_id === run.id
                    && message.role === 'assistant'
                ).pop();
            let response = lastMessage.content[0].text.value;

            // Obtain annotations from the response and elminate them if they exist. 
            let annotations = lastMessage.content[0].text.annotations[0];

            if (typeof (annotations) === 'undefined' && response) {
                return response;
            } else {
                response = response.replace(annotations.text, '');
                return response;
            }
        } catch (error) {
            errorLog('creating an assistant response', error);
        }
    },
};


/*/////////////////////////////// FILE MANAGER /////////////////////////////////*/



const fileman = {
    // Uploads a file for assistant base knowlege
    upload: async (filePath) => {
        try {
            return await openai.files.create({
                file: fs.createReadStream(filePath),
                purpose: 'assistants',
            });
        } catch (error) {
            errorLog('uploading file', error);
        }
    },

    // List uploaded files
    list: async () => {
        try {
            return await openai.files.list();
        } catch (error) {
            errorLog('listing files', error);
        }
    },
};


/*/////////////////////////////// SESSION MANAGER /////////////////////////////////*/


const session = {

    create: async (userId, message, sessions) => {
        try {
            const assistantId = process.env.ASSISTANT_ID;
            const assistant = await assistants.retrieve(assistantId);
            const thread = await threads.create();
            const newSession = {
                'userId': userId,
                'from': message.from,
                'assistant': assistant,
                'thread': thread,
                'runs': [],
                'messages': [
                    { 'user': message.body },
                ],
            };
            sessions.push(newSession);
            return newSession;
        } catch (error) {
            errorLog('creating a new session', error);
        }
    },

    update: async (userId, message, sessions) => {
        try {
            let updatedSession = {};
            for (const session of sessions) {
                if (session.userId === userId) {
                    updatedSession = session;
                    sessions = sessions.filter(elem => elem !== session);
                    updatedSession.messages.push({ 'user': message.body });
                    sessions.push(updatedSession);
                }
            }
            return updatedSession;
        } catch (error) {
            errorLog('updating sessions', error);
        }
    }
};

module.exports = {
    chat,
    threads,
    messages,
    runs,
    assistants,
    fileman,
    session,
};


