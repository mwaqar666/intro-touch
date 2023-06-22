import { AbstractModule } from "@/backend-core/core/concrete/module";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import { ResponseHandlerExtension } from "@/backend-core/request-processor/extensions";
import { RequestProcessorService } from "@/backend-core/request-processor/services";

export class RequestProcessorModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(RequestProcessorTokenConst.ResponseHandler, ResponseHandlerExtension);
		this.container.registerSingleton(RequestProcessorTokenConst.RequestProcessor, RequestProcessorService);
	}
}
