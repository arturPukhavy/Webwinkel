import { Address } from './model/Address.model';
import { User } from './model/User.model';
import { Role } from './model/Role.model';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ActivatedRoute, Params, Router } from '@angular/router';






@Component({
  // standalone: true,
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit, OnDestroy{
  userForm: FormGroup;
  subscription: Subscription;
  id: number;
  users: User[] = [];
  viewForm = false; 
  secondAddress = false;
  editMode = false;
  editedUser: User;
  errorHandlingMode = false;
  error: string;
  roles: string[] = Object.values(Role);

  constructor( private userService: UsersService, 
               private spinnerService: NgxSpinnerService,
               private route: ActivatedRoute, 
               private router: Router) {}

  ngOnInit(): void {
    this.onFetchUsers();
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
          // console.log(this.editMode);
        }
      )
  }
  
  get controls() {
    return (<FormArray>this.userForm.get('address')).controls;
  }
    
  private initForm() {
    let firstName = '';
    let lastName = '';
    let role = 'enum'; 
    let email = '';
    let birthDate: Date;
    birthDate = new Date(Date.now());
    let userName = ''; 
    let userAddress = new FormArray([]);

    this.userForm = new FormGroup({
      'firstName': new FormControl(firstName, Validators.required),
      'lastName': new FormControl(lastName, Validators.required),
      'role': new FormControl(role, Validators.required),
      'email': new FormControl(email, [Validators.required, Validators.email]),
      'birthDate': new FormControl(birthDate, Validators.required),
      'userName': new FormControl(userName, Validators.required),
      'address': userAddress 
    })

    // if (this.editMode) {
    //   const user = this.getUser(this.id);
    //   firstName = user.firstName;
    //   lastName = user.lastName;
    //   role = user.role;
    //   email = user.email;
    //   birthDate = user.birthDate;
    //   userName = user.userName;
    //   if (user['address']) {
    //     for (let item of user.address) {
    //       userAddress.push(
    //         new FormGroup({
    //           city: new FormControl(item.city, Validators.required),
    //           street: new FormControl(item.street, Validators.required),
    //           houseNumber: new FormControl(item.houseNumber, [
    //             Validators.required,
    //             Validators.pattern(/^[1-9]+[0-9]*$/)
    //           ]),
    //           postCode: new FormControl(item.postCode, Validators.required)
    //         })
    //       )
    //     }
    //   }
    // }
  }  


    // this.subscription = this.userService.startedEditing
    //   .subscribe(
    //     (index: number) => {
    //       console.log('User to edit: ' + JSON.stringify(this.getUser(index)));
    //       this.editMode = true;
    //       this.editedUser = this.getUser(index);
    //       setTimeout(() => {
    //       this.userForm.patchValue({
    //         firstName: this.editedUser.firstName,
    //         lastName: this.editedUser.lastName,
    //         role: this.editedUser.role,
    //         email: this.editedUser.email,
    //         birthDate: this.editedUser.birthDate,
    //         userName: this.editedUser.userName,
    //         city: this.editedUser.address[0].city,
    //         street: this.editedUser.address[0].street,
    //         houseNumber: this.editedUser.address[0].houseNumber,
    //         postCode: this.editedUser.address[0].postCode,
    //         city1: this.editedUser.address[1].city,
    //         street1: this.editedUser.address[1].street,
    //         houseNumber1: this.editedUser.address[1].houseNumber,
    //         postCode1: this.editedUser.address[1].postCode
    //       })
    //     }, 10);
    //     }
    //   ) 
  

  onAddAddress() {
    (<FormArray>this.userForm.get('address')).push(
      new FormGroup({
        city: new FormControl(null, Validators.required),
        street: new FormControl(null, Validators.required),
        houseNumber: new FormControl(null, [
                Validators.required,
                Validators.pattern(/^[1-9]+[0-9]*$/)
                ]),
        postCode: new FormControl(null, Validators.required)
      })
    )
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
    this.viewForm = true;
    this.editMode = true;
    this.secondAddress = true;
    this.userService.startedEditing.next(index);
  }
  onCancel() {
    this.userForm.reset();
    this.viewForm = false;
    this.editMode = false;
  }
  onCancelAddress(index:number) {
    (<FormArray>this.userForm.get('address')).removeAt(index);
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
