import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = ({ handleLogin, notificationMessage, notificationType }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    handleLogin({ username, password });
    setUsername('');
    setPassword('');
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="container">
        <h1>Login to blogs application</h1>
        {notificationMessage && (
          <div className={`notification ${notificationType}`}>
            {notificationMessage}
          </div>
        )}
        <div>
          <p id="username-label">username:</p>
          <input
            id="username"
            type="text"
            value={username}
            placeholder="Enter username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <p id="password-label">password:</p>
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit" className="login-button">
          login
        </button>
        <div>
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
