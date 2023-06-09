import { DbTokenConst } from "@/backend-core/database/const";
import type { IDbConnector } from "@/backend-core/database/interface";
import type { IDatabase } from "@/backend-core/database/types";
import { Inject } from "iocc";

export class UserRepository {
	public constructor(
		// Dependencies
		@Inject(DbTokenConst.DbConnectorToken) protected readonly dbConnector: IDbConnector<IDatabase>,
	) {}

	public async findAll(userName: string): Promise<void> {
		console.log(
			await this.dbConnector
				.getDatabaseConnection()
				.selectFrom("users")
				.where((query) => {
					return query.or([
						//
						query.cmpr("userFirstName", "=", userName),
						query.cmpr("userMiddleName", "=", userName),
						query.cmpr("userLastName", "=", userName),
					]);
				})
				.execute(),
		);
	}
}
