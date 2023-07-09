import { PlatformModule } from "@/backend/platform/module";
import { UserModule } from "@/backend/user/module";
import { AuthenticationModule } from "@/backend-core/authentication/module";
import { AuthorizationModule } from "@/backend-core/authorization/module";
import { ConfigModule } from "@/backend-core/config/module";
import type { IModule } from "@/backend-core/core/contracts/module";
import { DatabaseModule } from "@/backend-core/database/module";
import { MailerModule } from "@/backend-core/mailer/module";
import { RequestProcessorModule } from "@/backend-core/request-processor/module";
import { RouterModule } from "@/backend-core/router/module";
import { ValidationModule } from "@/backend-core/validation/module";
import type { Constructable } from "@/stacks/types";

export class ModuleRegister {
	public static applicationModules(): Array<Constructable<IModule>> {
		return [
			// Application core modules
			ConfigModule,
			DatabaseModule,
			RequestProcessorModule,
			RouterModule,
			AuthenticationModule,
			AuthorizationModule,
			ValidationModule,
			MailerModule,

			// Application business modules
			UserModule,
			PlatformModule,
		];
	}
}
