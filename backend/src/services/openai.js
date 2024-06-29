import OpenAI from 'openai';
import fs from 'fs';
import { errorLog } from '../utils/errorHandler.js';

const openai = new OpenAI(); 


/*/////////////////////////////// CHAT COMPLETION/////////////////////////////////*/


/**
 * A function that makes a request to the OpenAI chat completions endpoint. See the next link to dive into chat completions https://platform.openai.com/docs/api-reference/chat/create
 * @type {Function}
 * @param {Array} messages An array of objects that stores the  history chat.
 * @param {Object} config An object with parameters that modify the model response.
 * @property {String} [config.model = 'gpt-3.5-turbo-1106'] model ID of the model to use. See the model endpoint compatibility table for details on which models work with the Chat API. https://platform.openai.com/docs/modelsmodel-endpoint-compatibility 
 * @property {Number} [config.frequency_penalty = null] frequency_penalty Number between -2.0 and 2.0 Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim. 
 * @property {Integer} [config.max_tokens = 250] The maximum number of tokens to generate in the completion. 
 * @property {Number} [config.temperature = 1] What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or top_p but not both.
 * @property {Number} [config.top_p = null] An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered. We generally recommend altering this or temperature but not both.
 * @property {Integer} [config.n = 1] How many chat completion choices to generate for each input message. Note that you will be charged based on the number of generated tokens across all of the choices. Keep n as 1 to minimize costs.
 * @property {Array | String} [config.stop = null] Up to 4 sequences where the API will stop generating further tokens. 
 * @property {Boolean} [config.stream = null] If set, partial message deltas will be sent, like in ChatGPT. Tokens will be sent as data-only server-sent events as they become available, with the stream terminated by a data: [DONE] message.
 * @returns {Promise<string>}} Completion generated by the model passed in the arguments.
 */
const chatCompletion = async (messages, {
    frequency_penalty = null,
    max_tokens = 250,
    model = 'gpt-3.5-turbo-1106',
    n = 1,
    stop = null,
    stream = null,
    temperature = 1,
    top_p = null,

}) => {
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
    chatCompletion,
    createEmbedding,
    threads,
    messages,
    runs,
    assistants,
    fileman,
};


