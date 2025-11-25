import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ProductsService } from '../../shared/services/products/products.service';
import { Product } from '../../types/product.inteface';
import { CreateProductComponent } from './create-product/create-product.component';

@Component({
  selector: 'app-manage-products',
  templateUrl: './manage-products.component.html',
  styleUrl: './manage-products.component.scss',
  standalone: false,
})
export class ManageProductsComponent {
  products = this.productsService.fetchAllProductsCreated();

  constructor(
    private dialog: MatDialog,
    private productsService: ProductsService,
  ) {}

  onSubscribeProduct(): void {
    const dialogRef = this.dialog.open(CreateProductComponent);

    dialogRef
      .afterClosed()
      .subscribe((result) =>
        this.products.update(this.productsService.fetchAllProductsCreated()),
      );
  }

  onDelete(product: Product | null): void {
    const confirmed = confirm('Deseja excluir o produto?');

    if (confirmed && product) {
      this.productsService.delete(product);
      this.products.update(this.productsService.fetchAllProductsCreated());
    }
  }

  onSearchText(text: string): void {
    if (!text) {
      this.products.update(this.productsService.fetchAllProductsCreated());
      return;
    }

    this.products.update((oldProducts) =>
      oldProducts.filter((product: Product) =>
        product.title.toLowerCase().includes(text.toLowerCase()),
      ),
    );
  }

  onEdit(product: Product | null): void {
    const dialogRef = this.dialog.open(CreateProductComponent, {
      data: product,
    });

    dialogRef
      .afterClosed()
      .subscribe((result) =>
        this.products.update(this.productsService.fetchAllProductsCreated()),
      );
  }
}
