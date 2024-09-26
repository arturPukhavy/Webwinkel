import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../products/product.model';
import { CartItem } from './shopping-cart.model';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class CartService {
  private product: Product[]; 

  private cartItems: CartItem[] = [];
  private cartSubject = new BehaviorSubject<CartItem[]>(this.cartItems);
  private cartItemCountSubject = new BehaviorSubject<number>(0);
  
  products$ = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {
    // Initialize the products$ BehaviorSubject 
    this.products$.next(this.product);
  }

  getCartItems() {
    return this.cartSubject.asObservable();
  }
  getCartItemCount() {
    return this.cartItemCountSubject.asObservable(); // New observable for item count
  }

  addToCart(product: Product) {
    const item = this.cartItems.find((i) => i.product.id === product.id);
    if (item) {
      item.quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    this.cartSubject.next(this.cartItems);
    this.updateCartItemCount();
  }

  removeFromCart(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.cartSubject.next(this.cartItems);
    this.updateCartItemCount();
  }

  private updateCartItemCount() {
    const totalCount = this.cartItems.reduce((count, item) => count + item.quantity, 0);
    this.cartItemCountSubject.next(totalCount); // Emit the new count
  }

  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

}