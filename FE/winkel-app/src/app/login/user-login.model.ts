import { Role } from "../users/user/model/Role.model";


export class Login {
    constructor(
      private _token: string,
      private _tokenExpirationDate: Date,
      public role: Role,
      public userName: string, 
    ) {}
  
    get token() {
      if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
        return null;
      }
      return this._token;
    }
  }
  