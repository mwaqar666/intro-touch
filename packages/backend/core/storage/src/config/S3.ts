export enum S3Bucket {
	ProfilePictures = "profile-pictures",
}

export class S3BucketConst {
	public static readonly BucketName = (bucket: S3Bucket, stage: string): string => `introtouch-bucket-${stage}-${bucket}`;
}
