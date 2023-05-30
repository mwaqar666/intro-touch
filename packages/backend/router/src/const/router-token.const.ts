import { Token } from "ioc-class";
import type { IRouteBuilder, IRouteHandler, IRouteRegister, IStackRouter } from "@/backend/router/interface";

export class RouterTokenConst {
	public static readonly StackRouterToken: Token<IStackRouter> = new Token<IStackRouter>("StackRouterToken");
	public static readonly RouteBuilderToken: Token<IRouteBuilder> = new Token<IRouteBuilder>("RouteBuilderToken");
	public static readonly RouteRegisterToken: Token<IRouteRegister> = new Token<IRouteRegister>("RouteRegisterToken");
	public static readonly RouteHandlerToken: Token<IRouteHandler> = new Token<IRouteHandler>("RouteHandlerToken");
}
