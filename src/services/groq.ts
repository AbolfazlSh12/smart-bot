import axios from 'axios';
import { GroqResponse } from '../types/groq';

export const callGroqAPI = async (message: string, apiKey: string): Promise<string> => {
	const { data } = await axios.post<GroqResponse>(
		'https://api.groq.com/v1/chat/completions',
		{
			model: 'mixtral-8x7b-32768',
			messages: [{ role: 'user', content: message }],
		},
		{
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
		}
	);

	return data.choices[0].message.content;
};
