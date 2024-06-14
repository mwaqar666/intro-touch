import type { BaseEntity } from "@/backend-core/database/entity";
import type { BaseRepository } from "@/backend-core/database/repository";
import type { IEntityTableColumnProperties } from "@/backend-core/database/types";
import type { Constructable, Key } from "@/stacks/types";

export interface IUniqueValidatorNoIgnoreOptions<T extends BaseEntity<T>, R extends BaseRepository<T>> {
	repository: Constructable<R>;
	column?: Key<IEntityTableColumnProperties<T>>;
}

export interface IUniqueValidatorIgnoreOptions<T extends BaseEntity<T>, R extends BaseRepository<T>> extends IUniqueValidatorNoIgnoreOptions<T, R> {
	extractParameterFrom: IExtractParametersFrom;
	ignoreByParameter: string;
}

export type IExtractParametersFrom = "path" | "query" | "body";

export type IUniqueValidatorOptions<T extends BaseEntity<T>, R extends BaseRepository<T>> = IUniqueValidatorNoIgnoreOptions<T, R> | IUniqueValidatorIgnoreOptions<T, R>;

export interface IValidMediaValidatorOptions {
	mimeType?: string;
	existing?: boolean;
	maxSizeInBytes?: number;
}
