import { AuthorizationTokenConst } from "@/backend-core/authorization/const";
import { Permission } from "@/backend-core/authorization/enums";
import type { IAuthorization } from "@/backend-core/authorization/interface";
import { Auth, Body, Controller, Path } from "@/backend-core/request-processor/decorators";
import { Inject } from "iocc";
import type { UserContactEntity, UserEntity } from "@/backend/user/db/entities";
import { CreateUserContactRequestDto } from "@/backend/user/dto/create-user-contact";
import { UserContactService } from "@/backend/user/services/user";

@Controller
export class UserContactController {
	public constructor(
		// Dependencies
		@Inject(UserContactService) private readonly userContactService: UserContactService,
		@Inject(AuthorizationTokenConst.Authorization) private readonly authorization: IAuthorization,
	) {}

	public async createUserContact(@Path("userUuid") userUuid: string, @Body(CreateUserContactRequestDto) createUserContactRequestDto: CreateUserContactRequestDto): Promise<{ userContact: UserContactEntity }> {
		return { userContact: await this.userContactService.createUserContact(userUuid, createUserContactRequestDto) };
	}

	public async getUserContactList(@Auth authEntity: UserEntity): Promise<{ userContacts: Array<UserContactEntity> }> {
		await this.authorization.can(authEntity, [Permission.ListUserContact]);

		return { userContacts: await this.userContactService.getUserContacts(authEntity) };
	}
}
