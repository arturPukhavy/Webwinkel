import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject, Subject } from 'rxjs';

import { Login } from './user-login.model';
import { __values } from 'tslib';
import { Role } from '../users/user/model/Role.model';
import { User } from '../users/user/model/User.model';


export interface LoginResponseData {
  idToken: string;
  email: string;
  expiresIn: number;
  role: Role;
  name: User
}

@Injectable({ providedIn: 'root' })
export class LoginService {
user = new BehaviorSubject<Login | null>(null);
private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<LoginResponseData>(
        '/api/v1/login',
        {
          email: email,
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.handleAuthentication(
            resData.email,
            resData.idToken,
            +resData.expiresIn,
            resData.role,
            resData.name
          );
        })
      );
  }
  autoLogin() {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      return;
    }
    const userData: {
      email: string;
      _token: string;
      _tokenExpirationDate: string;
      role: Role;
      name: User
    } = JSON.parse(userDataString);
   
    const loadedUser = new Login(
      userData.email,
      userData._token,
      new Date(userData._tokenExpirationDate),
      userData.role,
      userData.name
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    token: string,
    expiresIn: number,
    role: Role,
    name: User
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new Login(email, token, expirationDate, role, name );
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = errorRes.error.error;
    console.error('Error Response:', errorRes);
  
    // Check if the error response is as expected
    if (errorRes.error && errorRes.error.error) {
      const errorType = errorRes.error.error.message; 
      switch (errorType) {
        case 'EMAIL_NOT_FOUND':
          errorMessage = 'This email does not exist.';
          break;
        case 'INVALID_PASSWORD':
          errorMessage = 'This password is not correct.';
          break;
      }
    } else {
      errorMessage = 'An unknown error occurred!'; 
    }
    return throwError(errorMessage);
  }
}
