import type { Constructable, Key } from "@/stacks/types";

export const Controller = <T extends object>(target: Constructable<T, Array<any>>): Constructable<T, Array<any>> => {
	/**
	 * Trap the class instantiation, so when an instance of the class is created, we add another trap on property accessor
	 */
	return new Proxy(target, {
		construct(concreteController: Constructable<T, any>, argumentsArray: Array<any>): T {
			const controllerInstance: T = Reflect.construct(concreteController, argumentsArray);

			/**
			 * After the instance is created, we add another trap for property accessor
			 */
			return new Proxy(controllerInstance, {
				get(controller: T, property: string): T[Key<T>] {
					const targetProp: T[Key<T>] = Reflect.get(controller, property);

					/**
					 * We check if the property being accessed is a class method, if so, we
					 * bind the "this" context of method to class instance itself. This way
					 * we can pass around the method signature as callback to another function
					 */

					if (targetProp instanceof Function) {
						return targetProp.bind(controller);
					}

					return targetProp;
				},
			});
		},
	});
};
