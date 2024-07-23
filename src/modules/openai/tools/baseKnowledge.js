// import 'dotenv/config';
import { createEmbedding } from '../../../services/openai.js';
import Embedding from '../../../database/models/vectorModel.js';

export const get_base_knowledge = {
    type: 'function',
    function: {
        name: 'getBaseKnowledge',
        description: 'Returns the question if the customer requires further information about our products, such as price, payment methods, shipping, content, details, warranty or any other information related to our products or services. This question will be used for performing a vector search to look for relevant context in the base knowledge database.',
        parameters: {
            type: 'object',
            properties: {
                question: {
                    type: 'string',
                    description: 'The question about our products or services that require specific details',
                },
            },
            required: ['question'],
        },
    }
};


const vectorSearch = async(embedding) => {

    try {
        const collection = Embedding.collection;
        
        console.log('[?] Searching for the best answer...');
        const documents = await collection.aggregate([
            {
                $vectorSearch: {
                    index: 'embeds', 
                    path: 'embedding',
                    queryVector: embedding,
                    numCandidates: 100,
                    limit: 2,
                },
            },
            {
                $project: {
                    _id: 0,
                    description: 1,
                    ideal_answer: 1,
                    score: { $meta: 'vectorSearchScore' },
                },
            },

        ]).toArray();
        
        const candidates = documents.map(doc => doc.ideal_answer);
        console.log({candidates});
        return candidates;

    } catch (err) {
        console.error(err);
    }
};

export const getBaseKnowledge = async (args) => {

    const { question } = args;

    const embedding = await createEmbedding(question);

    return await vectorSearch(embedding);
};





