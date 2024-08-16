import { Component, OnInit } from '@angular/core';
import { Address } from './model/Address';
import { User } from './model/User';
import { Role } from './model/Role';


@Component({
  standalone: true,
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{

  ngOnInit(): void {
    //This is just an example
    let a1: Address
    a1 = {
      street: 'Street_1',
      houseNumber: '1',
      postCode: '2624ll',
      city: 'Delft'
    }
    let a2: Address
      a2 = {
      street: 'Street_2',
      houseNumber: '2',
      postCode: '2624hh',
      city: 'Delft'
    }

    let usr: User
    usr = {
      firstName: 'Max',
      lastName: 'Last',
      birthDate: new Date('2024-02-27'),
      role: Role.Empl,
      address: [a1,a2],
      userName: 'user1',
      password: '12345',
      email: 'dd@dd.com'
    }
    console.log('Test user: ' + JSON.stringify(usr));
  }

}
