import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTicketDialogComponent } from './update-ticket-dialog.component';

describe('UpdateTicketDialogComponent', () => {
  let component: UpdateTicketDialogComponent;
  let fixture: ComponentFixture<UpdateTicketDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTicketDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTicketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
