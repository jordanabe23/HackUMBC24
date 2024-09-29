import { NextResponse } from 'next/server';
import { dbConnect } from '../../lib/dbConnect';
import User from '../../../../models/user';
import OpenAI from 'openai';
import jwt from 'jsonwebtoken';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
    }
  
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
  
    const { messages } = await request.json();
  
    if (!messages) {
      return NextResponse.json({ error: 'Missing messages' }, { status: 400 });
    }
  
    await dbConnect();
  
    try {
      const user = await User.findById(decodedToken.id);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }
  
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: messages,
        max_completion_tokens: 300,
        temperature: 0.5,
      });
  
      const reply = response.choices[0].message.content.trim();
  
      const userMessage = messages[messages.length - 1].content;
      user.conversations.push({ sender: 'user', text: userMessage });
      user.conversations.push({ sender: 'bot', text: reply });
  
      await user.save();
  
      return NextResponse.json({ reply });
    } catch (error) {
      console.error('Error communicating with OpenAI:', error);
  
      if (error.response) {
        console.error('OpenAI API response error:', error.response.status, error.response.data);
        return NextResponse.json({ error: error.response.data }, { status: error.response.status });
      } else {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
      }
    }
  }