import { AppContainer } from "@/backend-core/core/extensions";
import type { Constructable } from "@/stacks/types";
import { RouterTokenConst } from "@/backend-core/router/const";
import type { IRouter, IRouteRegister } from "@/backend-core/router/interface";

export class RouterExtension {
	public static addRouter(router: Constructable<IRouter, Array<any>>): void {
		AppContainer.registerSingleton(router);

		const resolvedRouter: IRouter = AppContainer.resolve(router);
		const routeRegister: IRouteRegister = AppContainer.resolve(RouterTokenConst.RouteRegisterToken);
		routeRegister.addRouter(resolvedRouter);
	}
}