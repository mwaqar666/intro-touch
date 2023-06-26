import type { Delegate } from "@/stacks/types";

export type EventListener = Delegate<Array<unknown>, Promise<void>>;

export interface IServiceBusEventListeners {
	[event: string]: Array<EventListener>;
}

export interface IEventData {
	eventName: string;
	eventData: Array<unknown>;
}
