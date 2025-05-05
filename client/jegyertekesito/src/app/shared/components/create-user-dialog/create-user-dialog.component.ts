import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RegisterComponent } from '../../../register/register.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-user-dialog',
  imports: [CommonModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, MatCheckbox, ReactiveFormsModule, MatInputModule],
  templateUrl: './create-user-dialog.component.html',
  styleUrl: './create-user-dialog.component.scss'
})
export class CreateUserDialogComponent {
  userForm!: FormGroup;

  constructor(private dialogRef: MatDialogRef<CreateUserDialogComponent>, private fb: FormBuilder) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      nickname: ["", [Validators.required, Validators.maxLength(30)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      confirmPassword: ["", [Validators.required]],
      name: [""],
      address: [""],
      telephone: ["", [this.mustFollowPattern()]],
      isAdmin: [false]
    },  {
      validator: this.mustMatch("password", "confirmPassword")
    })
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      
      if (matchingControl.errors && matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({mustMatch: true});
      } else {
        matchingControl.setErrors(null);
      }
    }
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

  onCreate(): void {
    if (this.userForm.valid) {
      this.dialogRef.close(this.userForm.value);
    }
  }
}
