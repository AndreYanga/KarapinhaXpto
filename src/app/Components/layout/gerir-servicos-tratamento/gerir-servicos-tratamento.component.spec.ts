import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerirServicosTratamentoComponent } from './gerir-servicos-tratamento.component';

describe('GerirServicosTratamentoComponent', () => {
  let component: GerirServicosTratamentoComponent;
  let fixture: ComponentFixture<GerirServicosTratamentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GerirServicosTratamentoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerirServicosTratamentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
