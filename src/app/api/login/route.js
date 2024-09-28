// app/api/login/route.js
import {dbConnect} from '../../lib/dbConnect';
import User from '../../../../models/user';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { username, password } = await req.json();

  await dbConnect(); // Ensure database connection

  // Check for user existence and validate password
  const user = await User.findOne({ username });
  if (!user) {
    return new Response('User not found', { status: 404 });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response('Invalid credentials', { status: 401 });
  }

  // Create and return JWT
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
