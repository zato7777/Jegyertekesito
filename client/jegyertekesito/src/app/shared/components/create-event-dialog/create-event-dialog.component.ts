import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Location } from '../../services/model/Location';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-event-dialog',
  imports: [CommonModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, ReactiveFormsModule, MatInputModule, MatSelectModule, MatOption, MatDatepickerModule, MatNativeDateModule, MatDatepicker, MatDatepickerToggle, MatIconModule],
  templateUrl: './create-event-dialog.component.html',
  styleUrl: './create-event-dialog.component.scss'
})
export class CreateEventDialogComponent {
  eventForm!: FormGroup;
  organizer: any = null;
  locations: Location[] = [];
  selectedImageUrls: string[] = [];

  constructor(private dialogRef: MatDialogRef<CreateEventDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {}

  ngOnInit() {
    this.organizer = this.data.organizer;
    this.locations = this.data.locations;
    
    if (this.organizer === null || this.organizer === undefined) {
      console.log("Cannot find Organizer for event!");
      this.dialogRef.close();
    } else {
      this.eventForm = this.fb.group({
        title: ["", [Validators.required, Validators.maxLength(100)]],
        organizer: [this.organizer, [Validators.required]],
        location: ["", [Validators.required]],
        defaultPrice: ["", Validators.required],
        date: ["", [Validators.required]],
        time: ["", [Validators.required]],
        images: [this.selectedImageUrls]
      })
    }
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
    this.selectedImageUrls = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
  
      if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImageUrls.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  removeImage(index: number): void {
    this.selectedImageUrls.splice(index, 1);
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      formValue.images = this.selectedImageUrls;
      this.dialogRef.close(formValue);
    }
  }
}
