import type { Nullable } from "@/stacks/types";

export interface IStorageDriver {
	storeObject(directory: string, key: string, value: string | Buffer): Promise<void>;

	getObject(directory: string, key: string): Promise<Nullable<string>>;

	deleteObject(directory: string, key: string): Promise<void>;
}
