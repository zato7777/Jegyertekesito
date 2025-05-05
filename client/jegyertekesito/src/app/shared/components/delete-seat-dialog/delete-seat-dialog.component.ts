import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-seat-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './delete-seat-dialog.component.html',
  styleUrl: './delete-seat-dialog.component.scss'
})
export class DeleteSeatDialogComponent {
  constructor(private dialogRef: MatDialogRef<DeleteSeatDialogComponent>) {}
  
  onNoClick() {
    this.dialogRef.close();
  }
}
