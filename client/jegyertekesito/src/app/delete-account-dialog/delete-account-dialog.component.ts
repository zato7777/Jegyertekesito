import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-account-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './delete-account-dialog.component.html',
  styleUrl: './delete-account-dialog.component.scss'
})
export class DeleteAccountDialogComponent {
  constructor(private dialogRef: MatDialogRef<DeleteAccountDialogComponent>) {}
  
  onNoClick() {
    this.dialogRef.close();
  }
}
