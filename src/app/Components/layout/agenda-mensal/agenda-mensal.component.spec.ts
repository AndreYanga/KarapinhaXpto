import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaMensalComponent } from './agenda-mensal.component';

describe('AgendaMensalComponent', () => {
  let component: AgendaMensalComponent;
  let fixture: ComponentFixture<AgendaMensalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgendaMensalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AgendaMensalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
