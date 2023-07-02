import { AbstractModule } from "@/backend-core/core/concrete/module";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import { HandlerMetaResolverService, InterceptorResolverService, RequestProcessorService, ResponseHandlerService } from "@/backend-core/request-processor/services";

export class RequestProcessorModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(RequestProcessorTokenConst.ResponseHandlerToken, ResponseHandlerService);
		this.container.registerSingleton(RequestProcessorTokenConst.RequestProcessorToken, RequestProcessorService);
		this.container.registerSingleton(RequestProcessorTokenConst.InterceptorResolverToken, InterceptorResolverService);
		this.container.registerSingleton(RequestProcessorTokenConst.HandlerMetaResolverToken, HandlerMetaResolverService);
	}
}
