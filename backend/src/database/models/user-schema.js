import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    role:  {type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    assistants: { type: Array, default: [] },
    // assistants_sessions: { type: Array, default: [] },
}, { timestamps: true });

export default mongoose.model('User', userSchema, 'users'); 


/* const user = {
    name: 'Humberto Franc',
    email: 'asmin@mail.com',
    password: 'ueour785nORImiWR4SG',
    assistants: [
        {
            assistant_id: 'asst-986080890',
            assistant_sessions: [
                {
                    chat_id: '7389807079',
                    customer_phone_number: '522279884850',
                    assistant: 'asst-986080890',
                    thread: 'thread-h73070784987',
                    runs: [],
                    messages: [
                        { user: 'Hola' },
                        { assistant: 'Hola, ¿en qué puedo ayudarte' },
                    ],
                }
            ],
        }
    ],
}; */

