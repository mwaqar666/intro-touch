import { Token } from "iocc";
import type { IRouteBuilder, IRouteResolver, IStackRouter } from "@/backend-core/router/interface";

export class RouterTokenConst {
	public static readonly RouteBuilderToken: Token<IRouteBuilder> = new Token<IRouteBuilder>("RouteBuilderToken");
	public static readonly RouteResolverToken: Token<IRouteResolver> = new Token<IRouteResolver>("RouteResolverToken");
	public static readonly StackRouterToken: Token<IStackRouter> = new Token<IStackRouter>("StackRouterToken");
}
