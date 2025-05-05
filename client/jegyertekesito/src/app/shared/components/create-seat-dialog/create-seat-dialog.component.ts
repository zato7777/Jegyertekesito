import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-create-seat-dialog',
  imports: [CommonModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, ReactiveFormsModule, MatInputModule, MatSelect, MatOption],
  templateUrl: './create-seat-dialog.component.html',
  styleUrl: './create-seat-dialog.component.scss'
})
export class CreateSeatDialogComponent {
  seatForm!: FormGroup;
  
  constructor(private dialogRef: MatDialogRef<CreateSeatDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {}

  ngOnInit() {
    this.seatForm = this.fb.group({
      row: ["", [Validators.required, Validators.min(1), Validators.max(this.data.rows)]],
      number: ["", [Validators.required, Validators.min(1), Validators.max(this.data.columns)]],
      category: ["normal", [Validators.required]],
      location: [this.data, [Validators.required]]
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.seatForm.valid) {
      console.log(this.seatForm.value)
      this.dialogRef.close(this.seatForm.value);
    }
  }
}
