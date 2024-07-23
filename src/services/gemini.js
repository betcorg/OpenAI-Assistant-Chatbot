import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { promises as fs } from 'fs';
import { GEMINI_API_KEY } from '../configs/index.js';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const generationConfig = {
    /**
     * Cantidad máxima de tokens de salida: Especifica la cantidad máxima de tokens que se pueden generar en la respuesta. Un token tiene aproximadamente cuatro caracteres. 100 tokens corresponden a aproximadamente entre 60 y 80 palabras.
     */
    maxOutputTokens: 600,

    /**
     * Temperatura: La temperatura controla el grado de aleatorización en la selección de tokens. La temperatura se usa para el muestreo durante la generación de la respuesta, que se produce cuando se aplican topP y topK. Las temperaturas más bajas son buenas para las instrucciones que requieren una respuesta más determinística o menos abierta, mientras que las temperaturas más altas pueden generar resultados más diversos o creativos. Una temperatura de 0 es determinista, lo que significa que siempre se selecciona la respuesta de mayor probabilidad.
     */
    temperature: 0.7,
    /**
     * TopK: El parámetro topK cambia la manera en la que el modelo selecciona tokens para la salida. Un topK de 1 significa que el token seleccionado es el más probable entre todos los tokens en el vocabulario del modelo (también llamado decodificación codiciosa), mientras que un topK de 3 significa que el siguiente token se selecciona de los 3 más probables con la temperatura. Para cada paso de selección de tokens, se muestran los tokens topK con las probabilidades más altas. Los tokens se filtran aún más en función de topP con el token final seleccionado mediante el muestreo de temperatura.
     */
    // top_k: 5,

    /**
     * topP: El parámetro topP cambia la manera en la que el modelo selecciona tokens para la salida. Los tokens se seleccionan del más al menos probable hasta que la suma de sus probabilidades sea igual al valor de topP. Por ejemplo, si los tokens A, B y C tienen una probabilidad de 0.3, 0.2 y 0.1, y el valor de topP es 0.5, el modelo seleccionará A o B como el siguiente token mediante la temperatura y excluirá a C como candidato. El valor predeterminado de topP es 0.95.
     */
    // top_p: 0.5,
};

const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
];

export const createCompletion = async prompt => {
    try {
        const model = genAI.getGenerativeModel(
            { 
                model: 'gemini-1.5-pro-latest',
                maxOutputTokens: 500,
                temperature: 0.5,
            }
        );
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error(error);
    }
};

/**
 * Generates a chat response using a generative language model.
 *
 * @async
 * @function createChatCompletion
 * @param {string} geminiModel - The name of the language model to use.
 * @param {Array<object>} history - The message history of the chat.
 * @param {object} inputData - The input data for the current message.
 * @param {string} [inputData.systemInstruction] - The instruction for the model to follow.
 * @param {string} inputData.prompt - The user's text message.
 * @param {string} [inputData.imagePath] - The path to the image to send (optional).
 * @returns {Promise<object>} A promise that resolves with the model's response and the updated history.
 */
export const createChatCompletion = async (geminiModel, history, inputData) => {
    if (typeof geminiModel !== 'string') {
        throw new TypeError(`Generation model must be a string, but got ${typeof geminiModel}`);
    }

    if (!Array.isArray(history)) {
        throw new TypeError(`History must be an array, but got ${typeof history}`);
    }

    if (typeof inputData !== 'object' || inputData === null) {
        throw new TypeError(`Input data must be an object, but got ${typeof inputData}`);
    }

    if (typeof inputData.prompt !== 'string' || inputData.prompt.trim() === '') {
        throw new Error('Prompt must be a non-empty string.');
    }

    const model = genAI.getGenerativeModel({ model: geminiModel, safetySettings });

    const { systemInstruction = null, imagePath = null, prompt } = inputData;

    try {
        const chat = model.startChat({
            history,
            generationConfig,
            systemInstruction,
        });

        let parts;
        if (imagePath) {
            const imageData = await fs.readFile(imagePath);
            const extension = imagePath.match(/\.([a-z]+)$/i)?.[1];
            const mimeType = `image/${extension}`;

            const image = {
                inlineData: {
                    data: imageData.toString('base64'),
                    mimeType,
                },
            };
            parts = [prompt, image];
        } else {
            parts = [prompt];
        }

        const result = await chat.sendMessage(parts);
        const text = result.response.text();

        return {
            text,
            history: await chat.getHistory(),
        };
    } catch (error) {
        console.error('Error creating chat completion');
        throw error;
    }
};

