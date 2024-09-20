import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CartService } from '../shopping-cart.service';
import { CartItem } from '../shopping-cart.model';
import { PaymentService } from './payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  @ViewChild('payForm') payForm: NgForm;
  @Output() close = new EventEmitter<void>(); 
  cardNumber: string = '';
  cardHolder: string = '';
  expiryDate: string = '';
  cvv: string = '';
  totalPrice: number = 0;
  cartItems: CartItem[] = [];


  constructor(private cartService: CartService, private paymentService: PaymentService) {}

  ngOnInit() {
    this.totalPrice = this.cartService.getTotal(); // Get the total price

    this.cartService.getCartItems().subscribe((items: CartItem[]) => {
      this.cartItems = items;
    });
  }

  onSubmit() {
    

    // Call the chained API function
    this.paymentService.getChainedApiCalls().subscribe(
      (finalResult) => {
        console.log('Final result:', finalResult);
      },
      (error) => {
        console.error('Error in chained API calls:', error);
      }
    );

    this.paymentService.getChainedInvoiceCalls('ascf-257-xl').subscribe(
      (finalResult) => {
        console.log('Final result1:', finalResult);
      },
      (error) => {
        console.error('Error in chained API calls:', error);
      }
    );
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