import type { QueryInterface } from "sequelize";

export interface IMigration {
	up(queryInterface: QueryInterface): Promise<void>;

	down(queryInterface: QueryInterface): Promise<void>;
}
