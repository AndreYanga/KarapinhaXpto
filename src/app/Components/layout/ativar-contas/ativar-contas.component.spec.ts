import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtivarContasComponent } from './ativar-contas.component';

describe('AtivarContasComponent', () => {
  let component: AtivarContasComponent;
  let fixture: ComponentFixture<AtivarContasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtivarContasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AtivarContasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
