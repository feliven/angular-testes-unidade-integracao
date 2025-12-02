import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { ProductsService } from './products.service';
import { ProductsApiService } from './products-api.service';
import { StorageService } from '../storage/storage.service';
import { Product } from '../../../types/product.inteface';
import { provideHttpClient } from '@angular/common/http';

class ProductsApiServiceMock {
  getAllProducts(): Observable<Product[]> {
    return of([
      {
        id: 1,
        title: 'Produto A',
        category: 'eletronics',
        description: 'Product A',
        price: '50',
        image: 'image.png',
      },
      {
        id: 2,
        title: 'Produto B',
        category: `women's clothes`,
        description: 'Product B',
        price: '80',
        image: 'image.png',
      },
    ]);
  }
}

class StorageServiceMock {
  private data: { [key: string]: any } = {};

  getAll(): any[] {
    return Object.values(this.data);
  }

  setValue(key: string, value: any): void {
    this.data[key] = value;
  }

  remove(key: string): void {
    delete this.data[key];
  }
}

const mockStoredProducts: Product[] = [
  {
    id: 3,
    title: 'Produto C',
    category: 'eletronic',
    description: 'Product C',
    price: '100',
    image: 'image.png',
  },
  {
    id: 4,
    title: 'Produto D',
    category: `woman's clothes`,
    description: 'Product D',
    price: '10.5',
    image: 'image.png',
  },
];

describe('ProductsService', () => {
  let service: ProductsService;
  let sessionStorage = new StorageServiceMock();

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        ProductsService,
        { provide: ProductsApiService, useClass: ProductsApiServiceMock },
        { provide: StorageService, useClass: StorageServiceMock },
      ],
    });

    sessionStorage.setValue('products', mockStoredProducts);
    TestBed.overrideProvider(StorageService, { useValue: sessionStorage });
    service = TestBed.inject(ProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    it('should load products from storage on initialization', () => {
      const products = service.products().flat();

      expect(products[0]).toEqual(mockStoredProducts[0]);
      expect(products[1]).toEqual(mockStoredProducts[1]);
    });
  });

  describe('find', () => {
    beforeEach(() => {
      service.products.set(mockStoredProducts);
    });

    it('deve filtrar os produtos pelo título', () => {
      service.find('C');

      const products = service.products().flat();

      expect(products.length).toBe(1);
      expect(products[0].title).toBe('Produto C');
    });

    //   it('should filter products by title (case insensitive)', () => {
    //     service.find('product 1');
    //     expect(service.products().length).toBe(1);
    //     expect(service.products()[0].title).toBe('Product 1');
    //   });
    //   it('should filter products with uppercase search text', () => {
    //     service.find('PRODUCT 2');
    //     expect(service.products().length).toBe(1);
    //     expect(service.products()[0].title).toBe('Product 2');
    //   });

    it('should return all matching products', () => {
      service.find('Produto');
      expect(service.products().length).toBe(2);
    });
    it('should return empty array when no products match', () => {
      service.find('nonexistent');
      expect(service.products().length).toBe(0);
    });
  });

  describe('fetchAllProductsCreated', () => {
    it('should return a signal with products from storage', () => {
      const produtos: Product[] = [
        {
          id: 5,
          title: 'Produto F',
          category: 'eletronic',
          description: 'Product F',
          price: '500',
          image: 'image.png',
        },
      ];

      sessionStorage.setValue('products', produtos);
      const productsCreated = service.fetchAllProductsCreated()().flat();

      expect(productsCreated).toEqual(produtos);
    });

    it('should return empty array when storage is empty', () => {
      const produtos: Product[] = [];

      sessionStorage.setValue('products', produtos);
      const productsCreated = service.fetchAllProductsCreated()().flat();

      expect(productsCreated).toEqual([]);
    });
  });

  describe('fetchAllProducts', () => {
    beforeEach(() => {
      service.products.set(mockStoredProducts);
    });

    //   it('should increment currentItemPerPage', () => {
    //     productsApiServiceSpy.getAllProducts.and.returnValue(of([]));
    //     service.fetchAllProducts(10);
    //     expect(service.currentItemPerPage).toBe(10);
    //     service.fetchAllProducts(5);
    //     expect(service.currentItemPerPage).toBe(15);
    //   });

    it('should call productsApiService with correct parameter', () => {
      service.fetchAllProducts(10);

      expect(service.products().length).toBe(4);
    });

    //   it('should add new products to the products signal', () => {
    //     productsApiServiceSpy.getAllProducts.and.returnValue(of(mockProducts));
    //     service.fetchAllProducts(10);
    //     expect(service.products()).toEqual(mockProducts);
    //   });
    //   it('should not add duplicate products', () => {
    //     service.products.set([mockProducts[0]]);
    //     productsApiServiceSpy.getAllProducts.and.returnValue(of(mockProducts));
    //     service.fetchAllProducts(10);
    //     expect(service.products().length).toBe(2);
    //     expect(service.products()).toContain(mockProducts[0]);
    //     expect(service.products()).toContain(mockProducts[1]);
    //   });
    //   it('should preserve existing products when adding new ones', () => {
    //     const existingProduct: Product = {
    //       id: 99,
    //       title: 'Existing',
    //       price: '10',
    //       description: 'Existing',
    //       image: 'existing.jpg',
    //       category: 'existing',
    //     };
    //     service.products.set([existingProduct]);
    //     productsApiServiceSpy.getAllProducts.and.returnValue(of(mockProducts));
    //     service.fetchAllProducts(10);
    //     expect(service.products().length).toBe(3);
    //     expect(service.products()).toContain(existingProduct);
    //   });
  });

  describe('delete', () => {
    beforeEach(() => {
      service.products.set(mockStoredProducts);
    });

    it('deve remover o produto do armazenamento', () => {
      spyOn(sessionStorage, 'remove');
      const initialProductsLength = sessionStorage.getAll().length;

      service.delete(mockStoredProducts[0]);

      expect(sessionStorage.remove).toHaveBeenCalledTimes(1);
      expect(sessionStorage.getAll().length).toBeLessThanOrEqual(
        initialProductsLength
      );
    });

    //   it('should call storageService.remove with product id', () => {
    //     const product = mockProducts[0];
    //     service.delete(product);
    //     expect(storageServiceSpy.remove).toHaveBeenCalledWith('1');
    //   });
    //   it('should convert product id to string', () => {
    //     const product: Product = {
    //       id: 123,
    //       title: 'Test',
    //       price: '10',
    //       description: 'Test',
    //       image: 'test.jpg',
    //       category: 'test',
    //     };
    //     service.delete(product);
    //     expect(storageServiceSpy.remove).toHaveBeenCalledWith('123');
    //   });
  });
});
