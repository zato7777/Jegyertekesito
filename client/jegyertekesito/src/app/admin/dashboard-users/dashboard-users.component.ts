import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { User } from '../../shared/services/model/User';
import { UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UpdateUserDialogComponent } from '../../shared/components/update-user-dialog/update-user-dialog.component';
import { CreateUserDialogComponent } from '../../shared/components/create-user-dialog/create-user-dialog.component';

@Component({
  selector: 'app-dashboard-users',
  imports: [CommonModule, MatTableModule, MatIconModule, MatDialogModule],
  templateUrl: './dashboard-users.component.html',
  styleUrl: './dashboard-users.component.scss'
})
export class DashboardUsersComponent {
  users!: User[];
  columns = ["nickname", "email", "name", "address", "telephone", "isAdmin", "edit", "delete"];

  constructor(private userService: UserService, private authService: AuthService, private router: Router, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.userService.getAll().subscribe({
      next: (data) => {
        this.users = data;
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  createUser() {
    const dialogRef = this.dialog.open(CreateUserDialogComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          this.authService.register(data).subscribe({
            next: (createdUser) => {
              console.log(createdUser);
              this.ngOnInit();
              this.openSnackBar("User created successfully!", 3000);
            }, error: () => {
              this.snackBar.open('Failed to create user.', 'Close', { duration: 3000 });
            }
          });
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  updateUser(id: string, n: number) {
    const user = this.users[n];
    const dialogRef = this.dialog.open(UpdateUserDialogComponent, {
      width: '400px',
      data: { ...user },
    });

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          this.userService.update(id, data).subscribe({
            next: (updatedUser) => {
              console.log(updatedUser);
              this.users[n] = updatedUser;
              this.ngOnInit();
              this.openSnackBar("User updated successfully!", 3000);
            }, error: () => {
              this.snackBar.open('Failed to update user.', 'Close', { duration: 3000 });
            }
          });
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  deleteUser(id: string, n: number) {
      const dialogRef = this.dialog.open(DialogComponent);
  
      dialogRef.afterClosed().subscribe({
        next: (data) => {
          if (data) {
            console.log(data);
            this.userService.delete(id).subscribe({
              next: (data) => {
                console.log(data);
                this.users?.splice(n, 1);
                this.users = [...this.users];
                this.openSnackBar("User deleted successfully!", 3000)
              }, error: (err) => {
                console.log(err);
                this.snackBar.open('Failed to delete user.', 'Close', { duration: 3000 });
              }
            });
          }
        }, error: (err) => {
          console.log(err);
        }
      })
  }
  
  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, {duration: duration});
  }
}
