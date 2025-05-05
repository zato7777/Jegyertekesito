import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { EventsComponent } from './events/events.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { ProfileComponent } from './profile/profile.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { EventDetailsComponent } from './events/event-details/event-details.component';
import { ReservationComponent } from './reservation/reservation.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginComponent, RegisterComponent, EventsComponent, DashboardComponent, NavbarComponent, ProfileComponent, OrderHistoryComponent, EventDetailsComponent, ReservationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'jegyertekesito';
}
