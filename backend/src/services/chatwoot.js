import axios from 'axios';
import { CHATWOOT_TOKEN, CHATWOOT_BASE_URL } from '../configs/index.js';

const basePath = '/api/v1/accounts';
const appBaseURL = `${CHATWOOT_BASE_URL}/${basePath}`;
const platfomrBaseURL = `${CHATWOOT_BASE_URL}/platform${basePath}`
const clientBaseURL = `${CHATWOOT_BASE_URL}/client${basePath}`
const srveyBaseURL = `${CHATWOOT_BASE_URL}/survey${basePath}`

/* 
 * The Chatwoot class is a JavaScript class that provides methods for interacting with the Chatwoot API. 
*/
export default class Chatwoot {

    constructor({account_id}) {
        this.accountId = account_id;
    }

    async _request(method, data, baseURL, endpoint) {
        try {
            const response = await axios({
                method,
                url: `${baseURL}/${this.accountId}/${endpoint}`,
                headers: {
                    'api_access_token': CHATWOOT_TOKEN,
                    'Content-Type': 'application/json; charset=utf-8',
                },
                data,
            });
            return response.data;

        } catch (error) {
            throw error;
        }
    }


    /**
     * List all the contacts
     * @async
     * @param {Object} data - Query parameters.
     * @param {string} [data.sort] - The attribute by which the list should be sorted. 
     * Possible values are: "name", "email", "phone_number", "last_activity_at", "-name", "-email", "-phone_number", "-last_activity_at".
     * @param {number} [data.page=1] - The page number.
     * @returns {Promise<Object>} A promise that resolves with the list of contacts.
     */
    async listContacts(data) {
        return await this._request('GET', data, appBaseURL, '/contacts');
    }

    /**
     * Creates a new contact.
     * @async
     * @param {Object} data - The contact data.
     * @param {number} data.inbox_id - The numeric ID of the inbox.
     * @param {string} data.name - Name of the contact.
     * @param {string} data.email - Email of the contact.
     * @param {string} data.phone_number - Phone number of the contact.
     * @param {string} [data.avatar] - Send the form data with the avatar image binary.
     * @param {string} [data.avatar_url] - The url to a jpeg, png file for the contact avatar.
     * @param {string} [data.identifier] - A unique identifier for the contact in external system.
     * @param {Object} [data.custom_attributes] - An object where you can store custom attributes for contact.
     * @returns {Promise<Object>} The created contact data.
     */
    async createContact(data) {
        return await this._request('POST', data, appBaseURL, '/contacts');
    }

    /**
     * Creates a new conversation.
     * @async
     * @param {Object} data - The conversation data.
     * @param {string} data.source_id - Conversation source id.
     * @param {string} data.inbox_id - Id of inbox in which the conversation is created. Allowed Inbox Types: Website, Phone, Api, Email
     * @param {string} data.contact_id - Contact Id for which conversation is created.
     * @param {Object} [data.additional_attributes] - Lets you specify attributes like browser information.
     * @param {Object} [data.custom_attributes] - The object to save custom attributes for conversation, accepts custom attributes key and value.
     * @param {string} [data.status] - Specify the conversation whether it's pending, open, closed. Enum: "open" "resolved" "pending"
     * @param {string} [data.assignee_id] - Agent Id for assigning a conversation to an agent.
     * @param {string} [data.team_id] - Team Id for assigning a conversation to a team.
     * @param {Object} [data.message] - The initial message to be sent to the conversation.
     * @param {string} data.message.content - The message content.
     * @param {Object} [data.message.template_params] - Template parameters for the message.
     * @returns {Promise<Object>} The created conversation data.
     */
    async createConversation(data) {
        return await this._request('POST', data, appBaseURL, '/conversations');
    }

    /**
     * Creates a new message in the conversation.
     * @async
     * @param {number} conversationId - The numeric ID of the conversation.
     * @param {Object} data - The message data.
     * @param {string} data.content - The content of the message.
     * @param {string} [data.message_type] -  Enum: "outgoing" "incoming"
     * @param {boolean} [data.private] - Flag to identify if it is a private note.
     * @param {string} [data.content_type] -  Enum: "input_email" "cards" "input_select" "form" "article". If you want to create custom message types.
     * @param {Object} [data.content_attributes] - attributes based on your content type
     * @param {Object} [data.template_params] - The template params for the message in case of whatsapp Channel.
     * @param {string} data.template_params.name - The name of the template.
     * @param {string} data.template_params.category - The category of the template.
     * @param {string} data.template_params.language - The language of the template.
     * @param {Object} data.template_params.processed_params - Processed parameters for the template.
     * @returns {Promise<Object>} The created message data.
     */
    async createMessage(conversationId, data) {
        return await this._request('POST', data, appBaseURL, `/conversations/${conversationId}/messages`);
    }
}
