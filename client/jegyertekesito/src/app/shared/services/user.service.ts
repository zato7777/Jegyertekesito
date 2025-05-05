import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './model/User';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<User[]>("http://localhost:5000/app/getAllUsers", {withCredentials: true});
  }

  getOne(id: String) {
    return this.http.get<User>("http://localhost:5000/app/getOneUser?id=" + id, {withCredentials: true});
  }

  update(id: string, user: User): Observable<any> {
    const body = new URLSearchParams();
    body.set("nickname", user.nickname);
    body.set("name", user.name);
    body.set("address", user.address);
    body.set("telephone", user.telephone);
    body.set("isAdmin", String(user.isAdmin));

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });

    return this.http.put("http://localhost:5000/app/updateUser?id=" + id, body, {headers: headers, withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete("http://localhost:5000/app/deleteUser?id=" + id, {withCredentials: true});
  }
}
