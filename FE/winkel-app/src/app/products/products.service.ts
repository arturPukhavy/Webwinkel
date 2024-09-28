import { Injectable } from '@angular/core';
import { Subject } from "rxjs";
import { Product } from './product.model';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  startedEditing = new Subject<number>();
 

  constructor( private http: HttpClient ) {
    console.log('Create ProductsService instance')
   }

  fetchPosts() {
    return this.http.get<Product[]>('/api/v1/products')
  };

  createPost(postData: {naam: string; merk: string; voorraad: number; price: number}) {
    return this.http.post<Product[]>('/api/v1/products', postData)
  }

  updatePost(putData: { id: number, naam: string; merk: string; voorraad: number; price: number}) {
    console.log('PUT data: ' + JSON.stringify(putData));
     return this.http.put<Product[]>('/api/v1/products', putData)
  }
  deleteProduct(id: number) {
    const options = {
      body: {
        id:id
      },
    };
    return this.http.delete('/api/v1/product', options)
  }

  clearPosts() {
    return this.http.delete<Product>('/api/v1/products')
  }
  
}

