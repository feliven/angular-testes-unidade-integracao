import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CreateProductService } from './create-product.service';
import { CreateProductApiService } from './create-product-api.service';
import { StorageService } from '../../../../shared/services/storage/storage.service';
import { Product } from '../../../../types/product.inteface';

describe('CreateProductService', () => {
  let service: CreateProductService;
  let storageServiceMock: jest.Mocked<StorageService>;
  let createProductApiServiceMock: jest.Mocked<CreateProductApiService>;

  beforeEach(() => {
    storageServiceMock = {
      save: jest.fn(),
      getLastItem: jest.fn(),
    } as unknown as jest.Mocked<StorageService>;

    createProductApiServiceMock = {
      getCountProduct: jest.fn(),
    } as unknown as jest.Mocked<CreateProductApiService>;

    TestBed.configureTestingModule({
      providers: [
        CreateProductService,
        { provide: StorageService, useValue: storageServiceMock },
        {
          provide: CreateProductApiService,
          useValue: createProductApiServiceMock,
        },
      ],
    });
    service = TestBed.inject(CreateProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('save', () => {
    it('should save product with existing id', async () => {
      const product: Product = { id: 5, title: 'Test Product' } as Product;

      await service.save(product);

      expect(storageServiceMock.save).toHaveBeenCalledWith('5', {
        key: '5',
        value: product,
      });
    });

    it('should generate id from last storage item when product has no id', async () => {
      const product: Product = { title: 'Test Product' } as Product;
      storageServiceMock.getLastItem.mockReturnValue({
        key: '10',
        value: { id: 10, title: 'Last Product' } as Product,
      });

      await service.save(product);

      expect(product.id).toBe(11);
      expect(storageServiceMock.save).toHaveBeenCalledWith('11', {
        key: '11',
        value: product,
      });
    });

    it('should fetch id from API when storage is empty and product has no id', async () => {
      const product: Product = { title: 'Test Product' } as Product;
      storageServiceMock.getLastItem.mockReturnValue(null);
      createProductApiServiceMock.getCountProduct.mockReturnValue(of(5));

      await service.save(product);

      expect(createProductApiServiceMock.getCountProduct).toHaveBeenCalled();
      expect(product.id).toBe(6);
      expect(storageServiceMock.save).toHaveBeenCalledWith('6', {
        key: '6',
        value: product,
      });
    });

    it('should fetch id from API when last item has no id', async () => {
      const product: Product = { title: 'Test Product' } as Product;
      storageServiceMock.getLastItem.mockReturnValue({
        key: 'test',
        value: { title: 'Product without id' } as Product,
      });
      createProductApiServiceMock.getCountProduct.mockReturnValue(of(3));

      await service.save(product);

      expect(createProductApiServiceMock.getCountProduct).toHaveBeenCalled();
      expect(product.id).toBe(4);
    });

    it('should use id 0 when product has id 0', async () => {
      const product: Product = { id: 0, title: 'Test Product' } as Product;
      storageServiceMock.getLastItem.mockReturnValue(null);
      createProductApiServiceMock.getCountProduct.mockReturnValue(of(10));

      await service.save(product);

      expect(createProductApiServiceMock.getCountProduct).toHaveBeenCalled();
      expect(product.id).toBe(11);
    });
  });
});
