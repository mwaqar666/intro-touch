import type { ITransactionalOperation } from "@/backend-core/database/types/transaction";

export interface ITransactionManager {
	executeTransactionalOperation<T>(transactionalOperation: ITransactionalOperation<T>): Promise<T>;
}
