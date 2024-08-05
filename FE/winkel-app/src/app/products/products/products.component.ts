import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription} from 'rxjs';
import { NgForm } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy{
  @ViewChild('postForm') productForm: NgForm; 
  subscription: Subscription;
  loadedPosts = this.prService.loadedPosts;
  editMode = false;
  editItemIndex: number;  
  editedItem: Product;
  errorHandlingMode = false;


  constructor(private prService: ProductsService) {}
  

  ngOnInit() {
    this.prService.fetchPosts();
    this.subscription = this.prService.startedEditing
      .subscribe(
        (index: number) => {
          this.editItemIndex = index;
          console.log('Product to edit: ' + JSON.stringify(this.prService.getProduct(index)));
          this.editMode = true;
          this.editedItem = this.prService.getProduct(index);
          this.productForm.setValue({
            id: this.prService.getProduct(index).id,
            naam: this.editedItem.naam,
            merk: this.editedItem.merk,
            voorraad: this.editedItem.voorraad,
            price: this.editedItem.price
          })
        }
    ) 
  }

  onCreatePost() {
    this.prService.createPost(this.productForm.value);
  }

  onUpdatePost() {
    this.prService.updatePost(this.productForm.value);
    this.errorHandlingMode = true;
  }

  onFetchPosts() {
    this.prService.fetchPosts()
      ;
  }
  onDeleteProduct() {
    this.prService.deleteProduct(this.editItemIndex);
    this.errorHandlingMode = true;
  }

  onClearPosts() {
    this.prService.clearPosts;
    this.errorHandlingMode = true;
  }

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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
