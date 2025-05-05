import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from './model/Location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Location[]>("http://localhost:5000/app/getAllLocations");
  }

  getOne(id: String) {
    return this.http.get<Location>("http://localhost:5000/app/getOneLocation?id=" + id, {withCredentials: true});
  }

  create(location: Location): Observable<any> {
    const body = new URLSearchParams();
    body.set("name", location.name);
    body.set("address", location.address);
    body.set("rows", String(location.rows));
    body.set("columns", String(location.columns));

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
  });
  
    return this.http.post("http://localhost:5000/app/createLocation", body, {headers: headers, withCredentials: true});
  }

  update(id: string, location: Location): Observable<any> {
    const body = new URLSearchParams();
    body.set("name", location.name);
    body.set("address", location.address);
    body.set("rows", String(location.rows));
    body.set("columns", String(location.columns));

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });

    return this.http.put("http://localhost:5000/app/updateLocation?id=" + id, body, {headers: headers, withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete("http://localhost:5000/app/deleteLocation?id=" + id, {withCredentials: true});
  }
}
