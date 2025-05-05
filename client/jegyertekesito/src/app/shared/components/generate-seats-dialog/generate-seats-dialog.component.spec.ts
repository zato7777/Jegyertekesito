import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateSeatsDialogComponent } from './generate-seats-dialog.component';

describe('GenerateSeatsDialogComponent', () => {
  let component: GenerateSeatsDialogComponent;
  let fixture: ComponentFixture<GenerateSeatsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateSeatsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateSeatsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
