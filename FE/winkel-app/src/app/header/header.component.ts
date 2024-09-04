import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Subscription } from 'rxjs';
import { Login } from '../login/user-login.model';
import { Role } from "../users/user/model/Role.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;
  user: Login | null = null;
  role = Role
  
  constructor( private loginService: LoginService ) {}

  ngOnInit() {
    this.userSub = this.loginService.user.subscribe(user => {
      this.user = user;
      this.isAuthenticated = !!user;
      console.log(!user);
      console.log(!!user);
    });
  }

  onLogout() {
    this.loginService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }


}
