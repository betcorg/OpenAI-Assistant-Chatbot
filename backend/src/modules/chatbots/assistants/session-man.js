const openai = require('../../services/openai');
const errorLog = require('../../utils/secManager');


const isSessionActive = async (sessions, userId) => {
    let active = false;
    for (const session of sessions) {
        if (session.userId.includes(userId)) active = true;
    }
    return active;
};

const createSession = async (userId, message, sessions) => {
    try {
        const assistantId = process.env.ASSISTANT_ID;
        const assistant = await openai.assistants.retrieve(assistantId);
        const thread = await openai.threads.create();
        const newSession = {
            userId: userId,
            from: message.from,
            assistant: assistant,
            thread: thread,
            runs: [],
            messages: [
                { user: message.body },
            ],
        };
        sessions.push(newSession);
        return newSession;
    } catch (error) {
        errorLog('creating a new session', error);
    }
};

const updateSession = async (userId, message, sessions) => {
    try {
        let updatedSession = {};
        for (const session of sessions) {
            if (session.userId === userId) {
                updatedSession = session;
                sessions = sessions.filter(elem => elem !== session);
                updatedSession.messages.push({ 'user': message.body });
                sessions.push(updatedSession);
            }
        }
        return updatedSession;
    } catch (error) {
        errorLog('updating sessions', error);
    }
};

const sessionHandler = async (sessions, message) => {

    const userId = message.from.toString().match(/\d+/g)[0];
    const existingSession = await isSessionActive(sessions, userId);

    if (existingSession) {
        console.log('Active session\n');
        return await updateSession(userId, message, sessions);

    } else {
        console.log('Creating a new sessions\n');
        return await createSession(userId, message, sessions);
    }
};

module.exports = { 
    sessionHandler,
};