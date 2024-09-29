// app/api/register/route.js
import { dbConnect } from '../../lib/dbConnect';

import User from '../../../../models/user';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await dbConnect();
  const { username, password } = await req.json();

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return new Response(JSON.stringify({ error: 'User already exists. Please log in.' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();

  return new Response(JSON.stringify({ message: 'User registered successfully! You can now log in.' }), { status: 201 });
}