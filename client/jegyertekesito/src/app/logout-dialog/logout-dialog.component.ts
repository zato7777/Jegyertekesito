import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './logout-dialog.component.html',
  styleUrl: './logout-dialog.component.scss'
})
export class LogoutDialogComponent {
  constructor(private dialogRef: MatDialogRef<LogoutDialogComponent>) {}
  
  onNoClick() {
    this.dialogRef.close();
  }
}
