import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { Subject, takeUntil } from 'rxjs';
import { Order, UpdateOrderStatusPayload } from '../../interfaces/interfaces';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTooltipModule, TableModule, InputTextModule, SelectModule, ButtonModule, IconFieldModule, InputIconModule, DialogModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrdersComponent {
  private destroy$ = new Subject<void>();
  searchText: string = '';
  totalAmount: string = '';
  showDeleteConfirmModal: boolean = false;
  currentOrderId: number | null = null;
  statusList: string[] = [];
  selectedStatus: string = 'All';
  orders: Order[] = [];
  totalRecords: number = 0;
  rows: number = 10;
  loading: boolean = false;

  constructor(
    private router: Router,
    private sharedService: SharedService,
    private api: ApiService,
    private toast: ToastService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Orders';
    this.listOrders(1);
  }

  async listOrders(page: number = 1) {
    this.loading = true;
    this.api.listOrders(page, this.rows).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.orders = res?.data ?? [];
      this.totalRecords = res?.total ?? this.orders.length;
      this.totalAmount = this.orders.reduce((total, order) => total + order.totalAmount, 0).toFixed(2).toString();
      this.statusList = Array.from(new Set(this.orders.map(o => o.status)));
      this.statusList.unshift('All');
      this.loading = false;
      this.cdr.markForCheck();
    }, () => {
      this.loading = false;
      this.cdr.markForCheck();
    });
  }

  trackByOrderId(_index: number, order: Order): number {
    return order.id;
  }

  filteredOrders() {
    return this.orders.filter(order => {
      const matchesSearch = order.orderNumber.toLowerCase().includes(this.searchText.toLowerCase()) || order.customer?.name.toLowerCase().includes(this.searchText.toLowerCase());
      const matchesStatus = this.selectedStatus === 'All' || order.status === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  onPageChange(event: any) {
    this.rows = event.rows ?? this.rows;
    const page = Math.floor(event.first / this.rows) + 1;
    this.listOrders(page);
  }

  updateOrderStatus(orderId: number, newStatus: string) {
    const updateOrderPayload: UpdateOrderStatusPayload = {
      paymentStatus: "Completed",
      status: newStatus
    };
    this.api.upateOrder(updateOrderPayload, orderId).pipe(takeUntil(this.destroy$)).subscribe((_res) => {
      this.listOrders();
    })
  }

  viewOrderDetails(orderId: number) {
    this.router.navigate(['/order-details', orderId]);
  }

  deleteOrder(orderId: number) {
    this.currentOrderId = orderId;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal() {
    this.showDeleteConfirmModal = false;
    this.currentOrderId = null;
  }

  confirmDelete() {
    if (this.currentOrderId) {
      this.api.deleteOrder(this.currentOrderId).pipe(takeUntil(this.destroy$)).subscribe(async (res: any) => {
        this.toast.success(res?.message);
        await this.listOrders();
        this.closeDeleteConfirmModal();
      })
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
