// Types for Telegram Update object
interface TelegramUser {
	id: number;
	first_name: string;
	last_name?: string;
	username?: string;
}

interface TelegramChat {
	id: number;
	type: string;
	username?: string;
	first_name?: string;
	last_name?: string;
}

interface TelegramMessage {
	message_id: number;
	from?: TelegramUser;
	chat: TelegramChat;
	date: number;
	text?: string;
}

interface TelegramUpdate {
	update_id: number;
	message?: TelegramMessage;
}

interface TelegramResponse {
	chat_id: number;
	text: string;
}

export interface Env {
	BOT_TOKEN: string;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		// Only allow POST requests
		if (request.method !== 'POST') {
			return new Response('Only POST requests are allowed', { status: 405 });
		}

		try {
			const payload: TelegramUpdate = await request.json();

			// Check if this is a message
			if (payload.message?.text) {
				const chatId = payload.message.chat.id;

				// Telegram Bot API endpoint
				const TELEGRAM_URL = `https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`;

				const telegramResponse: TelegramResponse = {
					chat_id: chatId,
					text: 'Hello World!',
				};

				// Send response back to Telegram
				const response = await fetch(TELEGRAM_URL, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(telegramResponse),
				});

				if (!response.ok) {
					throw new Error('Failed to send message to Telegram');
				}

				return new Response('OK', { status: 200 });
			}

			return new Response('No message found in request', { status: 400 });
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			return new Response(`Error: ${errorMessage}`, { status: 500 });
		}
	},
};
