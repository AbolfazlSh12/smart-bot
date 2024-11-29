import { ChatMessage } from '../types/groq';
import { MAX_HISTORY_LENGTH } from '../config/constants';

/**
 * Manages conversation history for different chats
 */
export class ConversationManager {
	private conversations = new Map<number, ChatMessage[]>();

	/**
	 * Gets or initializes conversation history for a chat
	 * @param chatId - The ID of the chat
	 * @returns Array of chat messages
	 */
	getHistory(chatId: number): ChatMessage[] {
		if (!this.conversations.has(chatId)) {
			this.conversations.set(chatId, []);
		}
		return this.conversations.get(chatId)!;
	}

	/**
	 * Adds a message to the conversation history
	 * @param chatId - The ID of the chat
	 * @param message - The message to add
	 */
	addMessage(chatId: number, message: ChatMessage): void {
		const history = this.getHistory(chatId);
		history.push(message);

		// Trim history if too long
		if (history.length > MAX_HISTORY_LENGTH) {
			history.splice(0, 2); // Remove oldest Q&A pair
		}

		this.conversations.set(chatId, history);
	}

	/**
	 * Clears the conversation history for a specific chat
	 * @param chatId - The ID of the chat
	 */
	clearHistory(chatId: number): void {
		this.conversations.set(chatId, []);
	}
}
