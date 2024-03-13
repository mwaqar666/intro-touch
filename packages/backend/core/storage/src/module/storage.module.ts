import { AbstractModule } from "@/backend-core/core/concrete/module";
import { StorageTokenConst } from "@/backend-core/storage/const";
import { S3StorageDriver } from "@/backend-core/storage/drivers";
import { StorageService } from "@/backend-core/storage/services";

export class StorageModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(S3StorageDriver);

		this.container.registerSingleton(StorageTokenConst.StorageServiceToken, StorageService);
	}
}
