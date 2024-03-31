import type { IndustryEntity } from "@/backend/industry/db/entities";
import { IndustryRepository } from "@/backend/industry/db/repositories";
import { DbTokenConst } from "@/backend-core/database/const";
import type { ITransactionManager } from "@/backend-core/database/interface";
import type { ISeeder } from "@/backend-core/database/interface/seeder";
import type { IEntityTableColumnProperties, ITransactionStore } from "@/backend-core/database/types";
import type { Optional } from "@/stacks/types";
import { Inject } from "iocc";
import type { UserEntity, UserProfileEntity } from "@/backend/user/db/entities";
import { UserProfileRepository, UserRepository } from "@/backend/user/db/repositories";

export class UserProfilesSeeder implements ISeeder {
	public timestamp = 1688975570961;

	public constructor(
		// Dependencies

		@Inject(UserRepository) private readonly userRepository: UserRepository,
		@Inject(IndustryRepository) private readonly industryRepository: IndustryRepository,
		@Inject(UserProfileRepository) private readonly userProfileRepository: UserProfileRepository,
		@Inject(DbTokenConst.TransactionManagerToken) private readonly transactionManager: ITransactionManager,
	) {}

	public async seed(): Promise<void> {
		await this.transactionManager.executeTransaction({
			operation: async ({ transaction }: ITransactionStore): Promise<void> => {
				const users: Array<UserEntity> = await this.getUsers();

				const industries: Array<IndustryEntity> = await this.getIndustries();

				const userProfileData: Array<Partial<IEntityTableColumnProperties<UserProfileEntity>>> = [];

				for (const user of users) {
					const numberOfProfiles: number = Math.floor(Math.random() * 10);

					for (let profileIndex: number = 0; profileIndex < numberOfProfiles; profileIndex++) {
						const industryIndex: number = Math.floor(Math.random() * industries.length);

						const industry: Optional<IndustryEntity> = industries[industryIndex];

						if (!industry) continue;

						userProfileData.push(
							// Commented to format
							this.generateUserProfile(profileIndex + 1, profileIndex === 0, user, industry),
						);
					}
				}

				await this.userProfileRepository.createMany({
					valuesToCreate: userProfileData,
					transaction,
				});
			},
		});
	}

	private getUsers(): Promise<Array<UserEntity>> {
		return this.userRepository.findAll({
			findOptions: {},
		});
	}

	private getIndustries(): Promise<Array<IndustryEntity>> {
		return this.industryRepository.findAll({
			findOptions: {},
		});
	}

	private generateUserProfile(profileNumber: number, profileIsLive: boolean, user: UserEntity, industry: IndustryEntity): Partial<IEntityTableColumnProperties<UserProfileEntity>> {
		const formattedUserId: string = user.userId.toString().padStart(2, "0");
		const formattedProfileNumber: string = profileNumber.toString().padStart(2, "0");

		return {
			userProfileUserId: user.userId,
			userProfileIndustryId: industry.industryId,
			userProfileFirstName: `${user.userFirstName} - Profile ${formattedProfileNumber}`,
			userProfileLastName: `${user.userLastName} - Profile ${formattedProfileNumber}`,
			userProfilePicture: user.userPicture,
			userProfileEmail: `jane.doe${formattedUserId}${formattedProfileNumber}@demo.com`,
			userProfileBio: this.generateText(),
			userProfileCompany: `XYZ ${formattedProfileNumber} Pvt. LTD`,
			userProfileJobTitle: `Software Engineer - ${formattedProfileNumber}`,
			userProfileWorkplacePhone: "+1 (051) 345-3456",
			userProfilePersonalPhone: "+1 (983) 940-2841",
			userProfileLandPhone: "+1 (003) 9837-3864",
			userProfileFax: "983 345 983",
			userProfileWebsite: `https://blogspot.com/some-amazing-tips-${formattedProfileNumber}`,
			userProfileIsLive: profileIsLive,
		};
	}

