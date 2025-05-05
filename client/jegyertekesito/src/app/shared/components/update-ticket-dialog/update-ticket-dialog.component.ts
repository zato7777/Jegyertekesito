import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-update-ticket-dialog',
  imports: [CommonModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, ReactiveFormsModule, MatInputModule, MatSelect, MatOption],
  templateUrl: './update-ticket-dialog.component.html',
  styleUrl: './update-ticket-dialog.component.scss'
})
export class UpdateTicketDialogComponent {
  ticketForm!: FormGroup;

  constructor(private dialogRef: MatDialogRef<UpdateTicketDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {}

  ngOnInit() {
    this.ticketForm = this.fb.group({
      discount: [this.data.discount || "none", [Validators.required]]
    })
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    if (this.ticketForm.valid) {
      this.dialogRef.close(this.ticketForm.value);
    }
  }
}
