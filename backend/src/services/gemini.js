const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.G_API_KEY);

/**
 *
 * @param {String} input
 * @returns {promise<string>}
 */
async function generateContent(input, generationConfig) {
    try {
        const model = genAI.getGenerativeModel(
            {
                model: 'gemini-pro',
                generationConfig: generationConfig,
            }
        );

        const result = await model.generateContent(input);

        return result.response.text();
    } catch (error) {
        console.error(`Error calling gemini.js - generateContent(): ${error.message}`, error);
    }
}

/**
 *
 * @param {Array} chatHistory
 * @param {Object} chatConfig
 * @param {String} input
 * @returns {promise<string>}
 */
async function createChat(chatHistory, generationConfig, input) {

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: generationConfig,
        });

        const result = await chat.sendMessage(input);
        return result.response.text();

    } catch (error) {
        console.error(`Error calling gemini.js - createChat(): ${error.message}`, error);
    }

}

module.exports = {
    generateContent,
    createChat,
};