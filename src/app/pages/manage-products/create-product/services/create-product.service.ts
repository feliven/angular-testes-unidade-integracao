import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';

import {
  StorageObject,
  StorageService,
} from '../../../../shared/services/storage/storage.service';
import { Product } from '../../../../types/product.inteface';
import { CreateProductApiService } from './create-product-api.service';

@Injectable()
export class CreateProductService {
  constructor(
    private storageService: StorageService,
    private createProductApiService: CreateProductApiService,
  ) {}

  async save(product: Product): Promise<void> {
    const id = product.id || (await this.getId());
    product.id = id;

    const storageProduct: StorageObject<Product> = {
      key: id.toString(),
      value: product,
    };

    this.storageService.save(id.toString(), storageProduct);
  }

  private async getId(): Promise<number> {
    const lastItemId: number = (
      this.storageService.getLastItem()?.value as Product
    )?.id;
    return lastItemId
      ? lastItemId + 1
      : (await lastValueFrom(this.createProductApiService.getCountProduct())) +
          1;
  }
}
