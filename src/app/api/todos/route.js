import { dbConnect } from '../../lib/dbConnect';
import Todo from '../../../../models/todo';
import User from '../../../../models/user'; // Assuming you have a User model
import jwt from 'jsonwebtoken';

const authenticateUser = (request) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    throw new Response(
      JSON.stringify({ error: 'Authorization header missing.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new Response(
      JSON.stringify({ error: 'Token missing.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Response(
      JSON.stringify({ error: 'Invalid or expired token.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  return decoded.id; // Assuming the userId is stored as 'id' in your JWT
};

export async function GET(request) {
  await dbConnect(); // Ensure database connection

  try {
    const userId = authenticateUser(request);
    
    // Fetch the user's information including their group IDs
    const user = await User.findById(userId).select('groups'); // Fetch groups only
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const groupIds = user.groups; // Get the list of group IDs
    console.log(groupIds);
    // Fetch todos that match the user's group IDs
    const todos = await Todo.find({ groupId: { $in: groupIds } }).sort({ createdAt: -1 });

    return new Response(JSON.stringify(todos), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in GET /api/todos:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(request) {
  await dbConnect(); // Ensure database connection

  try {
    const userId = authenticateUser(request);
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Authentication failed.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();

    // Validate required fields
    if (!body.text || typeof body.text !== 'string' || body.text.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Task name is required and must be a non-empty string.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if groupId is present
    if (!body.groupId || typeof body.groupId !== 'string' || body.groupId.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Group ID is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Fetch the user's information to validate the group ID
    const user = await User.findById(userId).select('groups');
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validGroupIds = user.groups; // Get valid group IDs

    if (!validGroupIds.includes(body.groupId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid group ID.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a new Todo instance
    const newTodo = new Todo({
      text: body.text.trim(),
      description: body.description ? body.description.trim() : '',
      recurrence: ['once', 'daily', 'weekly', 'monthly'].includes(body.recurrence) ? body.recurrence : 'once',
      date: body.date ? new Date(body.date) : null,
      completed: false,
      userId, // Associate with the authenticated user
      groupId: body.groupId, // Include groupId in the new Todo
    });

    await newTodo.save();

    return new Response(JSON.stringify(newTodo), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in POST /api/todos:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}