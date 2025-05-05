import { Component } from '@angular/core';
import { Event } from '../../shared/services/model/Event';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService } from '../../shared/services/event.service';
import { AuthService } from '../../shared/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-event-details',
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss'
})
export class EventDetailsComponent {
  event: any;
  isLoggedIn = false;
  eventDate: any;
  eventTime: any;

  constructor(private route: ActivatedRoute, private eventService: EventService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.eventService.getOne(eventId).subscribe({
        next: (data) => {
          this.event = data;
          this.eventDate = new Date(this.event.date);
          this.eventTime = this.formatTime(this.event.date);
        }, error: (err) => {
          console.error(err);
        }
      });
    }

    this.authService.checkAuth().subscribe({
      next: (isAuth) => this.isLoggedIn = isAuth,
      error: () => this.isLoggedIn = false
    });
  }

  formatTime(date: string): string {
    const eventDate = new Date(date);
    const hours = eventDate.getHours().toString().padStart(2, '0');
    const minutes = eventDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  openReservation() {
    if (this.event && this.event._id) {
      this.router.navigate(['/reservation', this.event._id]);
    }
  }

  navigateToEvents() {
    this.router.navigateByUrl("/events");
  }
}
