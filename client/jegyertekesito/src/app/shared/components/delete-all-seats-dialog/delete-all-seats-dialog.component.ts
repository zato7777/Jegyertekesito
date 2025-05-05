import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-all-seats-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './delete-all-seats-dialog.component.html',
  styleUrl: './delete-all-seats-dialog.component.scss'
})
export class DeleteAllSeatsDialogComponent {
  constructor(private dialogRef: MatDialogRef<DeleteAllSeatsDialogComponent>) {}
  
  onNoClick() {
    this.dialogRef.close();
  }
}
