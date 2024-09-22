import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { LoginService, LoginResponseData } from './login.service';
import { Login } from './user-login.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  // standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  error: null;

  constructor(private loginService: LoginService, private router: Router, private spinnerService: NgxSpinnerService) {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.spinnerService.show();
    this.loginService.login(email, password).subscribe(
      resData => {
        console.log(resData);
        this.spinnerService.hide();
        this.router.navigate(['/products']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.spinnerService.hide();
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

}
