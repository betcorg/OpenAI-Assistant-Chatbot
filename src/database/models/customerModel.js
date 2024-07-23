import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: { type: String},
    channel: { type: String},
    phone_number: { type: String},
    conversation_id: { type: String, unique: true, required: true },
    inbox_id: { type: String},
    chatwoot_context: { type: Array, default: [] },
    messages: { type: Array, default: [] },
    context: { type: String, default: '' },
 
}, { timestamps: true });

export default mongoose.model('Customer', customerSchema, 'customers'); 