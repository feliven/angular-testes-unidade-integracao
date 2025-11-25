import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve renderizar imagem no template', () => {
    const srcImagem = 'assets/images/zoop-store.svg';

    const imagemNoHeader = fixture.debugElement.query(
      By.css('img')
    ).nativeElement;

    expect(imagemNoHeader.src).toContain(srcImagem);
  });

  it('deve renderizar nav no template', () => {
    const navNoHeader = fixture.debugElement.query(By.css('nav')).nativeElement;

    expect(navNoHeader).toBeDefined();
  });

  it('deve renderizar ul no template', () => {
    const ulNoHeader = fixture.debugElement.query(By.css('ul')).nativeElement;

    expect(ulNoHeader).toBeDefined();
  });

  it('deve renderizar 2 li no template', () => {
    const liNoHeader = fixture.debugElement.queryAll(By.css('li'));

    fixture.detectChanges();

    expect(liNoHeader.length).toBe(2);
  });

  it('deve renderizar 2 links corretamente no template', () => {
    const linksNoHeader = fixture.debugElement.queryAll(By.css('a'));

    expect(linksNoHeader.length).toBe(2);
    expect(linksNoHeader[0].nativeElement.textContent).toContain('Produtos');
    expect(linksNoHeader[1].nativeElement.textContent).toContain('Gerenciar');
  });
});
