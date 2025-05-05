import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-ticket-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './delete-ticket-dialog.component.html',
  styleUrl: './delete-ticket-dialog.component.scss'
})
export class DeleteTicketDialogComponent {
  constructor(private dialogRef: MatDialogRef<DeleteTicketDialogComponent>) {}
  
  onNoClick() {
    this.dialogRef.close();
  }
}
