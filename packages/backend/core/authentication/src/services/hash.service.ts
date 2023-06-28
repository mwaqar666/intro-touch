import { createHash } from "crypto";

export class HashService {
	public hash(text: string): string {
		return createHash("sha256").update(text).digest("hex");
	}

	public compare(text: string, hash: string): boolean {
		return this.hash(text) === hash;
	}
}
