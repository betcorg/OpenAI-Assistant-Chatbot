import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.G_API_KEY);

export const generateContent = async (input, generationConfig) => {
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
};


export const createChat = async (chatHistory, generationConfig, input) => {

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

};

