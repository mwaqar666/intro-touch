import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfig, IAppConfigResolver } from "@/backend-core/config/types";
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

	public async storeObject(key: string, value: string | Buffer): Promise<void> {
		const putObjectCommandInput: PutObjectCommandInput = {
			Bucket: undefined,
			Key: key,
			Body: value,
		};

		const putObjectCommand: PutObjectCommand = new PutObjectCommand(putObjectCommandInput);

		try {
			await this.s3Client.send(putObjectCommand);
		} catch (error: unknown) {
			const exception: Error = error as Error;

			throw new InternalServerException(exception.message);
		}
	}

	public async getObject(key: string): Promise<Nullable<string>> {
		const getObjectCommandInput: GetObjectCommandInput = {
			Bucket: undefined,
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

	public async deleteObject(key: string): Promise<void> {
		const deleteObjectCommandInput: DeleteObjectCommandInput = {
			Bucket: undefined,
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
