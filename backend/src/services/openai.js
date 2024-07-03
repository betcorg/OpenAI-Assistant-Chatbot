import OpenAI from 'openai';
import fs from 'fs';
import { errorLog } from '../utils/errorHandler.js';

const openai = new OpenAI(); 


/*/////////////////////////////// CHAT COMPLETION/////////////////////////////////*/


/**
 * Generates a chat completion using the OpenAI API.
 *
 * @async
 * @param {Array<Object>} messages - An array of messages comprising the conversation history.
 * @param {Object} [options] - Optional parameters for the chat completion.
 * @param {number} [options.frequency_penalty=null] - Controls the model's tendency to repeat itself.
 * @param {number} [options.max_tokens=250] - The maximum number of tokens to generate.
 * @param {string} [options.model='gpt-3.5-turbo'] - The ID of the model to use.
 * @param {number} [options.n=1] - The number of chat completion choices to generate.
 * @param {string|Array<string>} [options.stop=null] - A sequence or array of sequences where the API will stop generating further tokens.
 * @param {boolean} [options.stream=null] - Whether to stream back partial progress.
 * @param {number} [options.temperature=1] - Controls the randomness of the model's output.
 * @param {number} [options.top_p=null] - Controls the diversity of the model's output.
 * @returns {Promise<string>} The content of the generated chat completion.
 * @throws {Error} If there is an error creating the chat completion.
 */
export const createChatCompletion = async (messages, {
    frequency_penalty = null,
    max_tokens = 250,
    model = 'gpt-3.5-turbo',
    n = 1,
    stop = null,
    stream = null,
    temperature = 1,
    top_p = null,

} = {}) => {
    const params = {
        messages: messages,
        frequency_penalty,
        max_tokens,
        model,
        n,
        stop,
        stream,
        temperature,
        top_p,
    };

    try {
        console.log('[+] Generating chat completion...');
        const completion = await openai.chat.completions.create(params);
        return completion.choices[0].message.content;

    } catch (error) {
        errorLog('creating chat completion', error);
        throw error;
    }
};


/*/////////////////////////////////////// EMBEDDINGS ///////////////////////////////////////*/


/**
 * 
 * @param {String} input A word or text to be transfomed into an embedding representation.
 * @returns {Promise<Array>} An array of numbers that represent the embedding of the input.
 */
const createEmbedding = async (input) => {

    try {
        console.log('[+] Generating embedding...');
        const embedding = await openai.embeddings.create({
            model: 'text-embedding-ada-002',
            input: input,
            encoding_format: 'float',
        });
        return embedding.data[0].embedding;

    } catch (error) {
        errorLog('creating an embedding', error);
        throw error;
    }

};



/*/////////////////////////////////////// THREADS ///////////////////////////////////////*/



const threads = {
    // Creates a new thread with optional message
    create: async function () {
        try {
            return await openai.beta.threads.create();
        } catch (error) {
            errorLog('creating thread', error);
        }
    },

    // Update the thread metadata
    update: async function (threadId, metadata) {
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
    retrieve: async function (threadId) {
        try {
            return await openai.beta.threads.retrieve(threadId);
        } catch (error) {
            errorLog('retrieving a thread', error);
        }
    },

    // Deletes a thread
    delete: async function (threadId) {
        try {
            return await openai.beta.threads.del(threadId);
        } catch (error) {
            errorLog('deleting a thread', error);
        }
    },
};



/*///////////////////////////// MESSAGES ///////////////////////////////////*/



const messages = {

    create: async function (threadId, messages) {
        try {
            return await openai.beta.threads.messages.create(
                threadId,
                { role: 'user', content: messages },
            );
        } catch (error) {
            errorLog('creating a message', error);
        }
    },

    retrieve: async function (threadId, messageId) {
        try {
            return await openai.beta.threads.messages.retrieve(
                threadId,
                messageId,
            );
        } catch (error) {
            errorLog('retrieving messages', error);
        }
    },

    // Funcion incompleta
    update: async function () {
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


    list: async function (threadId) {
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
    create: async function (threadId, assistantId) {
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
    retrieve: async function (threadId, runId) {
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
    update: async function () {
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
    list: async function (threadId) {
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

    /*
    * This function creates a new assistant with the given parameters.
    * Refer the nex link for more information about the params needed to create a new assistant:
    * https://platform.openai.com/docs/api-reference/assistants/createAssistant
    */
    create: async function (params) {
        try {
            return await openai.beta.assistants.create(params);
        } catch (error) {
            errorLog('creating a new assistant', error);
            throw error;
        }
    },

    /*
    * This function retrieves an assistant by its id.
    * For more information about retrieving an assistant visit the link bellow:
    * https://platform.openai.com/docs/api-reference/assistants/getAssistant
    */
    retrieve: async function (assistantId) {
        try {
            return await openai.beta.assistants.retrieve(assistantId);
        } catch (error) {
            errorLog('retrieving an assistant', error);
            throw error;
        }
    },

    /*
    * This function updates an existing assistant with the given parameters.
    * Refer the nex link for more information about the params needed to update a new assistant:
    * https://platform.openai.com/docs/api-reference/assistants/modifyAssistant
    */
    update: async function (id, params) {
        try {
            return await openai.beta.assistants.update(
                id,
                params,
            );
        } catch (error) {
            errorLog('updating an assistant', error);
            throw error;
        }
    },


    /*
    * This function deletes an existing assistant with the given id.
    * For more information about deleting an assistant visit the link bellow:
    * https://platform.openai.com/docs/api-reference/assistants/deleteAssistant
    */
    delete: async function (assistantId) {
        try {
            return await openai.beta.assistants.del(assistantId);
        } catch (error) {
            errorLog('deleting an assistant', error);
            throw error;
        }
    },

    // List existing assistants
    list: async function () {
        try {
            return await openai.beta.assistants.list({
                order: 'desc',
                limit: '20',
            });
        } catch (error) {
            errorLog('listing assistants', error);
            throw error;
        }
    },

    response: async function (session, userMessage) {
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
    upload: async function (filePath) {
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
    list: async function () {
        try {
            return await openai.files.list();
        } catch (error) {
            errorLog('listing files', error);
        }
    },
};


/*/////////////////////////////// SESSION MANAGER /////////////////////////////////*/




export {
    createEmbedding,
    threads,
    messages,
    runs,
    assistants,
    fileman,
};


