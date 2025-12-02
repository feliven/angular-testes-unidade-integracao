import { TestBed } from '@angular/core/testing';

import { Injectable } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

import { CreateProductApiService } from './create-product-api.service';
import { Product } from '../../../../types/product.inteface';

fdescribe('CreateProductApiService', () => {
  let service: CreateProductApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), CreateProductApiService],
    });
    service = TestBed.inject(CreateProductApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
