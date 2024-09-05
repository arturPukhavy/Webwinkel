import { Person } from "../users/user/model/Person.model";
import { Role } from "../users/user/model/Role.model";
import { User } from "../users/user/model/User.model";

export class Login {
    constructor(
      public email: string,
      private _token: string,
      private _tokenExpirationDate: Date,
      public role: Role,
      public name: User 
    ) {}
  
    get token() {
      if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
        return null;
      }
      return this._token;
    }
  }
  