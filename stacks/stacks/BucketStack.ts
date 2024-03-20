import type { StackContext } from "sst/constructs";
import { Bucket } from "sst/constructs";
import { S3Bucket, S3BucketConst } from "@/backend-core/storage/config";
import { BucketConst } from "@/stacks/const";

export interface IBucketStack {}

export const BucketStack = ({ app, stack }: StackContext): IBucketStack => {
	const s3BucketsToCreate: Array<S3Bucket> = Object.values(S3Bucket);

	const bucketNames: Array<string> = s3BucketsToCreate.map((s3Bucket: S3Bucket): string => {
		const bucket: Bucket = new Bucket(stack, BucketConst.BucketId(app.stage, s3Bucket), {
			name: S3BucketConst.BucketName(app.stage, s3Bucket),
			cdk: {
				bucket: {
					versioned: true,
				},
			},
			blockPublicACLs: false,
		});

		return bucket.bucketName;
	});

	stack.addOutputs({
		bucketNames: bucketNames.join(", "),
	});

	return {};
};
