import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CartService } from '../shopping-cart.service';
import { CartItem } from '../shopping-cart.model';

import { InvoiceService } from './payment.services/payment.invoice.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { PaymentService } from './payment.services/payment.service';

@Component({
  standalone: true,
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
  imports: [FormsModule, NgIf, NgFor, CommonModule]
})
export class PaymentComponent {
  @ViewChild('payForm') payForm: NgForm;
  @Output() close = new EventEmitter<void>(); 
  cardNumber: string = '';
  cardHolder: string = '';
  expiryDate: string = '';
  cvv: string = '';
  totalPrice: number = 0;
  isChecked: boolean = false;
  orderCompleted = false;
  orderId: string = '';
  cartItems: CartItem[] = [];


  constructor(private cartService: CartService, 
              private paymentService: PaymentService,
              private invoiceService: InvoiceService) {}

  ngOnInit() {
    this.totalPrice = this.cartService.getTotal(); // Get the total price

    this.cartService.getCartItems().subscribe((items: CartItem[]) => {
      this.cartItems = items;
    });
  }

  onSubmit() {
    this.paymentService.getChainedApiCalls().subscribe(
      (finalResult) => {
        console.log('Final result from getChainedApiCalls:', finalResult);
  
        if (finalResult && finalResult.orderId) {
          console.log('Order ID retrieved:', finalResult.orderId);
          this.orderCompleted = true;
          this.orderId = finalResult.orderId;
  
          if (this.isChecked) {
            this.invoiceService.getChainedInvoiceCalls(finalResult.orderId).subscribe(
              (invoiceResult) => {
                console.log('Final invoice result:', invoiceResult);
              },
              (error) => {
                console.error('Error in chained invoice API calls:', error);
              }
            );
          }
        } else {
          console.error('No valid orderId received from getChainedApiCalls:', finalResult);
        }
      },
      (error) => {
        console.error('Error in chained API calls:', error);
      }
    );
  }

  onCancel() {
    this.close.emit();
  }
}