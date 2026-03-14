import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { SharedService } from '../../services/shared.service';
import { Order, UpdateOrderStatusPayload } from '../../interfaces/interfaces';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, FormsModule, ButtonModule, SelectModule, MatTooltip],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss'
})
export class OrderDetailsComponent {
  private destroy$ = new Subject<void>();
  order: Order = {} as Order;
  orderId: string;
  statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private api: ApiService, public sharedService: SharedService) {
    if (!(this.activatedRoute?.snapshot?.paramMap?.get('id'))) this.router.navigate(['/orders']);
    this.orderId = (this.activatedRoute?.snapshot?.paramMap?.get('id')) as string;
  }

  ngOnInit() {
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.api.getOrder(this.orderId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.order = res?.data;
    })
  }

  updateOrderStatus(orderId: number, newStatus: string) {
    const payload: UpdateOrderStatusPayload = {
      paymentStatus: "Completed",
      status: newStatus
    };
    this.api.upateOrder(payload, orderId).pipe(takeUntil(this.destroy$)).subscribe((_res) => {
      this.getOrderDetails();
    }, (_err) => {
      this.getOrderDetails();
    })
  }

  viewCustomer() {
    this.router.navigate(['/customer-details', this.order.customerId]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
