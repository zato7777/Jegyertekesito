import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { Event } from '../shared/services/model/Event';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { EventService } from '../shared/services/event.service';

@Component({
  selector: 'app-events',
  imports: [CommonModule, MatTableModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {
  events!: Event[];
  columns = ["title", "date", "location", "details"];

  constructor(private eventService: EventService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.eventService.getAll().subscribe({
      next: (data) => {
        this.events = data;
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  openEventDetails(id: string): void {
    this.eventService.getOne(id).subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(["/event-details", id]);
      }, error: (err) => {
        console.log(err);
      }
    });
  }
}
