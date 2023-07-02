import { compare, hash } from "bcryptjs";

export class HashService {
	public async hash(text: string): Promise<string> {
		return await hash(text, 10);
	}

	public async compare(text: string, hash: string): Promise<boolean> {
		return compare(text, hash);
	}
}
