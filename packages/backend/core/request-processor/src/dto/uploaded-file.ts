import type { IFormDataFileField } from "@/backend-core/request-processor/types";

export class UploadedFile implements IFormDataFileField {
	public constructor(
		public readonly fileName: string,
		public readonly fileType: string,
		public readonly fileData: Buffer,
		public readonly fileEncoding: string,
		public readonly fileExtension: string,
	) {}

	public sizeInBytes(): number {
		return Buffer.byteLength(this.fileData);
	}
}
