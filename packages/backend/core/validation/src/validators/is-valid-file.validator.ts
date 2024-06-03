import type { UploadedFile } from "@/backend-core/request-processor/dto";
import type { Optional } from "@/stacks/types";
import type { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from "class-validator";
import { registerDecorator, ValidatorConstraint } from "class-validator";
import type { IValidMediaValidatorOptions } from "@/backend-core/validation/types";

export function IsValidFile(isValidMediaOptions?: IValidMediaValidatorOptions, validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string): void {
		let message: string = `${propertyName}`;

		if (isValidMediaOptions) {
			if (isValidMediaOptions.mimeType) message = `${message} must be of type “${isValidMediaOptions.mimeType}”`;

			if (isValidMediaOptions.maxSizeInBytes) message = `${message} ${isValidMediaOptions.mimeType ? "and " : ""}must be less than ${isValidMediaOptions.maxSizeInBytes} bytes.`;
		}

		registerDecorator({
			target: object.constructor,
			propertyName,
			options: { message, ...validationOptions },
			constraints: [isValidMediaOptions],
			validator: IsValidFileConstraint,
		});
	};
}

@ValidatorConstraint()
export class IsValidFileConstraint implements ValidatorConstraintInterface {
	public validate(value: Optional<string | UploadedFile>, args: ValidationArguments): boolean {
		if (!value) return false;

		const [validationConstraints]: [Optional<IValidMediaValidatorOptions>] = args.constraints as [Optional<IValidMediaValidatorOptions>];

		if (!validationConstraints) return true;

		const { mimeType, existing, maxSizeInBytes }: IValidMediaValidatorOptions = validationConstraints;

		if (typeof value === "string") return !!existing;

		if (!("fileName" in value) || !("fileType" in value) || !("fileData" in value) || !("fileExtension" in value)) return false;

		if (mimeType) {
			const mimeTypeValidated: boolean = this.validateMimeType(mimeType, value);

			if (!mimeTypeValidated) return false;
		}

		if (maxSizeInBytes) {
			const fileSizeValidated: boolean = this.validateFileSize(maxSizeInBytes, value);

			if (!fileSizeValidated) return false;
		}

		return true;
	}

	private validateMimeType(mimeType: string, uploadedFile: UploadedFile): boolean {
		if (mimeType === "*") return true;

		const [type, subType]: Array<Optional<string>> = mimeType.split("/");
		const [providedType, providedSubType]: Array<Optional<string>> = uploadedFile.fileType.split("/");

		if (type !== "*" && type !== providedType) return false;

		return subType === "*" || subType === providedSubType;
	}

	private validateFileSize(maxSizeInBytes: number, uploadedFile: UploadedFile): boolean {
		return uploadedFile.sizeInBytes() <= maxSizeInBytes;
	}
}
