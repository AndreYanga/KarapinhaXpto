import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitarMarcacaoComponent } from './solicitar-marcacao.component';

describe('SolicitarMarcacaoComponent', () => {
  let component: SolicitarMarcacaoComponent;
  let fixture: ComponentFixture<SolicitarMarcacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SolicitarMarcacaoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SolicitarMarcacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
