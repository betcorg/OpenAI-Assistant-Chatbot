
import { pdfTextExtractor } from '../../services/pdfTextExtractor.js';
import { textSummariser } from '../../modules/textSummariser.js';
 

export const pdfSummary = async (req, res) => {

    try {
        const { maxWords, model} = req.body;
        console.log(req.body);
        
        const pdfFile = req.file;
        const pdfText = await pdfTextExtractor(pdfFile.path);

        if (pdfText.length === 0) {
            return res.status(400).json({ error: 'No text found in the PDF file.' });
        }

        const summarisedText = await textSummariser(pdfText, maxWords, model);
        console.log('[*] Summary done');

        res.status(200).json({ summarisedText });

    } catch (error) {
        console.error('An error occured', error);
        res.status(500).json({ error });
    }
};


