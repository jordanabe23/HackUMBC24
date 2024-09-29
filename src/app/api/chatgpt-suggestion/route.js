import { OpenAI } from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure your API key is set in the environment variables
});

const generateSuggestion = async (todo) => {
  try {
    const prompt = `You are an assistant. A user has the following task: "${todo.text}". Here's more context: "${todo.description}". Please provide a one-line helpful suggestion or tip for this task.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 50,
      temperature: 0.7,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating suggestion:', error);
    throw new Error('Failed to generate suggestion');
  }
};

// API route handler
export async function POST(req) {
  try {
    const { todo } = await req.json();

    if (!todo || !todo.text) {
      return new Response(JSON.stringify({ error: 'Todo item is required' }), { status: 400 });
    }

    // Generate suggestion using OpenAI API
    const suggestion = await generateSuggestion(todo);

    return new Response(JSON.stringify({ text: suggestion }), { status: 200 });
  } catch (error) {
    console.error('Error handling request:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate suggestion' }), { status: 500 });
  }
}
