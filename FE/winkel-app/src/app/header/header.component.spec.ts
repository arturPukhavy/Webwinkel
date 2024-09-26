// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { LoginService } from '../login/login.service';
// import { Component } from '@angular/core';
// import { HeaderComponent } from './header.component';

// describe('HeaderComponent', () => {
//   let component: HeaderComponent;
//   let fixture: ComponentFixture<HeaderComponent>;
//   let loginServiceSpy: jasmine.SpyObj<LoginService>;

//   beforeEach(async () => {
//     const spy = jasmine.createSpyObj('LoginService', ['logout']);

//     await TestBed.configureTestingModule({
//       declarations: [HeaderComponent],
//       providers: [{ provide: LoginService, useValue: spy }]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(HeaderComponent);
//     component = fixture.componentInstance;
//     loginServiceSpy = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should call logout on initialization', () => {
//     fixture.detectChanges(); // Trigger ngOnInit
//     expect(loginServiceSpy.logout).toHaveBeenCalled();
//   });
// });



