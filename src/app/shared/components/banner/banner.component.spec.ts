import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerComponent } from './banner.component';
import { By } from '@angular/platform-browser';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar o título no template', () => {
    const titulo = 'teste';

    component.title = titulo;

    fixture.detectChanges();

    const tituloNaPagina = fixture.debugElement.query(
      By.css('h1')
    ).nativeElement;

    expect(tituloNaPagina.textContent).toEqual(titulo);
  });

  // it("",()=>{})
});
