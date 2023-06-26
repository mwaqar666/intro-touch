import { ResponseHandler } from "@/backend-core/request-processor/extensions";
import type { IControllerRequest, ISuccessfulResponse } from "@/backend-core/request-processor/types";
import type { IPathParams, IQueryParams } from "@/backend-core/router/interface";
import type { Optional } from "@/stacks/types";
import { Inject } from "iocc";
import { DbTokenConst } from "@/backend-core/database/const";
import type { IMigrationRunner } from "@/backend-core/database/interface";

export interface IMigrationRevertQueryParams extends IQueryParams {
	step?: Optional<string>;
}

export class MigrationController {
	public constructor(
		// Dependencies
		@Inject(DbTokenConst.MigrationRunnerToken) private readonly migrationRunner: IMigrationRunner,
	) {}

	public async runMigrations(): Promise<ISuccessfulResponse<string>> {
		await this.migrationRunner.runMigrations();

		return ResponseHandler.sendResponse("Done");
	}

	public async revertMigrations(request: IControllerRequest<unknown, IPathParams, IMigrationRevertQueryParams>): Promise<ISuccessfulResponse<string>> {
		await this.migrationRunner.revertMigrations({
			step: request.queryParams.step ? +request.queryParams.step : 0,
		});

		return ResponseHandler.sendResponse("Done");
	}
}
