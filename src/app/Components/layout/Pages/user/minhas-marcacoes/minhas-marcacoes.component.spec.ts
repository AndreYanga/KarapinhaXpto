import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasMarcacoesComponent } from './minhas-marcacoes.component';

describe('MinhasMarcacoesComponent', () => {
  let component: MinhasMarcacoesComponent;
  let fixture: ComponentFixture<MinhasMarcacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MinhasMarcacoesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MinhasMarcacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
