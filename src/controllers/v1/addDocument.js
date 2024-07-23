import { uploadDocument } from '../../utils/uploadDocToDB.js';

export const addDocument = async(req, res) => {

    try {
        const {description, info} = req.body;
    
        const result = await uploadDocument(description, info);
    
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({error: error.message});
    }

};

