import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerirAdministrativoComponent } from './gerir-administrativo.component';

describe('GerirAdministrativoComponent', () => {
  let component: GerirAdministrativoComponent;
  let fixture: ComponentFixture<GerirAdministrativoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GerirAdministrativoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GerirAdministrativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
