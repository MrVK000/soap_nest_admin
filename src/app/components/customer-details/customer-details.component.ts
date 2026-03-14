import { SharedService } from './../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { Customer } from '../../interfaces/interfaces';
import { ButtonModule } from 'primeng/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-customer-details',
  imports: [CommonModule, ButtonModule, MatTooltip],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.scss'
})
export class CustomerDetailsComponent {
  private destroy$ = new Subject<void>();
  customer: Customer = {} as Customer;
  customerId: string;
  totalSpend: number = 0;
  orderStats = { pending: 0, shipped: 0, delivered: 0, cancelled: 0 };

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private api: ApiService, public sharedService: SharedService) {
    if (!(this.activatedRoute?.snapshot?.paramMap?.get('id'))) this.router.navigate(['/orders']);
    this.customerId = (this.activatedRoute?.snapshot?.paramMap?.get('id')) as string;
  }

  ngOnInit() {
    this.getCustomerDetails();
  }

  getCustomerDetails() {
    this.api.getUser(this.customerId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.customer = res?.data;
      const orders = this.customer?.orders ?? [];
      this.totalSpend = orders.reduce((sum, o) => sum + (o.totalAmount ?? 0), 0);
      this.orderStats = {
        pending: orders.filter(o => o.status === 'Pending').length,
        shipped: orders.filter(o => o.status === 'Shipped').length,
        delivered: orders.filter(o => o.status === 'Delivered').length,
        cancelled: orders.filter(o => o.status === 'Cancelled').length,
      };
    })
  }

  viewOrder(orderId: number) {
    this.router.navigate(['/order-details', orderId]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
