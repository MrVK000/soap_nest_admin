import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { Customer } from '../../interfaces/interfaces';
import { MatTooltip } from '@angular/material/tooltip';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTooltip, TableModule],
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersComponent {
  private destroy$: Subject<void> = new Subject<void>();
  customers: Customer[] = [];
  searchTerm: string = '';
  totalRecords: number = 0;
  rows: number = 10;
  loading: boolean = false;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private api: ApiService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Customers';
    this.listCustomers(1);
  }

  listCustomers(page: number = 1) {
    this.loading = true;
    this.api.listUsers(page, this.rows).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.customers = res?.data ?? [];
      this.totalRecords = res?.total ?? this.customers.length;
      this.loading = false;
      this.cdr.markForCheck();
    }, () => {
      this.loading = false;
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

  onPageChange(event: any) {
    this.rows = event.rows ?? this.rows;
    const page = event.rows ? event.first / event.rows + 1 : 1;
    this.listCustomers(page);
  }

  viewCustomer(customerId: any) {
    this.router.navigate(['/customer-details', customerId]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
