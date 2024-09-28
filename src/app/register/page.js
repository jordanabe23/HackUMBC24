// src/app/register/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      // Set the token in local storage (you should generate a real token)
      localStorage.setItem('token', data.token); // Assuming the API returns a token
      setSuccessMessage('User registered successfully! You can now log in.');
      setErrorMessage('');
      setUsername('');
      setPassword('');
      // Optionally, redirect the user to the login page
      router.push('/login');
    } else {
      const errorData = await res.json();
      setErrorMessage(errorData.error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl text-black font-bold mb-6">Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 text-black p-2 mb-4 w-full"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 text-black p-2 mb-4 w-full"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
            Register
          </button>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
        </form>
        <p className="text-black mt-4">
          Already have an account?{' '}
          <a href="/login" className="text-blue-500">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
