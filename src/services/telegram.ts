export class TelegramClient {
	private readonly baseUrl: string;

	constructor(private readonly token: string) {
		this.baseUrl = `https://api.telegram.org/bot${token}`;
	}

	async sendMessage(chatId: number, text: string): Promise<Response> {
		const response = await fetch(`${this.baseUrl}/sendMessage`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chat_id: chatId,
				text: text,
				parse_mode: 'Markdown',
			}),
		});

		return response;
	}
}

export class GroqClient {
	private readonly baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
	private readonly systemPrompt = `You are a helpful and friendly AI assistant in a Telegram chat. Your responses should be:
    1. Concise yet informative
    2. Friendly and conversational
    3. Formatted using Markdown when appropriate
    4. Free of any HTML tags
    5. Limited to 4000 characters to fit Telegram's message limits

    You may use emojis sparingly when appropriate. If you need to format code, use Markdown code blocks.
    If you're unsure about something, be honest about your limitations.`;

	constructor(private readonly apiKey: string) {}

	async getChatCompletion(userMessage: string): Promise<string> {
		const response = await fetch(this.baseUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: 'llama3-8b-8192',
				messages: [
					{
						role: 'system',
						content: this.systemPrompt,
					},
					{
						role: 'user',
						content: userMessage,
					},
				],
				temperature: 0.7,
				max_tokens: 800,
				// You can also add these optional parameters:
				// presence_penalty: 0.6,  // Encourage the model to talk about new topics
				// frequency_penalty: 0.5   // Reduce repetition in responses
			}),
		});

		if (!response.ok) {
			throw new Error(`Groq API error: ${await response.text()}`);
		}

		const data = (await response.json()) as GroqChatResponse;
		return data.choices[0].message.content;
	}

	// Optional: Add a method for maintaining conversation history
	async getChatCompletionWithHistory(messages: Array<{ role: string; content: string }>): Promise<string> {
		const conversationMessages = [
			{
				role: 'system',
				content: this.systemPrompt,
			},
			...messages,
		];

		const response = await fetch(this.baseUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: 'llama3-8b-8192',
				messages: conversationMessages,
				temperature: 0.7,
				max_tokens: 800,
			}),
		});

		if (!response.ok) {
			throw new Error(`Groq API error: ${await response.text()}`);
		}

		const data = (await response.json()) as GroqChatResponse;
		return data.choices[0].message.content;
	}
}
