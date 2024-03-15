import type { UploadedFile } from "@/backend-core/request-processor/dto";
import type { Optional } from "@/stacks/types";
import type { ValidationArguments, ValidationOptions, ValidatorConstraintInterface } from "class-validator";
import { registerDecorator, ValidatorConstraint } from "class-validator";
import type { IValidMediaValidatorOptions } from "@/backend-core/validation/types";

export function IsValidFile(isValidMediaOptions?: IValidMediaValidatorOptions, validationOptions?: ValidationOptions) {
	return function (object: object, propertyName: string): void {
		registerDecorator({
			target: object.constructor,
			propertyName,
			options: { message: `${propertyName}: Invalid file type`, ...validationOptions },
			constraints: [isValidMediaOptions],
			validator: IsValidFileConstraint,
		});
	};
}

@ValidatorConstraint({ async: true })
export class IsValidFileConstraint implements ValidatorConstraintInterface {
	public async validate(value: Optional<string | UploadedFile>, args: ValidationArguments): Promise<boolean> {
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
