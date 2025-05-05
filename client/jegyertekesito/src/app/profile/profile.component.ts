import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { User } from '../shared/services/model/User';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { DeleteAccountDialogComponent } from '../delete-account-dialog/delete-account-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SharedService } from '../shared/services/shared.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatFormField, MatLabel, ReactiveFormsModule, MatInputModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  profileForm!: FormGroup;
  user!: User;

  constructor(private userService: UserService, private authService: AuthService, private sharedService: SharedService, private fb: FormBuilder, private router: Router, private dialog: MatDialog,  private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.authService.checkAdminAuth().subscribe(user => {
      if (this.isUser(user)) {
        this.user = user;
        this.profileForm = this.fb.group({
          nickname: [this.user.nickname, [Validators.required, Validators.maxLength(30)]],
          name: [this.user.name],
          address: [this.user.address],
          telephone: [this.user.telephone, [this.mustFollowPattern()]]
        })
      } else {
        this.openSnackBar("User not found!", 3000)
        this.router.navigate(['/events']);
      }
    });
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

  onUpdate() {
    const updatedUser = {
      ...this.user,
      ...this.profileForm.value
    };

    this.userService.update(this.user._id, updatedUser).subscribe({
      next: (updatedUser) => {
        console.log(updatedUser);
        this.openSnackBar("User updated successfully!", 3000);
        this.router.navigate(['/events']);
      }, error: () => {
        this.snackBar.open('Failed to update user.', 'Close', { duration: 3000 });
      }
    });
  }
  
  confirmDelete(): void {
    const dialogRef = this.dialog.open(DeleteAccountDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.userService.delete(this.user._id).subscribe({
          next: () => {
            this.openSnackBar("Account deleted successfully!", 3000);
            this.authService.logout().subscribe(() => {
              this.sharedService.emitLoginStatusChange();
              this.router.navigate(['/events']).then(() => {
                window.location.reload();
              });
            });
          },
          error: () => {
            this.openSnackBar("Failed to delete account!", 3000);
          }
        });
      }
    });
  }

  isUser(obj: any): obj is User {
    return obj && typeof obj === 'object';
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, {duration: duration});
  }
}
