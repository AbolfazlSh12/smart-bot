import { TelegramUpdate } from './types/telegram';
import { callGroqAPI } from './services/groq';
import { sendTelegramMessage } from './services/telegram';

export interface Env {
	BOT_TOKEN: string;
	GROQ_API_KEY: string;
}

const handleRequest = async (request: Request, env: Env): Promise<Response> => {
	if (request.method !== 'POST') {
		return new Response('Method not allowed', { status: 405 });
	}

	try {
		console.log('Received request');
		const update: TelegramUpdate = await request.json();
		console.log('Update:', JSON.stringify(update));

		if (!update.message?.text) {
			return new Response('No message text found', { status: 400 });
		}

		console.log('Calling Groq API...');
		const groqResponse = await callGroqAPI(update.message.text, env.GROQ_API_KEY);
		console.log('Groq response:', groqResponse);

		console.log('Sending Telegram message...');
		await sendTelegramMessage(update.message.chat.id, groqResponse, env.BOT_TOKEN);
		console.log('Message sent successfully');

		return new Response('OK', { status: 200 });
	} catch (error) {
		console.error('Error:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return new Response(`Error: ${errorMessage}`, { status: 500 });
	}
};

export default {
	fetch: handleRequest,
};
