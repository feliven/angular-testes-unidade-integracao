import { TestBed } from '@angular/core/testing';

import { CreateProductService } from './create-product.service';
import { CreateProductApiService } from './create-product-api.service';
import { provideHttpClient } from '@angular/common/http';

describe('CreateProductService', () => {
  let service: CreateProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CreateProductService,
        CreateProductApiService,
        provideHttpClient(),
      ],
    });
    service = TestBed.inject(CreateProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
