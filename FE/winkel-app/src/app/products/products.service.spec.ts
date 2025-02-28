import { TestBed } from '@angular/core/testing';
import { ProductsService } from './products.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from './product.model';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  const mockProduct: Product = { id: 1, naam: 'Test Product', merk: 'Test Brand', voorraad: 5, price: 100, details: { description: 'desc', picture: 'url', features: ["4K gaming", "Game streaming capabilities", "Wide game library"] } };
  const mockProductArray: Product[] = [mockProduct]; // Ensure we are mocking an array when needed

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService]
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifies that no unmatched requests are outstanding
  });

  it('should fetch products from the API', () => {
    service.fetchPosts().subscribe(products => {
      expect(products.length).toBe(1);
      expect(products).toEqual(mockProductArray); // Expect an array
    });

    const req = httpMock.expectOne('/api/v1/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProductArray); // Return an array from the mocked response
  });

  it('should create a new product', () => {
    service.createPost(mockProduct).subscribe(product => {
      expect(product).toEqual(mockProductArray); // Expect an array
    });

    const req = httpMock.expectOne('/api/v1/products');
    expect(req.request.method).toBe('POST');
    req.flush(mockProductArray); // Return an array from the mocked response
  });

  it('should delete a product', () => {
    const productId = 1;

    service.deleteProduct(productId).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne('/api/v1/product');
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual({ id: productId });
    req.flush({ message: 'Product deleted' }); // Simulate response
  });
});
