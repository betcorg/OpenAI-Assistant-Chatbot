const { encode } = require('gpt-3-encoder');
const openai = require('../services/openai');
const gemini = require('../services/gemini');

let requests = 0;
const ChunkSize = 4000;

/** 
 * Use Gemini-pro model for summarization
 */
const useGemini = async (prompt) => {
    requests++;
    return await gemini.generateContent(prompt);
};

/** 
 * Use chatGPT model for summarization
 */
const useChatGPT = async (prompt) => {
    requests++;
    const messages = [
        { 'role': 'user', 'content': prompt },
    ];
    const config = {
        model: 'gpt-3.5-turbo-1106',
        max_tokens: ChunkSize,
        temperature: 1,
    };

    const response = await openai.chatCompletion(
        messages,
        config,
    );
    return response;
};

/**
 * 
 * @param {String} chunk A piece of text to be summarised
 * @param {number} maxWords An integer that indicates the size (in words) of the output summary.
 * @param {String} model The name of the model to be used for summarisation. 
 * @returns 
 */
const summariseChunk = async (chunk, maxWords, model = 'gemini-pro') => {
    console.log('[*] Summarising chunk');

    let condition = '';
    if (maxWords) {
        condition = ` con una extesión de ${maxWords} palabras`;
    }

    try {
        const prompt = `Haz un resumen del siguiente texto${condition}: \n"""${chunk}"""\n Identifica las ideas principales, organiza y desarrolla el contenido de modo que sea fácil de leer y comprender. Evita mencionar "El texto se trata de..." y despliega directamente la información en formato markdown`;
        let response = '';

        switch (model) {
        case 'gpt-3.5-turbo-1106':
            response = await useChatGPT(prompt);
            break;
        case 'gemini-pro':
            response = await useGemini(prompt);
            break;  // Asegúrate de agregar este break para evitar la ejecución del siguiente caso accidentalmente
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
const summariseChunks = async (chunks) => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const summarisedChunks = await Promise.all(chunks.map(async chunk => {
        await delay(200);
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
const splitSentence = (sentence, maxChunkSize) => {
    console.log('[*] Splitting sentence');

    const sentenceChunks = [];
    let patialChunk = '';
    const words = sentence.split(' ');

    words.forEach((word) => {

        if (calculateTokens(patialChunk + word) < maxChunkSize) {
            patialChunk += word + '.';
        } else {
            sentenceChunks.push(patialChunk.trim());
            patialChunk = word + '.';
        }

    });

    if (patialChunk) {
        sentenceChunks.push(patialChunk.trim());
    }
    return sentenceChunks;
};

/**
 * 
 * @param {String} text The hole text extracted from a pdf or a website
 * @param {Number} maxChunkSize An integer that indicates the max tokens in the chunk
 * @returns An array of strings, each string representing a chunk of text to be summarised.
 */
const splitTextIntoChunks = (text, maxChunkSize) => {
    console.log('[*] Splitting pdf text into chunks');

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
        }

    });

    if (currentChunk) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
};

const calculateTokens = (text) => encode(text).length;

/**
 * 
 * @param {String} text The text to be summarised.
 * @param {Number} maxWords An integer that indicates the model how long you want the output be in words.
 * @param {String} model The model to be used for summarisation.
 * @returns 
 */
const textSummariser = async (text, maxWords, model) => {

    let summarisedText = text;

    while (calculateTokens(summarisedText) > ChunkSize) {
        const textChunks = splitTextIntoChunks(summarisedText, ChunkSize);
        summarisedText = await summariseChunks(textChunks);
    }

    console.log('[*] Summary done');
    console.log('[*] Generating summarised response');
    console.log('PDF Size (tokens): ', calculateTokens(text));
    console.log('AI Requests:', requests);
    requests = 0;

    return await summariseChunk(summarisedText, maxWords, model);
};


module.exports = {
    textSummariser,
};