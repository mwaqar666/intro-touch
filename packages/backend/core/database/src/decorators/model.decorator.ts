import type { Delegate } from "@/stacks/types";
import { AllowNull, AutoIncrement, Column, CreatedAt, DataType, Default, DeletedAt, ForeignKey, PrimaryKey, Unique, UpdatedAt } from "sequelize-typescript";
import type { ModelClassGetter } from "sequelize-typescript/dist/model/shared/model-class-getter";
import { v4 as uuid } from "uuid";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { EntityType } from "@/backend-core/database/types";

export const PrimaryKeyColumn: PropertyDecorator = <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
	Column({ type: DataType.INTEGER })(target, propertyKey);
	AutoIncrement(target, propertyKey);
	PrimaryKey(target, propertyKey);
});

export const UuidKeyColumn: PropertyDecorator = <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
	const concreteEntity: EntityType<TEntity> = <EntityType<TEntity>>target.constructor;
	concreteEntity.uuidColumnName = propertyKey;

	Column({ type: DataType.STRING(50) })(target, propertyKey);
	AllowNull(false)(target, propertyKey);
	Default(uuid)(target, propertyKey);
	Unique(target, propertyKey);
});

export const ForeignKeyColumn: Delegate<[ModelClassGetter<any, any>, boolean?], PropertyDecorator> = (entityGetter: ModelClassGetter<any, any>, nullable = false) => {
	return <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
		const concreteEntity: EntityType<TEntity> = <EntityType<TEntity>>target.constructor;
		concreteEntity.foreignKeyNames.push(propertyKey);

		Column({ type: DataType.INTEGER })(target, propertyKey);
		AllowNull(nullable)(target, propertyKey);
		ForeignKey(entityGetter)(target, propertyKey);
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
	Default(uuid)(target, propertyKey);
});

export const IsActiveColumn: PropertyDecorator = <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
	const concreteEntity: EntityType<TEntity> = <EntityType<TEntity>>target.constructor;
	concreteEntity.isActiveColumnName = propertyKey;

	Column({ type: DataType.BOOLEAN })(target, propertyKey);
	AllowNull(false)(target, propertyKey);
	Default(true)(target, propertyKey);
});

const ApplyTimestampDecorator = <TEntity extends BaseEntity<TEntity>, TimestampKey extends "createdAtColumnName" | "updatedAtColumnName" | "deletedAtColumnName">(
	target: TEntity,
	propertyKey: string,
	timestampDecorator: PropertyDecorator,
	timestampKey: TimestampKey,
): void => {
	const concreteEntity: EntityType<TEntity> = <EntityType<TEntity>>target.constructor;
	concreteEntity[timestampKey] = propertyKey;

	timestampDecorator(target, propertyKey);
};
