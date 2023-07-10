import type { UserEntity } from "@/backend/user/db/entities";

export class ListUserResponseDto {
	public users: Array<UserEntity>;
}
