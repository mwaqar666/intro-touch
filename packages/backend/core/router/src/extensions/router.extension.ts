import { App } from "@/backend-core/core/extensions";
import type { Constructable } from "@/stacks/types";
import { RouterTokenConst } from "@/backend-core/router/const";
import type { IRouteBuilder, IRouter } from "@/backend-core/router/interface";

export class RouterExtension {
	public static addRouter(router: Constructable<IRouter, Array<any>>): void {
		App.container.registerSingleton(router);

		const resolvedRouter: IRouter = App.container.resolve(router);

		const routeBuilder: IRouteBuilder = App.container.resolve(RouterTokenConst.RouteBuilderToken);

		routeBuilder.addRouter(resolvedRouter);
	}
}
