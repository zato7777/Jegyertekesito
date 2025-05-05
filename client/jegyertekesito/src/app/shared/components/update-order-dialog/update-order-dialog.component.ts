import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-update-order-dialog',
  imports: [CommonModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, ReactiveFormsModule, MatInputModule, MatSelect, MatOption],
  templateUrl: './update-order-dialog.component.html',
  styleUrl: './update-order-dialog.component.scss'
})
export class UpdateOrderDialogComponent {
  orderForm!: FormGroup;
  statuses = ["pending", "confirmed", "cancelled"];

  constructor(private dialogRef: MatDialogRef<UpdateOrderDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {}

  ngOnInit() {
    this.orderForm = this.fb.group({
      status: [this.data.status || "pending", [Validators.required]]
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    if (this.orderForm.valid) {
      this.dialogRef.close(this.orderForm.value);
    }
  }
}
