import type { AnyObject, AnyObjectValues, Delegate, Optional, Primitives } from "@/stacks/types";
import { getBoundary, parse } from "parse-multipart-data";
import { useBody } from "sst/node/api";
import { UploadedMedia } from "@/backend-core/request-processor/dto";
import { BadRequestException } from "@/backend-core/request-processor/exceptions";
import type { Request } from "@/backend-core/request-processor/handlers";
import type { IBodyParser } from "@/backend-core/request-processor/interface";
import type { IFormDataField, IFormDataRawField, IFormDataRawFileField } from "@/backend-core/request-processor/types";

export class FormDataParser implements IBodyParser {
	public parse(request: Request): AnyObject {
		const parsedBody: AnyObject = {};

		const requestBody: Optional<string> = useBody();
		if (!requestBody) return parsedBody;

		const requestBodyBuffer: Buffer = Buffer.from(requestBody, "utf-8");
		const contentType: Optional<string> = request.getHeaders("Content-Type");

		if (!contentType) throw new BadRequestException("Missing boundary on multipart/formdata");

		const formDataFields: Array<IFormDataRawField> = parse(requestBodyBuffer, getBoundary(contentType)) as Array<IFormDataRawField>;

		for (const formDataField of formDataFields) {
			const formDataFieldName: string = formDataField.name;

			const nestedKeys: Array<string> = formDataFieldName.split(/]\[|]|\[/);

			const formDataValue: IFormDataField = this.transformFormData(formDataField);

			this.insertNestedDataAtKeys(formDataValue, parsedBody, nestedKeys);
		}

		return parsedBody;
	}

	private transformFormData(formDataField: IFormDataRawField): IFormDataField {
		if ("type" in formDataField) {
			const { type, data, filename }: IFormDataRawFileField = formDataField;

			return new UploadedMedia(filename, type, data);
		}

		return formDataField.data.toString("utf-8");
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
