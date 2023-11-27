const chatCompletion = require('../modules/chat-completion');
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
        const completion = await chatCompletion(userQuestion);
        console.log(completion);
    }
}
main();