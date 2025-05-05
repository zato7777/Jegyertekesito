import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Event } from '../../shared/services/model/Event';
import { Ticket } from '../../shared/services/model/Ticket';
import { TicketService } from '../../shared/services/ticket.service';
import { EventService } from '../../shared/services/event.service';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateTicketDialogComponent } from '../../shared/components/update-ticket-dialog/update-ticket-dialog.component';
import { DeleteTicketDialogComponent } from '../../shared/components/delete-ticket-dialog/delete-ticket-dialog.component';

@Component({
  selector: 'app-dashboard-tickets',
  imports: [CommonModule, MatTableModule, MatIconModule, MatDialogModule],
  templateUrl: './dashboard-tickets.component.html',
  styleUrl: './dashboard-tickets.component.scss'
})
export class DashboardTicketsComponent {
  events!: Event[];
  eventIndex = 0;
  tickets!: Ticket[];
  columnsEvent = ["title", "date", "location", "organizer", "defaultPrice", "view"];
  columnsTicket = ["seat", "category", "discount", "user", "status", "date", "edit", "delete"];
  selectedEventId: string | null = null;

  constructor(private ticketService: TicketService, private eventService: EventService, private router: Router, private authService: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  showTickets(eventId: string, index: number): void {
    this.selectedEventId = eventId;
    this.eventIndex = index;
    this.ticketService.getTicketsByEvent(eventId).subscribe(tickets => {
      this.tickets = tickets;
      console.log(tickets);
    });
  }

  backToEvents(): void {
    this.selectedEventId = null;
    this.eventIndex = 0;
    this.tickets = [];
  }

  updateTicket(id: string, n: number) {
    const ticket = this.tickets[n];
    const dialogRef = this.dialog.open(UpdateTicketDialogComponent, {
      width: '400px',
      data: { ...ticket },
    });

    dialogRef.afterClosed().subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          this.ticketService.update(id, data).subscribe({
            next: (updatedTicket) => {
              console.log(updatedTicket);
              this.tickets[n] = updatedTicket;
              this.showTickets(this.selectedEventId!, this.eventIndex);
              this.openSnackBar("Ticket updated successfully!", 3000);
            }, error: () => {
              this.snackBar.open('Failed to update ticket.', 'Close', { duration: 3000 });
            }
          });
        }
      }, error: (err) => {
        console.log(err);
      }
    });
  }
  
  deleteTicket(id: string, n: number) {
    if (this.tickets[n].order.status === "compleated" || this.tickets[n].order.status === "cancelled") {
      const dialogRef = this.dialog.open(DeleteTicketDialogComponent);

      dialogRef.afterClosed().subscribe({
        next: (data) => {
          if (data) {
            console.log(data);
            this.ticketService.delete(id).subscribe({
              next: (data) => {
                console.log(data);
                this.tickets?.splice(n, 1);
                this.tickets = [...this.tickets];
                this.openSnackBar("Ticket deleted successfully!", 3000)
              }, error: (err) => {
                console.log(err);
                this.snackBar.open('Failed to delete ticket.', 'Close', { duration: 3000 });
              }
            });
          }
        }, error: (err) => {
          console.log(err);
        }
      })
    }
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, {duration: duration});
  }
}
