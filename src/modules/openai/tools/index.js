import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

// Get the current directory path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load tools function
const loadTools = async () => {
    try {
        let schemas = [];
        let functions = {};
        
        // Read the files in the current directory
        const files = await fs.readdir(__dirname);
        
        // Iterate over each file
        for (const file of files) {
            // Construct the full path of the file
            const fullPath = path.join(__dirname, file);
            
            // Get the file stats
            const stat = await fs.stat(fullPath);
            
            // Check if the file is a file (not a directory) and not the current file
            if (stat.isFile() && file !== 'index.js') {
                // Dynamically import the file
                const fileFunctions = await import(fullPath);
                
                // Iterate over each function in the imported file
                Object.keys(fileFunctions).forEach((fnName) => {
                    // Check if the number of schemas is equal to the number of functions
                    if (Object.keys(schemas).length === Object.keys(functions).length) {
                        // Add the function to the functions object
                        functions[fnName] = fileFunctions[fnName];
                    } else if (Object.keys(functions).length > Object.keys(schemas).length) {
                        // Add the schema to the schemas array
                        schemas.push(fileFunctions[fnName]);
                    } 
                });
            }
        }
        
        // Returns an object containing the schemas and functions
        return {
            schemas,
            functions,
        };
        
    } catch (error) {
        console.error('[!] Error exporting tool functions at loadTools');
        throw error;
    }
};

export default loadTools;