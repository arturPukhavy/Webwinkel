import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AlertComponent } from './alert/alert.component';
import { ProductsComponent } from './products/products/products.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from './products/products.service';
import { UserComponent } from './users/user/user.component';
import { LoginComponent } from './login/login.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { HeaderComponent } from './header/header.component';
import { PaymentComponent } from './shopping-cart/payment/payment.component';
import { UsersService } from './users/users.service';
import { CartService } from './shopping-cart/shopping-cart.service';
import { LoginService } from './login/login.service';
import { AuthInterceptor } from './intercepter/auth.interceptor';
import { PaymentService } from './shopping-cart/payment/payment.service';


@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    AlertComponent,
    UserComponent,
    HeaderComponent,
    LoginComponent,
    ShoppingCartComponent,
    PaymentComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ProductsService, UsersService, CartService, LoginService, PaymentService,
    {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
