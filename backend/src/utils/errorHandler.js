/**
 * 
 * @param {String} operation The operation that was executing wile the error occured
 * @param {Object} error The error that occured during the operation
 */
const errorLog = (operation, error) => {
    console.log(`Error during ${operation}: ${error.message || error}\n`);
};

module.exports =  {errorLog};
