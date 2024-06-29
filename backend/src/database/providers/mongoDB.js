import mongoose from 'mongoose';

class MongoDB {

  async connect(uri) {

    try {
      await mongoose.connect(uri);
      console.log('\n[*] Connected to MongoDB');
    } catch (error) {
      console.error('\n[!] Error connecting to MongoDB:', error);
      process.exit(1);
    }
  }
}

export default new MongoDB();