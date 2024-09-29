import { dbConnect } from '../../lib/dbConnect'; // Adjust path as necessary
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose'; // Import ObjectId from mongoose
import User from '../../../../models/user'; // Adjust the path to your User model
import Group from '../../../../models/group'; // Adjust the path to your Group model

export async function GET(req) {
  try {
    const authHeader = req.headers.get('Authorization'); // Use headers.get for Next.js 13

    // Check for authorization header
    if (!authHeader) {
      return new Response(JSON.stringify({ message: 'Authorization header missing' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ message: 'Token missing' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Verify the token and extract user ID
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return new Response(JSON.stringify({ message: 'Invalid or expired token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = decoded.id; // Adjust based on your JWT payload structure

    // Connect to the database
    await dbConnect();

    // Find the user in the Users collection
    const user = await User.findById(userId).populate('groups'); // Assuming 'groups' is a reference in User model
    console.log(user);
    if (!user || !user.groups || user.groups.length === 0) {
      return new Response(JSON.stringify({ message: 'No groups found for this user' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Map the groups directly from the populated user data
    const groupNames = user.groups.map(group => ({
      _id: group._id.toString(),
      name: group.groupName,
    }));

    console.log('Fetched Groups:', groupNames); // Log the fetched groups
    return new Response(JSON.stringify(groupNames), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching groups:', error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}