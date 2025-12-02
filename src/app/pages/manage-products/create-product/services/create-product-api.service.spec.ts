import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { Injectable } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

import { environment } from '../../../../../environments/environment';
import { CreateProductApiService } from './create-product-api.service';
import { Product } from '../../../../types/product.inteface';

describe('CreateProductApiService', () => {
  let service: CreateProductApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        CreateProductApiService,
      ],
    });
    service = TestBed.inject(CreateProductApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar as categorias', () => {
    const mockCategories: string[] = [
      'electronics',
      `men's clothing`,
      'jewelery',
    ];
    service.getAllCategories().subscribe((categories) => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/products/categories`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('deve retornar a quantidade de produtos', () => {
    const mockProducts: Product[] = [
      {
        id: 1,
        title: 'Produto A',
        category: 'eletronic',
        description: 'Product A',
        price: '50',
        image: 'image.png',
      },
      {
        id: 2,
        title: 'Produto B',
        category: `woman's clothes`,
        description: 'Product B',
        price: '80',
        image: 'image.png',
      },
    ];

    const expectedCount = 2;

    service.getCountProduct().subscribe((count) => {
      expect(count).toEqual(expectedCount);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}/products?limit=200`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });
});
