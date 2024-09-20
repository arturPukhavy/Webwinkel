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

  getOrder(orderId: string): Observable<any> {
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
            if (response && response.orderId) {
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
    if (!orderData || !orderData.orderId) {
        console.error('Invalid orderData in completeOrder:', orderData);
        return of(null); // Return null if orderData is invalid
    }
    const completeData = {
        orderId: orderData.orderId // Send the orderId if needed for processing
    };

    return this.http.post('/api/v1/order/complete', completeData, { headers: this.headers }).pipe(
        map((response: any) => {
            console.log('Response from completeOrder:', response); // Log the response
            // if (response && response.status) {
            //     return response; // Return the response containing status
            // } else {
            //     console.error('Invalid response from completeOrder:', response);
            //     return null; // Handle the case where the response is not as expected
            // }
        }),
        catchError((error: HttpErrorResponse) => {
            console.error('Error in completeOrder:', error);
            return of(null); // Return null in case of error
        })
    );
  }

  // Function to chain all three API calls
  getChainedApiCalls(orderId: string): Observable<any> {
    return this.getOrder(orderId).pipe(
        switchMap((orderData) => {
            console.log('Order Data:', orderData);
            // if (!orderData || !orderData.orderId) {
            //     console.error('Invalid orderData received from getOrder:', orderData);
            //     return of(null); // Stop the chain if getOrder returns invalid data
            // }
            return this.payOrder(orderData);
        }),
        switchMap((paymentResult) => {
            console.log('Payment Result:', paymentResult);
            if (!paymentResult || !paymentResult.orderId) {
                console.error('Invalid paymentResult received from payOrder:', paymentResult);
                return of(null); // Handle case where orderId is missing
            }
            return this.completeOrder(paymentResult); // This now expects the simplified response
        }),
        catchError((error) => {
            console.error('Error during API calls:', error);
            return of(null); // Return fallback value if any error occurs
        })
    );
  }

  createInvoice(orderData: any): Observable<any> {
    const invoiceData = {
        orderId: orderData.orderId
    };
    return this.http.post('/api/v1/invoice/create', invoiceData, { headers: this.headers }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error in invoiceData:', error);
          return of(null); // Return null in case of error
        })
    );
  }
  sendInvoice(orderData: any): Observable<any> {
    const invoiceInfo = {
      invoiceForOrder: orderData.orderId
    };
    return this.http.post('/api/v1/invoice/send', invoiceInfo, { headers: this.headers }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error in invoiceInfo:', error);
          return of(null); // Return null in case of error
        })
    );
  }
  getChainedInvoiceCalls(invoiceForOrder: string): Observable<any> {
    return this.createInvoice(invoiceForOrder).pipe(
        switchMap((orderData) => {
            console.log('Order Data:', orderData);
            // if (!orderData || !orderData.orderId) {
            //     console.error('Invalid orderData received from getOrder:', orderData);
            //     return of(null); // Stop the chain if getOrder returns invalid data
            // }
            return this.sendInvoice(orderData);
        })
    );
  }
}
