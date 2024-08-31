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

export class UserComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  subscription: Subscription;
  users: User[] = [];
  viewForm = false; 
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

    let firstName = '';
    let lastName = '';
    let role = ''; 
    let email = '';
    let birthDate = '';
    let userName = ''; 
    let userAddress:any = new FormArray([]);

    this.userForm = new FormGroup({
      'firstName': new FormControl(firstName, Validators.required),
      'lastName': new FormControl(lastName, Validators.required),
      'role': new FormControl(role),
      'email': new FormControl(email, [Validators.required, Validators.email]),
      'birthDate': new FormControl(birthDate, Validators.required),
      'userName': new FormControl(userName, Validators.required),
      'address': userAddress
    })
   
    this.subscription = this.userService.startedEditing
      .subscribe(
        (index: number) => {
          console.log('User to edit: ' + JSON.stringify(this.getUser(index)));
          this.editMode = true;
          this.editedUser = this.getUser(index);
          setTimeout(() => {
          this.userForm.patchValue({
            firstName: this.editedUser.firstName,
            lastName: this.editedUser.lastName,
            role: this.editedUser.role,
            email: this.editedUser.email,
            birthDate: this.editedUser.birthDate,
            userName: this.editedUser.userName
          })
          if (this.editedUser['address']) {
            for (let item of this.editedUser.address) {
              userAddress.push(
                new FormGroup({
                  city: new FormControl(item.city, Validators.required),
                  street: new FormControl(item.street, Validators.required),
                  houseNumber: new FormControl(item.houseNumber, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/)
                  ]),
                  postCode: new FormControl(item.postCode, Validators.required)
                })
              )
            }
          } 
        }, 10);
        }
      ) 
  }
  
  get controls() {
    return (<FormArray>this.userForm.get('address')).controls;
  }

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
        this.spinnerService.hide();
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    })
  }

  onAdd() {
    this.viewForm = true;
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
    (<FormArray>this.userForm.get('address')).clear();
    this.viewForm = true;
    this.userService.startedEditing.next(index);
  }
  onCancel() {
    this.userForm.reset();
    (<FormArray>this.userForm.get('address')).clear();  
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
