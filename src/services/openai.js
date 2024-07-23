import OpenAI from 'openai';
import fs from 'fs';
import { errorLog } from '../utils/errorHandler.js';
import loadTools from '../modules/openai/tools/index.js';

const openai = new OpenAI();


/*/////////////////////////////// CHAT COMPLETION/////////////////////////////////*/


const getToolFunctions = async (tools) => {

    try {
        // Load available tool functions and their schemas
        const agentTools = await loadTools();
        const toolSchemas = agentTools.schemas;
        const toolFunctions = agentTools.functions;
        let toolChoices = [];

        // Filter tools based on the provided tool names
        tools.forEach(toolName => {
            // Find the tool schema that matches the provided tool name
            const tool = toolSchemas.find(tool => tool.function.name === toolName);
            toolChoices.push(tool);
        });

        // Return the imported tool functions and current tools
        return {
            toolFunctions,
            toolChoices,
        };

    } catch (error) {
        console.error('[!] Error importing tool functions:', error.message);
        throw error;
    }
};

export const completion = async (params) => {

    try {

        console.log('[+] Generating completion...');
        const response = await openai.chat.completions.create(params);
        return response;

    } catch (error) {
        console.error('Error crceating completion');
        throw error;
    }
};


const callChosenFunctions = async (responseMessage, functions, messages) => {

    try {
        // Pushes the message that contain the tool arguments obtained in the first completion
        messages.push(responseMessage);

        // Extract the tool calls from the response message
        const toolCalls = responseMessage.tool_calls;

        // Iterate over each tool call
        for (const tool of toolCalls) {
            // Extract the tool ID, name, and arguments
            const id = tool.id;
            const name = tool.function.name;
            const args = JSON.parse(tool.function.arguments);

            // Get the current function based on the tool name
            const currentFunction = functions[name];

            let functionResponse = await currentFunction(args);

            // Check if the function response is valid
            if (!functionResponse) {
                throw new Error('Function response missing');
            }

            // Add the function response to the tool messages
            messages.push({
                tool_call_id: id,
                role: 'tool',
                name: name,
                content: JSON.stringify(functionResponse),
            });
        }

        return messages;

    } catch (error) {
        console.error('[!] Error at callChosenFunctions:', error.message);
        throw error;
    }
};


/**
 * 
 * @param {Array} messages An array or list of messages comprising the conversation so far.
 * @param {Object} params An object that contains all the parameters for the text generation.
 * @param {String} params.model ID of the model to use. See the model endpoint compatibility table for details on which models work with the Chat API.
 * @param {Number} params.max_tokens The maximum number of tokens that can be generated in the chat completion.
 * @param {Number} params.temperature What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. We generally recommend altering this or top_p but not both.
 * @param {String} params.user A unique identifier representing your end-user, which can help OpenAI to monitor and detect abuse.
 * @param {Object} params.tools A list of tools the model may call. Currently, only functions are supported as a tool. Use this to provide a list of functions the model may generate JSON inputs for. A max of 128 functions are supported.
 * @param {String|Object} params.tool_choice Controls which (if any) tool is called by the model. none means the model will not call any tool and instead generates a message. auto means the model can pick between generating a message or calling one or more tools. required means the model must call one or more tools. Specifying a particular tool via {"type": "function", "function": {"name": "my_function"}} forces the model to call that tool.
 * @returns {Object} Return an object containing the generated text and usage information.
 */
export const createChatCompletion = async (messages, {
    model = 'gpt-3.5-turbo',
    max_tokens = 500,
    temperature = 1,
    user,
    tools,
    tool_choice,
    headless_tool_response,

}) => {

    try {

        const params = {
            messages,
            model,
            max_tokens,
            temperature,
            user,
        }

        // Check if tools are provided and if they are valid
        if (tools && tools.length > 0) {

            // Import tool functions from the available tools list
            const { toolFunctions, toolChoices } = await getToolFunctions(tools);

            // Generate the first tool chat completion using OpenAI's chat completion API
            params.tools = toolChoices;
            params.tool_choice = tool_choice;

            const response = await completion(params);

            // Extract the response message and check for tool calls
            const responseMessage = response.choices[0].message;

            /**
             * if the message response includes tool calls will try to run all the calls
             * and call again the OpenAI API
             */
            if (responseMessage.tool_calls) {

                console.log('[+] Tool calls detected:', responseMessage.tool_calls);

                // Call the chosen tool functions and inject the tool respinses into the message array
                const toolsResponse = await callChosenFunctions(responseMessage, toolFunctions, messages);

                if (headless_tool_response) {
                    const usage = response.usage;
                    return {
                        toolsResponse,
                        usage,
                    };
                }

                // Generate the second tool chat completion using OpenAI's chat completion API
                const secondResponse = await completion(params);

                // Extract the generated text and usage information
                const text = secondResponse.choices[0].message.content;
                const firstUsage = response.usage;
                const secondUsage = secondResponse.usage;
                const { prompt_tokens, completion_tokens, total_tokens } = firstUsage;
                const usage = {
                    prompt_tokens: prompt_tokens + secondUsage.prompt_tokens,
                    completion_tokens: completion_tokens + secondUsage.completion_tokens,
                    total_tokens: total_tokens + secondUsage.total_tokens,
                };

                return {
                    text,
                    usage,
                };

            } else {

                console.log('[+] Response generated, not tool calls detected...');
                const text = responseMessage.content;
                const usage = response.usage;
                return {
                    text,
                    usage,
                };
            }

        } else {

            // Generate a regular chat completion using OpenAI's chat completion API
            try {
                console.log('[+] Generating regular chat completion...');
                const response = await completion(params)

                console.log('[+] Response generated...');
                const usage = response.usage;
                const text = response.choices[0].message.content;
                console.log({ usage });
                return {
                    text,
                    usage,
                };

            } catch (error) {
                console.error('[!] Error while creating regular chat completion', error.message);
                throw error;
            }
        }

    } catch (error) {
        console.error('[!] Error at chatGPTCompletion:', error.message);
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
            model: 'text-embedding-3-small',
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


