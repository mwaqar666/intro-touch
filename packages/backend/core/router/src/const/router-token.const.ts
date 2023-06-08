import { Token } from "iocc";
import type { IRouteBuilder, IRouteRegister, IStackRouter } from "@/backend-core/router/interface";

export class RouterTokenConst {
	public static readonly RouteBuilderToken: Token<IRouteBuilder> = new Token<IRouteBuilder>("RouteBuilderToken");
	public static readonly RouteRegisterToken: Token<IRouteRegister> = new Token<IRouteRegister>("RouteRegisterToken");
	public static readonly StackRouterToken: Token<IStackRouter> = new Token<IStackRouter>("StackRouterToken");
}
