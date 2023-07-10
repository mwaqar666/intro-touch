import type { QueryInterface } from "sequelize";
import type { ModelAttributeColumnOptions } from "sequelize/types/model";
import { DataType } from "sequelize-typescript";
import type { IMigration } from "@/backend-core/database/interface/migration";

export abstract class AbstractMigration implements IMigration {
	public abstract timestamp: number;

	protected queryInterface: QueryInterface;

	public setQueryInterface(queryInterface: QueryInterface): void {
		this.queryInterface = queryInterface;
	}

	public abstract down(): Promise<void>;

	public abstract up(): Promise<void>;

	protected createPrimaryKeyProps(): ModelAttributeColumnOptions {
		return {
			primaryKey: true,
			autoIncrement: true,
			type: DataType.INTEGER,
		};
	}

	protected createUuidKeyProps(): ModelAttributeColumnOptions {
		return {
			unique: true,
			allowNull: false,
			type: DataType.STRING(50),
		};
	}

	protected createForeignKeyProps(allowNull = false): ModelAttributeColumnOptions {
		return {
			allowNull,
			type: DataType.INTEGER,
		};
	}

	protected createIsActiveKeyProps(): ModelAttributeColumnOptions {
		return {
			defaultValue: true,
			allowNull: false,
			type: DataType.BOOLEAN,
		};
	}

	protected createCreatedAtKeyProps(): ModelAttributeColumnOptions {
		return {
			allowNull: false,
			type: DataType.DATE,
		};
	}

	protected createUpdatedAtKeyProps(): ModelAttributeColumnOptions {
		return {
			allowNull: false,
			type: DataType.DATE,
		};
	}

	protected createDeletedAtKeyProps(): ModelAttributeColumnOptions {
		return {
			allowNull: true,
			type: DataType.DATE,
		};
	}

	protected createForeignKeyConstraint(targetTable: string, targetColumn: string, sourceTable: string, sourceColumn: string): Promise<void> {
		return this.queryInterface.addConstraint(targetTable, {
			type: "foreign key",
			name: this.createForeignKeyConstraintName(targetTable, targetColumn),
			fields: [targetColumn],
			references: {
				table: sourceTable,
				field: sourceColumn,
			},
			onUpdate: "cascade",
			onDelete: "cascade",
		});
	}

	protected dropForeignKeyConstraint(targetTable: string, targetColumn: string): Promise<void> {
		return this.queryInterface.removeConstraint(targetTable, this.createForeignKeyConstraintName(targetTable, targetColumn));
	}

	protected createForeignKeyConstraintName(targetTable: string, targetColumn: string): string {
		return `${targetTable}_${targetColumn}_fkey`;
	}
}
