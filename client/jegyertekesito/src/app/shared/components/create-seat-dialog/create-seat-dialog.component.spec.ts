import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSeatDialogComponent } from './create-seat-dialog.component';

describe('CreateSeatDialogComponent', () => {
  let component: CreateSeatDialogComponent;
  let fixture: ComponentFixture<CreateSeatDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSeatDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSeatDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
