import React, { useState, useEffect } from 'react';

const MenuManagement = ({ token, restaurantId }) => {
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      const response = await fetch(`http://localhost:5000/restaurants/${restaurantId}/menu`, {
        method: 'GET',
      });
      const data = await response.json();
      setMenu(data);
    };

    fetchMenu();
  }, [restaurantId]);

  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/restaurants/${restaurantId}/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, description, price, availability }),
    });
    const data = await response.json();
    setMenu([...menu, data]);
  };

  return (
    <div className="menu-management">
      <h2>Menu Management</h2>
      <form onSubmit={handleAddMenuItem}>
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={availability}
            onChange={(e) => setAvailability(e.target.checked)}
          />{' '}
          Available
        </label>
        <button type="submit">Add Menu Item</button>
      </form>

      <h3>Menu List</h3>
      <ul>
        {menu.map((item) => (
          <li key={item._id}>
            <strong>{item.name}</strong> - ${item.price}
            <br />
            {item.description}
            <br />
            {item.availability ? 'Available' : 'Not Available'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuManagement;
