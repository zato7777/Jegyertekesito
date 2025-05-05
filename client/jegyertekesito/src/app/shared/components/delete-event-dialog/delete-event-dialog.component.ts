import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-event-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './delete-event-dialog.component.html',
  styleUrl: './delete-event-dialog.component.scss'
})
export class DeleteEventDialogComponent {
  constructor(private dialogRef: MatDialogRef<DeleteEventDialogComponent>) {}
  
  onNoClick() {
    this.dialogRef.close();
  }
}
