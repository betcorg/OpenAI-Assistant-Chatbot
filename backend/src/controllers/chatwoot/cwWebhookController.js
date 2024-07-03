
import fs from 'fs';
import Chatwoot from '../../services/chatwoot.js';
import Customer from '../../database/models/customerModel.js';
import { createChatCompletion } from '../../services/openai.js';

const chatwoot = new Chatwoot({ account_id: 3 });

export const webhookController = async (req, res) => {

    const payload = req.body;
    const messageType = payload?.message_type;

    if (messageType === 'incoming') {
        console.log('[+] ==> Mensaje entante');
        fs.writeFileSync('./payloads/incoming-tg-msg.json', JSON.stringify(payload));

        const conversation = payload?.conversation;
        const { messages, meta, channel, labels } = conversation;
        const { inbox_id, conversation_id, content } = messages[0];
        const { name, phone_number } = meta.sender;


        let customer = await Customer.findOne({ conversation_id });

        if (!customer) {
            customer = new Customer({
                name,
                channel,
                phone_number,
                conversation_id,
                inbox_id,
                chatwoot_context: meta,
            });
            await customer.save();
        }

        if(content === '/reset') {
            customer.messages = [];
            customer.save();
            return;
        }

        const needsHumanAgent = labels.find(label => label === 'human_assistance');
        if (needsHumanAgent) {
            console.log('[i] Customer need human assistance');
            return;
        };

        const history = customer.messages;
        history.push({ role: 'user', content });
        const response = await createChatCompletion(history, {
            model: 'gpt-3.5-turbo',
            max_tokens: 800,
            temperature: 1,
        })

        history.push({ role: 'assistant', content: response });

        await chatwoot.createMessage(customer.conversation_id, {
            content: response,
            message_type: 'outgoing',
        });
        await customer.save();

    } else if (messageType === 'outgoing') {
        console.log('[+] ==> Mensaje saliente');
        fs.writeFileSync('./payloads/outgoing-tg-msg.json', JSON.stringify(payload));
    }
    res.status(200);
}