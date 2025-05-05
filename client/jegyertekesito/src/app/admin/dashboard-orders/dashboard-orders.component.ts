import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Order } from '../../shared/services/model/Order';
import { OrderService } from '../../shared/services/order.service';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateOrderDialogComponent } from '../../shared/components/update-order-dialog/update-order-dialog.component';
import { DeleteOrderDialogComponent } from '../../shared/components/delete-order-dialog/delete-order-dialog.component';
import { Seat } from '../../shared/services/model/Seat';

@Component({
  selector: 'app-dashboard-orders',
  imports: [CommonModule, MatTableModule, MatIconModule, MatDialogModule],
  templateUrl: './dashboard-orders.component.html',
  styleUrl: './dashboard-orders.component.scss'
})
export class DashboardOrdersComponent {
  orders!: Order[];
  columns = ["orderDate", "status", "user", "event", "edit", "delete"];

  constructor(private orderService: OrderService, private router: Router, private authService: AuthService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.orderService.getAll().subscribe({
      next: (data) => {
        this.orders = data;
      }, error: (err) => {
        console.log(err);
      }
    });
  }

  updateOrder(id: string, n: number) {
      const order = this.orders[n];
      const dialogRef = this.dialog.open(UpdateOrderDialogComponent, {
        width: '400px',
        data: { ...order },
      });
  
      dialogRef.afterClosed().subscribe({
        next: (data) => {
          if (data) {
            console.log(data);
            this.orderService.update(id, data).subscribe({
              next: (updatedOrder) => {
                console.log(updatedOrder);
                this.orders[n] = updatedOrder;
                this.ngOnInit();
                this.openSnackBar("Order updated successfully!", 3000);
              }, error: () => {
                this.snackBar.open('Failed to update order.', 'Close', { duration: 3000 });
              }
            });
          }
        }, error: (err) => {
          console.log(err);
        }
      });
    }
    
    deleteOrder(id: string, n: number) {
      const dialogRef = this.dialog.open(DeleteOrderDialogComponent);
  
      dialogRef.afterClosed().subscribe({
        next: (data) => {
          if (data) {
            console.log(data);
            this.orderService.delete(id).subscribe({
              next: (data) => {
                console.log(data);
                this.orders?.splice(n, 1);
                this.orders = [...this.orders];
                this.openSnackBar("Order deleted successfully!", 3000)
              }, error: (err) => {
                console.log(err);
                this.snackBar.open('Failed to delete order.', 'Close', { duration: 3000 });
              }
            });
          }
        }, error: (err) => {
          console.log(err);
        }
      })
    }
  
    openSnackBar(message: string, duration: number) {
      this.snackBar.open(message, undefined, {duration: duration});
    }
}
