import { Component } from '@angular/core';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isAuthenticated = false;
  
  constructor( private loginService: LoginService ) {}

  onLogout() {
    this.loginService.logout();
  }


}
