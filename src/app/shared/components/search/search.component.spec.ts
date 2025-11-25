import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deveria emitir texto de busca', () => {
    const spySearchText = spyOn(component.searchText, 'emit');

    const inputElemento = document.createElement('input');
    inputElemento.value = 'teste';
    const event = { target: inputElemento } as unknown as Event;

    component.onInputChange(event);
    fixture.detectChanges();

    expect(spySearchText).toHaveBeenCalledWith('teste');
    expect(spySearchText).toHaveBeenCalledTimes(1);

    // const spyInputChange = spyOn(component.onInputChange(textoDeBusca), never);
  });

  it('deveria emitir string vazia se texto do input for vazio', () => {
    const spyInputChange = spyOn(component.searchText, 'emit');
    const inputElemento = document.createElement('input');
    inputElemento.value = '';
    const event = { target: inputElemento } as unknown as Event;

    component.onInputChange(event);

    expect(spyInputChange).toHaveBeenCalledWith('');
    expect(spyInputChange).toHaveBeenCalledTimes(1);
  });

  it('should emit on successive input changes', () => {
    const spyInputChange = spyOn(component.searchText, 'emit');
    const inputElemento = document.createElement('input');

    inputElemento.value = 'a';
    component.onInputChange({ target: inputElemento } as unknown as Event);

    inputElemento.value = 'ab';
    component.onInputChange({ target: inputElemento } as unknown as Event);

    inputElemento.value = 'abc';
    component.onInputChange({ target: inputElemento } as unknown as Event);

    expect(spyInputChange.calls.allArgs()).toEqual([['a'], ['ab'], ['abc']]);
    expect(spyInputChange).toHaveBeenCalledTimes(3);
  });

  // it("",()=>{})
});
