import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginService } from '../login/login.service';
import { Subscription } from 'rxjs';
import { Login } from '../login/user-login.model';
import { Role } from "../users/user/model/Role.model";
import { CartService } from '../shopping-cart/shopping-cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private subs: Subscription = new Subscription();
  user: Login | null = null;
  role = Role;
  cartItemCount: number = 0;
  
  constructor( private loginService: LoginService, private cartService: CartService ) {}

  ngOnInit() {
    this.subs.add(
      this.loginService.user.subscribe(user => {
        this.user = user;
        this.isAuthenticated = !!user;
        console.log('User object:', this.user);
        console.log(!user);
        console.log(!!user);
      })
    );

    this.subs.add(
      this.cartService.getCartItemCount().subscribe(count => {
        this.cartItemCount = count;
      })
    );
  }

  onLogout() {
    this.loginService.logout();
  }

  get fullName(): string {
    // Access the User object from the Login model
    const userName: string | undefined = this.user?.userName;
  if (userName) {
    return userName; 
    }
    return ''; 
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
