import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class PaymentService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  getOrder(): Observable<any> {
    return this.http.get('/api/v1/order/init', { headers: this.headers }).pipe(
        map((response: any) => {
            if (response && response.orderId) {
                return response; 
            } else {
                console.error('Invalid response from getOrder:', response);
                return null; 
            }
        }),
        catchError((error: HttpErrorResponse) => {
            console.error('Error in getOrder:', error);
            return of(null); // Return null in case of error
        })
    );
  }  

  payOrder(orderData: any): Observable<any> {
    console.log('Received orderData in payOrder:', orderData);
    if (!orderData || !orderData.orderId) {
        console.error('Invalid orderData in payOrder:', orderData);
        return of(null);
    }
    const taskData = {
        orderId: orderData.orderId,
        cardNumber: orderData.cardNumber,
        name: orderData.cardHolder,
        expirityDate: orderData.expiryDate,
        cvv: orderData.cvv,
        totalPrice: orderData.totalPrice
    };
    console.log('task data:', JSON.stringify(taskData));
    return this.http.post('/api/v1/order/pay', taskData, { headers: this.headers }).pipe(
        map((response: any) => {
            console.log('Response from payOrder:', response); // Log the response
            if (response) {
                console.log('Pay-response:', response);
                return response;
            } else {
                console.error('Payment response does not include orderId:', response);
                return { paymentStatus: response.paymentStatus, orderId: orderData.orderId }; // Include orderId from input
            }
        }),
        catchError((error: HttpErrorResponse) => {
            console.error('Error in payOrder:', error);
            return of(null);
        })
    );
  }

  // API 3: Mark the task as completed
  completeOrder(orderData: any): Observable<any> {
    console.log('Received orderData in completeOrder:', orderData);
    if (!orderData) {
        console.error('Invalid orderData in completeOrder:', orderData);
        return of(null); // Return null if orderData is invalid
    }
    const completeData = {
        orderId: orderData.orderId // Send the orderId if needed for processing
    };

    return this.http.post('/api/v1/order/complete', completeData, { headers: this.headers }).pipe(
        map((response: any) => {
            console.log('Response from completeOrder:', response); // Log the response
            return response;
        }),
        catchError((error: HttpErrorResponse) => {
            console.error('Error in completeOrder:', error);
            return of(null); // Return null in case of error
        })
    );
  }

  // Function to chain all three API calls
  getChainedApiCalls(): Observable<any> {
    return this.getOrder().pipe(
      switchMap((orderData) => {
        console.log('Order Data from getOrder:', orderData);
  
        // Return null if orderData or orderId is invalid
        if (!orderData || !orderData.orderId) {
          console.error('Invalid orderData or orderId:', orderData);
          return of(null);
        }
  
        // Save the orderId to reuse it later in the invoice call
        const orderId = orderData.orderId;
  
        // Proceed to payOrder with the orderData
        return this.payOrder(orderData).pipe(
          switchMap((paymentResult) => {
            console.log('Payment Result from payOrder:', paymentResult);
  
            // Return null if paymentResult is invalid
            if (!paymentResult) {
              console.error('Invalid paymentResult:', paymentResult);
              return of(null);
            }
  
            // Proceed to completeOrder with the paymentResult
            return this.completeOrder(paymentResult).pipe(
              map((completeResult) => {
                // Attach the original orderId to the completeResult
                return { ...completeResult, orderId };  // Merge orderId with completeResult
              })
            );
          })
        );
      }),
      catchError((error) => {
        console.error('Error during chained API calls:', error);
        return of(null); // Return fallback value if any error occurs
      })
    );
  }
}
