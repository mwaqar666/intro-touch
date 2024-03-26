export enum S3Bucket {
	ProfilePictures = "profile-pictures",
	ContactPictures = "contact-pictures",
	CustomPlatformIcons = "custom-platform-icons",
	BuiltinPlatformIcons = "builtin-platform-icons",
}

export class S3BucketConst {
	public static readonly BucketName = (stage: string, bucket: S3Bucket): string => `introtouch-bucket-${stage}-${bucket}`;
}
