import express from 'express';
import { 
    createNewAssistant,
    deleteAssistantById, 
    getAssistantById, 
    listAssistants, 
    updateAssistantById, 
    useAssistant 
} from '../controllers/v1/assistants.js';

const router = express.Router();

router.get('/list', listAssistants);
router.get('/retrieve', getAssistantById);
router.post('/create', createNewAssistant);
router.put('/update', updateAssistantById);
router.delete('/delete', deleteAssistantById);
router.post('/use', useAssistant);

export default router;
