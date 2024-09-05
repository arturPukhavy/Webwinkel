import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Subscription } from 'rxjs';
import { Login } from '../login/user-login.model';
import { Role } from "../users/user/model/Role.model";
import { User } from '../users/user/model/User.model';
import { Person } from '../users/user/model/Person.model';
import { CartService } from '../shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private sub: Subscription;
  user: Login | null = null;
  role = Role;
  cartItemCount: number = 0;
  
  constructor( private loginService: LoginService, private cartService: CartService ) {}

  ngOnInit() {
    this.sub = this.loginService.user.subscribe(user => {
      this.user = user;
      this.isAuthenticated = !!user;
      console.log('User object:', this.user);
      console.log(!user);
      console.log(!!user);
    });
    this.sub = this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  onLogout() {
    this.loginService.logout();
  }

  get fullName(): string {
    // Access the User object from the Login model
    const userDetails: User | undefined = this.user?.name;
    if (userDetails && userDetails.firstName && userDetails.lastName) {
      return `${userDetails.firstName} ${userDetails.lastName}`; // Construct full name
    }
    return ''; // Return empty string if no user or names are not available
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


}
