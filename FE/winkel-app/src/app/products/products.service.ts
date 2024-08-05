import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { Product } from './product.model';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  startedEditing = new Subject<number>();
  loadedPosts: Product[] = [];

  constructor( private http: HttpClient, private spinnerService: NgxSpinnerService) { }

  fetchPosts() {
    this.http.get<Product[]>('/api/v1/products').subscribe({
        next: data => {
          data.forEach(element => {
            console.log('Item: ' + element.naam)
          });
          this.loadedPosts = data;
        },
        error: error => {
          console.error('There was an error: ', error.message);
        }
    });
  }
  createPost(postData: {naam: string; merk: string; voorraad: number; price: number}) {
    this.spinnerService.show();
    this.http.post<Product[]>('/api/v1/products', postData)
      .subscribe({
        next: data => {
          setTimeout(() => {
            this.spinnerService.hide();
          }, 2000);
          console.log('Product added: ' + JSON.stringify(postData));
          this.fetchPosts();
        },
        error: error => {
          console.error('There was an error: ', error.message);
        }
      });
  }
  updatePost(putData: { id: number, naam: string; merk: string; voorraad: number; price: number}) {
    console.log('PUT data: ' + JSON.stringify(putData));
    this.http.put<Product[]>('/api/v1/products', putData)
      .subscribe({
        next: data => {
          console.log('Product changed: ' + JSON.stringify(putData));
          this.fetchPosts()
        },
        error: error => {
          console.error('There was an error: ', error.message);
        }
      });
  }
  deleteProduct(id: number) {
    const options = {
      body: {
        id:id
      },
    };
    this.http.delete('/api/v1/product', options).subscribe({
      next: data => {
        this.loadedPosts = this.loadedPosts.filter(item => item.id !== id);
        console.log('Delete successful, id: ' + id);
      },
      error: error => {
          console.error('There was an error: ', error.message);
      }
  });
  }
  clearPosts() {
    this.http.delete<Product>('/api/v1/products').subscribe({
      next: data => {
        console.log('All products deleted');
        this.loadedPosts = [];
      },
      error: error => {
        console.error('There was an error: ', error.message);
      }
    });
  }

  getProduct(index: number) {
    return this.loadedPosts[index];
  }
  

  
}

