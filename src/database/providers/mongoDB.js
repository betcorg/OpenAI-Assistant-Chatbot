import mongoose from 'mongoose';

export default class MongoDB {

    constructor(uri) {
        this.uri = uri;
    }

    async connect() {

        try {
            await mongoose.connect(this.uri);
            console.log('\n[*] Mongoose: Connected to MongoDB');
        } catch (error) {
            console.error('\n[!] Mongoose: Error connecting to MongoDB:', error);
            process.exit(1);
        }
    }
}