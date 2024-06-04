import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerirProfissionaisComponent } from './gerir-profissionais.component';

describe('GerirProfissionaisComponent', () => {
  let component: GerirProfissionaisComponent;
  let fixture: ComponentFixture<GerirProfissionaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GerirProfissionaisComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerirProfissionaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
