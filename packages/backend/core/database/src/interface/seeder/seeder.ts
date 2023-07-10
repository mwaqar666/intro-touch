export interface ISeeder {
	timestamp: number;

	seed(): Promise<void>;
}
