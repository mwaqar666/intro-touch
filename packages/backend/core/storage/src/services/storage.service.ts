import { ConfigTokenConst } from "@/backend-core/config/const";
import type { IAppConfigResolver, IStorageConfig } from "@/backend-core/config/types";
import { App } from "@/backend-core/core/extensions";
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

	public async storeObject(directory: string, key: string, value: string | Buffer): Promise<void> {
		await this.storageDriver.storeObject(directory, key, value);
	}

	public async getObject(directory: string, key: string): Promise<Nullable<string>> {
		return this.storageDriver.getObject(directory, key);
	}

	public async deleteObject(directory: string, key: string): Promise<void> {
		await this.storageDriver.deleteObject(directory, key);
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
