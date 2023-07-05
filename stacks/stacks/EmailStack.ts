import fastGlob from "fast-glob";

export const EmailStack = async (): Promise<void> => {
	const emailTemplates: Array<string> = await fastGlob("packages/**/*.email.html");

	console.log(emailTemplates);
};
