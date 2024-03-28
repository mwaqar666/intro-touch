import { RouteMethod } from "@/backend-core/router/enum";
import type { IRoute, IRouter } from "@/backend-core/router/interface";
import { Inject } from "iocc";
import { IndustryController } from "@/backend/industry/controllers";

export class IndustryRouter implements IRouter {
	public constructor(
		// Dependencies

		@Inject(IndustryController) private readonly industryController: IndustryController,
	) {}

	public registerRoutes(): Array<IRoute> {
		return [
			{
				prefix: "/industry",
				routes: [
					{
						path: "/list",
						method: RouteMethod.Get,
						handler: this.industryController.getIndustryList,
					},
					{
						path: "/view/{industryUuid}",
						method: RouteMethod.Get,
						handler: this.industryController.getIndustry,
					},
					{
						path: "/create",
						method: RouteMethod.Post,
						handler: this.industryController.createIndustry,
					},
					{
						path: "/update/{industryUuid}",
						method: RouteMethod.Patch,
						handler: this.industryController.updateIndustry,
					},
					{
						path: "/delete/{industryUuid}",
						method: RouteMethod.Delete,
						handler: this.industryController.deleteIndustry,
					},
				],
			},
		];
	}
}
