import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { BannerComponent } from '../../shared/components/banner/banner.component';
import { ManageRoutingModule } from './manage-products-routing.module';
import { ManageProductsComponent } from './manage-products.component';
import { ProductsService } from '../../shared/services/products/products.service';
import { ProductsApiService } from '../../shared/services/products/products-api.service';
import { CardComponent } from '../../shared/components/card/card.component';
import { SearchComponent } from '../../shared/components/search/search.component';

const COMPONENTS = [BannerComponent, CardComponent, SearchComponent];

@NgModule({
  declarations: [ManageProductsComponent],
  exports: [ManageProductsComponent],
  imports: [
    ...COMPONENTS,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    ManageRoutingModule,
  ],
  providers: [
    ProductsService,
    ProductsApiService,
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class ManageProductsModule {}
