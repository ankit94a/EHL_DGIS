import { BaseModel } from "./base.model";

export class Policy extends BaseModel{
  type:string;
  category:string;
  categoryId:number;
  wing:string;
  wingId:number;
  fileName:string;
  filePath:string;
  fileSize:number;
  file:any;
  remarks:string;
  contractType:string;
}

export class FilterModel {
  category:string;
  categoryId:number;
  subCategory:string;
  subCategoryId:number;
  eqpt:string;
  eqptId:number;
  searchText:string;
  wingId:number;
  wing:string
}

export class PolicyFilterModel{
  category:string;
  categoryId:number;
  wingId:number;
  wing:string
  type:string;
  typeId:number;
}
