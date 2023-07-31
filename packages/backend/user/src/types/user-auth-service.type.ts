import type { IEntityTableColumnPropertiesExcept } from "@/backend-core/database/types";
import type { UserEntity } from "@/backend/user/db/entities";

export type IFindOrCreateUserProps = IEntityTableColumnPropertiesExcept<UserEntity, "userId" | "userUuid" | "userUsername" | "userIsActive" | "userCreatedAt" | "userUpdatedAt" | "userDeletedAt">;
