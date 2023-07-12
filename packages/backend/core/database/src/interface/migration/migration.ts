import type { QueryInterface } from "sequelize";

export interface IMigration {
	timestamp: number;

	setQueryInterface(queryInterface: QueryInterface): void;

	up(): Promise<void>;

	down(): Promise<void>;
}
