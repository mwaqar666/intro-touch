import type { Readable } from "stream";
import type { Action, AnyObject, AnyObjectValues, ApiRequest, DeepReadonly, Delegate, Optional, Primitives } from "@/stacks/types";
import type { Busboy, FileInfo } from "busboy";
import busboyParser from "busboy";
import mime from "mime";
import type { BufferEncoding } from "typescript";
import { UploadedFile } from "@/backend-core/request-processor/dto";
import type { Request } from "@/backend-core/request-processor/handlers";
import type { IBodyParser } from "@/backend-core/request-processor/interface";
import type { IFormDataField } from "@/backend-core/request-processor/types";

export class FormDataParser implements IBodyParser {
	public async parse(request: Request): Promise<AnyObject> {
		const parsedBody: AnyObject = {};

		const formDataFields: Record<string, IFormDataField> = await this.parseRequestBody(request);

		for (const [fieldName, formDataField] of Object.entries(formDataFields)) {
			const nestedKeys: Array<string> = fieldName.split(/]\[|]|\[/);

			this.insertNestedDataAtKeys(formDataField, parsedBody, nestedKeys);
		}

		return parsedBody;
	}

	private parseRequestBody(request: Request): Promise<Record<string, IFormDataField>> {
		return new Promise<Record<string, IFormDataField>>((resolve: Action<[Record<string, IFormDataField>]>, reject: Action<[unknown]>): void => {
			const parsedBody: Record<string, IFormDataField> = {};

			const busboy: Busboy = busboyParser({ headers: request.getHeaders() });

			busboy.on("file", (fieldName: string, fileStream: Readable, { filename, mimeType, encoding }: FileInfo): void => {
				let fileData: Buffer;

				fileStream.on("data", (data: Buffer): void => {
					fileData = data;
				});

				fileStream.on("end", (): void => {
					const fileExtension: string = mime.getExtension(mimeType) ?? "";

					parsedBody[fieldName] = new UploadedFile(filename, mimeType, fileData, encoding, fileExtension);
				});
			});

			busboy.on("field", (name: string, value: string): void => {
				parsedBody[name] = value;
			});

			busboy.on("error", (error: unknown): void => reject(error));
			busboy.on("close", (): void => resolve(parsedBody));

			const awsUnderlyingRequest: DeepReadonly<ApiRequest> = request.getUnderlyingAwsRequest();
			const bufferEncoding: BufferEncoding = awsUnderlyingRequest.isBase64Encoded ? "base64" : "binary";

			busboy.write(awsUnderlyingRequest.body, bufferEncoding);

			busboy.end();
		});
	}

	private insertNestedDataAtKeys(data: IFormDataField, parsedBody: AnyObject, nestedKeys: Array<string>): void {
		const isLastIndex: Delegate<[number], boolean> = (index: number): boolean => index === nestedKeys.length - 1;
		const isNumericKey: Delegate<[string], boolean> = (key: string): boolean => !isNaN(+key) && !isNaN(parseFloat(key));

		nestedKeys.reduce((currentObject: Exclude<AnyObjectValues, Primitives>, key: string, currentIndex: number): Exclude<AnyObjectValues, Primitives> => {
			if (isLastIndex(currentIndex)) return this.insertDataAtLeafNode(data, currentObject, key);

			const pathNode: Optional<AnyObjectValues> = Array.isArray(currentObject) ? currentObject[+key] : currentObject[key];
			if (pathNode) return (Array.isArray(currentObject) ? currentObject[+key] : currentObject[key]) as Exclude<AnyObjectValues, Primitives>;

			const nextKey: Optional<string> = nestedKeys[currentIndex + 1];
			if (!nextKey) return currentObject;

			const nextNestedDataStructure: AnyObjectValues = isNumericKey(nextKey) ? [] : {};
			Array.isArray(currentObject) ? (currentObject[+key] = nextNestedDataStructure) : (currentObject[key] = nextNestedDataStructure);

			return nextNestedDataStructure;
		}, parsedBody);
	}

	private insertDataAtLeafNode(data: IFormDataField, currentObject: Exclude<AnyObjectValues, Primitives>, key: string): Exclude<AnyObjectValues, Primitives> {
		const leafNode: Optional<AnyObjectValues> = Array.isArray(currentObject) ? currentObject[+key] : currentObject[key];

		if (leafNode) {
			if (Array.isArray(leafNode)) {
				const leafNodeData: AnyObjectValues = [...leafNode, data] as AnyObjectValues;
				Array.isArray(currentObject) ? (currentObject[+key] = leafNodeData) : (currentObject[key] = leafNodeData);

				return currentObject;
			}

			const leafNodeData: AnyObjectValues = [leafNode, data] as AnyObjectValues;
			Array.isArray(currentObject) ? (currentObject[+key] = leafNodeData) : (currentObject[key] = leafNodeData);

			return currentObject;
		}

		const leafNodeData: AnyObjectValues = data as AnyObjectValues;
		Array.isArray(currentObject) ? (currentObject[+key] = leafNodeData) : (currentObject[key] = leafNodeData);

		return currentObject;
	}
}
