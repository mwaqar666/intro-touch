import type { Delegate } from "@/stacks/types";
import type { Transaction } from "sequelize";

export interface ITransactionStore {
	transaction: Transaction;
}

export interface IRunningTransaction {
	currentTransaction: ITransactionStore;
	createdOnThisLevel: boolean;
}

export type TransactionCallback<T> = (runningTransaction: ITransactionStore) => Promise<T>;

export type TransactionError = Delegate<[unknown], Promise<void>>;

export interface ITransactionalOperation<TransactionReturn> {
	operation: TransactionCallback<TransactionReturn>;
	failure?: TransactionError;
}
