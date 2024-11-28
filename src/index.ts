import { TelegramClient, GroqClient } from './services/telegram';

export interface Env {
	BOT_TOKEN: string;
	GROQ_API_KEY: string;
}

// Simple in-memory conversation history (note: this will reset when worker restarts)
const conversationHistory = new Map<number, Array<{ role: string; content: string }>>();
const MAX_HISTORY_LENGTH = 10; // Keep last 10 messages

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		if (request.method !== 'POST') {
			return new Response('Method not allowed', { status: 405 });
		}

		try {
			const update: TelegramUpdate = await request.json();

			if (!update.message?.text) {
				return new Response('OK', { status: 200 });
			}

			const telegram = new TelegramClient(env.BOT_TOKEN);
			const groq = new GroqClient(env.GROQ_API_KEY);
			const chatId = update.message.chat.id;
			const text = update.message.text;

			// Initialize or get conversation history
			if (!conversationHistory.has(chatId)) {
				conversationHistory.set(chatId, []);
			}
			const history = conversationHistory.get(chatId)!;

			let responseText = '';

			if (text.startsWith('/start')) {
				responseText =
					'Hello! 👋 I am your AI-powered Telegram bot. I can help you with various tasks, answer questions, and engage in conversations. Feel free to ask me anything!';
				// Clear history on /start
				history.length = 0;
			} else if (text.startsWith('/clear')) {
				responseText = "Conversation history cleared! Let's start fresh.";
				history.length = 0;
			} else {
				try {
					// Show typing indicator
					await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendChatAction`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							chat_id: chatId,
							action: 'typing',
						}),
					});

					// Add user message to history
					history.push({ role: 'user', content: text });

					// Get AI response with history
					responseText = await groq.getChatCompletionWithHistory(history);

					// Add AI response to history
					history.push({ role: 'assistant', content: responseText });

					// Trim history if too long
					if (history.length > MAX_HISTORY_LENGTH) {
						history.splice(0, 2); // Remove oldest QA pair
					}
				} catch (error) {
					console.error('Error getting AI response:', error);
					responseText = 'Sorry, I encountered an error while processing your message. Please try again later.';
				}
			}

			await telegram.sendMessage(chatId, responseText);

			// Update conversation history
			conversationHistory.set(chatId, history);

			return new Response('OK', { status: 200 });
		} catch (error) {
			console.error('Error processing request:', error);
			return new Response('Internal Server Error', { status: 500 });
		}
	},
};
