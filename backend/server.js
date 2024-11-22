require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const chatRoutes = require('./routes/chatRoutes');
const dataRoutes = require('./routes/dataRoutes');

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
console.log('MongoDB URI:', process.env.MONGODB_URI ? 'URI is set' : 'URI is not set');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/career-guidance', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  keepAlive: true,
  keepAliveInitialDelay: 300000
})
.then(() => {
  console.log('Successfully connected to MongoDB');
  console.log('Database name:', mongoose.connection.name);
  console.log('Connection state:', mongoose.connection.readyState);
})
.catch(err => {
  console.error('MongoDB connection error details:', {
    name: err.name,
    message: err.message,
    code: err.code,
    stack: err.stack
  });
});

// Monitor MongoDB connection
mongoose.connection.on('connected', () => console.log('MongoDB connected event fired'));
mongoose.connection.on('error', err => console.error('MongoDB error event:', err));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected event fired'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'Debug endpoint working',
    mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
    geminiApiKey: process.env.GEMINI_API_KEY ? 'Set' : 'Not set',
    nodeEnv: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Test Gemini endpoint
app.post('/api/test-gemini', async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("Say hello!");
    const response = await result.response;
    const text = response.text();
    res.json({ message: text });
  } catch (error) {
    console.error('Gemini API test error:', error);
    res.status(500).json({ 
      error: 'Gemini API test failed',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Routes
app.use('/api', chatRoutes);
app.use('/api', dataRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', err);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
