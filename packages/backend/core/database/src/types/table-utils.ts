import type { Nullable } from "@/stacks/types";
import type { ColumnType } from "kysely";

export type ICreatedAt<TPrefix extends string> = {
	[K in TPrefix as `${TPrefix}CreatedAt`]: ColumnType<Date, string, never>;
};

export type IUpdatedAt<TPrefix extends string> = {
	[K in TPrefix as `${TPrefix}UpdatedAt`]: ColumnType<Date, string, string>;
};

export type IDeletedAt<TPrefix extends string> = {
	[K in TPrefix as `${TPrefix}DeletedAt`]: ColumnType<Nullable<Date>, null, string>;
};

export type ITimestamps<TPrefix extends string> = ICreatedAt<TPrefix> & IUpdatedAt<TPrefix> & IDeletedAt<TPrefix>;

export type IUuid<TPrefix extends string> = {
	[K in TPrefix as `${TPrefix}Uuid`]: string;
};

export type ITableUtils<TPrefix extends string> = ITimestamps<TPrefix> & IUuid<TPrefix>;
