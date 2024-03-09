import { AbstractModule } from "@/backend-core/core/concrete/module";
import { StorageTokenConst } from "@/backend-core/storage/const";
import { StorageService } from "@/backend-core/storage/services";

export class StorageModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerTransient(StorageTokenConst.StorageServiceToken, StorageService);
	}
}
