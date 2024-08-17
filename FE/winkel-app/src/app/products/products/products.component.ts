import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy{
  @ViewChild('postForm') productForm: NgForm; 
  subscription: Subscription;
  loadedPosts: Product[] = [];
  editMode = false;
  editItemIndex: number;  //TODO: seems this is not used. It can bedeleted
  editedItem: Product;
  errorHandlingMode = false;
  error: string;

  constructor(private prService: ProductsService, private spinnerService: NgxSpinnerService ) {
    console.log('Create ProductsComponent')
  }
  

  ngOnInit() {
    this.onFetchPosts();
    this.subscription = this.prService.startedEditing
      .subscribe(
        (index: number) => {
          this.editItemIndex = index; //TODO: delete it
          console.log('Product to edit: ' + JSON.stringify(this.getProduct(index)));
          this.editMode = true;
          this.editedItem = this.getProduct(index);
          this.productForm.setValue({
            id: this.getProduct(index).id,
            naam: this.editedItem.naam,
            merk: this.editedItem.merk,
            voorraad: this.editedItem.voorraad,
            price: this.editedItem.price
          })
        }
    ) 
  };

  onCreatePost() {
    this.spinnerService.show();
    this.prService.createPost(this.productForm.value).subscribe({
      next: data => {
        this.spinnerService.hide();
        console.log('Product added: ' + JSON.stringify(data));
        this.onFetchPosts();
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    })
  };

  onUpdatePost() {
    this.prService.updatePost(this.productForm.value).subscribe({
      next: data => {
        console.log('Product changed: ' + JSON.stringify(data));
        this.onFetchPosts()
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    }) 
  };

  onFetchPosts() {
    this.prService.fetchPosts().subscribe({
      next: data => {
        data.forEach(element => {
          console.log('Item: ' + element.naam)
        });
        this.loadedPosts = data;
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    })
  };
  onDeleteProduct(id: number) {
    this.prService.deleteProduct(id).subscribe({
      next: data => {
        this.loadedPosts = this.loadedPosts.filter(item => item.id !== id);
        console.log('Delete successful, id: ' + id);
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    })
  };

  onClearPosts() {
    this.prService.clearPosts().subscribe({
      next: data => {
        console.log('All products deleted');
        this.loadedPosts = [];
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    })
  };

  onEditProduct(index: number) {
    this.prService.startedEditing.next(index);
  }

  onCancel() {
    this.productForm.reset();
    this.editMode = false;
  }

  onHandleError() {
    this.errorHandlingMode = false;
  }

  getProduct(index: number) {
    return this.loadedPosts[index];
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    console.log('Destroy ProductsComponent')
  }

}
