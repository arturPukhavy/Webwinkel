import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AlertComponent } from './alert/alert.component';
import { ProductsComponent } from './products/products/products.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ProductsService } from './products/products.service';
import { UserComponent } from './users/user/user.component';
import { LoginComponent } from './login/login.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    AlertComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    FormsModule,
    UserComponent,
    LoginComponent,
    ShoppingListComponent
  ],
  providers: [ProductsService, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
