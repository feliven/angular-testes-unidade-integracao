import { Routes } from '@angular/router';

import { SearchProductsComponent } from './pages/search-products/search-products.component';

export const routes: Routes = [
  { path: '', component: SearchProductsComponent },

  {
    path: 'gerenciar',
    loadChildren: () =>
      import('./pages/manage-products/manage-products.module').then(
        (mod) => mod.ManageProductsModule,
      ),
  },
];
