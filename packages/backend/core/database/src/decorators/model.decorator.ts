import { CreatedAt, DeletedAt, UpdatedAt } from "sequelize-typescript";
import type { BaseEntity } from "@/backend-core/database/entity";
import type { EntityType } from "@/backend-core/database/types";

export const CreatedAtColumn: PropertyDecorator = <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
	ApplyTimestampDecorator(target, propertyKey, <PropertyDecorator>CreatedAt, "createdAtColumnName");
});

export const UpdatedAtColumn: PropertyDecorator = <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
	ApplyTimestampDecorator(target, propertyKey, <PropertyDecorator>UpdatedAt, "updatedAtColumnName");
});

export const DeletedAtColumn: PropertyDecorator = <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
	ApplyTimestampDecorator(target, propertyKey, <PropertyDecorator>DeletedAt, "deletedAtColumnName");
});

export const UuidColumn: PropertyDecorator = <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
	const concreteEntity: EntityType<TEntity> = <EntityType<TEntity>>target.constructor;
	concreteEntity.uuidColumnName = propertyKey;
});

export const IsActiveColumn: PropertyDecorator = <PropertyDecorator>(<TEntity extends BaseEntity<TEntity>>(target: TEntity, propertyKey: string): void => {
	const concreteEntity: EntityType<TEntity> = <EntityType<TEntity>>target.constructor;
	concreteEntity.isActiveColumnName = propertyKey;
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
