import type { UploadedFile } from "@/backend-core/request-processor/dto";
import type { Nullable } from "@/stacks/types";

export interface IStorageDriver {
	storeFile(directory: string, key: string, value: UploadedFile): Promise<string>;

	getFile(directory: string, key: string): Promise<Nullable<string>>;

	deleteFile(directory: string, key: string): Promise<void>;
}
