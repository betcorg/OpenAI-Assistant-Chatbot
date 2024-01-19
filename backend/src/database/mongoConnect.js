const mongoose = require('mongoose');

const DB_URL = process.env.DB_URL;

const connectDatabase= async () => {
    await mongoose.connect(DB_URL)
        .then(() => console.log('\n[*] Connected to MongoDB'))
        .catch(err => console.log('\n[-] Error during database connection: ', err));
};

module.exports = connectDatabase;