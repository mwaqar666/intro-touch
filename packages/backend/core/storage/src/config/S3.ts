export enum S3Bucket {
	ProfilePictures = "profile-pictures",
	BuiltinPlatformIcons = "builtin-platform-icons",
	CustomPlatformIcons = "custom-platform-icons",
}

export class S3BucketConst {
	public static readonly BucketName = (stage: string, bucket: S3Bucket): string => `introtouch-bucket-${stage}-${bucket}`;
}
