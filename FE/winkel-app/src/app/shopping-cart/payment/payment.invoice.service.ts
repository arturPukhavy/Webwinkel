import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class InvoiceService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  createInvoice(orderData: any): Observable<any> {
    console.log('--- Invoice, orderData:', orderData);
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
  sendInvoice(invoiceData: any): Observable<any> {
    const invoiceInfo = {
      invoiceForOrder: invoiceData.invoiceForOrder
    };
    console.log('--->> InvoiceInfo, orderData:', invoiceInfo);
    return this.http.post('/api/v1/invoice/send', invoiceInfo, { headers: this.headers }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error in invoiceInfo:', error);
          return of(null); // Return null in case of error
        })
    );
  }
  getChainedInvoiceCalls(invoiceForOrder: string): Observable<any> {
    console.log('--->Order Data:', invoiceForOrder);
    const orderIdData = {
        orderId: invoiceForOrder
    };
    return this.createInvoice(orderIdData).pipe(
        switchMap((invoiceData) => {
            console.log('-Order Data-11:', invoiceData);
            return this.sendInvoice(invoiceData);
        })
    );
  }
}