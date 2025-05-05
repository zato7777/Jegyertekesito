import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  loginStatusChanged = new Subject<void>();
  
  constructor() {}

  emitLoginStatusChange() {
    this.loginStatusChanged.next();
  }
}
