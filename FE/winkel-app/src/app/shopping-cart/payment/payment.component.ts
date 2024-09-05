import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CartService } from '../shopping-cart.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  @ViewChild('payForm') payForm!: NgForm;
  @Output() close = new EventEmitter<void>(); 
  cardNumber: string = '';
  cardHolder: string = '';
  expiryDate: string = '';
  cvv: string = '';
  totalPrice: number = 0;


  constructor(private cartService: CartService) {}

  ngOnInit() {
    this.totalPrice = this.cartService.getTotal(); // Get the total price
  }

  onSubmit() {
    // this.cartService.buyProducts(this.cartItems).subscribe({
    //   next: data => {
    //     console.log('Products bought: ' + JSON.stringify(data));
    //     alert("Thank you for your purchase!");
    //     this.cartItems = [];
    //   },
    //   error: (error: HttpErrorResponse) => {
    //     this.errorHandlingMode = true;
    //     this.error = error.error.error;
    //     console.error('There was an error: ', error.error.error);
    //   }
    // })
  }

  onCancel() {
    this.close.emit();
  }
}