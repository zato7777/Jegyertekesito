import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSeatDialogComponent } from './delete-seat-dialog.component';

describe('DeleteSeatDialogComponent', () => {
  let component: DeleteSeatDialogComponent;
  let fixture: ComponentFixture<DeleteSeatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteSeatDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSeatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
