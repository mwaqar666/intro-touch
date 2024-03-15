import { Controller } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import { DbTokenConst } from "@/backend-core/database/const";
import type { MigrationResponseDto } from "@/backend-core/database/dto/migration";
import type { IMigrationRunner } from "@/backend-core/database/interface/migration";

@Controller
export class MigrationController {
	public constructor(
		// Dependencies
		@Inject(DbTokenConst.MigrationRunnerToken) private readonly migrationRunner: IMigrationRunner,
	) {}

	public async runMigrations(): Promise<MigrationResponseDto> {
		const migrations: Array<string> = await this.migrationRunner.runMigrations();

		return { migrations };
	}

	public async revertMigrations(): Promise<MigrationResponseDto> {
		const migrations: Array<string> = await this.migrationRunner.revertMigrations();

		return { migrations };
	}
}
