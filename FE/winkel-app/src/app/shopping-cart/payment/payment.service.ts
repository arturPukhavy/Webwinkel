import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {

  constructor(private http: HttpClient) {}

  getOrder(orderId: string): Observable<any> {
    return this.http.get('http://localhost:3000/api/v1/order/init');
  }

  payOrder(orderData: any): Observable<any> {
    const taskData = {
      "orderId": "ascf-257-xl",
      "cardNumber": "123456",
      "name": "Anna",
      "expirityDate": "12/26",
      "cvv": "123",
      "totalPrice": "1234.5"
    };
    return this.http.post('http://localhost:3000/api/v1/order/pay', taskData);
  }

  // API 3: Mark the task as completed
  completeOrder(orderData: any): Observable<any> {
    const completeData = {
      "orderId": "ascf-257-xl"
    };
    return this.http.post('http://localhost:3000/api/v1/order/complete', completeData);
  }

  // Function to chain all three API calls
  getChainedApiCalls(orderId: string): Observable<any> {
    return this.getOrder(orderId).pipe(
      switchMap((orderData) => {
        // First POST request using the result from the GET request
        return this.payOrder(orderData);
      }),
      switchMap((orderData) => {
        // Second POST request using the result from the first POST request
        return this.completeOrder(orderData);
      }),
      catchError((error) => {
        console.error('Error during API calls:', error);
        return of(null); // Return fallback value if any error occurs
      })
    );
  }
}