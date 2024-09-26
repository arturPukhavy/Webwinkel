// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ProductsComponent } from './products.component';
// import { ProductsService } from '../products.service';
// import { CartService } from '../../shopping-cart/shopping-cart.service';
// import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
// import { LoginService } from '../../login/login.service';
// import { of, BehaviorSubject, throwError, Subject } from 'rxjs';
// import { Product } from '../product.model';
// import { HttpErrorResponse } from '@angular/common/http';
// import { Login } from '../../login/user-login.model';
// import { NgForm } from '@angular/forms';
// import { UserComponent } from './user.component';
// import { UsersService } from '../users.service';
// import { User } from './model/User.model';
// import { Role } from './model/Role.model';

// describe('ProductsComponent', () => {
//   let component: UserComponent;
//   let fixture: ComponentFixture<UserComponent>;
//   let usersServiceSpy: jasmine.SpyObj<UsersService>;
//   let spinnerServiceSpy: jasmine.SpyObj<NgxSpinnerService>;

//   const mockUser: User = { id: 1, firstName: 'Test', lastName: 'Test Brand', userName: 'test', address: [], role: 'employee', 
//                            email: 'test', birthDate:  };
//   const mockUserArray: User[] = [mockUser];

//   beforeEach(async () => {
//     usersServiceSpy = jasmine.createSpyObj('UsersService', ['fetchUsers', 'createUser', 'deleteUser']);
  
//     // Mock for NgxSpinnerService
//     spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

//     await TestBed.configureTestingModule({
//       imports: [NgxSpinnerModule],
//       declarations: [ProductsComponent],
//       providers: [
//         { provide: UsersService, useValue: usersServiceSpy },
//         { provide: NgxSpinnerService, useValue: spinnerServiceSpy },
//       ],
//     }).compileComponents();

//     fixture = TestBed.createComponent(UserComponent);
//     component = fixture.componentInstance;
//   });

//   it('should create the component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should fetch users on init', () => {
//     usersServiceSpy.fetchUsers.and.returnValue(of(mockUserArray));
    
//     component.ngOnInit();
    
//     expect(usersServiceSpy.fetchUsers).toHaveBeenCalled();
//     expect(component.users.length).toBe(1);
//   });

//   it('should handle errors during fetchPosts', () => {
//     const errorResponse = new HttpErrorResponse({
//       error: { error: 'Test error' },
//       status: 500
//     });

//     usersServiceSpy.fetchUsers.and.returnValue(throwError(() => errorResponse));

//     component.onFetchUsers(); // Call the method directly
//     expect(component.errorHandlingMode).toBeTrue();
//     expect(component.error).toEqual('Test error');
//   });

//   it('should create a new product', () => {
//     component.userForm = {
//       value: { naam: 'New Product', merk: 'Brand', voorraad: 10, price: 200 },
//       reset: () => {}
//     } as NgForm;

//     usersServiceSpy.createUser.and.returnValue(of(mockUserArray));
//     component.onAddUser();

//     expect(spinnerServiceSpy.show).toHaveBeenCalled();
//     expect(usersServiceSpy.createUser).toHaveBeenCalledWith(component.userForm.value);
//   });

//   it('should unsubscribe from subscriptions on destroy', () => {
//     // Create a mock subscription
//     const subscription1 = jasmine.createSpyObj('Subscription', ['unsubscribe']);
//     const subscription2 = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  
//     // Add mock subscriptions to the component's subscriptions array
//     component['subscriptions'].push(subscription1);
//     component['subscriptions'].push(subscription2);
  
//     // Call ngOnDestroy to trigger the unsubscribe logic
//     component.ngOnDestroy();
  
//     // Verify that unsubscribe was called for each subscription
//     expect(subscription1.unsubscribe).toHaveBeenCalled();
//     expect(subscription2.unsubscribe).toHaveBeenCalled();
//   });
// });
