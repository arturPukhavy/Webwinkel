import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  constructor(private http: HttpClient) {}

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  getOrder(orderId: string): Observable<any> {
    return this.http.get('http://localhost:3000/api/v1/order/init', { headers: this.headers });
  }

  payOrder(orderData: any): Observable<any> {
    const taskData = {
        orderId: orderData.orderId, 
        cardNumber: orderData.cardNumber,
        name: orderData.cardHolder,
        expirityDate: orderData.expiryDate,
        cvv: orderData.cvv,
        totalPrice: orderData.totalPrice
    };
    return this.http.post('http://localhost:3000/api/v1/order/pay', taskData, { headers: this.headers });
  }

  // API 3: Mark the task as completed
  completeOrder(orderData: any): Observable<any> {
    const completeData = {
        orderId: orderData.orderId
    };
    return this.http.post('http://localhost:3000/api/v1/order/complete', completeData, { headers: this.headers });
  }

  // Function to chain all three API calls
  getChainedApiCalls(orderId: string): Observable<any> {
    return this.getOrder(orderId).pipe(
      switchMap((orderData) => {
        // First POST request using the result from the GET request
        return this.payOrder(orderData);
      }),
      switchMap((paymentResult) => {
        // Second POST request using the result from the first POST request
        return this.completeOrder(paymentResult);
      }),
      catchError((error) => {
        console.error('Error during API calls:', error);
        return of(null); // Return fallback value if any error occurs
      })
    );
  }
}