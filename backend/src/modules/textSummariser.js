import { encode } from 'gpt-3-encoder';
import * as openai from '../services/openai.js';
import * as gemini from '../services/gemini.js';


let requests = 0;
const ChunkSize = 4000;
let currentModel = 'gemini-pro';

/** 
 * Use Gemini-pro model for summarization
 */
export const useGemini = async (prompt) => {
    const generationConfig = {
        // stopSequences: ["red"],
        maxOutputTokens: ChunkSize,
        temperature: 0.1,
        // topP: 0.1,
        // topK: 16,
    };
    requests++;
    return await gemini.generateContent(prompt, generationConfig);
};

/** 
 * Use chatGPT model for summarization
 */
export const useChatGPT = async (prompt) => {
    const messages = [
        { 'role': 'user', 'content': prompt },
    ];
    const config = {
        model: 'gpt-3.5-turbo-1106',
        max_tokens: ChunkSize,
        temperature: 0.1,
    };

    const response = await openai.chatCompletion(
        messages,
        config,
    );
    requests++;
    return response;
};

/**
 * 
 * @param {String} chunk A piece of text to be summarised
 * @param {number} maxWords An integer that indicates the size (in words) of the output summary.
 * @param {String} model The name of the model to be used for summarisation. 
 * @returns 
 */
export const summariseChunk = async (chunk, maxWords, model = currentModel) => {
    console.log('[*] Summarising chunk');

    let condition = '';
    if (maxWords) {
        condition = `El resumen debe tener una extensión final de ${maxWords} palabras.`;
    }

    try {
        const prompt = `Analiza el siguiente texto y has un resumen conservando la estructura original del texto (con encabezados y su contenido). Conserva las ideas principales en cada subtema. El resumen debe ser lo más fiel posible a la información principal manteniendo la coherencia y el orden de los temas. Escribe el sesumen en formato markdown. ${condition}\n
        Texto:\n"""${chunk}"""`;
        let response = '';

        switch (model) {
        case 'gpt-3.5-turbo-1106':
            console.log('[>>] Using gpt-3.5-turbo-1106');
            response = await useChatGPT(prompt);
            break;
        case 'gemini-pro':
            console.log('[>>] Using gemini-pro');
            response = await useGemini(prompt);
            break;
        default:
            break;
        }
        return response;

    } catch (error) {
        console.log('An error occured while summarising chunk', error);
        throw new Error(error);
    }
};

/**
 * 
 * @param {Array} chunks An array of strings, each string representing a chunk of text to be summarised.
 * @returns A String with all the chunks summarised together.
 */
export const summariseChunks = async (chunks) => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const summarisedChunks = await Promise.all(chunks.map(async chunk => {
        await delay(500);
        return await summariseChunk(chunk);
    }));

    const conncatText = summarisedChunks.join(' ');

    return conncatText;
};

/**
 * 
 * @param {String} sentence A string that represents a sentense in the text.
 * @param {Number} maxChunkSize A number that represents the max tokens in the chunk
 * @returns An array of strings, each string representing a chunk of text to be summarised.
 */
export const splitSentence = (sentence, maxChunkSize) => {
    console.log('[*] Splitting sentence');

    const sentenceChunks = [];
    let partialChunk = '';
    const words = sentence.split(' ');

    words.forEach((word) => {

        if (calculateTokens(partialChunk + word) < maxChunkSize) {
            partialChunk += word + '.';
        } else {
            sentenceChunks.push(partialChunk.trim());
            partialChunk = word + '.';
        }

    });

    if (partialChunk) {
        sentenceChunks.push(partialChunk.trim());
    }
    return sentenceChunks;
};

/**
 * 
 * @param {String} text The hole text extracted from a pdf or a website
 * @param {Number} maxChunkSize An integer that indicates the max tokens in the chunk
 * @returns An array of strings, each string representing a chunk of text to be summarised.
 */
export const splitTextIntoChunks = (text, maxChunkSize) => {

    const chunks = [];
    let currentChunk = '';
    const sentences = text.split('.');

    sentences.forEach((sentence) => {

        if (calculateTokens(currentChunk) > maxChunkSize) {
            const sentenceChunks = splitSentence(currentChunk, maxChunkSize);
            chunks.push(...sentenceChunks);
        }

        if (calculateTokens(currentChunk + sentence) < maxChunkSize) {
            currentChunk += sentence + '.';
        } else {
            chunks.push(currentChunk.trim());
            currentChunk = sentence + '.';
            console.log(`Chunk: ${chunks.length} ready`);
        }
    });

    if (currentChunk) {
        chunks.push(currentChunk.trim());
        console.log(`Chunk: ${chunks.length} ready`);
    }
    return chunks;
};

export const calculateTokens = (text) => encode(text).length;

/**
 * 
 * @param {String} text The text to be summarised.
 * @param {Number} maxWords An integer that indicates the model how long you want the output be in words.
 * @param {String} model The model to be used for summarisation.
 * @returns 
 */
export const textSummariser = async (text, maxWords, model) => {
    currentModel = model;

    console.log('[*] PDF Size (tokens): ', calculateTokens(text));

    let summarisedText = text;

    console.log('[*] Splitting pdf text into chunks');
    while (calculateTokens(summarisedText) > ChunkSize) {
        const textChunks = splitTextIntoChunks(summarisedText, ChunkSize);
        summarisedText = await summariseChunks(textChunks);
    }
    console.log('[*] Generating summarised response');

    const response = await summariseChunk(summarisedText, maxWords, currentModel);

    console.log('[>>] AI Requests:', requests);
    requests = 0;
    return response;
};
