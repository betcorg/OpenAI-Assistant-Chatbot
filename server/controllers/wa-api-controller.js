const whatsapp = require('../../modules/whatsapp');
const openai = require('../../modules/openai');
require('dotenv').config();


function verification(req, res) {

    try {
        const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN;
        const WEBHOOK_VERIFICATION_TOKEN = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (
            challenge != null
            && WEBHOOK_VERIFICATION_TOKEN !== null
            && WEBHOOK_VERIFICATION_TOKEN === WEBHOOK_TOKEN
        ) {
            res.send(challenge);
        } else {
            res.status(400).send();
        }

    } catch (error) {
        res.status(400).send();
    }
}

async function receiveMessage(req, res) {

    try {
        const messages = req.body.entry[0].changes[0].value.messages;

        if (typeof (messages) !== 'undefined') {

            const codeMX = /^52/;
            let userNumber = messages[0].from;
            if (codeMX.test(userNumber)) userNumber = userNumber.replace(/^...(.)/, '52' + '$1');
            const userText = messages[0].text.body;
            const instructions = 'You are a very useful assistant';
            const response = await openai.chat.completion(instructions, userText);

            whatsapp.send.text(response, userNumber);
        }

        res.send('EVENT_RECEIVED');
    } catch (error) {

        console.log(error);
        res.send('EVENT_RECEIVED');
    }
}

module.exports = {
    verification,
    receiveMessage,
}