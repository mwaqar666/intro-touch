import * as process from "process";

export class AuthConfig {
	public static readonly GOOGLE_CLIENT_ID: string = <string>process.env["GOOGLE_CLIENT_ID"];
}
