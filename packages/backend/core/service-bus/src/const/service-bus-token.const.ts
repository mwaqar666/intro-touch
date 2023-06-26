import { Token } from "iocc";
import type { IServiceBus } from "@/backend-core/service-bus/interface";

export class ServiceBusTokenConst {
	public static readonly ServiceBus: Token<IServiceBus> = new Token<IServiceBus>("ServiceBus");
}
