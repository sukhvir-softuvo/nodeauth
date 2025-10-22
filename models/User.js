const bcrypt = require('bcryptjs');
const jsonStorage = require('../database/jsonStorage');

class User {
  constructor(data) {
    this._id = data._id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.resetPasswordOTP = data.resetPasswordOTP;
    this.resetPasswordExpires = data.resetPasswordExpires;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  // Hash password before saving
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  // Compare password
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Remove password from JSON output
  toJSON() {
    const user = { ...this };
    delete user.password;
    delete user.resetPasswordOTP;
    delete user.resetPasswordExpires;
    return user;
  }

  // Static methods for database operations
  static async findOne(query) {
    if (query.email) {
      const userData = await jsonStorage.findByEmail(query.email);
      return userData ? new User(userData) : null;
    }
    if (query.username) {
      const userData = await jsonStorage.findByUsername(query.username);
      return userData ? new User(userData) : null;
    }
    if (query._id) {
      const userData = await jsonStorage.findById(query._id);
      return userData ? new User(userData) : null;
    }
    return null;
  }

  static async findOneWithOr(query) {
    if (query.$or) {
      for (const condition of query.$or) {
        if (condition.email) {
          const userData = await jsonStorage.findByEmail(condition.email);
          if (userData) return new User(userData);
        }
        if (condition.username) {
          const userData = await jsonStorage.findByUsername(condition.username);
          if (userData) return new User(userData);
        }
      }
    }
    return null;
  }

  static async create(userData) {
    // Hash password before saving
    const hashedPassword = await User.hashPassword(userData.password);
    
    const newUserData = await jsonStorage.create({
      ...userData,
      password: hashedPassword
    });
    
    return new User(newUserData);
  }

  async save() {
    const updatedUserData = await jsonStorage.update(this._id, {
      username: this.username,
      email: this.email,
      password: this.password,
      resetPasswordOTP: this.resetPasswordOTP,
      resetPasswordExpires: this.resetPasswordExpires
    });
    
    if (updatedUserData) {
      Object.assign(this, updatedUserData);
      return this;
    }
    return null;
  }

  // For compatibility with Mongoose-style operations
  static async deleteMany(query) {
    if (Object.keys(query).length === 0) {
      await jsonStorage.clear();
    }
  }
}

module.exports = User;