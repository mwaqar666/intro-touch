import { AbstractModule } from "@/backend-core/core/concrete/module";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import { Request, Response } from "@/backend-core/request-processor/handlers";
import { FormDataParser, JsonParser, UrlEncodedFormParser } from "@/backend-core/request-processor/parsers";
import { HandlerMetaResolverService, InterceptorResolverService, RequestProcessorService } from "@/backend-core/request-processor/services";

export class RequestProcessorModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerScoped(Request);
		this.container.registerScoped(Response);

		this.container.registerSingleton(FormDataParser);
		this.container.registerSingleton(JsonParser);
		this.container.registerSingleton(UrlEncodedFormParser);

		this.container.registerSingleton(RequestProcessorTokenConst.RequestProcessorToken, RequestProcessorService);
		this.container.registerSingleton(RequestProcessorTokenConst.InterceptorResolverToken, InterceptorResolverService);
		this.container.registerSingleton(RequestProcessorTokenConst.HandlerMetaResolverToken, HandlerMetaResolverService);
	}
}
