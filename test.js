// import Chatwoot from './src/services/chatwoot.js';

// const chatwoot = new Chatwoot(3);


// console.log(await chatwoot.contacts.list({
//     sort: 'name',
// }));

// console.log(await chatwoot.contacts.create({
//     inbox_id: 1,
//     name: 'Test Contact',
//     email: 'test@contact.com',
//     phone_number: '+528951563023',
//     custom_attributes: {
//         'custom_attribute_1': 'custom_value_1',
//         'custom_attribute_2': 'custom_value_2',
//     }
// }))

// console.log(await chatwoot.conversations.create({
//     source_id: 'ca852b2e-846f-414b-8168-23f7d39590d7',
//     inbox_id: 1,
//     message: {
//         content: 'Hola este es un mensaje de prueba'
//     }
// }));


// console.log(await chatwoot.messages.create(2, {
//     content: 'Hola este es una respuesta enviada desde la api',
//     message_type: 'outgoing'
// }));



/* // Obtener el path del directorio raiz para las rutas relativas.
import { dirname } from "path"; // librería externa
import { fileURLToPath } from "url";
console.log(fileURLToPath(import.meta.url));
const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname); */

/* import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname); */



import { createCompletion } from "./src/services/gemini.js";

console.log(await createCompletion('Hola'));