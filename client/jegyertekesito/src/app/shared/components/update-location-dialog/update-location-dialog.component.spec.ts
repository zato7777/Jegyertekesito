import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLocationDialogComponent } from './update-location-dialog.component';

describe('UpdateLocationDialogComponent', () => {
  let component: UpdateLocationDialogComponent;
  let fixture: ComponentFixture<UpdateLocationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateLocationDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateLocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
