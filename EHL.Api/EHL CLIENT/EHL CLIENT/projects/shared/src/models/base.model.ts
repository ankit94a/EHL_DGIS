export class BaseModel {
  id:number;
  createdBy:number;
  updatedBy:number;
  createdOn:Date;
  updatedOn:Date;
  isActive:boolean;
  isDeleted:boolean;
  isEdit:boolean=false;
}

export class DeactivateModel {
  id:number;
  tableName:string;
}