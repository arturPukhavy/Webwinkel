import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { of, throwError, Subject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserComponent } from './user.component';
import { UsersService } from '../users.service';
import { User } from './model/User.model';
import { Role } from './model/Role.model';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let spinnerServiceSpy: jasmine.SpyObj<NgxSpinnerService>;

  const mockUser: User = { 
    id: 1, 
    firstName: 'Test', 
    lastName: 'Test Brand', 
    userName: 'test', 
    address: [], 
    role: Role.Empl, 
    email: 'test@test.com', 
    password: 'test', 
    birthDate: new Date('2000-01-01') 
  };
  const mockUserArray: User[] = [mockUser];

  beforeEach(async () => {
    usersServiceSpy = jasmine.createSpyObj('UsersService', ['fetchUsers', 'createUser', 'deleteUser']);
    usersServiceSpy.startedEditing = new Subject<number>(); // Subject for startedEditing

    spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      imports: [NgxSpinnerModule],
      declarations: [UserComponent],
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;

    component.userForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      role: new FormControl('Admin'),
      email: new FormControl(null, [Validators.required, Validators.email]),
      birthDate: new FormControl(null, Validators.required),
      userName: new FormControl(null, Validators.required),
      address: new FormArray([])
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch users on init', () => {
    usersServiceSpy.fetchUsers.and.returnValue(of(mockUserArray));
    
    component.ngOnInit();
    
    expect(usersServiceSpy.fetchUsers).toHaveBeenCalled();
    expect(component.users.length).toBe(1);
  });

  it('should handle errors during fetchUsers', () => {
    const errorResponse = new HttpErrorResponse({
      error: { error: 'Test error' },
      status: 500
    });

    usersServiceSpy.fetchUsers.and.returnValue(throwError(() => errorResponse));

    component.onFetchUsers(); // Call the method directly
    expect(component.errorHandlingMode).toBeTrue();
    expect(component.error).toEqual('Test error');
  });

  it('should create a new user', () => {
    component.userForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      role: 'Admin',
      email: 'johndoe@test.com',
      birthDate: new Date('2000-01-01'),
      userName: 'johndoe',
      address: []
    });

    usersServiceSpy.createUser.and.returnValue(of(mockUserArray)); // Return an array
    component.onAddUser();

    expect(spinnerServiceSpy.show).toHaveBeenCalled();
    expect(usersServiceSpy.createUser).toHaveBeenCalledWith(component.userForm.value);
  });

  it('should unsubscribe from subscription on destroy', () => {
    const subscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.subscription = subscription; // Assign the mock subscription

    component.ngOnDestroy();

    expect(subscription.unsubscribe).toHaveBeenCalled();
  });
});