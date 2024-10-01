import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { LoginService, LoginResponseData } from './login.service';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { of, throwError } from 'rxjs';
import { FormsModule, NgForm } from '@angular/forms';
import { Role } from '../users/user/model/Role.model';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let spinnerServiceSpy: jasmine.SpyObj<NgxSpinnerService>;

  const mockLoginResponseData: LoginResponseData = {
    idToken: 'mock-id-token',
    expiresIn: 3600,
    role: Role.Custm,
    userName: 'test-user',
    email: 'test@test.com'
  };

  beforeEach(async () => {
    const loginSpy = jasmine.createSpyObj('LoginService', ['login']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const spinnerSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule, NgxSpinnerModule],
      providers: [
        { provide: LoginService, useValue: loginSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: NgxSpinnerService, useValue: spinnerSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    loginServiceSpy = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    spinnerServiceSpy = TestBed.inject(NgxSpinnerService) as jasmine.SpyObj<NgxSpinnerService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should not call loginService when form is invalid', () => {
    const form = <unknown>{
      valid: false,
      value: { email: '', password: '' },
      reset: jasmine.createSpy('reset')
    } as NgForm;

    component.onSubmit(form);

    expect(loginServiceSpy.login).not.toHaveBeenCalled();
    expect(spinnerServiceSpy.show).not.toHaveBeenCalled();
  });

  it('should call loginService and spinner when form is valid', () => {
    const form = <unknown>{
      valid: true,
      value: { email: 'test@test.com', password: '123456' },
      reset: jasmine.createSpy('reset')
    } as NgForm;

    loginServiceSpy.login.and.returnValue(of(mockLoginResponseData));

    component.onSubmit(form);

    expect(spinnerServiceSpy.show).toHaveBeenCalled();
    expect(loginServiceSpy.login).toHaveBeenCalledWith('test@test.com', '123456');
    expect(form.reset).toHaveBeenCalled(); // Ensure reset is called
  });

  it('should navigate to /products on successful login', () => {
    const form = <unknown>{
      valid: true,
      value: { email: 'test@test.com', password: '123456' },
      reset: jasmine.createSpy('reset')
    } as NgForm;

    loginServiceSpy.login.and.returnValue(of(mockLoginResponseData));

    component.onSubmit(form);

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/products']);
  });

  it('should handle login error and set error message', () => {
    const form = <unknown>{
      valid: true,
      value: { email: 'test@test.com', password: '123456' },
      reset: jasmine.createSpy('reset')
    } as NgForm;

    loginServiceSpy.login.and.returnValue(throwError('Login failed'));

    component.onSubmit(form);

    expect(component.error).toBe('Login failed');
    expect(spinnerServiceSpy.hide).toHaveBeenCalled();
  });

  it('should reset error message when onHandleError is called', () => {
    component.error = 'Some error';
    component.onHandleError();
    expect(component.error).toBeNull();
  });
});
