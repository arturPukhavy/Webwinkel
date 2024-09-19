import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
    private headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

  constructor(private http: HttpClient) {}

  getOrder(orderId: string): Observable<any> {
    return this.http.get('/api/v1/order/init', { headers: this.headers }).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error('Error in getOrder:', error);
            return of(null); // Return null in case of error
        })
      );;
  }

  payOrder(orderData: any): Observable<any> {
    if (!orderData || !orderData.orderId) {
        console.error('Invalid orderData in payOrder:', orderData);
        return of(null); // Return null if orderData is invalid
    }
    const taskData = {
        orderId: orderData.orderId, 
        cardNumber: orderData.cardNumber,
        name: orderData.cardHolder,
        expirityDate: orderData.expiryDate,
        cvv: orderData.cvv,
        totalPrice: orderData.totalPrice
    };
    console.log('task data:' + JSON.stringify(taskData));
    return this.http.post('/api/v1/order/pay', taskData, { headers: this.headers }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error in payOrder:', error);
          return of(null); // Return null in case of error
        })
      );
  }

  // API 3: Mark the task as completed
  completeOrder(orderData: any): Observable<any> {
    if (!orderData || !orderData.orderId) {
        console.error('Invalid orderData in completeOrder:', orderData);
        return of(null); // Return null if orderData is invalid
    }
    const completeData = {
        orderId: orderData.orderId
    };
    return this.http.post('/api/v1/order/complete', completeData, { headers: this.headers }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error in completeOrder:', error);
          return of(null); // Return null in case of error
        })
      );;
  }

  // Function to chain all three API calls
  getChainedApiCalls(orderId: string): Observable<any> {
    return this.getOrder(orderId).pipe(
      switchMap((orderData) => {
        console.log('Order Data:', orderData);
        if (!orderData || !orderData.orderId) {
          console.error('Invalid orderData received from getOrder:', orderData);
          return of(null); // Stop the chain if getOrder returns invalid data
        }
        return this.payOrder(orderData);
      }),
      switchMap((paymentResult) => {
        console.log('Payment Result:', paymentResult);
        if (!paymentResult || !paymentResult.orderId) {
          console.error('Invalid paymentResult received from payOrder:', paymentResult);
          return of(null); // Stop the chain if payOrder returns invalid data
        }
        return this.completeOrder(paymentResult);
      }),
      catchError((error) => {
        console.error('Error during API calls:', error);
        return of(null); // Return fallback value if any error occurs
      })
    );
  }
}
