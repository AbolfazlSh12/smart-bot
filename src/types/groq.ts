export interface GroqResponse {
	choices: Array<{
		message: {
			content: string;
		};
	}>;
}
