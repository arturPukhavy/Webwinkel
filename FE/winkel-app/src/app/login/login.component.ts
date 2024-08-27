import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { LoginService, LoginResponseData } from './login.service';

@Component({
  // standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoginMode = true;
  isLoading = false;
  error: null;

  constructor(private loginService: LoginService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<LoginResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.loginService.login(email, password);
    } else {
      authObs = this.loginService.signup(email, password);
    }

    authObs.subscribe(
      resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

}
