import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEventDialogComponent } from './create-event-dialog.component';

describe('CreateEventDialogComponent', () => {
  let component: CreateEventDialogComponent;
  let fixture: ComponentFixture<CreateEventDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateEventDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateEventDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
