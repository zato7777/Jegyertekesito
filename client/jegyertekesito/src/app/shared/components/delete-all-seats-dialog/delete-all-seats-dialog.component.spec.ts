import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAllSeatsDialogComponent } from './delete-all-seats-dialog.component';

describe('DeleteAllSeatsDialogComponent', () => {
  let component: DeleteAllSeatsDialogComponent;
  let fixture: ComponentFixture<DeleteAllSeatsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAllSeatsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAllSeatsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
