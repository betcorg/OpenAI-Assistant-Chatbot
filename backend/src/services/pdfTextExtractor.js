import { PDFExtract } from 'pdf.js-extract';

/**
 * 
 * @param {String} filepath The path of the pdf file you want to extraxt text from.
 * @returns A string with the whole text extracted from the pdf file.
 */
export const pdfTextExtractor = async (filepath) =>{

    const pdfExtract = new PDFExtract();
    const extractOptions = {
        firstPage: 1,
        lastPage: undefined,
        password: '',
        verbosity: -1,
        normalizeWhitespace: false,
        disableCombineTextItems: false
    };

    console.log('[*] Extracting data from pdf file');
    const data =  await pdfExtract.extract(filepath, extractOptions);

    return data.pages.map(page => page.content.map(item => item.str).join(' ')).join(' ');
};
