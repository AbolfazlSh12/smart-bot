import axios from 'axios';

export const sendTelegramMessage = async (chatId: number, text: string, botToken: string): Promise<void> => {
	await axios.post(
		`https://api.telegram.org/bot${botToken}/sendMessage`,
		{
			chat_id: chatId,
			text,
		},
		{
			headers: {
				'Content-Type': 'application/json',
			},
		}
	);
};
