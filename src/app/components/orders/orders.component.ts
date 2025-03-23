import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  constructor(private router: Router, private sharedService: SharedService) { }

  searchText: string = '';

  orders = [
    { id: 'ORD123', customerName: 'Rahul Sharma', status: 'Pending', totalPrice: 1200 },
    { id: 'ORD124', customerName: 'Aisha Verma', status: 'Shipped', totalPrice: 850 },
    { id: 'ORD125', customerName: 'Karan Patel', status: 'Delivered', totalPrice: 1600 }
  ];

  ngOnInit(): void {
    this.sharedService.currentPage = 'Orders';
  }

  filteredOrders() {
    return this.orders.filter(order =>
      order.id.toLowerCase().includes(this.searchText.toLowerCase()) ||
      order.customerName.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  updateOrderStatus(orderId: string, newStatus: string) {
    console.log(`Order ${orderId} updated to ${newStatus}`);
    // Here, you'd make an API call to update the order status in the backend
  }

  viewOrderDetails(orderId: string) {
    console.log(`Navigating to Order Details for ${orderId}`);
    // Navigation logic to order details page
    this.router.navigate(['/order-details'], { state: { data: orderId } });
  }
}
