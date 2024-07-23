
import fs from 'fs';
import Chatwoot from '../../services/chatwoot.js';
import Customer from '../../database/models/customerModel.js';
import { createChatCompletion } from '../../services/openai.js';
import { createCompletion } from '../../services/gemini.js';


const chatwoot = new Chatwoot({ account_id: 3 });

export const webhookController = async (req, res) => {

    const payload = req.body;
    const messageType = payload?.message_type;
    fs.writeFileSync('./payloads/payload.json', JSON.stringify(payload));


    if (messageType === 'incoming') {
        console.log('[+] ==> Mensaje entante');
        fs.writeFileSync('./payloads/incoming-tg-msg.json', JSON.stringify(payload));

        const conversation = payload?.conversation;
        const { messages, meta, channel, labels } = conversation;
        const { inbox_id, conversation_id, content } = messages[0];
        const { name, phone_number } = meta.sender;

        /**
         * Database handler
         */
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


        /**
         * Resets the conversation context
         */
        if (content === '/reset') {
            customer.messages = [];
            customer.save();
            return;
        }


        /**
         * Filters if the customer needs to talk to  human agent
         */
        const needsHumanAgent = labels.find(label => label === 'human_assistance');
        if (needsHumanAgent) {
            console.log('[i] Customer need human assistance');
            return;
        };



        const params = {
            model: 'gpt-3.5-turbo',
            max_tokens: 800,
            temperature: 1,
            tools: ['getBaseKnowledge'], // This tool retrieves base knowledge context
            tool_choice: 'auto', // The model decides automatically whether tu run a tool function or not
        };
        const context = customer.context !== ''
            ? `Sobre el cliente actual:\n\n${customer.context}`
            : '';
            
        const instructions = `Actúa como una agente de atención al cliente, muy amable y persuasiva, tu nombre es Alma.\nTu tarea es brindar información sobre nuestra guía digital de joyería y artesanías con resina epoxi, la cual es ideal para amantes del bricolaje, las manualidades y el emprendimiento, debes generar interés en nuestros prospectos resaltando los beneficios de nuestra guía.\nEl precio se puede consultar en el siguiente enlace, el cual, únicamente deberás enviar cuando el cliente te lo pida o muestre interés en comprar: https://hotm.art/guiaJoyeriayArtesaniasDESC55.\nEn tarea conversarás con un cliente real, si su pregunta se relaciona a nuestros productos o servicios harás una llamada a la función \`getBaseKnowledge\` para obtener un contexto si éste es necesario para dar una respuesta más coherente. Si la pregunta del cliente está relacionada con el contexto obtenido, responde basándote en esa información.\nSi no se proporciona un contexto, responde basándote en el historial de mensajes de esta conversación y estas intrucciones.\n\n${context}`;

        const history = customer.messages;

        if (history.length === 0) {
            history.push({ role: 'system', content: instructions });
        }
        history.push({ role: 'user', content });

        const response = await createChatCompletion(history, params);
        console.log({ usage: response.usage });

        /**
         * Sends the response through the Chatwoot API
         */
        await chatwoot.createMessage(customer.conversation_id, {
            content: response.text,
            message_type: 'outgoing',
        });

        history.push({ role: 'assistant', content: response.text });

        // Summarizes the chat history if reaches the rate limit.
        const chatSummary = await summarizeCustmerChat(customer, history, 10);

        customer.context = chatSummary;
        customer.messages = [];

        await customer.save();

    } else if (messageType === 'outgoing') {
        console.log('[+] ==> Mensaje saliente');
        fs.writeFileSync('./payloads/outgoing-tg-msg.json', JSON.stringify(payload));
    }
    res.status(200);
};


export const summarizeCustmerChat = async (customer, history, rate) => {

    /**
     * If chat history has more than n messages then it will summarize the chat content
     * for a minor token consumption
     */
    if (history.length > rate) {
        let chat = '';
        history.forEach(message => {
            if (message.role === 'user') {
                chat += `Cliente: ${message.content}\n\n`;
            } else if (message.role === 'assistant' && !message.tool_calls) {
                chat += `Agente: ${message.content}\n\n`;
            }
        });

        console.log({ chat });
        const pastConversation = customer.context !== ''
            ? `2. Fusiona el resumen con el siguiente contexto en un texto de 100 palabras de modo que sirva como referencia de sus conversaciones pasadas.\n\ntexto:"""${customer.context}"""`
            : '';
        const summary = await createCompletion(`1. Crea un resumen corto de la siguiene conversación, incluye solo aspectos relevantes de la conversación que permitan perfilar al cliente:\n"""${chat}"""\n${pastConversation}`);
        console.log({ summary });
        return summary;
    }
    return '';
};