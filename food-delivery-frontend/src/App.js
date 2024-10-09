import React, { useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);

  return (
    <div className="App">
      <h1>Food Delivery Platform</h1>
      {!token ? (
        <>
          <Register />
          <Login setToken={setToken} />
        </>
      ) : (
        <Profile token={token} />
      )}
    </div>
  );
}

export default App;
