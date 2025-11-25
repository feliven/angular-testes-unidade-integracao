import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Product } from '../../../../types/product.inteface';

@Injectable()
export class CreateProductApiService {
  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/products/categories`);
  }

  getCountProduct(): Observable<number> {
    return this.http
      .get<Product[]>(`${environment.apiUrl}/products?limit=200`)
      .pipe(
        map(
          (arr) =>
            arr
              .sort((a, b) => b.id - a.id)
              .map((product: Product) => product.id)[0],
        ),
      );
  }
}
