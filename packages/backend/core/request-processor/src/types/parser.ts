export interface IFormDataFileField {
	fileName: string;
	fileType: string;
	fileData: Buffer;
	fileEncoding: string;
	fileExtension: string;
}

export type IFormDataField = string | IFormDataFileField;
