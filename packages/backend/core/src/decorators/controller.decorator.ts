import type { Constructable, Key } from "@/stacks/types";

export const Controller = <T extends object>(target: Constructable<T>): Constructable<T> => {
	return new Proxy(target, {
		construct(concreteController: Constructable<T>, argumentsArray: Array<void>): T {
			const controllerInstance: T = Reflect.construct(concreteController, argumentsArray);

			return new Proxy(controllerInstance, {
				get(controller: T, property: string): T[Key<T>] {
					const targetProp: T[Key<T>] = Reflect.get(controller, property);

					// noinspection SuspiciousTypeOfGuard
					if (targetProp instanceof Function) {
						return targetProp.bind(controller);
					}

					return targetProp;
				},
			});
		},
	});
};
