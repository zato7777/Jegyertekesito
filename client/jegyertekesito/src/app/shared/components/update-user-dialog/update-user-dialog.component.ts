import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { RegisterComponent } from '../../../register/register.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-update-user-dialog',
  imports: [CommonModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, MatCheckbox, ReactiveFormsModule, MatInputModule],
  templateUrl: './update-user-dialog.component.html',
  styleUrl: './update-user-dialog.component.scss'
})
export class UpdateUserDialogComponent {
  userForm!: FormGroup;

  constructor(private dialogRef: MatDialogRef<UpdateUserDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      nickname: [this.data.nickname, [Validators.required, Validators.maxLength(30)]],
      name: [this.data.name],
      address: [this.data.address],
      telephone: [this.data.telephone, [this.mustFollowPattern()]],
      isAdmin: [this.data.isAdmin]
    })
  }

  mustFollowPattern(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      const pattern = /^(\+36|06)(\d{1,2})\d{3}\d{4}$/;
      const valid = pattern.test(value);
      return valid ? null : { invalidPhone: true };
    };
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdate(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}
