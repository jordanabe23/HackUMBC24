// app/api/todos/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../lib/dbConnect';
import Todo from '../../../../models/todo';
import { getServerSession } from "next-auth/next";

export async function POST(request) {
  try {
    // Connect to the database
    await connectDB();

    // Get the session to ensure the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the request body
    const { text, description, recurrence, date } = await request.json();

    // Validate the required fields
    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    // Create a new todo item
    const newTodo = new Todo({
      userId: session.user.id, // Assuming the user id is stored in the session
      text,
      description,
      recurrence,
      date: date ? new Date(date) : undefined,
    });

    // Save the todo item to the database
    await newTodo.save();

    // Return the created todo item
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Optionally, you can also implement a GET method to fetch todos
export async function GET(request) {
  try {
    // Connect to the database
    await connectDB();

    // Get the session to ensure the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch todos for the authenticated user
    const todos = await Todo.find({ userId: session.user.id });

    // Return the todos
    return NextResponse.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}