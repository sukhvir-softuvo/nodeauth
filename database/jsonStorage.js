const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');

class JSONStorage {
  constructor() {
    this.dataFile = path.join(__dirname, 'users.json');
    this.users = [];
    this.initialized = false;
    console.log('📁 JSONStorage constructor - dataFile:', this.dataFile);
  }

  async init() {
    if (this.initialized) {
      console.log('📁 JSONStorage already initialized');
      return;
    }
    
    console.log('📁 Initializing JSONStorage...');
    console.log('📁 Data file path:', this.dataFile);
    
    try {
      // Check if data file exists, if not create it
      await fs.access(this.dataFile);
      console.log('📁 Data file exists, reading...');
      const data = await fs.readFile(this.dataFile, 'utf8');
      this.users = JSON.parse(data);
      console.log('📁 JSON database loaded successfully, users:', this.users.length);
    } catch (error) {
      // File doesn't exist, create empty array
      console.log('📁 Data file does not exist, creating...');
      this.users = [];
      await this.save();
      console.log('📁 JSON database created successfully');
    }
    this.initialized = true;
    console.log('📁 JSONStorage initialization complete');
  }

  async save() {
    try {
      console.log('💾 Saving users to JSON file:', this.users.length, 'users');
      await fs.writeFile(this.dataFile, JSON.stringify(this.users, null, 2));
      console.log('✅ Users saved successfully to', this.dataFile);
    } catch (error) {
      console.error('Error saving to JSON file:', error);
      throw error;
    }
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Find user by email
  async findByEmail(email) {
    await this.init();
    return this.users.find(user => user.email === email);
  }

  // Find user by username
  async findByUsername(username) {
    await this.init();
    return this.users.find(user => user.username === username);
  }

  // Find user by ID
  async findById(id) {
    await this.init();
    return this.users.find(user => user._id === id);
  }

  // Find user by email or username
  async findByEmailOrUsername(email, username) {
    await this.init();
    return this.users.find(user => user.email === email || user.username === username);
  }

  // Create new user
  async create(userData) {
    await this.init();
    console.log('👤 Creating new user:', userData.username, userData.email);
    
    const user = {
      _id: this.generateId(),
      username: userData.username,
      email: userData.email,
      password: userData.password, // This will be hashed before saving
      resetPasswordOTP: null,
      resetPasswordExpires: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users.push(user);
    console.log('👥 Total users before save:', this.users.length);
    await this.save();
    console.log('✅ User created and saved successfully');
    return user;
  }

  // Update user
  async update(id, updateData) {
    await this.init();
    const userIndex = this.users.findIndex(user => user._id === id);
    if (userIndex === -1) {
      return null;
    }

    this.users[userIndex] = {
      ...this.users[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    await this.save();
    return this.users[userIndex];
  }

  // Delete user
  async delete(id) {
    await this.init();
    const userIndex = this.users.findIndex(user => user._id === id);
    if (userIndex === -1) {
      return false;
    }

    this.users.splice(userIndex, 1);
    await this.save();
    return true;
  }

  // Get all users (for debugging)
  async findAll() {
    await this.init();
    return this.users;
  }

  // Clear all users (for testing)
  async clear() {
    await this.init();
    this.users = [];
    await this.save();
  }
}

const jsonStorage = new JSONStorage();

// Initialize the storage
jsonStorage.init().catch(console.error);

module.exports = jsonStorage;
