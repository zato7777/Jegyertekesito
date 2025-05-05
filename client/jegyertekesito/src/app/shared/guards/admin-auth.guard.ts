import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';


export const adminAuthGuard: CanActivateFn = (route, state) => {
  const r = inject(Router);
  
  return inject(AuthService).checkAdminAuth().pipe(map((user: any) => {
    if (user && user.isAdmin) {
      return true;
    } else {
      r.navigateByUrl("/events");
      return false;
    }
  }), catchError(error => {
    console.error("Admin guard error:", error);
    r.navigateByUrl("/events");
    return of(false);
  }))
};
