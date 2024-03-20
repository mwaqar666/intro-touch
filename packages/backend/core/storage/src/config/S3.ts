export enum S3Bucket {
	ProfilePictures = "profile-pictures",
}

export class S3BucketConst {
	public static readonly BucketName = (stage: string, bucket: S3Bucket): string => `introtouch-bucket-${stage}-${bucket}`;
}
