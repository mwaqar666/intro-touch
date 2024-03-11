export enum RouteType {
	/**
	 * Register route with both application layer and AWS Api Gateway Layer
	 */
	Global = "GLOBAL",

	/**
	 * Register route with application layer only
	 */
	Application = "APPLICATION",
}
