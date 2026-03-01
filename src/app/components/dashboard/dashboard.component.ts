import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Chart, ChartTypeRegistry } from 'chart.js/auto';
import { ApiService } from '../../services/api.service';
import { debounceTime, forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
import { Order, RevenueData } from '../../interfaces/interfaces';
import { FormsModule } from '@angular/forms';
import { ColorService } from '../../services/color.service';
import { MatTooltip } from '@angular/material/tooltip';
import { LoadingService } from '../../services/loading.service';
import { DropdownModule } from 'primeng/dropdown';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, MatTooltip, DropdownModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private destroy$ = new Subject<void>();
  orders: Order[] = [];
  totalAmount: string = '0';
  totalCustomers: number = 0;
  // chartTypes: string[] = ['bar', 'pie', 'radar', 'doughnut', 'polarArea', 'bubble', 'scatter', 'mixed', 'line'];
  chartTypes: string[] = ['bar', 'pie', 'radar', 'doughnut', 'polarArea'];
  selectedChartType: string = "bar";
  chart: Chart | undefined;
  monthlyRevenueData: RevenueData = {};
  isRevenueDataAvailable: boolean = false;
  years: number[] = [];
  selectedYear: number = new Date().getFullYear();

  private refreshSubject = new Subject<void>();

  @ViewChild('salesChart') salesChartRef!: ElementRef<HTMLCanvasElement>;

  constructor(
    private sharedService: SharedService,
    private api: ApiService,
    private colorService: ColorService,
    private loader: LoadingService,
    private cdr: ChangeDetectorRef,
  ) {
    this.generateYears();
    this.refreshSubject.pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      switchMap(() => {
        return forkJoin({
          revenue: this.api.getMonthlyRevenue(this.selectedYear),
          orders: this.api.listOrders(),
          usersCount: this.api.getUsersCount(),
        })
      })
    ).subscribe(({ revenue, orders, usersCount }) => {
      this.monthlyRevenueData = (revenue as any).data;
      this.isRevenueDataAvailable = Object.keys(this.monthlyRevenueData).length !== 0;
      if (this.isRevenueDataAvailable) {
        setTimeout(() => this.loadChart(this.selectedChartType), 100);
      }

      this.orders = (orders as any).data;
      this.totalAmount = this.orders.reduce((total, order) => total + order.totalAmount, 0).toFixed(2).toString();

      this.totalCustomers = (usersCount as any).data;
      this.cdr.markForCheck();
    });
  }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Dashboard';
    this.onYearChange();
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    const startYear = 2020; // change if needed

    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
  }

  onYearChange() {
    this.refreshData();
  }

  refreshData() {
    this.refreshSubject.next();
  }


  trackByOrderId(_index: number, order: Order): number {
    return order.id;
  }

  loadChart(chartType: string) {
    this.loader.show();
    const months = Object.keys(this.monthlyRevenueData).map(state => state.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
    const totalAmount = Object.values(this.monthlyRevenueData);
    const backgroundColors = totalAmount.map(_ => this.colorService.getRandomColor());

    const ctx = this.salesChartRef?.nativeElement;

    if (!ctx) {
      console.error("Canvas context not found for : salesChart");
      this.loader.hide();
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(ctx, {
      type: chartType as keyof ChartTypeRegistry,
      data: {
        labels: months,
        datasets: [{
          label: 'Sales (₹)',
          data: totalAmount,
          backgroundColor: backgroundColors
        }]
      },
      options: {
        responsive: true,
      }
    });
    this.loader.hide();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
