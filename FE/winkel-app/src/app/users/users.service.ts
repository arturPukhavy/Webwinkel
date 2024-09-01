import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { User } from './user/model/User.model';
import { Role } from './user/model/Role.model';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
  startedEditing = new Subject<number>();
 

  constructor( private http: HttpClient ) {}

  fetchUsers() {
    return this.http.get<User[]>('/api/v1/users')
  };
  createUser(postData: {firstName: string; lastName: string; role: Role;  email: string; birthDate: Date; userName: string;
    city: string; street: string; houseNumber: number; postCode: string }) {

    return this.http.post<User[]>('/api/v1/users', postData)
  }

  updateUser(putData: { firstName: string; lastName: string; role: Role;  email: string; birthDate: Date; userName: string;
    city: string; street: string; houseNumber: number; postCode: string}) {

    console.log('PUT data: ' + JSON.stringify(putData));
     return this.http.put<User[]>('/api/v1/users', putData)
  }

  deleteUser(id: number) {
    const options = {
      body: {
        id:id
      },
    };
    return this.http.delete('/api/v1/user', options)
  }

  clearUsers() {
    return this.http.delete<User>('/api/v1/users')
  }

}  