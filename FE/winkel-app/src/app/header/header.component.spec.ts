import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { LoginService } from '../login/login.service';
import { CartService } from '../shopping-cart/shopping-cart.service';
import { of, BehaviorSubject } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let loginServiceSpy: jasmine.SpyObj<LoginService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;

  beforeEach(async () => {
    // Create spies for the services
    const loginSpy = jasmine.createSpyObj('LoginService', ['logout'], {
      user: new BehaviorSubject(null) // Default to null user
    });
    const cartSpy = jasmine.createSpyObj('CartService', ['getCartItemCount']);

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: LoginService, useValue: loginSpy },
        { provide: CartService, useValue: cartSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    loginServiceSpy = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    cartServiceSpy = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should update cartItemCount from CartService', () => {
    // Mock the cart item count observable
    const mockCartItemCount = 3;
    cartServiceSpy.getCartItemCount.and.returnValue(of(mockCartItemCount));

    fixture.detectChanges(); // Trigger ngOnInit

    expect(component.cartItemCount).toBe(mockCartItemCount);
    expect(cartServiceSpy.getCartItemCount).toHaveBeenCalled();
  });

  it('should call loginService.logout when onLogout is called', () => {
    component.onLogout();
    expect(loginServiceSpy.logout).toHaveBeenCalled();
  });

  it('should unsubscribe from all subscriptions on ngOnDestroy', () => {
    spyOn(component['subs'], 'unsubscribe'); // Spy on the Subscription object's unsubscribe method
    component.ngOnDestroy();
    expect(component['subs'].unsubscribe).toHaveBeenCalled();
  });
});


