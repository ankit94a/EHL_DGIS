import { BaseModel } from "./base.model";
import { DownloadFileType } from "./enum.model";

export class DownloadModel extends BaseModel{
  name:string;
  filePath:string;
  fileType:DownloadFileType;
  type:any;
}

export class PdfFile extends BaseModel{
  fileType:string;
  fileStorage
}