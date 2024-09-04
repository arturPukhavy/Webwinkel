import { Role } from "../users/user/model/Role.model";

export class Login {
    constructor(
      public email: string,
      private _token: string,
      private _tokenExpirationDate: Date,
      public role: Role 
    ) {}
  
    get token() {
      if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
        return null;
      }
      return this._token;
    }
  }
  