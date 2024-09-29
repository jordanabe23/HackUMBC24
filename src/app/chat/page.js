"use client";

import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/navigation';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch token from localStorage and redirect if not found
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      fetchConversations(token); // Pass token to fetchConversations
    }
  }, [router]);

  const fetchConversations = async (token) => { // Accept token as parameter
    try {
      const response = await fetch('/api/getConversations', {
        method: 'GET', // Use GET
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMessages(data.conversations);

        // Check if there are no conversations and send a welcome message
        if (data.conversations.length === 0) {
          await sendWelcomeMessage(token);
        }
      } else {
        console.error('Error fetching conversations:', data.error);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const sendWelcomeMessage = async (token) => {
    setLoading(true);
    try {
        // Step 1: Fetch groups
        const groupsResponse = await fetch('/api/groups', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!groupsResponse.ok) {
            throw new Error('Error fetching groups');
        }

        const groupsData = await groupsResponse.json();
        const groups = groupsData.map(group => group.name); // Extract only the names

        // Step 2: Fetch todos
        const todosResponse = await fetch('/api/todos', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!todosResponse.ok) {
            throw new Error('Error fetching todos');
        }

        const todosData = await todosResponse.json();
        const todos = todosData.todos || []; // Adjust based on your API response structure

        // Step 3: Prepare the message for OpenAI
        const messageContent = `
          You are a helpful assistant. The user is part of the following groups: ${groups.join(', ')}.
          They have the following todo items: ${todos.join(', ')}.
          Please provide personalized recommendations for them.
        `;

        // Step 4: Send the request to OpenAI
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [{ role: 'system', content: messageContent }],
            }),
        });

        const data = await response.json();
        if (response.ok) {
            setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: data.reply }]);
        } else {
            console.error('Error sending welcome message:', data.error);
        }
    } catch (error) {
        console.error('Error sending welcome message:', error);
    } finally {
        setLoading(false);
    }
};

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setLoading(true);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            // System message to ensure no Markdown is used
            {
              role: 'system',
              content: 'Please respond in plain text without using any Markdown formatting or special characters, made for chat windows and easy readability. Make it short.'
            },
            // Include existing messages
            ...messages.map(({ sender, text }) => ({
              role: sender === 'user' ? 'user' : 'assistant',
              content: text,
            })),
            // User's current input
            { role: 'user', content: input },
          ],
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessages((prevMessages) => [...prevMessages, { sender: 'bot', text: data.reply }]);
      } else {
        console.error('Error sending message:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 min-h-screen p-6 flex flex-col">
      <Head>
        <title>Chat - Group Reminders</title>
        <meta name="description" content="Chat with your team" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Chat Page</h1>
      <div className="flex-1 overflow-y-auto bg-white p-4 rounded-lg shadow mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-2 rounded ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start mb-2">
            <div className="max-w-xs p-2 bg-gray-200 text-gray-800 rounded animate-pulse">ChatGPT is typing...</div>
          </div>
        )}
      </div>
      <form onSubmit={sendMessage} className="flex">
        <input
          type="text"
          className="flex-1 text-black border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600 focus:outline-none"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
