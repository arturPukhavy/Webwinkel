import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products/products.component';
import { UserComponent } from './users/user/user.component';
import { LoginComponent } from './login/login.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent},
  { path: 'user', component: UserComponent },
  { path: 'login', component: LoginComponent },
  { path: 'shoppinglist', component: ShoppingListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
