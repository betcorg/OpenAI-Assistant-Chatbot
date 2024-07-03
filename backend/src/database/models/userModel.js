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

