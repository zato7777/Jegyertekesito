import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Event } from './model/Event';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Event[]>("http://localhost:5000/app/getAllEvents");
  }

  getOne(id: String) {
    return this.http.get<Event>("http://localhost:5000/app/eventDetails?id=" + id);
  }

  /*create(event: Event): Observable<any> {
    const body = new URLSearchParams();
    body.set("title", event.title);
    body.set("date", String(event.date));
    body.set("defaultPrice", String(event.defaultPrice));
    body.set("organizer", event.organizer._id);
    body.set("location", event.location._id);
    body.set("images", JSON.stringify(event.images));

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
  });
  
    return this.http.post("http://localhost:5000/app/createEvent", body, {headers: headers, withCredentials: true});
  }*/

  create(event: Event): Observable<any> {
    const body = {
      title: event.title,
      date: event.date,
      defaultPrice: event.defaultPrice,
      organizer: event.organizer._id,
      location: event.location,
      images: event.images
    };
  
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });
  
    return this.http.post("http://localhost:5000/app/createEvent", body, { headers: headers, withCredentials: true });
  }

  update(id: string, event: Event): Observable<any> {
    const body = {
      title: event.title,
      date: event.date,
      defaultPrice: event.defaultPrice,
      location: event.location,
      images: event.images
    };
  
    const headers = new HttpHeaders({
      "Content-Type": "application/json"
    });

    return this.http.put("http://localhost:5000/app/updateEvent?id=" + id, body, {headers: headers, withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete("http://localhost:5000/app/deleteEvent?id=" + id, {withCredentials: true});
  }
}
