import type { IContainer } from "iocc";
import { ContainerFactory } from "iocc";

export class App {
	public static get container(): IContainer {
		return ContainerFactory.getContainer();
	}
}
