import type { ITransactionalOperation } from "@/backend-core/database/types/transaction";

export interface ITransactionManager {
	executeTransaction<T>(transactionalOperation: ITransactionalOperation<T>): Promise<T>;
}
