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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-green-300">
        <h2 className="text-3xl font-extrabold text-center text-green-800 mb-8">
          🌱 Join Plant Sync
        </h2>
        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-green-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-green-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-green-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-green-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Register
            </button>
          </div>
          {errorMessage && (
            <p className="text-red-600 text-sm text-center mt-2">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-600 text-sm text-center mt-2">{successMessage}</p>
          )}
        </form>
        <p className="mt-4 text-center text-sm text-black">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-green-800 hover:text-green-700">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
