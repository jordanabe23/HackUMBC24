// components/AuthModal.js
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const AuthModal = ({ onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/api/register' : '/api/login';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      if (isRegister) {
        alert('Registration successful!');
      } else {
        const { token } = await response.json();
        localStorage.setItem('token', token); // Store token for further requests
        alert('Login successful!');
        router.push('/'); // Redirect to home page
      }
      onClose();
    } else {
      const errorData = await response.json();
      alert(errorData.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{isRegister ? 'Register' : 'Login'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="border border-gray-300 p-2 rounded w-full mb-4"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="border border-gray-300 p-2 rounded w-full mb-4"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>
        <button
          className="text-blue-500 mt-4"
          onClick={() => setIsRegister((prev) => !prev)}
        >
          {isRegister ? 'Already have an account? Login' : 'No account? Register'}
        </button>
        <button onClick={onClose} className="text-red-500 mt-4">Close</button>
      </div>
    </div>
  );
};

export default AuthModal;
