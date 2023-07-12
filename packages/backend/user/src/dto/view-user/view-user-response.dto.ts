import type { UserEntity } from "@/backend/user/db/entities";

export class ViewUserResponseDto {
	public user: UserEntity;
}
