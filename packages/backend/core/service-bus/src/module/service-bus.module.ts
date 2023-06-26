import { AbstractModule } from "@/backend-core/core/concrete/module";
import { ServiceBusTokenConst } from "@/backend-core/service-bus/const";
import { ServiceBusService } from "@/backend-core/service-bus/services";

export class ServiceBusModule extends AbstractModule {
	public override async register(): Promise<void> {
		this.container.registerSingleton(ServiceBusTokenConst.ServiceBus, ServiceBusService);
	}
}
