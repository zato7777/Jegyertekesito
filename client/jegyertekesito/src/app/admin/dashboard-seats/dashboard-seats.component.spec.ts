import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSeatsComponent } from './dashboard-seats.component';

describe('DashboardSeatsComponent', () => {
  let component: DashboardSeatsComponent;
  let fixture: ComponentFixture<DashboardSeatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSeatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSeatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
