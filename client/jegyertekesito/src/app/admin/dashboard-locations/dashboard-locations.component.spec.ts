import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLocationsComponent } from './dashboard-locations.component';

describe('DashboardLocationsComponent', () => {
  let component: DashboardLocationsComponent;
  let fixture: ComponentFixture<DashboardLocationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLocationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardLocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
