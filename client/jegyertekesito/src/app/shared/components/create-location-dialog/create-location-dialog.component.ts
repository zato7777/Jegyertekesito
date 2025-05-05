import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-location-dialog',
  imports: [CommonModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, ReactiveFormsModule, MatInputModule],
  templateUrl: './create-location-dialog.component.html',
  styleUrl: './create-location-dialog.component.scss'
})
export class CreateLocationDialogComponent {
  locationForm!: FormGroup;

  constructor(private dialogRef: MatDialogRef<CreateLocationDialogComponent>, private fb: FormBuilder) {}

  ngOnInit() {
    this.locationForm = this.fb.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      address: [""],
      rows: ["", [Validators.required, Validators.min(1), Validators.max(100)]],
      columns: ["", [Validators.required, Validators.min(1), Validators.max(100)]]
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.locationForm.valid) {
      this.dialogRef.close(this.locationForm.value);
    }
  }
}
