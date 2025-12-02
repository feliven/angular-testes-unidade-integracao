import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { SearchProductsComponent } from './search-products.component';
import { ProductsService } from '../../shared/services/products/products.service';

describe('SearchProductsComponent', () => {
  let component: SearchProductsComponent;
  let fixture: ComponentFixture<SearchProductsComponent>;
  let productsServiceMock: any;

  beforeEach(async () => {
    // Create a mock for ProductsService
    productsServiceMock = {
      products: signal([]),
      // CHANGE: Replaced jasmine.createSpy() with jest.fn()
      fetchAllProducts: jest.fn(),
      // CHANGE: Replaced jasmine.createSpy() with jest.fn()
      find: jest.fn(),
      currentItemPerPage: 10, // Initial value to verify reset logic
    };

    await TestBed.configureTestingModule({
      imports: [SearchProductsComponent],
    })
      // Override the component's providers to use the mock service
      .overrideComponent(SearchProductsComponent, {
        set: {
          providers: [
            { provide: ProductsService, useValue: productsServiceMock },
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(SearchProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Triggers ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on initialization', () => {
    expect(productsServiceMock.fetchAllProducts).toHaveBeenCalledWith(5);
  });

  it('should fetch more products on scroll', () => {
    component.onScroll();
    expect(productsServiceMock.fetchAllProducts).toHaveBeenCalledWith(10);
  });

  it('should search for products when text is provided', () => {
    const searchText = 'Test Product';
    component.onSearchText(searchText);
    expect(productsServiceMock.find).toHaveBeenCalledWith(searchText);
  });

  it('should reset pagination and fetch default products when search text is empty', () => {
    // CHANGE: Replaced .calls.reset() with .mockClear()
    // Jest uses mockClear() to reset call history while keeping the mock implementation
    productsServiceMock.fetchAllProducts.mockClear();
    component.onSearchText('');
    expect(productsServiceMock.currentItemPerPage).toBe(0);
    expect(productsServiceMock.fetchAllProducts).toHaveBeenCalledWith(5);
  });
});
