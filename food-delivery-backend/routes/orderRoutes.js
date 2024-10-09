const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

// Place a new order
router.post('/orders', auth, async (req, res) => {
    const { restaurantId, items, deliveryAddress } = req.body;

    try {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });

        const totalCost = items.reduce((total, item) => total + item.price * item.quantity, 0);
        const order = new Order({
            user: req.user.id,
            restaurant: restaurantId,
            items,
            totalCost,
            deliveryAddress,
            status: 'Pending'
        });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get order details
router.get('/orders/:orderId', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId).populate('restaurant').populate('items');
        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update order status
router.put('/orders/:orderId/status', auth, async (req, res) => {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'In Progress', 'Out for Delivery', 'Delivered'];

    if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

    try {
        const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
