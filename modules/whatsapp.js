const https = require('https');
require('dotenv').config();


const CLOUD_API_ACCESS_TOKEN = process.env.CLOUD_API_ACCESS_TOKEN;
const WA_PHONE_NUMBER_ID = process.env.WA_PHONE_NUMBER_ID;


function makeRequest(data) {
    const options = {
        host: "graph.facebook.com",
        path: `/v17.0/${WA_PHONE_NUMBER_ID}/messages`,
        method: "POST",
        body: data,
        headers: {
            "Content-Type": "application/json",
            Authorization: CLOUD_API_ACCESS_TOKEN
        }
    }

    const req = https.request(options, (res) => {
        res.on('data', (d) => {
            process.stdout.write(d);
        });
    });

    req.write(data);
    req.end();
}


const send = {

    text: (text, number) => {

        const data = JSON.stringify({
            "messaging_product": "whatsapp",
            "to": number,
            "recipient_type": "individual",
            "type": "text",
            "text": {
                "preview_url": false,
                "body": text
            }
        });

        makeRequest(data);
    },

    imageByURL: (url, number) => {

        const data = JSON.stringify({
            "messaging_product": "whatsapp",
            "to": number,
            "recipient_type": "individual",
            "type": "image",
            "image": {
                "link": url // Image url
            }
        });

        makeRequest(data);
    },
}


module.exports = {
    send,
}

    