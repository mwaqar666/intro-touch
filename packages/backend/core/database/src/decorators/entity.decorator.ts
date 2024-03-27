import { randomUUID } from "crypto";
import type { Delegate, Optional } from "@/stacks/types";
import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, PrimaryKey, Unique, UpdatedAt } from "sequelize-typescript";
import type { ModelClassGetter } from "sequelize-typescript/dist/model/shared/model-class-getter";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { IEntityBooleanColumnOptions, IEntityDateColumnOptions, IEntityIntegerColumnOptions, IEntityStringColumnOptions, IEntityTextColumnOptions, IEntityType } from "@/backend-core/database/types";

export type TimestampColumn = "createdAtColumnName" | "updatedAtColumnName" | "deletedAtColumnName";

const ApplyTimestampDecorator = <TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string, timestampDecorator: PropertyDecorator, timestampKey: TimestampColumn): void => {
	const concreteEntity: IEntityType<TEntity> = <IEntityType<TEntity>>target.constructor;
	concreteEntity[timestampKey] = propertyKey;

	timestampDecorator(target, propertyKey);
};

const CreateEntityStringColumnOptions = (stringColumnOptions: Optional<Partial<IEntityStringColumnOptions>>): Required<IEntityStringColumnOptions> => {
	return {
		length: (stringColumnOptions && stringColumnOptions.length) ?? 255,
		nullable: (stringColumnOptions && stringColumnOptions.nullable) ?? false,
	};
};

const CreateEntityIntegerColumnOptions = (integerColumnOptions: Optional<Partial<IEntityIntegerColumnOptions>>): Required<IEntityIntegerColumnOptions> => {
	return {
		nullable: (integerColumnOptions && integerColumnOptions.nullable) ?? false,
	};
};

const CreateEntityDateColumnOptions = (dateColumnOptions: Optional<Partial<IEntityDateColumnOptions>>): Required<IEntityDateColumnOptions> => {
	return {
		nullable: (dateColumnOptions && dateColumnOptions.nullable) ?? false,
	};
};

const CreateEntityBooleanColumnOptions = (booleanColumnOptions: Optional<Partial<IEntityBooleanColumnOptions>>): Required<IEntityBooleanColumnOptions> => {
	return {
		nullable: (booleanColumnOptions && booleanColumnOptions.nullable) ?? false,
	};
};

const CreateEntityTextColumnOptions = (textColumnOptions: Optional<Partial<IEntityTextColumnOptions>>): Required<IEntityTextColumnOptions> => {
	return {
		nullable: (textColumnOptions && textColumnOptions.nullable) ?? false,
	};
};

export const PrimaryKeyColumn: PropertyDecorator = <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
	Column({ type: DataType.INTEGER })(target, propertyKey);
	AutoIncrement(target, propertyKey);
	PrimaryKey(target, propertyKey);
});

export const UuidKeyColumn: PropertyDecorator = <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
	const concreteEntity: IEntityType<TEntity> = <IEntityType<TEntity>>target.constructor;
	concreteEntity.uuidColumnName = propertyKey;

	Column({ type: DataType.STRING(50) })(target, propertyKey);
	AllowNull(false)(target, propertyKey);
	Default(randomUUID)(target, propertyKey);
	Unique(target, propertyKey);
});

export const ForeignKeyColumn: Delegate<[ModelClassGetter<any, any>, boolean?], PropertyDecorator> = (entityGetter: ModelClassGetter<any, any>, nullable: boolean = false) => {
	return <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
		const concreteEntity: IEntityType<TEntity> = <IEntityType<TEntity>>target.constructor;
		concreteEntity.foreignKeyNames.push(propertyKey);

		Column({ type: DataType.INTEGER })(target, propertyKey);
		AllowNull(nullable)(target, propertyKey);
		ForeignKey(entityGetter)(target, propertyKey);
	});
};

export const StringColumn: Delegate<[Partial<IEntityStringColumnOptions>?], PropertyDecorator> = (entityStringColumnOptions?: Partial<IEntityStringColumnOptions>) => {
	return <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
		const options: Required<IEntityStringColumnOptions> = CreateEntityStringColumnOptions(entityStringColumnOptions);

		Column({ type: DataType.STRING(options.length) })(target, propertyKey);
		AllowNull(options.nullable)(target, propertyKey);
	});
};

export const IntegerColumn: Delegate<[Partial<IEntityIntegerColumnOptions>?], PropertyDecorator> = (entityIntegerColumnOptions?: Partial<IEntityIntegerColumnOptions>) => {
	return <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
		const options: Required<IEntityIntegerColumnOptions> = CreateEntityIntegerColumnOptions(entityIntegerColumnOptions);

		Column({ type: DataType.INTEGER })(target, propertyKey);
		AllowNull(options.nullable)(target, propertyKey);
	});
};

export const DateColumn: Delegate<[Partial<IEntityDateColumnOptions>?], PropertyDecorator> = (entityDateColumnOptions?: Partial<IEntityDateColumnOptions>) => {
	return <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
		const options: Required<IEntityDateColumnOptions> = CreateEntityDateColumnOptions(entityDateColumnOptions);

		Column({ type: DataType.DATE })(target, propertyKey);
		AllowNull(options.nullable)(target, propertyKey);
	});
};

export const BooleanColumn: Delegate<[Partial<IEntityBooleanColumnOptions>?], PropertyDecorator> = (entityBooleanColumnOptions?: Partial<IEntityBooleanColumnOptions>) => {
	return <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
		const options: Required<IEntityBooleanColumnOptions> = CreateEntityBooleanColumnOptions(entityBooleanColumnOptions);

		Column({ type: DataType.BOOLEAN })(target, propertyKey);
		AllowNull(options.nullable)(target, propertyKey);
	});
};

export const TextColumn: Delegate<[Partial<IEntityTextColumnOptions>?], PropertyDecorator> = (entityTextColumnOptions?: Partial<IEntityTextColumnOptions>) => {
	return <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
		const options: Required<IEntityTextColumnOptions> = CreateEntityTextColumnOptions(entityTextColumnOptions);

		Column({ type: DataType.TEXT })(target, propertyKey);
		AllowNull(options.nullable)(target, propertyKey);
	});
};

export const CreatedAtColumn: PropertyDecorator = <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
	ApplyTimestampDecorator(target, propertyKey, <PropertyDecorator>CreatedAt, "createdAtColumnName");
});

export const UpdatedAtColumn: PropertyDecorator = <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
	ApplyTimestampDecorator(target, propertyKey, <PropertyDecorator>UpdatedAt, "updatedAtColumnName");
});

export const DeletedAtColumn: PropertyDecorator = <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
	ApplyTimestampDecorator(target, propertyKey, <PropertyDecorator>DeletedAt, "deletedAtColumnName");
});

export const DefaultUuid: PropertyDecorator = <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
	Default(randomUUID)(target, propertyKey);
});

export const IsActiveColumn: PropertyDecorator = <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
	const concreteEntity: IEntityType<TEntity> = <IEntityType<TEntity>>target.constructor;
	concreteEntity.isActiveColumnName = propertyKey;

	Column({ type: DataType.BOOLEAN })(target, propertyKey);
	AllowNull(false)(target, propertyKey);
	Default(true)(target, propertyKey);
});
