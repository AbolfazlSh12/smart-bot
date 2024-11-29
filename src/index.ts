import { TelegramClient } from './services/telegram';
import { GroqClient } from './services/groq';
import { ConversationManager } from './services/conversation';
import { TelegramUpdate } from './types/telegram';

export interface Env {
	BOT_TOKEN: string;
	GROQ_API_KEY: string;
}

// Initialize conversation manager
const conversationManager = new ConversationManager();

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

			let responseText = '';

			if (text.startsWith('/start')) {
				responseText =
					'Hello! 👋 I am your AI-powered Telegram bot. I can help you with various tasks, answer questions, and engage in conversations. Feel free to ask me anything!';
				conversationManager.clearHistory(chatId);
			} else if (text.startsWith('/clear')) {
				responseText = "Conversation history cleared! Let's start fresh.";
				conversationManager.clearHistory(chatId);
			} else {
				try {
					await telegram.sendTypingAction(chatId);

					// Add user message to history and get AI response
					conversationManager.addMessage(chatId, { role: 'user', content: text });
					responseText = await groq.getChatCompletionWithHistory(conversationManager.getHistory(chatId));

					// Add AI response to history
					conversationManager.addMessage(chatId, { role: 'assistant', content: responseText });
				} catch (error) {
					console.error('Error getting AI response:', error);
					responseText = 'Sorry, I encountered an error while processing your message. Please try again later.';
				}
			}

			await telegram.sendMessage(chatId, responseText);
			return new Response('OK', { status: 200 });
		} catch (error) {
			console.error('Error processing request:', error);
			return new Response('Internal Server Error', { status: 500 });
		}
	},
};
