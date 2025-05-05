import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Location } from '../../shared/services/model/Location';
import { Seat } from '../../shared/services/model/Seat';
import { SeatService } from '../../shared/services/seat.service';
import { LocationService } from '../../shared/services/location.service';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateSeatDialogComponent } from '../../shared/components/create-seat-dialog/create-seat-dialog.component';
import { UpdateSeatDialogComponent } from '../../shared/components/update-seat-dialog/update-seat-dialog.component';
import { DeleteSeatDialogComponent } from '../../shared/components/delete-seat-dialog/delete-seat-dialog.component';
import { GenerateSeatsDialogComponent } from '../../shared/components/generate-seats-dialog/generate-seats-dialog.component';
import { DeleteAllSeatsDialogComponent } from '../../shared/components/delete-all-seats-dialog/delete-all-seats-dialog.component';

@Component({
  selector: 'app-dashboard-seats',
  imports: [CommonModule, MatTableModule, MatIconModule, MatDialogModule],
  templateUrl: './dashboard-seats.component.html',
  styleUrl: './dashboard-seats.component.scss'
})
export class DashboardSeatsComponent {
  locations!: Location[];
  locationIndex = 0;
  seats!: Seat[];
  columnsLocation = ["name", "address", "add"];
  columnsSeat = ["row", "number", "category", "location", "edit", "delete"];
  selectedLocationId: string | null = null;

  constructor(private seatService: SeatService, private locationService: LocationService, private router: Router, private authService: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.locationService.getAll().subscribe({
      next: (data) => {
        this.locations = data;
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  showSeats(locationId: string, index: number): void {
    this.selectedLocationId = locationId;
    this.locationIndex = index;
    this.seatService.getSeatsByLocation(locationId).subscribe(seats => {
      this.seats = seats;
    });
  }

  backToLocations(): void {
    this.selectedLocationId = null;
    this.locationIndex = 0;
    this.seats = [];
  }

  createSeat() {
    const location = this.locations[this.locationIndex];
    const dialogRef = this.dialog.open(CreateSeatDialogComponent, {
      width: '400px',
      data: { ...location }
    });
  
    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          this.seatService.create(data).subscribe({
            next: (createdSeat) => {
              console.log(createdSeat);
              this.showSeats(this.selectedLocationId!, this.locationIndex);
              this.openSnackBar("Seat created successfully!", 3000);
            }, error: () => {
              this.snackBar.open('Failed to create seat.', 'Close', { duration: 3000 });
            }
          });
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }
  
  updateSeat(id: string, n: number) {
    const seat = this.seats[n];
    const dialogRef = this.dialog.open(UpdateSeatDialogComponent, {
      width: '400px',
      data: { ...seat },
    });

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          this.seatService.update(id, data).subscribe({
            next: (updatedSeat) => {
              console.log(updatedSeat);
              this.seats[n] = updatedSeat;
              this.showSeats(this.selectedLocationId!, this.locationIndex);
              this.openSnackBar("Seat updated successfully!", 3000);
            }, error: () => {
              this.snackBar.open('Failed to update seat.', 'Close', { duration: 3000 });
            }
          });
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }
  
  deleteSeat(id: string, n: number) {
    const dialogRef = this.dialog.open(DeleteSeatDialogComponent);

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          this.seatService.delete(id).subscribe({
            next: (data) => {
              console.log(data);
              this.seats?.splice(n, 1);
              this.seats = [...this.seats];
              this.openSnackBar("Seat deleted successfully!", 3000)
            }, error: (err) => {
              console.log(err);
              this.snackBar.open('Failed to delete seat.', 'Close', { duration: 3000 });
            }
          });
        }
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  openGenerateSeatsDialog(locationId: string): void {
    const dialogRef = this.dialog.open(GenerateSeatsDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.seatService.generateSeats(locationId).subscribe({
          next: (res) => {
            this.snackBar.open(`Seats created successfully!`, 'Close', { duration: 3000 });
            this.showSeats(this.selectedLocationId!, this.locationIndex);
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Failed to generate seats.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  openDeleteAllSeatsDialog(locationId: string): void {
    const dialogRef = this.dialog.open(DeleteAllSeatsDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.seatService.deleteAllSeats(locationId).subscribe({
          next: (res) => {
            this.snackBar.open(`All seats deleted successfully!`, 'Close', { duration: 3000 });
            this.showSeats(this.selectedLocationId!, this.locationIndex);
          },
          error: (err) => {
            console.error(err);
            this.snackBar.open('Failed to delete all seats.', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, {duration: duration});
  }
}
