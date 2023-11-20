const OpenAI = require('openai');
const openai = new OpenAI();
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
});

// creates a comand line interface and returns the user answer
async function askQuestion(question) {
    return new Promise((resolve) => {
        readline.question(question, (answer) => {
            resolve(answer);
        });
    });
}

async function main() {

    // Keeps the prompt alive
    let keepAsking = true;
    while (keepAsking) {
        const userQuestion = await askQuestion("\n>>> ");
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "Eres un asistente genial" },
                { role: "user", content: userQuestion },
            ],
            model: "gpt-3.5-turbo",
            max_tokens: 250,
        });

        console.log('\n'+completion.choices[0].message.content);
    }
}
main();