
const {pdfTextExtractor} = require('../../services/pdfTextExtractor');
const {textSummariser} = require('../../modules/textSummariser');


const pdfSummary = async (req, res) => {

    try {
        const { maxWords, model} = req.body;
        const pdfFile = req.file;
        const pdfText = await pdfTextExtractor(pdfFile.path);

        if (pdfText.length === 0) {
            return res.status(400).json({ error: 'No text found in the PDF file.' });
        }

        const summarisedText = await textSummariser(pdfText, maxWords, model);

        res.status(200).json({ summarisedText });

    } catch (error) {
        console.error('An error occured', error);
        res.status(500).json({ error });
    }
};

module.exports = {
    pdfSummary,
};
