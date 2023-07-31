import type { ApiRequest, ILambdaInput } from "@/stacks/types";
import type { Context } from "aws-lambda";
import { useEvent, useLambdaContext } from "sst/context";

export abstract class BaseAdapter {
	protected prepareRequestAndContext(): ILambdaInput {
		const request: ApiRequest = useEvent("api");
		const context: Context = useLambdaContext();

		return { request, context };
	}
}
