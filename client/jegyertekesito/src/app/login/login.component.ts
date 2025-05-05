import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  errorMessage: string = "";
  isLoading: boolean = false;

  constructor(private router: Router, private authService: AuthService, private snackBar: MatSnackBar) {}

  login() {
    this.isLoading = true;
    setTimeout(() => {
      if (this.email && this.password) {
        this.errorMessage = "";
        this.authService.login(this.email, this.password).subscribe({
          next: (data) => {
            if (data) {
              console.log(data);
              this.isLoading = false;
              this.router.navigateByUrl("/events");
              this.openSnackBar("Welcome back!", 3000);
            }
          }, error: (err) => {
            console.log(err);
            this.openSnackBar("Email or password incorrect!", 3000);
            this.isLoading = false;
          },
        });
      } else {
        this.errorMessage = "Form is empty!";
        this.isLoading = false;
      }
    }, 2000);
  }

  navigateToRegistration(to: string) {
    this.router.navigateByUrl(to);
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, {duration: duration});
  }
}
