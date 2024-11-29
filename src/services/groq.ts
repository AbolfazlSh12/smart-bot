import axios from 'axios';
import { GroqChatResponse, ChatMessage } from '../types/groq';
import { SYSTEM_PROMPT } from '../config/constants';

export class GroqClient {
	private readonly baseUrl = 'https://api.groq.com/openai/v1/chat/completions';

	constructor(private readonly apiKey: string) {}

	/**
	 * Gets a chat completion from Groq API with conversation history
	 * @param messages - Array of previous messages in the conversation
	 * @returns Promise<string> - The AI's response
	 */
	async getChatCompletionWithHistory(messages: ChatMessage[]): Promise<string> {
		const conversationMessages = [{ role: 'system', content: SYSTEM_PROMPT }, ...messages];

		try {
			const response = await axios.post<GroqChatResponse>(
				this.baseUrl,
				{
					model: 'llama3-8b-8192',
					messages: conversationMessages,
					temperature: 0.7,
					max_tokens: 800,
				},
				{
					headers: {
						Authorization: `Bearer ${this.apiKey}`,
						'Content-Type': 'application/json',
					},
				}
			);

			return response.data.choices[0].message.content;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				throw new Error(`Groq API error: ${error.response?.data || error.message}`);
			}
			throw error;
		}
	}
}
