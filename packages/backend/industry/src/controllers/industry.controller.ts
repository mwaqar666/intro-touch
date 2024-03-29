import { Body, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { IndustryEntity } from "@/backend/industry/db/entities";
import { CreateIndustryRequestDto } from "@/backend/industry/dto/create-industry";
import { UpdateIndustryRequestDto } from "@/backend/industry/dto/update-industry";
import { IndustryService } from "@/backend/industry/services";

@Controller
export class IndustryController {
	public constructor(
		// Dependencies

		@Inject(IndustryService) private readonly industryService: IndustryService,
	) {}

	public async getIndustryList(): Promise<{ industries: Array<IndustryEntity> }> {
		return { industries: await this.industryService.getIndustryList() };
	}

	public async getIndustry(@Path("industryUuid") industryUuid: string): Promise<{ industry: IndustryEntity }> {
		return { industry: await this.industryService.getIndustry(industryUuid) };
	}

	public async createIndustry(@Body(CreateIndustryRequestDto) createIndustryRequestDto: CreateIndustryRequestDto): Promise<{ industry: IndustryEntity }> {
		return { industry: await this.industryService.createIndustry(createIndustryRequestDto) };
	}

	public async updateIndustry(@Path("industryUuid") industryUuid: string, @Body(UpdateIndustryRequestDto) updateIndustryRequestDto: UpdateIndustryRequestDto): Promise<{ industry: IndustryEntity }> {
		return { industry: await this.industryService.updateIndustry(industryUuid, updateIndustryRequestDto) };
	}

	public async deleteIndustry(@Path("industryUuid") industryUuid: string): Promise<{ deleted: boolean }> {
		return { deleted: await this.industryService.deleteIndustry(industryUuid) };
	}
}
