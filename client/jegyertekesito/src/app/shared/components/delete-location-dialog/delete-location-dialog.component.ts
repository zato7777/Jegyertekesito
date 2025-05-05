import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-location-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './delete-location-dialog.component.html',
  styleUrl: './delete-location-dialog.component.scss'
})
export class DeleteLocationDialogComponent {
  constructor(private dialogRef: MatDialogRef<DeleteLocationDialogComponent>) {}
  
  onNoClick() {
    this.dialogRef.close();
  }
}
