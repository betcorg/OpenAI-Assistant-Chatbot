import mongoose from 'mongoose';

const EmbeddingSchema = new mongoose.Schema({
    description: String,
    ideal_answer: String,
    embedding: [Number],
});

export default mongoose.model('Embedding', EmbeddingSchema, 'embeddings');