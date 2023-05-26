import { RouteMethod } from "@/backend/router/enum";
import type { IRoute } from "@/backend/router/interface";

export const userRoutes: Array<IRoute> = [
	{
		prefix: "/user",
		authorizer: "jwt",
		routes: [
			{
				path: "{userId}",
				method: RouteMethod.POST,
				handler: "",
			},
		],
	},
];
