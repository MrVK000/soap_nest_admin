import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { Customer } from '../../interfaces/interfaces';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-customers',
  imports: [CommonModule, FormsModule, MatTooltip],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersComponent {
  private destroy$: Subject<void> = new Subject<void>();
  customers: Customer[] = [];
  searchTerm: string = '';

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private api: ApiService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Customers';
    this.listCustomers();
  }

  listCustomers() {
    this.api.listUsers().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.customers = res?.data;
      this.cdr.markForCheck();
    })
  }

  trackByCustomerId(_index: number, customer: Customer): string {
    return customer.customerId;
  }

  filteredCustomers() {
    return this.customers.filter(customer =>
      customer.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      customer.phone.includes(this.searchTerm)
    );
  }

  viewCustomer(customerId: any) {
    this.router.navigate(['/customer-details', customerId]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
