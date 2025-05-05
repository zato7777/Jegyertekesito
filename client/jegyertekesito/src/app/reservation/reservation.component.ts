import { Component } from '@angular/core';
import { Event as AppEvent } from '../shared/services/model/Event';
import { Seat } from '../shared/services/model/Seat';
import { User } from '../shared/services/model/User';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../shared/services/event.service';
import { SeatService } from '../shared/services/seat.service';
import { TicketService } from '../shared/services/ticket.service';
import { OrderService } from '../shared/services/order.service';
import { AuthService } from '../shared/services/auth.service';
import { Order } from '../shared/services/model/Order';
import { Ticket } from '../shared/services/model/Ticket';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-reservation',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.scss'
})
export class ReservationComponent {
  event: AppEvent | null = null;
  seats: Seat[] = [];
  selectedSeats: { seat: Seat; discount: string }[] = [];
  user: User | null = null;
  totalPrice: number = 0;
  rows: number[] = [];
  columns: number[] = [];
  reservedSeatIds: string[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private eventService: EventService, private seatService: SeatService, private ticketService: TicketService, private orderService: OrderService, private authService: AuthService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const eventId = params.get('id');
      if (eventId) {
        this.eventService.getOne(eventId).subscribe({
          next: (eventData) => {
            this.event = eventData;
            this.rows = Array.from({ length: this.event.location.rows }, (_, i) => i + 1);
            this.columns = Array.from({ length: this.event.location.columns }, (_, i) => i + 1);
  
            this.seatService.getSeatsByLocation(eventData.location._id).subscribe({
              next: (seatData) => {
                this.seats = seatData;
                
                this.ticketService.getTicketsByEvent(eventData._id).subscribe({
                  next: (tickets) => {
                    this.reservedSeatIds = tickets.map(ticket => ticket.seat._id);
                  },
                  error: (err) => console.error('Failed to load reserved seats!', err)
                });
              },
              error: (err) => console.error('Failed to load seats!', err)
            });
          },
          error: (err) => console.error('Failed to load event!', err)
        });
      }
    });
  
    this.authService.checkAdminAuth().subscribe({
      next: (user) => {
        this.user = user;
      },
      error: () => {
        this.user = null;
      }
    });
  }

  seatExists(row: number, number: number): boolean {
    return this.seats.some(seat => seat.row === row && seat.number === number);
  }
  
  getSeat(row: number, number: number): Seat | undefined {
    return this.seats.find(seat => seat.row === row && seat.number === number);
  }
  
  isSeatBooked(row: number, number: number): boolean {
    const seat = this.getSeat(row, number);
    return seat ? this.reservedSeatIds.includes(seat._id) : false;
  }
  
  isSeatSelected(row: number, number: number): boolean {
    return this.selectedSeats.some(sel => sel.seat.row === row && sel.seat.number === number);
  }

  onSeatClick(row: number, number: number): void {
    if (!this.seatExists(row, number) || this.isSeatBooked(row, number)) {
      return;
    }

    this.handleSeatClick(row, number);
  }

  handleSeatClick(row: number, number: number): void {
    const seat = this.getSeat(row, number);
    if (!seat || this.isSeatBooked(row, number)) {
      return;
    }

    const index = this.selectedSeats.findIndex(sel => sel.seat._id === seat._id);
    
    if (index >= 0) {
      this.selectedSeats.splice(index, 1);
    } else {
      this.selectedSeats.push({ seat, discount: 'none' });
    }

    this.calculateTotalPrice();
  }

  toggleSeatSelection(seat: Seat) {
    const index = this.selectedSeats.findIndex(data => {
      data.seat._id === seat._id;
    });

    if (index >= 0) {
      this.selectedSeats.splice(index, 1);
    } else {
      this.selectedSeats.push({ seat, discount: "none" });
    }

    this.calculateTotalPrice();
  }

  updateDiscount(seatId: string, discount: string) {
    const selected = this.selectedSeats.find(data => data.seat._id === seatId);
    if (selected) {
      selected.discount = discount;
      this.calculateTotalPrice();
    }
  }

  onDiscountChange(event: Event, seatId: string): void {
    const selectElement = event.target as HTMLSelectElement;
    const discount = selectElement.value;
    this.updateDiscount(seatId, discount);
  }

  calculateTotalPrice() {
    let price = 0;

    this.selectedSeats.forEach(selected => {
      const seat = selected.seat;
      const discount = selected.discount || 'none';

      let categoryMultiplier = 1;
      let discountMultiplier = 1;

      switch(seat.category) {
        case "normal": {
          categoryMultiplier = 1;
          break;
        }
        case "featured": {
          categoryMultiplier = 1.5;
          break;
        }
        case "premium": {
          categoryMultiplier = 2;
          break;
        }
        case "disabled": {
          categoryMultiplier = 1;
          break;
        }
        default: { 
          categoryMultiplier = 1; 
          break; 
       } 
      }

      switch(discount) {
        case "discount": {
          categoryMultiplier = 1;
          break;
        }
        case "child": {
          categoryMultiplier = 0.5;
          break;
        }
        case "student": {
          categoryMultiplier = 0.75;
          break;
        }
        case "retired": {
          categoryMultiplier = 0.7;
          break;
        }
        case "veteran": {
          categoryMultiplier = 0.9;
          break;
        }
        default: { 
          categoryMultiplier = 1; 
          break; 
       } 
      }
  
      const seatPrice = this.event!.defaultPrice * categoryMultiplier * discountMultiplier;
  
      price += seatPrice;
    });
  
    this.totalPrice = Math.round(price);
  }

  reservation() {
    if (!this.user || !this.event || this.selectedSeats.length === 0) {
      return;
    }
    
    const orderData: any = {
      user: this.user,
      event: this.event,
      orderDate: new Date(),
      status: "pending"
    };

    this.orderService.create(orderData).subscribe({
      next: (order) => {
        const tickets = this.selectedSeats.map(selected => {
          return {
            discount: selected.discount,
            order: order,
            seat: selected.seat,
            event: this.event
          } as Ticket;
        });

        const ticketRequests = tickets.map(ticket => this.ticketService.create(ticket));

        forkJoin(ticketRequests).subscribe({
          next: () => {
            this.openSnackBar("Order saved successfully!", 3000);
            this.router.navigateByUrl("/events");
          },
          error: (err) => {
            console.error(err);
            this.openSnackBar("Failed to save ticket(s)!", 3000);
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.openSnackBar("Failed to save order!", 3000);
      }
    });
  }

  compareSeat(seat: Seat): boolean {
    return this.selectedSeats.some(selected => selected.seat._id === seat._id);
  }

  navigateToEventDetails() {
    this.router.navigateByUrl("/event-details/" + this.event!._id);
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, {duration: duration});
  }
}
