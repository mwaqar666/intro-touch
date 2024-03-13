export class BucketConst {
	public static readonly BucketId = (stage: string, bucket: string): string => `bucket-${bucket}-${stage}`;
}
