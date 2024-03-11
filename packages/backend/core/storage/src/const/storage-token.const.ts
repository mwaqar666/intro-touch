import { Token } from "iocc";
import type { StorageService } from "@/backend-core/storage/services";

export class StorageTokenConst {
	public static readonly StorageServiceToken: Token<StorageService> = new Token<StorageService>("StorageServiceToken");
}
