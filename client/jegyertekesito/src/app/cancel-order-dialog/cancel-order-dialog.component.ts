import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cancel-order-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './cancel-order-dialog.component.html',
  styleUrl: './cancel-order-dialog.component.scss'
})
export class CancelOrderDialogComponent {
  constructor(private dialogRef: MatDialogRef<CancelOrderDialogComponent>) {}
  
  onNoClick() {
    this.dialogRef.close();
  }
}
