import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-generate-seats-dialog',
  imports: [MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
  templateUrl: './generate-seats-dialog.component.html',
  styleUrl: './generate-seats-dialog.component.scss'
})
export class GenerateSeatsDialogComponent {
  constructor(private dialogRef: MatDialogRef<GenerateSeatsDialogComponent>) {}
  
  onNoClick() {
    this.dialogRef.close();
  }
}
