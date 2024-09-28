import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { LoginService } from './login/login.service';
import { Component } from '@angular/core';

// Mock for the AppHeaderComponent
@Component({
  selector: 'app-header',
  template: '' // Empty template for the mock
})
class MockAppHeaderComponent {}

@Component({
  selector: 'router-outlet',
  template: '' // Empty template for the mock
})
class MockRouterOutletComponent {}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('LoginService', ['autoLogin']);

    await TestBed.configureTestingModule({
      declarations: [AppComponent, MockAppHeaderComponent, MockRouterOutletComponent], // Use the mock component
      providers: [{ provide: LoginService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    loginServiceSpy = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call autoLogin on initialization', () => {
    fixture.detectChanges(); // Trigger ngOnInit
    expect(loginServiceSpy.autoLogin).toHaveBeenCalled();
  });
});