export interface IFormDataRawTextField {
	name: string;
	data: Buffer;
}

export interface IFormDataRawFileField extends IFormDataRawTextField {
	filename: string;
	type: string;
}

export type IFormDataRawField = IFormDataRawFileField | IFormDataRawTextField;

export interface IFormDataFileField extends Omit<IFormDataRawFileField, "name"> {}

export type IFormDataField = string | IFormDataFileField;
