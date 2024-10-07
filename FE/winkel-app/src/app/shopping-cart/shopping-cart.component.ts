import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartItem } from './shopping-cart.model';
import { CartService } from './shopping-cart.service';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from '../alert/alert.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { PaymentComponent } from './payment/payment.component';

@Component({
  standalone: true,
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
  imports: [FormsModule, AlertComponent, PaymentComponent, NgIf, NgFor, CommonModule]
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

  increaseQuantity(item: CartItem) {
    this.cartService.increaseQuantity(item.product.id);
  }
  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      this.cartService.decreaseQuantity(item.product.id);
    } else {
      this.removeFromCart(item.product.id); // If quantity is 1, remove the item
    }
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
