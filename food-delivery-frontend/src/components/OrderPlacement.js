import React, { useState, useEffect } from 'react';
import '../components/styles/orderPlacement.css'

const OrderPlacement = ({ token }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState('');
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [orderStatus, setOrderStatus] = useState('');

    useEffect(() => {
        const fetchRestaurants = async () => {
            const response = await fetch('http://localhost:5000/api/restaurants', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setRestaurants(data);
        };
        fetchRestaurants();
    }, [token]);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                restaurantId: selectedRestaurant,
                items: selectedItems,
                deliveryAddress
            })
        });

        const data = await response.json();
        setOrderStatus(`Order placed successfully! Order ID: ${data._id}`);
    };

    return (
        <div className="order-form-container">
            <h2>Place an Order</h2>
            <form onSubmit={handlePlaceOrder}>
                <select
                    value={selectedRestaurant}
                    onChange={(e) => setSelectedRestaurant(e.target.value)}
                    required
                >
                    <option value="">Select Restaurant</option>
                    {restaurants.map((restaurant) => (
                        <option key={restaurant._id} value={restaurant._id}>
                            {restaurant.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="Delivery Address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                />

                <button type="submit">Place Order</button>
            </form>

            {orderStatus && <p>{orderStatus}</p>}
        </div>
    );
};

export default OrderPlacement;