	private generateText(): string {
		return `
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Turpis massa sed elementum tempus egestas sed sed risus pretium. Amet justo donec enim diam vulputate ut pharetra sit. Potenti nullam ac tortor vitae purus faucibus. Est ullamcorper eget nulla facilisi etiam. Habitasse platea dictumst quisque sagittis purus sit. Pellentesque dignissim enim sit amet venenatis urna cursus eget. Eget mauris pharetra et ultrices neque ornare aenean euismod elementum. Cursus metus aliquam eleifend mi in nulla posuere. Auctor elit sed vulputate mi sit amet mauris commodo quis. Sociis natoque penatibus et magnis dis parturient montes nascetur ridiculus. Ultrices tincidunt arcu non sodales. Odio ut enim blandit volutpat maecenas volutpat blandit aliquam. Dis parturient montes nascetur ridiculus. Pulvinar pellentesque habitant morbi tristique senectus et netus et malesuada. Sed blandit libero volutpat sed cras ornare arcu. Id velit ut tortor pretium viverra suspendisse potenti nullam ac. Ac tortor dignissim convallis aenean et tortor at risus viverra. Neque vitae tempus quam pellentesque nec nam aliquam sem. Magna eget est lorem ipsum dolor sit.

			Morbi blandit cursus risus at ultrices mi tempus imperdiet nulla. Ut eu sem integer vitae justo eget magna. Quam pellentesque nec nam aliquam sem et tortor consequat. Pharetra pharetra massa massa ultricies mi quis hendrerit dolor magna. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus. Eleifend quam adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus. Vitae suscipit tellus mauris a. At lectus urna duis convallis convallis tellus id interdum. Nisl pretium fusce id velit. Erat pellentesque adipiscing commodo elit at imperdiet dui accumsan. A erat nam at lectus urna duis. Blandit cursus risus at ultrices mi tempus. Tortor dignissim convallis aenean et tortor.

			Mattis enim ut tellus elementum sagittis. Feugiat nisl pretium fusce id velit ut tortor pretium. Odio euismod lacinia at quis risus sed vulputate odio ut. Turpis egestas maecenas pharetra convallis posuere morbi. Dui sapien eget mi proin. Est lorem ipsum dolor sit amet. Amet venenatis urna cursus eget nunc. Ultrices eros in cursus turpis massa tincidunt dui ut ornare. Fames ac turpis egestas maecenas pharetra convallis posuere morbi leo. Cursus eget nunc scelerisque viverra mauris in aliquam sem fringilla. Sodales neque sodales ut etiam sit amet nisl purus. Urna duis convallis convallis tellus id interdum velit.

			Phasellus egestas tellus rutrum tellus pellentesque eu tincidunt tortor aliquam. Et malesuada fames ac turpis egestas. Neque convallis a cras semper auctor neque vitae. Cras pulvinar mattis nunc sed. Ac ut consequat semper viverra. Lectus arcu bibendum at varius vel pharetra vel turpis nunc. Odio ut sem nulla pharetra diam. Sagittis id consectetur purus ut. Nunc sed augue lacus viverra vitae congue. Cursus euismod quis viverra nibh. Arcu cursus euismod quis viverra nibh cras pulvinar mattis nunc. Non enim praesent elementum facilisis leo vel fringilla est ullamcorper. Feugiat in ante metus dictum at. Pharetra et ultrices neque ornare aenean euismod elementum nisi. Felis eget nunc lobortis mattis.

			Fames ac turpis egestas sed tempus urna et pharetra. Non pulvinar neque laoreet suspendisse. Enim diam vulputate ut pharetra. Vel fringilla est ullamcorper eget nulla facilisi etiam dignissim diam. Fermentum dui faucibus in ornare. Mi sit amet mauris commodo quis imperdiet massa tincidunt. Posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Hendrerit dolor magna eget est lorem. Fusce id velit ut tortor pretium viverra suspendisse potenti nullam. Vitae tempus quam pellentesque nec nam. Cursus sit amet dictum sit amet. Varius vel pharetra vel turpis nunc eget lorem dolor sed. Non tellus orci ac auctor augue mauris augue. Varius morbi enim nunc faucibus a. Ullamcorper malesuada proin libero nunc.
		`;
	}
}
