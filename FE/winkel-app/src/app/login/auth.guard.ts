import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { LoginService } from './login.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginService.user.pipe(
      take(1),
      map(user => {
        const isAuth = !!user;
        const requiredRole = route.data['role'];
  
        if (!isAuth) {
          console.log('Not Authenticated: Redirecting to Login');
          this.router.navigate(['/login']);
          return false;
        }
  
        if (requiredRole) {
          console.log('User role:', user.role, 'Required role:', requiredRole); // Debug log
          if (user.role === requiredRole) {
            return true;
          } else {
            console.log('Access Denied: Redirecting to Products');
            this.router.navigate(['/products']);
            return false;
          }
        } else {
          // No role required, just check if authenticated
          return true;
        }
      })
    );
  }
}