import { dbConnect } from '../../lib/dbConnect';
import User from '../../../../models/user'; // Assuming you have a User model
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request) {
    // Check for the Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];

    // Verify the token and extract user ID
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.log("Token verification failed:", error);
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }

    const userId = decoded.id; // Adjust based on your JWT payload structure

    // Connect to the database
    await dbConnect();

    try {
      // Find the user by the ID from the decoded token
      const user = await User.findById(userId);
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      // Return the user's conversations
      return NextResponse.json({ conversations: user.conversations });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}