import { AbstractModule } from "@/backend-core/core/concrete/module";
import { ValidationConst } from "@/backend-core/validation/const";
import { ValidatorService } from "@/backend-core/validation/services";

export class ValidationModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(ValidationConst.ValidatorToken, ValidatorService);
	}
}
