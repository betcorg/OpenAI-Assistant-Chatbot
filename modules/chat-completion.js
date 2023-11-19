const OpenAI = require('openai');
const openai = new OpenAI();

async function chatCompletion(userText) {

    const params = {
        messages: [
            { role: "system", content: "Eres un asistente muy útil" },
            { role: "user", content: userText },
        ],
        model: "gpt-3.5-turbo",
        max_tokens: 150,
    }
    
    try {
        const completion = await openai.chat.completions.create(params);
        return completion.choices[0].message.content;

    } catch (error) {
        console.log('Error while creating chat completion', error);
    }

}

module.exports = chatCompletion;

