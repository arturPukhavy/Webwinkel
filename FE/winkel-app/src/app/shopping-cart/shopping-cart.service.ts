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
  
  products$ = new BehaviorSubject<Product[]>([]);

  constructor(private http: HttpClient) {
    // Initialize the products$ BehaviorSubject 
    this.products$.next(this.product);
  }

  getCartItems() {
    return this.cartSubject.asObservable();
  }

  addToCart(product: Product) {
    const item = this.cartItems.find((i) => i.product.id === product.id);
    if (item) {
      item.quantity++;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    this.cartSubject.next(this.cartItems);
  }

  removeFromCart(productId: number) {
    this.cartItems = this.cartItems.filter(item => item.product.id !== productId);
    this.cartSubject.next(this.cartItems);
  }

  getTotal() {
    return this.cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }

  buyProducts(cartItems: CartItem[]) {
    return this.http.post('/api/v1/shoppingcart', { items: cartItems })
  }
}