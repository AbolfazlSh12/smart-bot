import axios from 'axios';
import { TelegramResponse } from '../types/telegram';

export class TelegramClient {
	private readonly baseUrl: string;

	constructor(private readonly token: string) {
		this.baseUrl = `https://api.telegram.org/bot${token}`;
	}

	/**
	 * Sends a message to a specific Telegram chat
	 * @param chatId - The ID of the chat to send the message to
	 * @param text - The message text to send
	 * @returns Promise<void>
	 */
	async sendMessage(chatId: number, text: string): Promise<void> {
		await axios.post<TelegramResponse>(`${this.baseUrl}/sendMessage`, {
			chat_id: chatId,
			text: text,
			parse_mode: 'Markdown',
		});
	}

	/**
	 * Sends a chat action (typing indicator) to a specific chat
	 * @param chatId - The ID of the chat
	 */
	async sendTypingAction(chatId: number): Promise<void> {
		await axios.post(`${this.baseUrl}/sendChatAction`, {
			chat_id: chatId,
			action: 'typing',
		});
	}
}
