import { Controller, Query } from "@/backend-core/request-processor/decorators";
import { ResponseHandler } from "@/backend-core/request-processor/extensions";
import type { ISuccessfulResponse } from "@/backend-core/request-processor/types";
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

	public async runMigrations(): Promise<ISuccessfulResponse<string>> {
		await this.migrationRunner.runMigrations();

		return ResponseHandler.sendResponse("Done");
	}

	public async revertMigrations(@Query(MigrationQueryDto) migrationQueryDto: MigrationQueryDto): Promise<ISuccessfulResponse<string>> {
		await this.migrationRunner.revertMigrations({
			step: migrationQueryDto.step ? migrationQueryDto.step : 0,
		});

		return ResponseHandler.sendResponse("Done");
	}
}
