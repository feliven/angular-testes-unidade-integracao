import {
  ComponentFixture,
  fakeAsync,
  flushMicrotasks,
  TestBed,
  tick,
} from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';

import { CreateProductComponent } from './create-product.component';
import { CreateProductService } from './services/create-product.service';
import { CreateProductApiService } from './services/create-product-api.service';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockCreateProductApiService {
  getAllCategories(): Observable<string[]> {
    return of([
      'electronics',
      'jewelery',
      "men's clothing",
      "women's clothing",
    ]);
  }
}

const mockDialogRef = {
  close: jasmine.createSpy('close'),
};

const mockData = {
  id: '1',
  title: 'teste',
  description: 'teste',
  category: 'electronics',
  price: '100',
  image:
    'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlbaWmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKAP/2Q==',
};

describe('CreateProductComponent (editar produto)', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateProductComponent,
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
      providers: [
        provideHttpClient(),
        CreateProductService,
        CreateProductApiService,
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    TestBed.overrideComponent(CreateProductComponent, {
      set: {
        providers: [
          {
            provide: CreateProductApiService,
            useClass: MockCreateProductApiService,
          },
        ],
      },
    });

    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deveria listar as categorias', () => {
    const categorias = [
      'electronics',
      'jewelery',
      "men's clothing",
      "women's clothing",
    ];

    component.categories$.subscribe((resultado) => {
      console.log(resultado);
      expect(categorias).toEqual(resultado);
    });
  });

  it('deve verificar se o formulário esta preenchido com as informações do produto', () => {
    expect(component.formGroup.get('id')?.value).toEqual(mockData.id);
    expect(component.formGroup.get('title')?.value).toEqual(mockData.title);
    expect(component.formGroup.get('description')?.value).toEqual(
      mockData.description
    );
    expect(component.formGroup.get('category')?.value).toEqual(
      mockData.category
    );
    expect(component.formGroup.get('price')?.value).toEqual(mockData.price);
  });

  it('deve chamar o método close ao clicar no botão cancelar', () => {
    component.onCancelClick();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('deve chamar o método save do createProductService ao enviar o formulário', () => {
    const createProductService = TestBed.inject(CreateProductService);
    jest.spyOn(createProductService, 'save').mockResolvedValue();
    const evento = {
      target: {
        files: [new File([''], 'imagem.jpeg', { type: 'image/jpeg' })],
      },
    };
    component.onImageSelected(evento);
    component.onSubmitForm();
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(createProductService.save).toHaveBeenCalled();
    });
  });

  // ---

  it('deve remover a obrigatoriedade da imagem ao editar', () => {
    const imageControl = component.formGroup.get('image');
    // Control tem valor vazio porém não deve ter o validator required ativo
    expect(imageControl?.valid).toBe(true);
  });

  it('deve criar File a partir da base64 (imageSelected definido)', () => {
    const internalImage: File = (component as any).imageSelected;

    expect(internalImage).toBeDefined();
    expect(internalImage.name).toBe('image.jpeg');
    expect(internalImage.type).toBe('image/jpeg');
  });

  it('não deve chamar save se nenhuma imagem estiver selecionada (defesa)', fakeAsync(() => {
    (component as any).imageSelected = undefined;
    const service = TestBed.inject(CreateProductService);
    jest.spyOn(service, 'save').mockResolvedValue();

    try {
      component.onSubmitForm();
    } catch {}
    flushMicrotasks();
    expect(service.save).not.toHaveBeenCalled();
  }));

  it('deve manter os valores do formulário inalterados após ngOnInit com dados (edição)', () => {
    expect(component.formGroup.value).toEqual(
      jasmine.objectContaining({
        id: mockData.id,
        title: mockData.title,
        description: mockData.description,
        category: mockData.category,
        price: mockData.price,
      })
    );
  });

  it('deve atualizar imageSelected ao selecionar uma nova imagem na edição', () => {
    const fakeFile = new File(['x'], 'nova.jpg', { type: 'image/jpeg' });
    component.onImageSelected({ target: { files: [fakeFile] } });

    const internalImage: File = (component as any).imageSelected;

    expect(internalImage).toBe(fakeFile);
    expect(component.formGroup.get('image')?.value).toBe('');
  });
});

