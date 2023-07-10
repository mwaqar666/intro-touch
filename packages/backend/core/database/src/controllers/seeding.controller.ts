import { Controller } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import { DbTokenConst } from "@/backend-core/database/const";
import type { SeederResponseDto } from "@/backend-core/database/dto/seed";
import type { ISeederRunner } from "@/backend-core/database/interface/seeder";

@Controller
export class SeedingController {
	public constructor(
		// Dependencies

		@Inject(DbTokenConst.SeederRunnerToken) private readonly seederRunner: ISeederRunner,
	) {}

	public async seed(): Promise<SeederResponseDto> {
		const seeders: Array<string> = await this.seederRunner.runSeeders();

		return { seeders };
	}
}
