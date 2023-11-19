const OpenAI = require("openai");
const fs = require("fs");
const openai = new OpenAI();

const errorLog = (operation, error) => {
    console.log(`Error during ${operation}: ${error.message || error}\n`);
};

const fileman = {
    // Uploads a file for assistant base knowlege
    upload: async (filePath) => {
        try {
            return await openai.files.create({
                file: fs.createReadStream(filePath),
                purpose: "assistants",
            });
        } catch (error) {
            errorLog("uploading file", error);
        }
    },

    // List uploaded files
    list: async () => {
        try {
            return await openai.files.list();
        } catch (error) {
            errorLog("listing files", error);
        }
    },
};

module.exports = fileman;
