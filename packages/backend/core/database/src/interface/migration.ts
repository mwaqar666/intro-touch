import type { QueryInterface } from "sequelize";

export interface IMigration {
	timestamp: number;

	up(queryInterface: QueryInterface): Promise<void>;

	down(queryInterface: QueryInterface): Promise<void>;
}
