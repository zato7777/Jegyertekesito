import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-update-seat-dialog',
  imports: [CommonModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, ReactiveFormsModule, MatInputModule, MatSelect, MatOption],
  templateUrl: './update-seat-dialog.component.html',
  styleUrl: './update-seat-dialog.component.scss'
})
export class UpdateSeatDialogComponent {
  seatForm!: FormGroup;

  constructor(private dialogRef: MatDialogRef<UpdateSeatDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {}

  ngOnInit() {
    this.seatForm = this.fb.group({
      row: [this.data.row, [Validators.required]],
      number: [this.data.number, [Validators.required]],
      category: [this.data.category, [Validators.required]],
      location: [this.data.location, [Validators.required]]
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    if (this.seatForm.valid) {
      this.dialogRef.close(this.seatForm.value);
    }
  }
}
