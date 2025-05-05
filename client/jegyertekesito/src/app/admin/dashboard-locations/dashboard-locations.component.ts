import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { LocationService } from '../../shared/services/location.service';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '../../shared/services/model/Location';
import { CreateLocationDialogComponent } from '../../shared/components/create-location-dialog/create-location-dialog.component';
import { UpdateLocationDialogComponent } from '../../shared/components/update-location-dialog/update-location-dialog.component';
import { DeleteLocationDialogComponent } from '../../shared/components/delete-location-dialog/delete-location-dialog.component';

@Component({
  selector: 'app-dashboard-locations',
  imports: [CommonModule, MatTableModule, MatIconModule, MatDialogModule],
  templateUrl: './dashboard-locations.component.html',
  styleUrl: './dashboard-locations.component.scss'
})
export class DashboardLocationsComponent {
  locations!: Location[];
  columns = ["name", "address", "rows", "columns", "edit", "delete"];

  constructor(private locationService: LocationService, private router: Router, private authService: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.locationService.getAll().subscribe({
      next: (data) => {
        this.locations = data;
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  createLocation() {
    const dialogRef = this.dialog.open(CreateLocationDialogComponent, {
      width: '400px',
    });
  
    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          this.locationService.create(data).subscribe({
            next: (createdLocation) => {
              console.log(createdLocation);
              this.ngOnInit();
              this.openSnackBar("Location created successfully!", 3000);
            }, error: () => {
              this.snackBar.open('Failed to create location.', 'Close', { duration: 3000 });
            }
          });
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }
  
  updateLocation(id: string, n: number) {
    const location = this.locations[n];
    const dialogRef = this.dialog.open(UpdateLocationDialogComponent, {
      width: '400px',
      data: { ...location },
    });

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          this.locationService.update(id, data).subscribe({
            next: (updatedLocation) => {
              console.log(updatedLocation);
              this.locations[n] = updatedLocation;
              this.ngOnInit();
              this.openSnackBar("Location updated successfully!", 3000);
            }, error: () => {
              this.snackBar.open('Failed to update location.', 'Close', { duration: 3000 });
            }
          });
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }
  
  deleteLocation(id: string, n: number) {
    const dialogRef = this.dialog.open(DeleteLocationDialogComponent);

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          this.locationService.delete(id).subscribe({
            next: (data) => {
              console.log(data);
              this.locations?.splice(n, 1);
              this.locations = [...this.locations];
              this.openSnackBar("Location deleted successfully!", 3000)
            }, error: (err) => {
              console.log(err);
              this.snackBar.open('Failed to delete location.', 'Close', { duration: 3000 });
            }
          });
        }
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, {duration: duration});
  }
}
