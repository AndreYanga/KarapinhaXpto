import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerirMarcacoesComponent } from './gerir-marcacoes.component';

describe('GerirMarcacoesComponent', () => {
  let component: GerirMarcacoesComponent;
  let fixture: ComponentFixture<GerirMarcacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GerirMarcacoesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerirMarcacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
