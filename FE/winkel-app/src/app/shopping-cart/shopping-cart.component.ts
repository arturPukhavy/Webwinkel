import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartItem } from './shopping-cart.model';
import { CartService } from './shopping-cart.service';

@Component({
  // standalone: true,
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent implements OnInit {
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
  
}
