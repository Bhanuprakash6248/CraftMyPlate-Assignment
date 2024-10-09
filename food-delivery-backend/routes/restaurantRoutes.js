const express = require('express');
const router = express.Router();
const Restaurant = require('../models/Restaurant'); 
const auth = require('../middleware/auth'); 

// Create a new restaurant
router.post('/restaurants', auth, async (req, res) => {
  const { name, location } = req.body;
  try {
    const newRestaurant = new Restaurant({ name, location, menu: [] });
    await newRestaurant.save();
    res.status(201).json(newRestaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all restaurants
router.get('/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single restaurant by ID
router.get('/restaurants/:restaurantId', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update restaurant details
router.put('/restaurants/:restaurantId', auth, async (req, res) => {
  const { name, location } = req.body;
  const { restaurantId } = req.params;
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      restaurantId,
      { name, location },
      { new: true }
    );
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a restaurant
router.delete('/restaurants/:restaurantId', auth, async (req, res) => {
  const { restaurantId } = req.params;
  try {
    await Restaurant.findByIdAndDelete(restaurantId);
    res.json({ message: 'Restaurant deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new menu item to a restaurant
router.post('/restaurants/:restaurantId/menu', auth, async (req, res) => {
  const { name, description, price, availability } = req.body;
  const { restaurantId } = req.params;
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const newItem = { name, description, price, availability };
    restaurant.menu.push(newItem);
    await restaurant.save();
    res.json(restaurant.menu);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get menu of a restaurant
router.get('/restaurants/:restaurantId/menu', async (req, res) => {
  const { restaurantId } = req.params;
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json(restaurant.menu);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a menu item
router.put('/restaurants/:restaurantId/menu/:itemId', auth, async (req, res) => {
  const { name, description, price, availability } = req.body;
  const { restaurantId, itemId } = req.params;
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    const menuItem = restaurant.menu.id(itemId);
    if (!menuItem) return res.status(404).json({ message: 'Menu item not found' });

    menuItem.name = name || menuItem.name;
    menuItem.description = description || menuItem.description;
    menuItem.price = price || menuItem.price;
    menuItem.availability = availability !== undefined ? availability : menuItem.availability;
    
    await restaurant.save();
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a menu item
router.delete('/restaurants/:restaurantId/menu/:itemId', auth, async (req, res) => {
  const { restaurantId, itemId } = req.params;
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

    restaurant.menu.id(itemId).remove();
    await restaurant.save();
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
