export interface TelegramUser {
	id: number;
	first_name: string;
	last_name?: string;
	username?: string;
}

export interface TelegramChat {
	id: number;
	type: string;
}

export interface TelegramMessage {
	message_id: number;
	from?: TelegramUser;
	chat: TelegramChat;
	text?: string;
}

export interface TelegramUpdate {
	message?: TelegramMessage;
}
