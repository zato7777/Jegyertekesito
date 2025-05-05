import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './model/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    const body = new URLSearchParams();
    body.set("username", email);
    body.set("password", password);

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });

    return this.http.post("http://localhost:5000/app/login", body, {headers: headers, withCredentials: true});
  }

  register(user: User) {
    const body = new URLSearchParams();
    body.set("nickname", user.nickname);
    body.set("email", user.email);
    body.set("password", user.password);
    body.set("name", user.name);
    body.set("address", user.address);
    body.set("telephone", user.telephone);
    body.set("isAdmin", String(user.isAdmin));

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
  });
  
    return this.http.post("http://localhost:5000/app/register", body, {headers: headers});
  }

  logout() {
    return this.http.post("http://localhost:5000/app/logout", {}, {withCredentials: true, responseType: "text"});
  }

  checkAuth() {
    return this.http.get<boolean>("http://localhost:5000/app/checkAuth", {withCredentials: true});
  }

  checkAdminAuth() {
    return this.http.get<any>("http://localhost:5000/app/checkAdminAuth", { withCredentials: true });
  }
}