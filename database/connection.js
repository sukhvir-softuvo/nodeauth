const jsonStorage = require('./jsonStorage');

const connectDB = async () => {
  try {
    // Initialize JSON storage
    await jsonStorage.init();
    console.log('📁 JSON Database connected successfully');
  } catch (error) {
    console.error('JSON Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;