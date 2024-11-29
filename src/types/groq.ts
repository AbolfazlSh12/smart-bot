// src/types/telegram.ts
export interface TelegramUpdate {
	update_id: number;
	message?: {
		message_id: number;
		from: {
			id: number;
			first_name: string;
			username?: string;
		};
		chat: {
			id: number;
			type: string;
		};
		text?: string;
	};
}

export interface TelegramResponse {
	chat_id: number;
	text: string;
}

// src/types/groq.ts
export interface GroqChatResponse {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: Array<{
		index: number;
		message: {
			role: string;
			content: string;
		};
		logprobs: null;
		finish_reason: string;
	}>;
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

export interface ChatMessage {
	role: string;
	content: string;
}
