import { BaseModel } from "./base.model";

export class Wing extends BaseModel{
  name:string;
  description:string;
  imageUrl:string;
}
export class Category extends Wing{
  wingId:number;
  wingName:string;
}
export class SubCategory extends Category{
  categoryId:number;
}
export class Eqpt extends SubCategory{
  subCategoryId:number;
}
export class DeleteModel {
  Id:number;
  TableName:string;
  EmerNumber:string;
}
export class Feedback extends BaseModel{
  name:string;
  rank:string;
  unit:string;
  number:string;
  message:string;
}
