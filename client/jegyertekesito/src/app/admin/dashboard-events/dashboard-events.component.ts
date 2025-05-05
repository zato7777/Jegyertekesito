import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Event } from '../../shared/services/model/Event';
import { EventService } from '../../shared/services/event.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateEventDialogComponent } from '../../shared/components/create-event-dialog/create-event-dialog.component';
import { UpdateEventDialogComponent } from '../../shared/components/update-event-dialog/update-event-dialog.component';
import { DeleteEventDialogComponent } from '../../shared/components/delete-event-dialog/delete-event-dialog.component';
import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { LocationService } from '../../shared/services/location.service';
import { Location } from '../../shared/services/model/Location';
import { forkJoin } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-dashboard-events',
  imports: [CommonModule, MatTableModule, MatIconModule, MatDialogModule, MatDatepickerModule, MatNativeDateModule],
  templateUrl: './dashboard-events.component.html',
  styleUrl: './dashboard-events.component.scss'
})
export class DashboardEventsComponent {
  events!: Event[];
  organizer: any = null;
  locations: Location[] = [];

  columns = ["title", "date", "defaultPrice", "organizer", "location", "images", "edit", "delete"];

  constructor(private eventService: EventService, private userService: UserService, private locationService: LocationService, private router: Router, private authService: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  createEvent() { 
    forkJoin({
      organizer: this.authService.checkAdminAuth(),
      locations: this.locationService.getAll()
    }).subscribe({
      next: (result) => {
        const dialogRef = this.dialog.open(CreateEventDialogComponent, {
          width: '400px',
          data: {
            organizer: result.organizer,
            locations: result.locations
          }
        });
  
        dialogRef.afterClosed().subscribe({
          next: (data) => {
            if (data) {
              console.log(data);
              const datePart = data.date;
              const timePart = data.time;
  
              if (datePart && timePart) {
                const [hours, minutes] = timePart.split(':').map(Number);
                const combinedDate = new Date(datePart);
                combinedDate.setHours(hours);
                combinedDate.setMinutes(minutes);
                combinedDate.setSeconds(0);
                combinedDate.setMilliseconds(0);
  
                const formData = {
                  ...data,
                  date: combinedDate,
                  images: JSON.stringify(data.images)
                };
                console.log(formData);
  
                this.eventService.create(formData).subscribe({
                  next: (createdEvent) => {
                    console.log(createdEvent);
                    this.ngOnInit();
                    this.openSnackBar("Event created successfully!", 3000);
                  },
                  error: () => {
                    this.snackBar.open('Failed to create event.', 'Close', { duration: 3000 });
                  }
                });
              } else {
                console.error('Date or time is missing!');
                this.snackBar.open('Date or time is missing.', 'Close', { duration: 3000 });
              }
            }
          },
          error: (err) => {
            console.log(err);
          }
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  updateEvent(id: string, n: number) {
    this.locationService.getAll().subscribe({
      next: (data) => {
        const event = this.events[n];
        const dialogRef = this.dialog.open(UpdateEventDialogComponent, {
          width: '400px',
          data: { 
            ...event,
            locations: data
          },
        });
  
        dialogRef.afterClosed().subscribe({
          next: (data) => {
            if (data) {
              console.log(data);
              const datePart = data.date;
              const timePart = data.time;
  
              if (datePart && timePart) {
                const [hours, minutes] = timePart.split(':').map(Number);
                const combinedDate = new Date(datePart);
                combinedDate.setHours(hours);
                combinedDate.setMinutes(minutes);
                combinedDate.setSeconds(0);
                combinedDate.setMilliseconds(0);
  
                const formData = {
                  ...data,
                  date: combinedDate,
                  images: data.images
                };
                console.log(formData);
                this.eventService.update(id, formData).subscribe({
                  next: (updatedEvent) => {
                    console.log(updatedEvent);
                    this.events[n] = updatedEvent;
                    this.ngOnInit();
                    this.openSnackBar("Event updated successfully!", 3000);
                  },
                  error: () => {
                    this.snackBar.open('Failed to update event.', 'Close', { duration: 3000 });
                  }
                });
              } else {
                console.error('Date or time is missing!');
                this.snackBar.open('Date or time is missing.', 'Close', { duration: 3000 });
              }
            }
          }, 
          error: (err) => {
            console.log(err);
          }
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  deleteEvent(id: string, n: number) {
    const dialogRef = this.dialog.open(DeleteEventDialogComponent);

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          this.eventService.delete(id).subscribe({
            next: (data) => {
              console.log(data);
              this.events?.splice(n, 1);
              this.events = [...this.events];
              this.openSnackBar("Event deleted successfully!", 3000)
            }, error: (err) => {
              console.log(err);
              this.snackBar.open('Failed to delete event.', 'Close', { duration: 3000 });
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
