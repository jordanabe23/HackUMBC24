import { NextResponse } from 'next/server';
import { dbConnect } from '../../lib/dbConnect'; // Adjust path as necessary
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose'; // Import ObjectId from mongoose
import User from '../../../../models/user'; // Adjust the path to your User model
import Group from '../../../../models/group'; // Adjust the path to your Group model
import Todo from '../../../../models/todo'; // Adjust the path to your User model

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
// Authenticate the user by checking the JWT token in the request headers
const authenticateUser = (request) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization header missing.' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return NextResponse.json({ error: 'Token missing.' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id; // Assuming the user ID is stored in the token payload as 'id'
  } catch (err) {
    return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });
  }
};

// Next.js POST route handler
export async function POST(request) {
  await dbConnect(); // Ensure database connection

  try {
    // Authenticate the user
    const userId = authenticateUser(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authentication failed.' }, { status: 401 });
    }

    // Parse the request body to get the groupName and todos array
    const body = await request.json();
    const { groupName, todos } = body;

    // Validate the input
    if (!groupName || typeof groupName !== 'string' || groupName.trim() === '') {
      return NextResponse.json({ error: 'Group name is required and must be a non-empty string.' }, { status: 400 });
    }

    if (!todos || !Array.isArray(todos) || todos.length === 0) {
      return NextResponse.json({ error: 'Todos are required and must be a non-empty array.' }, { status: 400 });
    }

    // Step 1: Validate and create Todo documents for each todo in the list
    const todoIds = [];

    for (const todo of todos) {
      // Validate each todo item
      if (!todo.name || typeof todo.name !== 'string' || todo.name.trim() === '') {
        return NextResponse.json({ error: `Todo name is required for all todos.` }, { status: 400 });
      }
      if (!todo.recurrence || !['once', 'daily', 'weekly', 'monthly'].includes(todo.recurrence)) {
        return NextResponse.json({ error: `Invalid recurrence value for todo: ${todo.name}` }, { status: 400 });
      }

      // Create a new Todo instance
      const newTodo = new Todo({
        name: todo.name.trim(),
        description: todo.description ? todo.description.trim() : '',
        recurrence: todo.recurrence,
        created: new Date(),
      });

      // Save the new Todo to the database
      await newTodo.save();
      todoIds.push(newTodo._id); // Collect the created Todo IDs
    }

    // Step 2: Create a new Group with references to the created Todo IDs
    const newGroup = new Group({
      groupName: groupName.trim(),
      todos: todoIds, // Reference the newly created Todo IDs
    });

    // Save the new Group to the database
    await newGroup.save();

    // Step 3: Find the authenticated user and add the group to their list of groups
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    user.groups.push(newGroup._id);
    await user.save();

    // Step 4: Respond with the newly created group
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error('Error creating new group:', error);
    return NextResponse.json({ error: 'Server error. Please try again later.' }, { status: 500 });
  }
}