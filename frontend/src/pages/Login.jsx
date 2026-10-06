import React, { useState } from 'react';
import { api } from '../utils/api';

export default function Login({ onLogin }) {
  const [username, setUsername] =
    useState('admin');

  const [password, setPassword] =
    useState('admin123');

  const [error, setError] =
    useState('');

  async function submit(e) {
    e.preventDefault();

    setError('');

    try {
      const data = await api('/login', {
        method: 'POST',

        body: JSON.stringify({
          username,
          password
        })
      });

      localStorage.setItem(
        'token',
        data.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(data.user)
      );

      onLogin(data.user);

    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div className="login">

      <form
        onSubmit={submit}
        className="login-card"
      >

        <div className="logo">
          ₹
        </div>

        <h1>FeeTrack</h1>

        <p>
          Student fee collection & tracking
        </p>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        <label>
          Username

          <input
            value={username}
            onChange={(e) =>
              setUsername(e.target.value)
            }
          />
        </label>

        <label>
          Password

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </label>

        <button
          type="submit"
          className="primary"
        >
          Login
        </button>

        <small>
          Demo: admin/admin123 or staff/staff123
        </small>

      </form>

    </div>
  );
}