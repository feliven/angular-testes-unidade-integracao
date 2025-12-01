import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { BannerComponent } from '../../shared/components/banner/banner.component';
import { CardComponent } from '../../shared/components/card/card.component';
import { SearchComponent } from '../../shared/components/search/search.component';
import { Product } from '../../types/product.inteface';
import { ProductsService } from '../../shared/services/products/products.service';
import { ProductsApiService } from '../../shared/services/products/products-api.service';

const MODULES = [CommonModule, InfiniteScrollModule];

const COMPONENTS = [BannerComponent, SearchComponent, CardComponent];

@Component({
  selector: 'app-search-products',
  imports: [...MODULES, ...COMPONENTS],
  providers: [ProductsService, ProductsApiService],
  templateUrl: './search-products.component.html',
  styleUrl: './search-products.component.scss',
})
export class SearchProductsComponent implements OnInit {
  products = this.productsService.products;

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.productsService.fetchAllProducts(5);
  }

  onScroll(): void {
    this.productsService.fetchAllProducts(10);
  }

  onSearchText(text: string): void {
    if (!text) {
      this.productsService.currentItemPerPage = 0;
      this.productsService.fetchAllProducts(5);
      return;
    }

    this.productsService.find(text);
  }
}
