import { BaseModel } from "./base.model";

export class LoginModel extends BaseModel{
  userName:string;
  password:string;
}

export class CaptchaRequest
{
	 token :string;
   code :string;
}
