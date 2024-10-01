import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';
import { Login } from './user-login.model';
import { Role } from '../users/user/model/Role.model';

export interface LoginResponseData {
  idToken: string;
  expiresIn: number;
  role: Role;
  userName: string;
  email: string;  // Make sure the email is part of the response from the login API
}

@Injectable({ providedIn: 'root' })
export class LoginService {
  user = new BehaviorSubject<Login | null>(null);
  private tokenExpirationTimer: any;
  private email: string | null = null; // Store the email here

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<LoginResponseData>(
        '/api/v1/login',
        {
          email: email,  // Email is passed in the request body
          password: password,
          returnSecureToken: true
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(resData => {
          this.email = email;  // Store the email when the user logs in
          this.handleAuthentication(
            resData.idToken,
            +resData.expiresIn,
            resData.role,
            resData.userName,
            email  // Pass the email
          );
        })
      );
  }

  autoLogin() {
    const userDataString = localStorage.getItem('userData');
    if (!userDataString) {
      return; // No user data found in localStorage
    }
    
    const userData: {
      _token: string;
      _tokenExpirationDate: string;
      role: Role;
      userName: string;
      email: string;  // Make sure email is present in localStorage
    } = JSON.parse(userDataString);
    
    const loadedUser = new Login(
      userData._token,
      new Date(userData._tokenExpirationDate),
      userData.role,
      userData.userName
    );
  
    this.email = userData.email;  // Restore email from localStorage
  
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
    this.email = null; 
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
    token: string,
    expiresIn: number,
    role: Role,
    userName: string,
    email: string   // Now we pass the email as well
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new Login(token, expirationDate, role, userName);
    this.user.next(user);
    this.email = email;  // Store the email
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify({ 
      _token: token, 
      _tokenExpirationDate: expirationDate.toISOString(), 
      role: role, 
      userName: userName,
      email: email  // Save the email in local storage
    }));
  }

  // Method to retrieve the stored email
  getEmail(): string | null {
    return this.email;
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
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
    }
    return throwError(errorMessage);
  }
}


 
