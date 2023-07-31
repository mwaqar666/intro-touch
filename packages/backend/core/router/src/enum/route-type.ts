export enum RouteType {
	/**
	 * Register route with both application layer and AWS Api Gateway Layer
	 */
	GLOBAL = "GLOBAL",

	/**
	 * Register route with application layer only
	 */
	APPLICATION = "APPLICATION",
}
