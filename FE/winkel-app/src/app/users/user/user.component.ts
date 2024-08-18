import { Address } from './model/Address.model';
import { User } from './model/User.model';
import { Role } from './model/Role.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';






@Component({
  // standalone: true,
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit{
  @ViewChild('form') userForm: NgForm;
  viewForm = false; 
  secondAddress = false;

  ngOnInit(): void {
    //This is just an example to see how to create an instance of "User"
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

  onAddAddress() {
    this.secondAddress = true;
  }

  onAddUser() {
  }

  onAdd() {
    this.viewForm = true;
  }
  onUpdateUser() {

  }
  onDeleteAll() {

  }
  onCancel() {
    this.userForm.reset();
    this.viewForm = false;
  }

}
