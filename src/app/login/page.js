'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const AuthPage = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('token', token);

        // Dispatch both storage and custom login events
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('login'));

        // Redirect to home page
        router.push('/');
      } else {
        const errorData = await response.json();
        if (response.status === 404) {
          setErrorMessage('User not found. Please register.');
        } else {
          setErrorMessage('Invalid credentials. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token); // Assuming the API returns a token
        setSuccessMessage('User registered successfully! You can now log in.');
        setErrorMessage('');
        setUsername('');
        setPassword('');
        setIsLogin(true); // Switch to login form
      } else {
        const errorData = await res.json();
        setErrorMessage(errorData.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <Image src="/hackUMBC.png" alt="HackUMBC Logo" width={500} height={500} className="mb-4" />

      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-green-300">
        <h2 className="text-3xl font-extrabold text-center text-green-800 mb-8">
          {isLogin ? '🌱 Login to Plant Sync' : '🌱 Join Plant Sync'}
        </h2>

        {errorMessage && <p className="text-red-500 text-center mb-4">{errorMessage}</p>}
        {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

        <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-6">
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
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={isLoading}
          >
            {isLoading ? (isLogin ? 'Logging in...' : 'Registering...') : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-black text-center">
          {isLogin ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="font-medium text-green-800 hover:text-green-700"
                onClick={() => setIsLogin(false)}
              >
                Register here
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="font-medium text-green-800 hover:text-green-700"
                onClick={() => setIsLogin(true)}
              >
                Login here
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
