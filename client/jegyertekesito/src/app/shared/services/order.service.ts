import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from './model/Order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Order[]>("http://localhost:5000/app/getAllOrders", {withCredentials: true});
  }

  getOne(id: String) {
    return this.http.get<Order>("http://localhost:5000/app/getOneOrder?id=" + id, {withCredentials: true});
  }

  getAllOrdersByUserId(userId: String) {
    return this.http.get<Order[]>(`http://localhost:5000/app/getAllOrdersByUserId/${userId}`, {withCredentials: true})
  }

  create(order: Order): Observable<any> {
    const body = new URLSearchParams();
    body.set("orderDate", String(order.orderDate));
    body.set("status", order.status);
    body.set("user", order.user._id);
    body.set("event", order.event._id);

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
  });
  
    return this.http.post("http://localhost:5000/app/createOrder", body, {headers: headers, withCredentials: true});
  }

  update(id: string, order: Order): Observable<any> {
    const body = new URLSearchParams();
    body.set("status", order.status);

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });

    return this.http.put("http://localhost:5000/app/updateOrder?id=" + id, body, {headers: headers, withCredentials: true});
  }

  cancelOrder(id: string) {
    const body = new URLSearchParams();
    body.set("status", "cancelled");

    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });

    return this.http.put("http://localhost:5000/app/cancelOrder?id=" + id, body, {headers: headers, withCredentials: true});
  }

  delete(id: string) {
    return this.http.delete("http://localhost:5000/app/deleteOrder?id=" + id, {withCredentials: true});
  }
}
