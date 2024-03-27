import type { IEntityTableColumnPropertiesExcept, IEntityTableColumnPropertiesOnly } from "@/backend-core/database/types";
import type { NonNullableProps } from "@/stacks/types";
import type { UserEntity } from "@/backend/user/db/entities";

export type IUserRetrievalProps = IEntityTableColumnPropertiesOnly<UserEntity, "userEmail">;

export type IUserCredentialProps = NonNullableProps<IEntityTableColumnPropertiesOnly<UserEntity, "userPassword">>;

export type IUserAuthenticationProps = IUserRetrievalProps & IUserCredentialProps;

export type IFindOrCreateUserProps = IEntityTableColumnPropertiesExcept<UserEntity, "userId" | "userUuid" | "userUsername" | "userIsActive" | "userCreatedAt" | "userUpdatedAt" | "userDeletedAt">;
