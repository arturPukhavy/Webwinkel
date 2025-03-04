import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { ProductsService } from '../products.service';
import { CartService } from '../../shopping-cart/shopping-cart.service';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from '../../login/login.service';
import { of, BehaviorSubject, throwError, Subject } from 'rxjs';
import { Product } from '../product.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Login } from '../../login/user-login.model';
import { NgForm } from '@angular/forms';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let spinnerServiceSpy: jasmine.SpyObj<NgxSpinnerService>;

  const mockProduct: Product = { 
    id: 1, 
    naam: 'Test Product', 
    merk: 'Test Brand', 
    voorraad: 5, 
    price: 100, 
    details: { description: 'description', picture: 'url', features: ['1', '2', '3'] } 
  };
  const mockProductArray: Product[] = [mockProduct];

  beforeEach(async () => {
    productsServiceSpy = jasmine.createSpyObj('ProductsService', ['fetchPosts', 'createPost', 'deleteProduct', 'updatePost']);
    productsServiceSpy.startedEditing = new Subject<number>(); // Mock startedEditing as a Subject
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);
    cartServiceSpy.products$ = new BehaviorSubject<Product[]>(mockProductArray); // Mock cart products
    loginServiceSpy = jasmine.createSpyObj('LoginService', ['user'], { user: new BehaviorSubject<Login | null>(null) });
    spinnerServiceSpy = jasmine.createSpyObj('NgxSpinnerService', ['show', 'hide']);
    
    // Mock fetchPosts to return an observable with mockProductArray
    productsServiceSpy.fetchPosts.and.returnValue(of(mockProductArray));
  
    await TestBed.configureTestingModule({
      imports: [NgxSpinnerModule],
      declarations: [ProductsComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: LoginService, useValue: loginServiceSpy },
        { provide: NgxSpinnerService, useValue: spinnerServiceSpy },
      ],
    }).compileComponents();
  
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on init', () => {
    // Call ngOnInit, which will trigger the onFetchPosts() call
    component.ngOnInit();
  
    // Verify that fetchPosts was called
    expect(productsServiceSpy.fetchPosts).toHaveBeenCalled();
  
    // Check that products were set correctly
    expect(component.products.length).toBe(1);
  });
  
  it('should handle errors during fetchPosts', () => {
    const errorResponse = new HttpErrorResponse({
      error: { error: 'Test error' },
      status: 500
    });
  
    // Mock fetchPosts to return an observable that throws an error
    productsServiceSpy.fetchPosts.and.returnValue(throwError(() => errorResponse));
  
    // Call onFetchPosts directly to simulate the error
    component.onFetchPosts();
  
    // Check that error handling mode was activated
    expect(component.errorHandlingMode).toBeTrue();
    expect(component.error).toEqual('Test error');
  });

  it('should add a product to the cart', () => {
    component.onAddToCart(mockProduct);
    expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should create a new product', () => {
    // Mock the form with only the basic fields
    component.productForm = {
      value: { 
        naam: 'New Product', 
        merk: 'Brand', 
        voorraad: 10, 
        price: 200,
        description: undefined, // Optional: explicitly undefined to match default behavior
        picture: undefined,
        features: undefined
      },
      reset: () => {}
    } as NgForm;
  
    // Mock createPost to return an observable
    productsServiceSpy.createPost.and.returnValue(of(mockProductArray));
    component.onCreatePost();
  
    // Expect createPost to be called with the transformed data including details
    expect(productsServiceSpy.createPost).toHaveBeenCalledWith({
      naam: 'New Product',
      merk: 'Brand',
      voorraad: 10,
      price: 200,
      details: {
        description: '',
        picture: '',
        features: []
      }
    });
  
    expect(spinnerServiceSpy.show).toHaveBeenCalled();
  });

  it('should unsubscribe from subscriptions on destroy', () => {
    // Create a mock subscription
    const subscription1 = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    const subscription2 = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  
    // Add mock subscriptions to the component's subscriptions array
    component['subscriptions'].push(subscription1);
    component['subscriptions'].push(subscription2);
  
    // Call ngOnDestroy to trigger the unsubscribe logic
    component.ngOnDestroy();
  
    // Verify that unsubscribe was called for each subscription
    expect(subscription1.unsubscribe).toHaveBeenCalled();
    expect(subscription2.unsubscribe).toHaveBeenCalled();
  });
});