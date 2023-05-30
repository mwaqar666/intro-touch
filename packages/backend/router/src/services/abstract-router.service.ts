import type { IRoute, IRouter } from "@/backend/router/interface";

export abstract class AbstractRouter<T> implements IRouter<T> {
	protected controllers: T;

	public abstract registerRoutes(): Array<IRoute>;

	public setControllers(controllers: T): void {
		this.controllers = controllers;
	}
}
