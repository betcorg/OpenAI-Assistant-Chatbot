import Embedding from '../database/models/vectorModel.js';
import { createEmbedding } from '../services/openai.js';

export const uploadDocument = async (description, idealAnswer) => {

    try {

        const embedding = await createEmbedding(idealAnswer);

        const newEmbedding = await Embedding.create({
            description: description,
            ideal_answer: `${description}\n\n${idealAnswer}`,
            embedding: embedding,
        });

        console.log('[*] Document added to database:', newEmbedding._id);

        return {
            description: description,
            doc_id: newEmbedding._id,
        };

    } catch (error) {
        console.log('Error while adding a document to the database');
        throw error;
    }
};


