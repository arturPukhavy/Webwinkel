import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = 'Bearer jwt_token_string'; 

    // Clone the request and set the new header
    const cloned = req.clone({
      setHeaders: {
        Authorization: token
      }
    });

    return next.handle(cloned); 
  }
}