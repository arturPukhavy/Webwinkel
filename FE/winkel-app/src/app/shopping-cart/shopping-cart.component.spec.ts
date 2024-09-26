import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShoppingCartComponent } from './shopping-cart.component';
import { CartService } from './shopping-cart.service';
import { of } from 'rxjs';
import { Product } from '../products/product.model';
import { CartItem } from './shopping-cart.model';

describe('ShoppingCartComponent', () => {
  let component: ShoppingCartComponent;
  let fixture: ComponentFixture<ShoppingCartComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  const mockProduct: Product = { id: 1, naam: 'Product 1', merk: 'Brand', voorraad: 10, price: 100 };
  const mockCartItems: CartItem[] = [{ product: mockProduct, quantity: 1 }];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('CartService', ['getCartItems', 'removeFromCart', 'getTotal']);

    TestBed.configureTestingModule({
      declarations: [ShoppingCartComponent],
      providers: [{ provide: CartService, useValue: spy }]
    }).compileComponents();

    fixture = TestBed.createComponent(ShoppingCartComponent);
    component = fixture.componentInstance;
    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;

    // Mock CartService methods
    cartServiceSpy.getCartItems.and.returnValue(of(mockCartItems));
    cartServiceSpy.getTotal.and.returnValue(100);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load cart items on init', () => {
    component.ngOnInit();
    expect(cartServiceSpy.getCartItems).toHaveBeenCalled();
    expect(component.cartItems.length).toBe(1);
  });

  it('should remove item from cart', () => {
    component.removeFromCart(mockProduct.id);
    expect(cartServiceSpy.removeFromCart).toHaveBeenCalledWith(mockProduct.id);
  });

  it('should set payment to true when buy is called', () => {
    component.buy();
    expect(component.payment).toBeTrue();
  });

  it('should return the correct total price', () => {
    const total = component.total;
    expect(cartServiceSpy.getTotal).toHaveBeenCalled();
    expect(total).toBe(100);
  });
});
