import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { ProductsService } from '../products.service';
import { Product } from '../product.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { CartService } from '../../shopping-cart/shopping-cart.service';
import { Role } from '../../users/user/model/Role.model';
import { Login } from '../../login/user-login.model';
import { LoginService } from '../../login/login.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy{
  @ViewChild('postForm') productForm: NgForm; 
  subscription: Subscription;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm: string = '';
  editMode = false;
  editedItem: Product;
  errorHandlingMode = false;
  error: string;
  role = Role
  user: Login | null = null;

  

  constructor(private prService: ProductsService, 
              private cartService: CartService,
              private loginService: LoginService, 
              private spinnerService: NgxSpinnerService ) {}
  
  ngOnInit() {
    this.onFetchPosts();

    this.subscription = this.loginService.user.subscribe(user => {
      this.user = user;
    });  
    
    this.subscription = this.cartService.products$.subscribe((product) => {
      this.products = product;
    });

    this.subscription = this.prService.startedEditing
      .subscribe(
        (index: number) => {
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

  filterProducts() {
    console.log('Search term:', this.searchTerm);
    this.filteredProducts = this.products.filter(product =>
      product.naam.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.merk.toLowerCase().includes(this.searchTerm.toLowerCase()) 
    );
    console.log('Filtered products:', this.products);
  }

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
        this.products = data;
        this.filteredProducts = [...this.products];
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
        this.filteredProducts = this.filteredProducts.filter(item => item.id !== id);
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
        this.products = [];
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
    return this.products[index];
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    console.log('Destroy ProductsComponent')
  }

}
