import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-update-location-dialog',
  imports: [CommonModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, ReactiveFormsModule, MatInputModule],
  templateUrl: './update-location-dialog.component.html',
  styleUrl: './update-location-dialog.component.scss'
})
export class UpdateLocationDialogComponent {
  locationForm!: FormGroup;

  constructor(private dialogRef: MatDialogRef<UpdateLocationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {}

  ngOnInit() {
    this.locationForm = this.fb.group({
      name: [this.data.name, [Validators.required, Validators.maxLength(100)]],
      address: [this.data.address],
      rows: [this.data.rows, [Validators.required]],
      columns: [this.data.columns, [Validators.required]]
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    if (this.locationForm.valid) {
      this.dialogRef.close(this.locationForm.value);
    }
  }
}
