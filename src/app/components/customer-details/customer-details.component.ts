import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-details',
  imports: [CommonModule],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.scss'
})
export class CustomerDetailsComponent {
  customer: any;
  customerOrders: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {
    const state = this.router.getCurrentNavigation()?.extras.state;
    if (state && state['data']) {
      const orderId = state['data'];
      this.fetchCustomerDetails(orderId as string);
    }
  }

  // ngOnInit() {
  //   const customerId = this.route.snapshot.paramMap.get('id');
  //   this.fetchCustomerDetails(customerId);
  // }

  fetchCustomerDetails(customerId: string | null) {
    // Replace this with an API call to fetch customer details
    this.customer = {
      name: 'Rahul Sharma',
      email: 'rahul@example.com',
      phone: '9876543210',
      address: 'Delhi'
    };

    // Replace this with an API call to fetch order history
    this.customerOrders = [
      { orderId: 'ORD123', date: '2025-03-15', totalAmount: 1200, status: 'Shipped' },
      { orderId: 'ORD124', date: '2025-03-18', totalAmount: 750, status: 'Delivered' },
      { orderId: 'ORD125', date: '2025-03-20', totalAmount: 499, status: 'Pending' }
    ];
  }

  viewOrder(orderId: string) {
    this.router.navigate(['/order-details'], { state: { data: orderId } });
  }
}
