// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const connectDB = require('./database/connection');
const config = require('./config');

// Import routes
const authRoutes = require('./routes/auth');

const app = express();

// Connect to JSON Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AuthNode API',
      version: '1.0.0',
      description: 'A Node.js Authentication API with JWT and SMTP',
      contact: {
        name: 'AuthNode',
        email: 'support@authnode.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${config.PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'AuthNode API Documentation'
}));

// Routes
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AuthNode API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to AuthNode API',
    documentation: '/api-docs',
    endpoints: {
      signup: 'POST /api/auth/signup',
      login: 'POST /api/auth/login',
      forgotPassword: 'POST /api/auth/forgot-password',
      resetPassword: 'POST /api/auth/reset-password',
      profile: 'GET /api/auth/profile'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
});

module.exports = app;
