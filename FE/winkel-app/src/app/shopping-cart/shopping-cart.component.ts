import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartItem } from './shopping-cart.model';
import { Product } from '../products/product.model';
import { CartService } from './shopping-cart.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  // standalone: true,
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit, OnDestroy{
  cartItems: CartItem[] = [];
  errorHandlingMode = false;
  error: string;
  payment = false

  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.cartService.getCartItems().subscribe((items) => {
      this.cartItems = items;
    });
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  buy() {
    this.payment = true;
  }

  onClose() {
    this.payment = false;
  }
  onHandleError() {
    this.errorHandlingMode = false;
  }

  get total() {
    return this.cartService.getTotal();
  }
  
  ngOnDestroy() {

  }
}
