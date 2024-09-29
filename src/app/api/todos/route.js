import { dbConnect } from '../../lib/dbConnect';
import Todo from '../../../../models/todo';
import User from '../../../../models/user';
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
    
    const user = await User.findById(userId).select('groups');
    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found.' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const groupIds = user.groups; // Get the list of group IDs

    const todos = await Todo.find({ groupId: { $in: groupIds } }).sort({ created: -1 });

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
  await dbConnect();

  try {
    const userId = authenticateUser(request);
    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'Authentication failed.' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();

    if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Task name is required and must be a non-empty string.' }),
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
