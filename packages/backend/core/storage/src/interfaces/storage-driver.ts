import type { Nullable } from "@/stacks/types";

export interface IStorageDriver {
	storeObject(key: string, value: string | Buffer): Promise<void>;

	getObject(key: string): Promise<Nullable<string>>;

	deleteObject(key: string): Promise<void>;
}
