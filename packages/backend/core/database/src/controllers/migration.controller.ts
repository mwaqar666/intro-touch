import { Controller, Query } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import { DbTokenConst } from "@/backend-core/database/const";
import { MigrationQueryDto } from "@/backend-core/database/dto/migration";
import type { IMigrationRunner } from "@/backend-core/database/interface";

@Controller
export class MigrationController {
	public constructor(
		// Dependencies
		@Inject(DbTokenConst.MigrationRunnerToken) private readonly migrationRunner: IMigrationRunner,
	) {}

	public async runMigrations(): Promise<string> {
		await this.migrationRunner.runMigrations();

		return "Done";
	}

	public async revertMigrations(@Query(MigrationQueryDto) migrationQueryDto: MigrationQueryDto): Promise<string> {
		await this.migrationRunner.revertMigrations({
			step: migrationQueryDto.step ? migrationQueryDto.step : 0,
		});

		return "Done";
	}
}
