import { OpenAI } from 'openai';

export async function POST(req) {
    const { image } = await req.json();
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [{
            role: "user",
            content: [{
                type: "text",
                text: "Extract and transcribe all handwritten text from this whiteboard image."
            }, {
                type: "image_url",
                image_url: { url: image }
            }]
        }]
    });

    return new Response(JSON.stringify({
        text: response.choices[0].message.content
    }), {
        headers: { 'Content-Type': 'application/json' }
    });
}