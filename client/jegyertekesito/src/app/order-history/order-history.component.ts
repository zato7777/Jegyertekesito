import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { OrderService } from '../shared/services/order.service';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Order } from '../shared/services/model/Order';
import { User } from '../shared/services/model/User';
import { CancelOrderDialogComponent } from '../cancel-order-dialog/cancel-order-dialog.component';

@Component({
  selector: 'app-order-history',
  imports: [CommonModule, MatTableModule, MatIconModule, MatDialogModule],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent {
  orders!: Order[];
  user!: User;
  columns = ["orderDate", "status", "event", "cancel"];

  constructor(private orderService: OrderService, private router: Router, private authService: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.authService.checkAdminAuth().subscribe(user => {
      if (this.isUser(user)) {
        this.user = user;
        this.orderService.getAllOrdersByUserId(this.user._id).subscribe({
          next: (data) => {
            this.orders = data;
            console.log(this.orders);
          }, error: (err) => {
            console.log(err);
          }
        });
      } else {
        this.openSnackBar("User not found!", 3000)
        this.router.navigate(['/events']);
      }
    });
  }

  cancelOrder(orderId: string, i: number) {
    const dialogRef = this.dialog.open(CancelOrderDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.orderService.cancelOrder(orderId).subscribe({
          next: () => {
            this.openSnackBar("Order cancelled successfully!", 3000);
            this.ngOnInit();
          },
          error: () => {
            this.openSnackBar("Failed to cancel order!", 3000);
          }
        });
      }
    });
  }

  isUser(obj: any): obj is User {
    return obj && typeof obj === 'object';
  }

  openSnackBar(message: string, duration: number) {
    this.snackBar.open(message, undefined, {duration: duration});
  }
}
