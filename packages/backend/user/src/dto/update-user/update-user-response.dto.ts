import type { UserEntity } from "@/backend/user/db/entities";

export class UpdateUserResponseDto {
	public user: UserEntity;
}