describe('CreateProductComponent (novo produto)', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CreateProductComponent,
        CommonModule,
        ReactiveFormsModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        MatSelectModule,
        MatIconModule,
        BrowserAnimationsModule,
      ],
      providers: [
        provideHttpClient(),
        CreateProductService,
        CreateProductApiService,
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: MatDialogRef, useValue: mockDialogRef },
      ],
    }).compileComponents();

    TestBed.overrideComponent(CreateProductComponent, {
      set: {
        providers: [
          {
            provide: CreateProductApiService,
            useClass: MockCreateProductApiService,
          },
        ],
      },
    });

    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('form deve iniciar inválido (campos obrigatórios vazios)', () => {
    expect(component.formGroup.invalid).toBe(true);
    ['title', 'description', 'category', 'price', 'image'].forEach((ctrl) => {
      expect(component.formGroup.get(ctrl)?.invalid).toBe(true);
    });
  });

  it('deve ficar válido após preencher todos os campos', () => {
    component.formGroup.patchValue({
      title: 'Produto X',
      description: 'Desc',
      category: 'electronics',
      price: '10',
    });

    // Browser security prevents setting the value of a file input to anything other than an empty string.
    component.formGroup
      .get('image')
      ?.setValue('file-placeholder', { emitModelToViewChange: false });

    expect(component.formGroup.valid).toBe(true);
  });

  it('deve selecionar a imagem e permitir submit após preencher restantes', () => {
    const fakeFile = new File(['conteudo'], 'foto.jpg', { type: 'image/jpeg' });
    const evento = { target: { files: [fakeFile] } };

    component.onImageSelected(evento);
    component.formGroup.patchValue({
      title: 'Produto',
      description: 'Desc',
      category: 'electronics',
      price: '20',
    });

    component.formGroup
      .get('image')
      ?.setValue('foto.jpg', { emitModelToViewChange: false });

    expect(component.formGroup.valid).toBe(true);
  });

  it('deve chamar save e fechar dialog ao submeter novo produto', async () => {
    const service = TestBed.inject(CreateProductService);
    jest.spyOn(service, 'save').mockResolvedValue();

    const fakeFile = new File(['x'], 'novo.jpg', { type: 'image/jpeg' });
    component.onImageSelected({ target: { files: [fakeFile] } });

    component.formGroup.patchValue({
      title: 'Novo',
      description: 'Desc',
      category: 'electronics',
      price: '30',
    });

    component.formGroup
      .get('image')
      ?.setValue('novo.jpg', { emitModelToViewChange: false });

    class MockFileReader {
      result: string | ArrayBuffer | null = 'data:image/jpeg;base64,AAA';
      onload: any;
      readAsDataURL(_: File) {
        if (this.onload) {
          this.onload({ target: { result: this.result } });
        }
      }
    }

    jest
      .spyOn(window as any, 'FileReader')
      .mockResolvedValue(new MockFileReader());
    component.onSubmitForm();
    await fixture.whenStable();
    expect(service.save).toHaveBeenCalledTimes(1);
    expect(service.save).toHaveBeenCalledWith(
      jasmine.objectContaining({
        title: 'Novo',
        image: 'data:image/jpeg;base64,AAA',
      })
    );

    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('deve continuar inválido se faltar qualquer campo obrigatório', () => {
    component.formGroup.patchValue({
      title: 'Prod',
      description: 'Desc',
      category: 'electronics',
      price: '', // faltando
    });

    component.formGroup
      .get('image')
      ?.setValue('foto.jpg', { emitModelToViewChange: false });

    expect(component.formGroup.invalid).toBe(true);
    expect(component.formGroup.get('price')?.invalid).toBe(true);
  });

  it('não deve permitir submit se form inválido (sem image)', fakeAsync(() => {
    const service = TestBed.inject(CreateProductService);
    jest.spyOn(service, 'save').mockResolvedValue();
    component.formGroup.patchValue({
      title: 'SemImagem',
      description: 'Desc',
      category: 'electronics',
      price: '10',
      image: '', // permanece inválido
    });

    try {
      component.onSubmitForm();
    } catch {}
    flushMicrotasks();
    expect(service.save).not.toHaveBeenCalled();
    expect(mockDialogRef.close).not.toHaveBeenCalled();
  }));

  it('onImageSelected deve definir imageSelected corretamente', () => {
    const fakeFile = new File(['abc'], 'foto.png', { type: 'image/png' });
    component.onImageSelected({ target: { files: [fakeFile] } });
    expect((component as any).imageSelected).toBe(fakeFile);
  });
});
