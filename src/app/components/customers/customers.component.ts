import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, FormsModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss'
})
export class CustomersComponent {
  customers: any[] = [];
  searchTerm: string = '';

  constructor(private router: Router, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Customers';
    this.fetchCustomers();
  }


  fetchCustomers() {
    // Replace this with an API call to fetch customers
    this.customers = [
      { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', phone: '9876543210', address: 'Delhi', blocked: false },
      { id: 2, name: 'Priya Singh', email: 'priya@example.com', phone: '8765432109', address: 'Mumbai', blocked: false },
      { id: 3, name: 'Amit Verma', email: 'amit@example.com', phone: '7654321098', address: 'Kolkata', blocked: true },
    ];
  }

  filteredCustomers() {
    return this.customers.filter(customer =>
      customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      customer.phone.includes(this.searchTerm)
    );
  }

  viewCustomer(customerId: any) {
    console.log('View Customer:', customerId);
    // Navigate to a detailed customer page if needed
    this.router.navigate(['/customer-details'], { state: { data: customerId } });
  }

  blockCustomer(customer: any) {
    customer.blocked = true;
    console.log(`Customer ${customer.name} has been blocked.`);
    // Call an API to update customer status in the backend
  }
}
