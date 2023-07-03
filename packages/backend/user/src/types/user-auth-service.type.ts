import type { EntityTableColumnPropertiesExcept } from "@/backend-core/database/types";
import type { UserEntity } from "@/backend/user/db/entities";

export type ICreateUserWithProfile = EntityTableColumnPropertiesExcept<UserEntity, "userId" | "userUuid" | "userIsActive" | "userCreatedAt" | "userUpdatedAt" | "userDeletedAt">;
