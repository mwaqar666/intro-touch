import { compare, hash } from "bcryptjs";
import type { IHash } from "@/backend-core/authentication/interface";

export class HashService implements IHash {
	public async hash(text: string): Promise<string> {
		return await hash(text, 10);
	}

	public async compare(text: string, hash: string): Promise<boolean> {
		return compare(text, hash);
	}
}
