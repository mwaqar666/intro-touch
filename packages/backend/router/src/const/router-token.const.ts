import { Token } from "typedi";
import type { IRoute, IRouteBuilder, IStackRouter } from "@/backend/router/interface";

export class RouterTokenConst {
	public static readonly StackRouterToken: Token<IStackRouter> = new Token<IStackRouter>("IStackRouter");
	public static readonly RouteBuilderToken: Token<IRouteBuilder> = new Token<IRouteBuilder>("IRouteBuilder");

	public static readonly RouteToken: Token<Array<IRoute>> = new Token<Array<IRoute>>("Array<IRoute>");
}
