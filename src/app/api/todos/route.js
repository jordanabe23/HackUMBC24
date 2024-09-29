import { dbConnect } from '../../lib/dbConnect';
import Todo from '../../../../models/todo';
import User from '../../../../models/user';
import jwt from 'jsonwebtoken';

// Utility function to authenticate the user
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

// GET request handler
export async function GET(request) {
  await dbConnect(); // Ensure database connection

  try {
    const userId = authenticateUser(request);

    // Fetch the user's information including their group IDs
    const user = await User.findById(userId).select('groups');
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const groupIds = user.groups; // Get the list of group IDs

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

// POST request handler
export async function POST(request) {
  await dbConnect();

  try {
    const userId = authenticateUser(request); // Authenticate the user

    const body = await request.json();

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Todo name is required and must be a non-empty string.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!body.groupId || typeof body.groupId !== 'string' || body.groupId.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Group ID is required.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await User.findById(userId).select('groups');
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const validGroupIds = user.groups;
    if (!validGroupIds.includes(body.groupId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid group ID.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a new Todo instance with the provided data
    const newTodo = new Todo({
      name: body.name.trim(),
      description: body.description ? body.description.trim() : '',
      recurrence: ['once', 'daily', 'weekly', 'monthly'].includes(body.recurrence) ? body.recurrence : 'once',
      created: new Date(),
      completed: false,
      last_check: null, // Default as null
      groupId: body.groupId,
      userId,
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

// PUT request handler to update 'completed' status of a todo
export async function PUT(request) {
  console.log('Starting PUT request'); // Log start
  await dbConnect(); // Ensure database connection

  try {
    const userId = authenticateUser(request); // Authenticate the user
    console.log('User authenticated:', userId); // Log authenticated user

    const body = await request.json();
    console.log('Request body received:', body); // Log body

    const { completed } = body; // Only receive 'completed' in body
    const { searchParams } = new URL(request.url); // Extract todoId from query parameters
    const todoId = searchParams.get('todoId'); // Fetch the todoId from the URL query

    if (!todoId) {
      return new Response(
        JSON.stringify({ error: 'todoId is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (typeof completed !== 'boolean') {
      console.error('Validation failed: Completed must be a boolean');
      return new Response(
        JSON.stringify({ error: 'Completed status must be a boolean.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Find and update the todo's completed status
    const updatedTodo = await Todo.findByIdAndUpdate(
      todoId,
      { completed }, // Update the completed status
      { new: true }  // Return the updated document
    );

    if (!updatedTodo) {
      return new Response(
        JSON.stringify({ error: 'Todo not found.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Todo updated successfully:', updatedTodo);

    return new Response(JSON.stringify(updatedTodo), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in PUT /api/todos:', error.message); // Log the actual error
    return new Response(
      JSON.stringify({ error: `Internal Server Error: ${error.message}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
