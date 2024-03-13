import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfig, IAppConfigResolver } from "@/backend-core/config/types";
import type { UploadedFile } from "@/backend-core/request-processor/dto";
import { InternalServerException } from "@/backend-core/request-processor/exceptions";
import type { Nullable } from "@/stacks/types";
import type { DeleteObjectCommandInput, GetObjectCommandInput, GetObjectCommandOutput, PutObjectCommandInput } from "@aws-sdk/client-s3";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Inject } from "iocc";
import type { IStorageDriver } from "@/backend-core/storage/interfaces";

export class S3StorageDriver implements IStorageDriver {
	private readonly s3Client: S3Client;

	public constructor(
		// Dependencies

		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {
		this.s3Client = this.prepareS3Client();
	}

	public async storeFile(directory: string, key: string, value: UploadedFile): Promise<string> {
		const putObjectCommandInput: PutObjectCommandInput = {
			Bucket: directory,
			Key: key,
			Body: value.fileData,
			ACL: "public-read",
			ContentType: value.fileType,
			ContentLength: value.sizeInBytes(),
			ContentEncoding: value.fileEncoding,
		};

		const putObjectCommand: PutObjectCommand = new PutObjectCommand(putObjectCommandInput);

		try {
			await this.s3Client.send(putObjectCommand);

			return `https://${directory}.s3.amazonaws.com/${key}`;
		} catch (error: unknown) {
			const exception: Error = error as Error;

			throw new InternalServerException(exception.message);
		}
	}

	public async getFile(directory: string, key: string): Promise<Nullable<string>> {
		const getObjectCommandInput: GetObjectCommandInput = {
			Bucket: directory,
			Key: key,
		};

		const getObjectCommand: GetObjectCommand = new GetObjectCommand(getObjectCommandInput);

		try {
			const getObjectCommandOutput: GetObjectCommandOutput = await this.s3Client.send(getObjectCommand);

			if (!getObjectCommandOutput.Body) return null;

			return getObjectCommandOutput.Body.transformToString("base64");
		} catch (error: unknown) {
			const exception: Error = error as Error;

			throw new InternalServerException(exception.message);
		}
	}

	public async deleteFile(directory: string, key: string): Promise<void> {
		const deleteObjectCommandInput: DeleteObjectCommandInput = {
			Bucket: directory,
			Key: key,
		};

		const deleteObjectCommand: DeleteObjectCommand = new DeleteObjectCommand(deleteObjectCommandInput);

		try {
			await this.s3Client.send(deleteObjectCommand);
		} catch (error: unknown) {
			const exception: Error = error as Error;

			throw new InternalServerException(exception.message);
		}
	}

	private prepareS3Client(): S3Client {
		const { region }: IAppConfig = this.configResolver.resolveConfig("app");

		return new S3Client({ region });
	}
}
