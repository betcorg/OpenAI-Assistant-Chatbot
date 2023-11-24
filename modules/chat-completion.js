const OpenAI = require('openai');
const openai = new OpenAI();

async function chatCompletion(userMessage) {

    const params = {
        messages: [
            { role: "system", content: "Eres un asistente muy útil" },
            { role: "user", content: userMessage },
        ],
        model: "gpt-3.5-turbo-1106",
        max_tokens: 150,
    }
    
    try {
        const completion = await openai.chat.completions.create(params);
        return completion.choices[0].message.content;

    } catch (error) {
        console.log('Error while creating chat completion\n', error.message);
    }

}

module.exports = chatCompletion;

