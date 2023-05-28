import type { Constructable, Key } from "@/stacks/types";

export const Controller: ClassDecorator = <ClassDecorator>(<T extends object, TArgs extends Array<unknown> = Array<void>>(target: Constructable<T, TArgs>): Constructable<T, TArgs> => {
	return new Proxy(target, {
		construct(concreteController: Constructable<T, any>, argumentsArray: TArgs): T {
			const controllerInstance: T = Reflect.construct(concreteController, argumentsArray);

			return new Proxy(controllerInstance, {
				get(controller: T, property: string): T[Key<T>] {
					const targetProp: T[Key<T>] = Reflect.get(controller, property);

					if (targetProp instanceof Function) {
						return targetProp.bind(controller);
					}

					return targetProp;
				},
			});
		},
	});
});
