export interface IConfigValidator<TSchema> {
	validateConfig(config: unknown): TSchema;
}
