import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateSeatDialogComponent } from './update-seat-dialog.component';

describe('UpdateSeatDialogComponent', () => {
  let component: UpdateSeatDialogComponent;
  let fixture: ComponentFixture<UpdateSeatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateSeatDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateSeatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
