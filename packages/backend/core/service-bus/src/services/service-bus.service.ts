import type { Optional } from "@/stacks/types";
import { filter, Subject } from "rxjs";
import type { IServiceBus } from "@/backend-core/service-bus/interface";
import type { EventListener, IEventData, IServiceBusEventListeners } from "@/backend-core/service-bus/types";

export class ServiceBusService implements IServiceBus {
	private readonly dispatcher: Subject<IEventData> = new Subject<IEventData>();
	private readonly serviceBusEventListeners: IServiceBusEventListeners = {};

	public dispatch(eventName: string, ...params: Array<unknown>): void {
		this.dispatcher.next({
			eventName,
			eventData: params,
		});
	}

	public addListener<C>(eventName: string, listener: EventListener, context: C): void {
		this.registerListener(eventName, listener, context);

		this.dispatcher
			.pipe(
				// Apply event name filter
				filter((eventData: IEventData): boolean => eventData.eventName === eventName),
			)
			.subscribe(async (eventData: IEventData): Promise<void> => {
				const eventListeners: Array<EventListener> = this.getListeners(eventData.eventName);

				for (const eventListener of eventListeners) {
					await eventListener(...eventData.eventData);
				}
			});
	}

	private getListeners(eventName: string): Array<EventListener> {
		const eventListeners: Optional<Array<EventListener>> = this.serviceBusEventListeners[eventName];

		return eventListeners ?? [];
	}

	private registerListener<C>(eventName: string, listener: EventListener, context: C): void {
		const eventListeners: Optional<Array<EventListener>> = this.serviceBusEventListeners[eventName];
		if (!eventListeners) {
			this.serviceBusEventListeners[eventName] = [listener];

			return;
		}

		this.serviceBusEventListeners[eventName] = [...eventListeners, listener.bind(context)];
	}
}
