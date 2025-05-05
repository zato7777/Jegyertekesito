import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ticket } from './model/Ticket';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Ticket[]>("http://localhost:5000/app/getAllTickets", {withCredentials: true});
  }

  getTicketsByEvent(eventId: String) {
    return this.http.get<Ticket[]>(`http://localhost:5000/app/getTicketsByEvent/${eventId}`, {withCredentials: true});
  }

  getOne(id: String) {
    return this.http.get<Ticket>("http://localhost:5000/app/getOneTicket?id=" + id, {withCredentials: true});
  }

  create(ticket: Ticket): Observable<any> {
    const body = new URLSearchParams();
    body.set("discount", ticket.discount);
    body.set("order", ticket.order._id);
    body.set("seat", ticket.seat._id);
    body.set("event", ticket.event._id);

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
  });
  
    return this.http.post("http://localhost:5000/app/createTicket", body, {headers: headers, withCredentials: true});
  }

  update(id: string, ticket: Ticket): Observable<any> {
    const body = new URLSearchParams();
    body.set("discount", ticket.discount);

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });

    return this.http.put("http://localhost:5000/app/updateTicket?id=" + id, body, {headers: headers, withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete("http://localhost:5000/app/deleteTicket?id=" + id, {withCredentials: true});
  }
}
