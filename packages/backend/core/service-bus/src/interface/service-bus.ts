import type { EventListener } from "@/backend-core/service-bus/types";

export interface IServiceBus {
	dispatch(eventName: string, ...params: Array<unknown>): void;

	addListener<C>(eventName: string, listener: EventListener, context: C): void;
}
