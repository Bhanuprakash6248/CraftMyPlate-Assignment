const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authMiddleware = require('./middleware/auth'); 

// Initialize app and environment variables
const app = express();
dotenv.config();

// Middleware
app.use(express.json());  
app.use(cors());          

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Importing routes
const userRoutes = require('./routes/userRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Route middlewares
app.use('/api/auth', userRoutes);   
app.use('/api/restaurants', authMiddleware, restaurantRoutes);  
app.use('/api/orders', authMiddleware, orderRoutes); 

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the Food Delivery Platform API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
