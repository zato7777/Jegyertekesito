import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { Location } from '../../services/model/Location';
import { LocationService } from '../../services/location.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-update-event-dialog',
  imports: [CommonModule, MatDialogContent, MatFormField, MatLabel, MatDialogActions, ReactiveFormsModule, MatInputModule, MatSelect, MatOption, MatNativeDateModule, MatDatepickerModule, MatDatepicker, MatDatepickerToggle, MatIconModule],
  templateUrl: './update-event-dialog.component.html',
  styleUrl: './update-event-dialog.component.scss'
})
export class UpdateEventDialogComponent {
  eventForm!: FormGroup;
  locations: Location[] = [];
  selectedImageUrls: string[] = [];

  constructor(private dialogRef: MatDialogRef<UpdateEventDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder, private locationService: LocationService) {}

  ngOnInit() {
    this.locations = this.data.locations;
    this.selectedImageUrls = [...this.data.images];
    console.log(this.data);
    

    this.eventForm = this.fb.group({
      title: [this.data.title, [Validators.required, Validators.maxLength(100)]],
      location: [this.data.location._id, [Validators.required]],
      defaultPrice: [this.data.defaultPrice, Validators.required],
      date: [new Date(this.data.date), [Validators.required]],
      time: [this.formatTime(this.data.date), [Validators.required]],
      images: [this.selectedImageUrls]
    });

    const defaultLocation = this.locations.find(loc => loc._id === this.data.location._id);
    if (defaultLocation) {
      this.eventForm.patchValue({ location: defaultLocation._id });
    }
  }

  formatTime(date: string): string {
    const eventDate = new Date(date);
    const hours = eventDate.getHours().toString().padStart(2, '0');
    const minutes = eventDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;
  
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

  onUpdate(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      formValue.images = this.selectedImageUrls;
      this.dialogRef.close(formValue);
    }
  }
}
