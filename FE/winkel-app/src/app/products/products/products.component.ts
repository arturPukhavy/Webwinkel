import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
  subscriptions: Subscription[] = [];
  products: Product[] = [];
  filteredProducts: Product[] = [];
  paginatedProducts: Product[] = [];
  searchTerm: string = '';
  editMode = false;
  editedItem: Product;
  errorHandlingMode = false;
  error: string;
  role = Role
  user: Login | null = null;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  showFields = false;
  

  constructor( private prService: ProductsService, 
               private cartService: CartService,
               private loginService: LoginService, 
               private spinnerService: NgxSpinnerService 
  ) {}
  

  ngOnInit() {
    this.onFetchPosts(); 

    this.subscriptions.push(this.loginService.user.subscribe(user => {
      this.user = user;
    }));

    this.subscriptions.push(this.cartService.products$.subscribe((product) => {
      this.products = product;
    }));

    this.subscriptions.push(this.prService.startedEditing.subscribe(
      (index: number) => {
        this.editMode = true;
        this.editedItem = this.getProduct(index);
        if (this.productForm) {
          this.productForm.setValue({
            id: this.editedItem.id,
            naam: this.editedItem.naam,
            merk: this.editedItem.merk,
            voorraad: this.editedItem.voorraad,
            price: this.editedItem.price,
            description: this.editedItem.details?.description || '',
            picture: this.editedItem.details?.picture || '',
            features: this.editedItem.details?.features?.join(', ') || '' // Join array to string for form
          });
        }
      }
    ));
  }

  toggleFields() {
    this.showFields = !this.showFields;
  }

  filterProducts() {
    console.log('Search term:', this.searchTerm);
    this.filteredProducts = this.products.filter(product =>
      product.naam.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      product.merk.toLowerCase().includes(this.searchTerm.toLowerCase()) 
    );
    this.currentPage = 1; // Reset to the first page after filtering
    this.updatePaginatedProducts();
    console.log('Filtered products:', this.products);
  }

  // Update paginated products based on the current page
  updatePaginatedProducts() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedProducts = this.filteredProducts.slice(start, end);
  }

  // Handle page change
  changePage(page: number) {
    this.currentPage = page;
    this.updatePaginatedProducts();
  }  

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  onCreatePost() {
    this.spinnerService.show();
    const formValue = this.productForm.value;
    const featuresValue = formValue.features || '';
    const postData = {
      naam: formValue.naam,
      merk: formValue.merk,
      voorraad: formValue.voorraad,
      price: formValue.price,
      details: {
        description: formValue.description !== undefined ? formValue.description : '',
        picture: formValue.picture !== undefined ? formValue.picture : '',
        features: featuresValue.split(',').map((feature: string) => feature.trim()).filter((feature: string) => feature.length > 0)
      }
    };
    console.log('Creating product with:', JSON.stringify(postData));
    this.prService.createPost(postData).subscribe({
      next: data => {
        this.spinnerService.hide();
        console.log('Product added: ' + JSON.stringify(data));
        this.onFetchPosts();
      },
      error: (error: HttpErrorResponse) => {
        this.spinnerService.hide();
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    });
  }

  onUpdatePost() {
    const putData = {
      id: this.productForm.value.id,
      naam: this.productForm.value.naam,
      merk: this.productForm.value.merk,
      voorraad: this.productForm.value.voorraad,
      price: this.productForm.value.price,
      details: {
        description: this.productForm.value.description,
        picture: this.productForm.value.picture,
        features: this.productForm.value.features
          ? this.productForm.value.features.split(',').map((feature: string) => feature.trim()).filter((feature: string) => feature.length > 0)
          : []
      }
    };
    console.log('Updating product with:', JSON.stringify(putData));
    this.prService.updatePost(putData).subscribe({
      next: data => {
        console.log('Product changed: ' + JSON.stringify(data));
        this.onFetchPosts();
        this.showFields = false;
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    });
  }

  onFetchPosts() {
    this.prService.fetchPosts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.filteredProducts = [...this.products];
        this.updatePaginatedProducts();
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    });
  }
  onDeleteProduct(id: number) {
    this.prService.deleteProduct(id).subscribe({
      next: data => {
        this.paginatedProducts = this.paginatedProducts.filter(item => item.id !== id);
        console.log('Delete successful, id: ' + id);
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    })
  };

  onClearProducts() {
    this.prService.clearPosts().subscribe({
      next: data => {
        console.log('All products deleted');
        this.paginatedProducts = [];
      },
      error: (error: HttpErrorResponse) => {
        this.errorHandlingMode = true;
        this.error = error.error.error;
        console.error('There was an error: ', error.error.error);
      }
    })
  };

  onEditProduct(index: number) {
    this.showFields = true;
    setTimeout(() => {
      this.prService.startedEditing.next(index);
    }, 1);
  }

  onCancel() {
    this.productForm.reset();
    this.editMode = false;
  }

  onHandleError() {
    this.errorHandlingMode = false;
  }

  getProduct(index: number) {
    return this.paginatedProducts[index];
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }

  toggleDetails(index: number): void {
    const product = this.paginatedProducts[index]; 
    product.showDetails = !product.showDetails; // Toggle the visibility
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    console.log('Destroy ProductsComponent');
  }

}
