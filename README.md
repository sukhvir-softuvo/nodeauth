# AuthNode - Node.js Authentication API

A complete Node.js authentication API with JWT tokens, SMTP OTP, and Swagger documentation. Uses JSON file storage for easy understanding and setup.

## Features

- ✅ User Registration (Signup)
- ✅ User Login with JWT
- ✅ Forgot Password with OTP via SMTP
- ✅ Reset Password with OTP validation
- ✅ Get User Profile
- ✅ Input validation
- ✅ Swagger API documentation
- ✅ Comprehensive testing

## API Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/forgot-password` | Send OTP for password reset | No |
| POST | `/api/auth/reset-password` | Reset password with OTP | No |
| GET | `/api/auth/profile` | Get user profile | Yes |

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

**Option 1: Using .env file (Recommended)**

Create a `.env` file in the project root:

```bash
# Create .env file
touch .env
```

Add the following content to `.env`:

```env
# Server Configuration
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# SMTP Configuration (for Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=your-email@gmail.com
FROM_NAME=AuthNode
```

**Option 2: Update config.js directly**

Alternatively, update the `config.js` file with your settings:

```javascript
module.exports = {
  PORT: 3000,
  JWT_SECRET: 'your-super-secret-jwt-key',
  JWT_EXPIRES_IN: '24h',
  
  // SMTP Configuration (for Gmail)
  SMTP_HOST: 'smtp.gmail.com',
  SMTP_PORT: 587,
  SMTP_USER: 'your-email@gmail.com',
  SMTP_PASS: 'your-app-password',
  FROM_EMAIL: 'your-email@gmail.com',
  FROM_NAME: 'AuthNode'
};
```

### 3. Run the Application

```bash
# Simple start (recommended for beginners)
npm start

# Development mode with auto-restart
npm run dev

# Direct server start
npm run server

```

### 4. Access API Documentation

Visit: http://localhost:3000/api-docs

**Note:** User data is automatically stored in `database/users.json` file. No database setup required!

## Why JSON File Storage?

This project uses JSON file storage instead of MongoDB to make it easier for beginners to:

- ✅ **No Database Setup** - No need to install or configure MongoDB
- ✅ **Easy to Understand** - Data is stored in a simple JSON file
- ✅ **Easy to Debug** - You can open `database/users.json` to see all user data
- ✅ **Easy to Reset** - Just delete the JSON file to clear all data
- ✅ **Portable** - The entire project is self-contained
- ✅ **Learning Friendly** - Perfect for understanding authentication concepts

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## API Usage Examples

### Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Forgot Password
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### Reset Password
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "otp": "123456",
    "newPassword": "NewPassword123"
  }'
```

### Get Profile
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Validation Rules

### Username
- 3-30 characters
- Alphanumeric and underscore only

### Email
- Valid email format
- Unique

### Password
- Minimum 6 characters
- Must contain: uppercase, lowercase, and number

### OTP
- 6 digits
- Expires in 10 minutes

## Project Structure

```
authnode/
├── config.js                 # Configuration
├── server.js                 # Main server file
├── package.json              # Dependencies
├── models/
│   └── User.js              # User model
├── controllers/
│   └── authController.js    # Auth controllers
├── middleware/
│   ├── auth.js              # JWT middleware
│   └── validation.js        # Input validation
├── routes/
│   └── auth.js              # Auth routes
├── services/
│   └── emailService.js      # SMTP service
├── database/
│   ├── connection.js        # JSON database connection
│   ├── jsonStorage.js       # JSON file storage logic
│   └── users.json           # User data file (auto-created)
└── README.md               # Documentation
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JSON File Storage** - Simple file-based database
- **JWT** - Authentication
- **Nodemailer** - Email service
- **Express-validator** - Input validation
- **Swagger** - API documentation
- **bcryptjs** - Password hashing

## License

MIT
