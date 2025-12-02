import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageProductsComponent } from './manage-products.component';
import { ProductsService } from '../../shared/services/products/products.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA, signal } from '@angular/core';
import { CreateProductComponent } from './create-product/create-product.component';
import { Product } from '../../types/product.inteface';

describe('ManageProductsComponent', () => {
  let component: ManageProductsComponent;
  let fixture: ComponentFixture<ManageProductsComponent>;
  let productsServiceMock: any;
  let matDialogMock: any;

  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    description: 'Description',
    price: '100',
    category: 'Category',
    image: 'image.jpg',
  };

  beforeEach(async () => {
    productsServiceMock = {
      fetchAllProductsCreated: jasmine
        .createSpy('fetchAllProductsCreated')
        .and.returnValue(signal([mockProduct])),
      delete: jasmine.createSpy('delete'),
    };

    matDialogMock = {
      open: jasmine.createSpy('open').and.returnValue({
        afterClosed: () => of(true),
      }),
    };

    await TestBed.configureTestingModule({
      declarations: [ManageProductsComponent],
      providers: [
        { provide: ProductsService, useValue: productsServiceMock },
        { provide: MatDialog, useValue: matDialogMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize products from service', () => {
    expect(productsServiceMock.fetchAllProductsCreated).toHaveBeenCalled();
    expect(component.products()).toEqual([mockProduct]);
  });

  it('should open CreateProductComponent dialog on onSubscribeProduct', () => {
    // Spy on the signal's update method to prevent actual execution logic issues and verify call
    jest.spyOn(component.products, 'update');

    component.onSubscribeProduct();

    expect(matDialogMock.open).toHaveBeenCalledWith(CreateProductComponent);
    expect(component.products.update).toHaveBeenCalled();
  });

  it('should delete product when confirmed', () => {
    jest.spyOn(window, 'confirm').and.returnValue(true);
    jest.spyOn(component.products, 'update');

    component.onDelete(mockProduct);

    expect(window.confirm).toHaveBeenCalledWith('Deseja excluir o produto?');
    expect(productsServiceMock.delete).toHaveBeenCalledWith(mockProduct);
    expect(component.products.update).toHaveBeenCalled();
  });

  it('should NOT delete product when NOT confirmed', () => {
    jest.spyOn(window, 'confirm').and.returnValue(false);

    component.onDelete(mockProduct);

    expect(window.confirm).toHaveBeenCalled();
    expect(productsServiceMock.delete).not.toHaveBeenCalled();
  });

  it('should filter products on search text', () => {
    // Set up initial state
    component.products.set([
      { ...mockProduct, title: 'Apple' },
      { ...mockProduct, title: 'Banana' },
    ]);

    component.onSearchText('app');

    const filtered = component.products();
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('Apple');
  });

  it('should reset products when search text is empty', () => {
    jest.spyOn(component.products, 'update');
    component.onSearchText('');
    // When empty, it calls update with fetchAllProductsCreated result
    expect(component.products.update).toHaveBeenCalled();
  });

  it('should open dialog with data on onEdit', () => {
    jest.spyOn(component.products, 'update');

    component.onEdit(mockProduct);

    expect(matDialogMock.open).toHaveBeenCalledWith(CreateProductComponent, {
      data: mockProduct,
    });
    expect(component.products.update).toHaveBeenCalled();
  });
});
