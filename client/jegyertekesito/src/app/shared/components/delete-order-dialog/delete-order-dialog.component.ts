import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-order-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './delete-order-dialog.component.html',
  styleUrl: './delete-order-dialog.component.scss'
})
export class DeleteOrderDialogComponent {
  constructor(private dialogRef: MatDialogRef<DeleteOrderDialogComponent>) {}
  
  onNoClick() {
    this.dialogRef.close();
  }
}
