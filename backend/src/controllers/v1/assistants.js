import * as openai from '../../services/openai.js';
import User from '../../database/models/user-schema.js';
import { getAssistantResponse } from '../../modules/chatbots/assistants/gpt-assistants.js';

export const listAssistants = async (req, res) => {
    try {
        const assistantaList = await openai.assistants.list();
        if (!assistantaList) {
            return res.status(404).json({ message: 'No assistants found' });
        }
        res.status(200).json(assistantaList);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log('Cannot list the assistants: ', error);
    }
};

export const getAssistantById = async (req, res) => {
    try {
        const assistantId = req.params.id;
        const retrievedAssistant = await openai.assistants.retrieve(assistantId);
        if (!retrievedAssistant) {
            return res.status(404).json({ message: 'Assistant not found' });
        }
        res.status(200).json(retrievedAssistant);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log('Cannot retrieve assistant: ', error);
    }
};

export const createNewAssistant = async (req, res) => {
    try {
        const { user_id } = req.params;
        const {
            model,
            assistant_name,
            instructions,
            file_ids,
            tools,
        } = req.body;

        const params = {
            model: model,
            name: assistant_name,
            instructions: instructions,
            file_ids: file_ids,
            tools: tools,
        };

        const newAssistant = await openai.assistants.create(params);
        const { id, name } = newAssistant;

        await User.findByIdAndUpdate(
            user_id,
            { $push: { assistants: { id, name } } },
            { new: true },
        );

        res.status(201).json(newAssistant);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log('cannot create assistant: ', error);
    }
};

export const updateAssistantById = async (req, res) => {
    try {
        const assistant_id = req.params.id;
        console.log(assistant_id);

        if (!req.body) {
            res.status(400).json({ message: 'Please provide parameters to be changed' });
        } else {
            const { name, description, model, instructions, tools, file_ids } = req.body;
            const params = {
                name: name,
                description: description,
                model: model,
                instructions: instructions,
                tools: tools,
                file_ids: file_ids,
            };
            const updatedAssistant = await openai.assistants.update(assistant_id, params);
            res.status(200).json(updatedAssistant);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log('cannot update assistant: ', error);
    }
};

export const deleteAssistantById = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const assistant_id = req.params.assistant_id;

        await User.findByIdAndUpdate(
            user_id,
            { $pull: { chatbots: { name: assistant_id } } }, 
            { new: true },
        );
        res.status(204).json();
    } catch (error) {
        res.status(404).json({ error: error.message });
        console.log('cannot delete assistant: ', error);
    }
};

export const useAssistant = async (req) => {
    console.log(req.body);
    await getAssistantResponse();
};
