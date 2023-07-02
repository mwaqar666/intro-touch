import type { Constructable, Key } from "@/stacks/types";
import { copyMetadata } from "iocc";
import { HandlerMetaConst } from "@/backend-core/request-processor/const";

export const Controller = <T extends object>(target: Constructable<T, Array<any>>): Constructable<T, Array<any>> => {
	/**
	 * Trap the class instantiation, so when an instance of the class is created, we can add
	 * another trap on property accessor
	 */
	const proxyTarget: Constructable<T, Array<any>> = new Proxy(target, {
		construct(concreteController: Constructable<T, Array<any>>, argumentsArray: Array<any>): T {
			const controllerInstance: T = Reflect.construct(concreteController, argumentsArray);

			/**
			 * After the instance is created, we add another trap for property accessor
			 */
			return new Proxy(controllerInstance, {
				get(controller: T, property: string): T[Key<T>] {
					const targetProp = Reflect.get(controller, property);

					/**
					 * We check if the property being accessed is a class method, if so, we
					 * bind the "this" context of method to class instance itself. This way
					 * we can pass around the method signature as callback to another function
					 */
					if (targetProp instanceof Function) {
						const boundHandler = targetProp.bind(controller);
						Reflect.defineMetadata(HandlerMetaConst.HandlerControllerKey, controller, boundHandler);

						return boundHandler;
					}

					return targetProp;
				},
			});
		},
	});

	copyMetadata(target, proxyTarget);

	return proxyTarget;
};
