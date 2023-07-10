import { Inject } from "iocc";
import { PlatformRepository } from "@/backend/platform/db/repositories";

export class PlatformService {
	public constructor(@Inject(PlatformRepository) private readonly platformRepository: PlatformRepository) {}
}
