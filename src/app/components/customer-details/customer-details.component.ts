import { SharedService } from './../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { Customer } from '../../interfaces/interfaces';

@Component({
  selector: 'app-customer-details',
  imports: [CommonModule],
  templateUrl: './customer-details.component.html',
  styleUrl: './customer-details.component.scss'
})
export class CustomerDetailsComponent {
  private destroy$ = new Subject<void>();
  customer: Customer = {} as Customer;
  customerId: string;

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
