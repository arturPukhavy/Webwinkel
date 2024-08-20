import { Address } from './model/Address.model';
import { User } from './model/User.model';
import { Role } from './model/Role.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsersService } from '../users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';






@Component({
  // standalone: true,
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit, OnDestroy{
  @ViewChild('form') userForm: NgForm;
  subscription: Subscription;
  users: User[] =[];
  viewForm = false; 
  secondAddress = false;
  editMode = false;
  editedUser: User;
  errorHandlingMode = false;
  error: string;

  constructor( private userService: UsersService, private spinnerService: NgxSpinnerService) {}

  ngOnInit(): void {
    this.onFetchUsers();
    this.subscription = this.userService.startedEditing
      .subscribe(
        (index: number) => {
          console.log('User to edit: ' + JSON.stringify(this.getUser(index)));
          this.viewForm = true;
          this.editMode = true;
          this.editedUser = this.getUser(index);
          this.userForm.setValue({
            fistName: this.editedUser.firstName,
            lastName: this.editedUser.lastName,
            role: this.editedUser.role,
            email: this.editedUser.email,
            birthDate: this.editedUser.birthDate,
            userName: this.editedUser.userName,
            city: this.editedUser.city,
            street: this.editedUser.street,
            houseNumber: this.editedUser.houseNumber,
            postCode: this.editedUser.postCode
          })
        }
      ) 
  }

  onAddAddress() {
    this.secondAddress = true;
  }

  onAddUser() {
    this.spinnerService.show();
    this.userService.createUser(this.userForm.value).subscribe({
      next: data => {
        this.spinnerService.hide();
        console.log('User added: ' + JSON.stringify(data));
        this.onFetchUsers();
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    })
  }

  onAdd() {
    this.viewForm = true;
    this.secondAddress = false;
  }
  onFetchUsers() {
    this.userService.fetchUsers().subscribe({
      next: data => {
        data.forEach(element => {
          console.log('Item: ' + element.lastName)
        });
        this.users = data;
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    })
  };
  onUpdateUser() {
    this.userService.updateUser(this.userForm.value).subscribe({
      next: data => {
        console.log('Product changed: ' + JSON.stringify(data));
        this.onFetchUsers()
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    }) 

  }
  onDeleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: data => {
        this.users = this.users.filter(item => item.id !== id);
        console.log('Delete successful, id: ' + id);
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    })
  };
  onDeleteAll() {
    this.userService.clearUsers().subscribe({
      next: data => {
        console.log('All products deleted');
        this.users = [];
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    })

  }
  onEditUser(index: number) {
    this.userService.startedEditing.next(index);
  }
  onCancel() {
    this.userForm.reset();
    this.viewForm = false;
    this.editMode = false;
  }
  getUser(index: number) {
    return this.users[index];
  }
  onHandleError() {
    this.errorHandlingMode = false;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    
  }

}
