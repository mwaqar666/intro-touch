import type { IFormDataFileField } from "@/backend-core/request-processor/types";

export class UploadedMedia implements IFormDataFileField {
	public constructor(
		public readonly filename: string,
		public readonly type: string,
		public readonly data: Buffer,
	) {}

	public sizeInBytes(): number {
		return Buffer.byteLength(this.data);
	}

	public sizeInKiloBytes(): number {
		return this.sizeInBytes() / 1024;
	}

	public sizeInMegaBytes(): number {
		return this.sizeInKiloBytes() / 1024;
	}
}
