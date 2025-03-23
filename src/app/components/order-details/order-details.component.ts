import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {
  order: any;

  constructor(private route: ActivatedRoute, private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state && state['data']) {
      const orderId = state['data'];
      this.fetchOrderDetails(orderId as string);
    }
  }

  // ngOnInit() {
  //   const orderId = this.route.snapshot?.paramMap?.get('id');
  //   this.fetchOrderDetails(orderId as string);
  // }

  fetchOrderDetails(orderId: string) {
    // Replace this with an API call to fetch order details
    this.order = {
      id: orderId,
      date: '2025-03-22',
      status: 'Pending',
      customer: {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '9876543210',
        address: '123, Green Street, Delhi'
      },
      products: [
        { name: 'Neem Soap', quantity: 2, price: 329 },
        { name: 'Lemon Soap', quantity: 1, price: 549 }
      ],
      total: 878,
      deliveryCharge: 50,
      paymentMethod: 'Online Payment'
    };
  }

  updateOrderStatus(orderId: string, newStatus: string) {
    console.log(`Order ${orderId} updated to ${newStatus}`);
    // Here, you'd make an API call to update the order status in the backend
  }

  backToOrders() {
    // this.router.navigate(['/orders']);
    window.history.back();
  }
}
