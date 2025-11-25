import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardComponent } from './card.component';
import { Product } from '../../../types/product.inteface';
import { By } from '@angular/platform-browser';

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar o produto no template', () => {
    const product: Product = {
      id: 1,
      title: 'iPhone 15',
      price: '1000',
      category: 'electronics',
      description: 'Smart Phone',
      image: '/assets/image.png',
    };

    component.product = product;

    const productImg = fixture.debugElement.query(By.css('img')).nativeElement;
    const productTitle = fixture.debugElement.query(By.css('h2')).nativeElement;
    const productDescription = fixture.debugElement.query(
      By.css('p')
    ).nativeElement;
    const productPrice = fixture.debugElement.query(By.css('h3')).nativeElement;

    fixture.detectChanges();

    expect(productImg.src).toContain(product.image);
    expect(productTitle.textContent).toContain(product.title);
    expect(productDescription.textContent).toContain(product.description);
    expect(productPrice.textContent).toContain(product.price);
  });

  it('deve emitir o evento onEdit quando onEditClick for chamado', () => {
    const product: Product = {
      id: 1,
      title: 'Samsung s22',
      price: '950',
      category: 'eletronics',
      description: 'Smart Phone',
      image: 'src/assets/image.png',
    };

    component.product = product;
    fixture.detectChanges();

    const spyEdit = spyOn(component.onEdit, 'emit');

    component.isManageable = true;
    fixture.detectChanges();

    const manageableElement = fixture.debugElement.query(
      By.css('span')
    ).nativeElement;
    expect(manageableElement).not.toBeNull();

    component.onEditClick();
    expect(spyEdit).toHaveBeenCalledWith(product);
  });

  it('deve emitir o evento onDelete quando onDeleteClick for chamado', () => {
    const product: Product = {
      id: 1,
      title: 'Samsung s22',
      price: '950',
      category: 'eletronics',
      description: 'Smart Phone',
      image: 'src/assets/image.png',
    };

    component.product = product;
    fixture.detectChanges();

    const spyDelete = spyOn(component.onDelete, 'emit');

    component.isManageable = true;
    fixture.detectChanges();

    const manageableElement = fixture.debugElement.query(
      By.css('span')
    ).nativeElement;
    expect(manageableElement).not.toBeNull();

    component.onDeleteClick();
    expect(spyDelete).toHaveBeenCalledWith(product);
  });

  // it("",()=>{})
  // it("",()=>{})
  // it("",()=>{})
  // it("",()=>{})
});
