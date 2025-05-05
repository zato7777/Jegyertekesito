import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { SharedService } from '../services/shared.service';
import { LogoutDialogComponent } from '../../logout-dialog/logout-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isLoggedIn = false;
  isAdmin = false;

  constructor(private authService: AuthService, private router: Router, private sharedService: SharedService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.checkLoginStatus();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkLoginStatus();
      });

    this.sharedService.loginStatusChanged.subscribe(() => {
      this.checkLoginStatus();
    });
  }

  checkLoginStatus() {
    this.authService.checkAuth().subscribe({
      next: (data) => {
        this.isLoggedIn = data === true;
      },
      error: () => {
        this.isLoggedIn = false;
      }
    });
  
    this.authService.checkAdminAuth().subscribe({
      next: (user) => {
        this.isAdmin = user?.isAdmin === true;
      },
      error: () => {
        this.isAdmin = false;
      }
    });
  }

  logout(): void {
    const dialogRef = this.dialog.open(LogoutDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.authService.logout().subscribe({
          next: () => {
            this.openSnackBar("Logged out successfully!", 3000);
            this.isLoggedIn = false;
            this.isAdmin = false;
            this.router.navigate(['/login']);
          },
          error: () => {
            this.openSnackBar("Failed to logout!", 3000);
          }
        });
      }
    });
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, {duration: duration});
  }
}
