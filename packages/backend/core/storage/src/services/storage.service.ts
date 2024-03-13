import { randomUUID } from "crypto";
import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IStorageConfig } from "@/backend-core/config/types";
import { App } from "@/backend-core/core/extensions";
import type { UploadedFile } from "@/backend-core/request-processor/dto";
import type { Nullable } from "@/stacks/types";
import { Inject } from "iocc";
import { S3StorageDriver } from "@/backend-core/storage/drivers";
import { StorageDriver } from "@/backend-core/storage/enums";
import type { IStorageDriver } from "@/backend-core/storage/interfaces";

export class StorageService {
	private storageDriver: IStorageDriver;

	public constructor(
		// Dependencies

		@Inject(ConfigTokenConst.ConfigResolverToken) private readonly configResolver: IAppConfigResolver,
	) {
		this.initializeStorage();
	}

	public async storeFile(directory: string, value: UploadedFile): Promise<string> {
		const uniqueKey: string = `${randomUUID()}.${value.fileExtension}`;

		return await this.storageDriver.storeFile(directory, uniqueKey, value);
	}

	public async getFile(directory: string, key: string): Promise<Nullable<string>> {
		return await this.storageDriver.getFile(directory, key);
	}

	public async deleteFile(directory: string, key: string): Promise<void> {
		await this.storageDriver.deleteFile(directory, key);
	}

	public useDriver(storageDriver: StorageDriver): StorageService {
		this.initializeStorage(storageDriver);

		return this;
	}

	private initializeStorage(): void;
	private initializeStorage(storageDriver: StorageDriver): void;
	private initializeStorage(storageDriver?: StorageDriver): void {
		if (storageDriver) {
			this.storageDriver = this.getStorageDriver(storageDriver);

			return;
		}

		const storageConfig: IStorageConfig = this.configResolver.resolveConfig("storage");

		this.storageDriver = this.getStorageDriver(storageConfig.driver);
	}

	private getStorageDriver(storageDriver: StorageDriver): IStorageDriver {
		switch (storageDriver) {
			case StorageDriver.S3:
				return App.container.resolve(S3StorageDriver);
		}
	}
}
