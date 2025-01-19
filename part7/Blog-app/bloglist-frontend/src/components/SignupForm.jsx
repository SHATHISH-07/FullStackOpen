import React, { useState } from 'react';

// Inside SignupForm.js
const SignupForm = ({
  handleSignup,
  notificationMessage,
  notificationType,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    handleSignup({ username, password, name });
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username: </label>
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            required
          />
        </div>
        <div>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            required
          />
        </div>
        <div>
          <label>Name: </label>
          <input
            type="text"
            value={name}
            onChange={({ target }) => setName(target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
        already have an account? <a href="/">Login</a>
      </form>
      {notificationMessage && (
        <div className={`notification ${notificationType}`}>
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default SignupForm;
