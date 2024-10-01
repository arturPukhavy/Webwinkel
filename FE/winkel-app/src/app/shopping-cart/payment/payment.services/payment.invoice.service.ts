import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { OrderData } from '../payment.models/payment.model';
import { InvoiceData } from '../payment.models/payment.invoice.model';
import { LoginService } from '../../../login/login.service';
import { Login } from '../../../login/user-login.model';

@Injectable({
  providedIn: 'root',
})

export class InvoiceService {
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient, private loginService: LoginService) {}

  createInvoice(orderData: OrderData): Observable<any> {
    console.log('--- Invoice, orderData:', orderData);
    return this.http.post('/api/v1/invoice/create', orderData, { headers: this.headers }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error in invoiceData:', error);
          return of(null); // Return null in case of error
        })
    );
  }

  sendInvoice(invoice: InvoiceData): Observable<any> {
    console.log('--->> InvoiceInfo, orderData:', invoice);
    return this.http.post('/api/v1/invoice/send', invoice, { headers: this.headers }).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error in invoiceInfo:', error);
          return of(null); // Return null in case of error
        })
    );
  }

  getChainedInvoiceCalls(invoiceForOrder: string): Observable<any> {
    console.log('--->Order Data:', invoiceForOrder);
    const orderIdData: OrderData = { orderId: invoiceForOrder };
    return this.createInvoice(orderIdData).pipe(
      switchMap((invoiceD) => {
        console.log('-Order Data-11:', invoiceD);

        // Retrieve the email from the LoginService
        const email = this.loginService.getEmail();
        if (!email) {
          console.error('No email found for the logged-in user!');
          return of(null); // Handle when email is not available
        }
        const invoice: InvoiceData = {
          invoiceForOrder: invoiceD,
          email: email
        };

        return this.sendInvoice(invoice);
      })
    );
  }
}
