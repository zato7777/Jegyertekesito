import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Seat } from './model/Seat';

@Injectable({
  providedIn: 'root'
})
export class SeatService {

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Seat[]>("http://localhost:5000/app/getAllSeats", {withCredentials: true});
  }

  getSeatsByLocation(locationId: String) {
    return this.http.get<Seat[]>(`http://localhost:5000/app/getSeatsByLocation/${locationId}`, {withCredentials: true});
  }

  getOne(id: String) {
    return this.http.get<Seat>("http://localhost:5000/app/getOneSeat?id=" + id, {withCredentials: true});
  }

  create(seat: Seat): Observable<any> {
    const body = new URLSearchParams();
    body.set("row", String(seat.row));
    body.set("number", String(seat.number));
    body.set("category", seat.category);
    body.set("location", seat.location._id);

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
  });
  
    return this.http.post("http://localhost:5000/app/createSeat", body, {headers: headers, withCredentials: true});
  }

  update(id: string, seat: Seat): Observable<any> {
    const body = new URLSearchParams();
    body.set("row", String(seat.row));
    body.set("number", String(seat.number));
    body.set("category", seat.category);
    body.set("location", seat.location._id);

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });

    return this.http.put("http://localhost:5000/app/updateSeat?id=" + id, body, {headers: headers, withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete("http://localhost:5000/app/deleteSeat?id=" + id, {withCredentials: true});
  }

  generateSeats(locationId: string): Observable<any> {
    return this.http.post("http://localhost:5000/app/generateSeats", { locationId }, { withCredentials: true });
  }

  deleteAllSeats(locationId: string): Observable<any> {
    return this.http.delete("http://localhost:5000/app/deleteAllSeats?locationId=" + locationId, { withCredentials: true });
  }
}
