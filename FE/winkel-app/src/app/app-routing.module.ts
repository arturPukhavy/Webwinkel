import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products/products/products.component';
import { UserComponent } from './users/user/user.component';

const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductsComponent},
  { path: 'user', component: UserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
