import { CommonModule, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private location: Location, private authService: AuthService) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      nickname: ['', [Validators.required, Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(30)]],
      confirmPassword: ['', [Validators.required]],
      name: [''],
      address: [''],
      telephone: ['', [this.mustFollowPattern()]],
      isAdmin: [false]
    }, {
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

  onSubmit() {
    if (this.registerForm.valid) {
      console.log("Form data: ", this.registerForm.value);
      this.authService.register(this.registerForm.value).subscribe({
        next: (data) => {
          console.log(data);
        }, error: (err) => {
          console.log(err);
        }
      });
    } else {
      console.log("Form data invalid!");
    }
  }

  navigateToLogin(to: string) {
    this.location.back();
  }
}
