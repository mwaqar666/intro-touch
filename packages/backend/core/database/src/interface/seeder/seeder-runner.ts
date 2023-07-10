export interface ISeederRunner {
	runSeeders(): Promise<Array<string>>;
}
