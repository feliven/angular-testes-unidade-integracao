import {
  DestroyRef,
  Injectable,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';

import { ProductsApiService } from './products-api.service';
import { Product } from '../../../types/product.inteface';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class ProductsService {
  currentItemPerPage = 0;
  products = signal<Array<Product>>([]);
  destroyRef = inject(DestroyRef);

  constructor(
    private storageService: StorageService,
    private productsApiService: ProductsApiService,
  ) {
    this.products.update((products) => [
      ...products,
      ...(this.storageService.getAll() as Product[]),
    ]);
  }

  find(text: string): void {
    this.products.update((oldProducts) =>
      oldProducts.filter((product: Product) =>
        product.title.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  }

  fetchAllProductsCreated(): WritableSignal<Array<Product>> {
    return signal<Array<Product>>(this.storageService.getAll());
  }

  fetchAllProducts(itemPerPage: number): void {
    this.currentItemPerPage += itemPerPage;

    this.productsApiService
      .getAllProducts(this.currentItemPerPage)
      .subscribe((products) =>
        this.products.update((oldProducts) => {
          return [
            ...oldProducts,
            ...products.filter(
              (p: Product) =>
                p.id !==
                oldProducts.find(
                  (oldProduct: Product) => oldProduct.id === p.id,
                )?.id,
            ),
          ];
        }),
      );
  }

  delete(product: Product): void {
    this.storageService.remove(`${product.id}`);
  }
}
