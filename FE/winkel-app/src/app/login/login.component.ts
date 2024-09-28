import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from './login.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AlertComponent } from '../alert/alert.component';
import { NgIf } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule, NgxSpinnerModule, AlertComponent, NgIf]
})
export class LoginComponent {
  error: string | null = null;

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
