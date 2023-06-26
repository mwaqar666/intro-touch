import { AbstractModule } from "@/backend-core/core/concrete/module";
import { RequestProcessorTokenConst } from "@/backend-core/request-processor/const";
import { RequestProcessorService, ResponseHandlerService } from "@/backend-core/request-processor/services";

export class RequestProcessorModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(RequestProcessorTokenConst.ResponseHandler, ResponseHandlerService);
		this.container.registerSingleton(RequestProcessorTokenConst.RequestProcessor, RequestProcessorService);
	}
}
