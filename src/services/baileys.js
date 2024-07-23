
import { makeWASocket, DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';

const authFolder = 'auth_info_baileys';

class WaClient {

    constructor() {
        this.sock = null;
    }

    async login(callback) {

        try {

            const { state, saveCreds } = await useMultiFileAuthState(authFolder);

            this.sock = makeWASocket({
                auth: state,
                printQRInTerminal: true,
            });

            this.sock.ev.on('creds.update', saveCreds);

            this.sock.ev.on('connection.update', callback);

        } catch (error) {
            console.log('[!] Error during WhatsApp connection');
        }

    }

     /**
     * Attempts to reconnect if the last disconnect was not a logout.
     * @param {object} lastDisconnect - The last disconnect event object.
     */
    async connectionKeeper(lastDisconnect) {
        const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
        console.log('[-] Connection closed due to:', lastDisconnect.error, ', reconnecting:', shouldReconnect);
        if (shouldReconnect) {
            await this.login();
        }
    }

       /**
     * Sets up a listener for new messages.
     * @param {function(Array<object>, string):void} callback - Callback function to handle new messages. 
     * It receives two arguments: `messages` (recived message) and `type` (a string indicating the type of update).
     */
    onMessagesUpsert(callback) {
        this.sock.ev.on('messages.upsert', callback);
    }

     /**
     * Sends a text message.
     * @param {string} id - WhatsApp ID of the recipient.
     * @param {string} message - Text message to send.
     */
    async sendMessage(id, message) {
        await this.sock.sendMessage(id, { text: message });
    }
}

export const whatsapp = new WaClient();



