import type { Key, Optional } from "@/stacks/types";
import { getBoundary, parse } from "parse-multipart-data";
import { useBody } from "sst/node/api";
import { BadRequestException } from "@/backend-core/request-processor/exceptions";
import type { Request } from "@/backend-core/request-processor/handlers";
import type { IBodyParser } from "@/backend-core/request-processor/interface";
import type { IFormDataField, IFormDataRawField, IFormDataRawFileField } from "@/backend-core/request-processor/types";

export class FormDataParser<T extends object = object> implements IBodyParser<T> {
	public parse(request: Request<T>): T {
		const parsedBody: T = {} as T;

		const requestBody: Optional<string> = useBody();

		if (!requestBody) return parsedBody;

		const requestBodyBuffer: Buffer = Buffer.from(requestBody, "utf-8");
		const contentType: Optional<string> = request.getHeaders("Content-Type");

		if (!contentType) throw new BadRequestException("Missing boundary on multipart/formdata");

		const formDataFields: Array<IFormDataRawField> = parse(requestBodyBuffer, getBoundary(contentType)) as Array<IFormDataRawField>;

		return formDataFields.reduce((parsed: T, formDataField: IFormDataRawField): T => {
			const fieldName: Key<T> = formDataField.name as Key<T>;

			let formDataValue: IFormDataField;

			if (!("type" in formDataField)) {
				formDataValue = formDataField.data.toString("utf-8");
			} else {
				const { type, data, filename }: IFormDataRawFileField = formDataField;

				formDataValue = { type, data, filename };
			}

			const fieldValue: Optional<T[Key<T>]> = parsed[fieldName];

			if (fieldValue) {
				if (Array.isArray(fieldValue)) {
					parsed[fieldName] = [...fieldValue, formDataValue] as T[Key<T>];
				} else {
					parsed[fieldName] = [fieldValue, formDataValue] as T[Key<T>];
				}

				return parsed;
			}

			parsed[fieldName] = formDataValue as T[Key<T>];

			return parsed;
		}, parsedBody);
	}
}
