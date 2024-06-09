import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFinanceiroComponent } from './dashboard-financeiro.component';

describe('DashboardFinanceiroComponent', () => {
  let component: DashboardFinanceiroComponent;
  let fixture: ComponentFixture<DashboardFinanceiroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardFinanceiroComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardFinanceiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
