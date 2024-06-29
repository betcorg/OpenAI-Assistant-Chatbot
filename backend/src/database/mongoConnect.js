import mongoose from 'mongoose';

const DB_URL = process.env.DB_URL;

export const connectDatabase= async () => {
    await mongoose.connect(DB_URL)
        .then(() => console.log('\n[*] Connected to MongoDB'))
        .catch(err => console.log('\n[-] Error during database connection: ', err));
};
