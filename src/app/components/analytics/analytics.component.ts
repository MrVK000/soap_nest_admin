import { ColorService } from './../../services/color.service';
import { Chart, ChartTypeRegistry } from 'chart.js/auto';
import { SharedService } from './../../services/shared.service';
import { Component } from '@angular/core';
import { debounceTime, forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RevenueData } from '../../interfaces/interfaces';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule, FormsModule, MatTooltip],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent {
  private destroy$ = new Subject<void>();
  totalSales = 0;
  totalOrders = 0;
  // chartTypes: string[] = ['bar', 'pie', 'radar', 'doughnut', 'polarArea', 'bubble', 'scatter', 'mixed', 'line'];
  chartTypes: string[] = ['bar', 'pie', 'radar', 'doughnut', 'polarArea'];
  selectedChartTypeForState: string = "bar";
  selectedChartTypeForDistrict: string = "bar";
  stateChart: Chart | undefined;
  stateWiseRevenueData: RevenueData = {};
  districtChart: Chart | undefined;
  districtWiseRevenueData: RevenueData = {};

  private refreshSubject = new Subject<void>();

  constructor(private sharedService: SharedService, private api: ApiService, private colorService: ColorService) {
    this.refreshSubject.pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      switchMap(() => {
        return forkJoin({
          stateWiseRevenue: this.api.getStateWiseRevenue(),
          districtWiseRevenue: this.api.getDistrictWiseRevenue(),
          ordersCount: this.api.getOrdersCount(),
        })
      })
    ).subscribe(({ stateWiseRevenue, districtWiseRevenue, ordersCount }) => {
      this.stateWiseRevenueData = (stateWiseRevenue as any).data;
      this.loadStateWiseSalesChart(this.selectedChartTypeForState, this.stateWiseRevenueData);
      this.totalSales = Object.values(this.stateWiseRevenueData).reduce((sum, revenue) => sum + revenue, 0);

      this.districtWiseRevenueData = (districtWiseRevenue as any).data;
      this.loadDistrictWiseSalesChart(this.selectedChartTypeForDistrict, this.districtWiseRevenueData);
      if (this.totalSales <= 0) {
        this.totalSales = Object.values(this.districtWiseRevenueData).reduce((sum, revenue) => sum + revenue, 0);
      }

      this.totalOrders = (ordersCount as any).data;
    });
  }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Analytics';
    this.refreshData();
  }

  refreshData() {
    this.refreshSubject.next();
  }



  // ngAfterViewInit() {
  //   this.getStateWiseRevenue();
  //   this.getDistrictWiseRevenue();
  // }

  // getOrdersCount() {
  //   this.api.getOrdersCount().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
  //     this.totalOrders = res?.data;
  //   })
  // }

  // getStateWiseRevenue() {
  //   this.api.getStateWiseRevenue().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
  //     this.stateWiseRevenueData = res?.data;
  //     this.loadStateWiseSalesChart(this.selectedChartTypeForState, this.stateWiseRevenueData);
  //     this.totalSales = Object.values(this.stateWiseRevenueData).reduce((sum, revenue) => sum + revenue, 0);
  //   })
  // }

  loadStateWiseSalesChart(chartType: string, stateWiseRevenueData: RevenueData) {
    const months = Object.keys(stateWiseRevenueData).map(state => state.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
    const totalAmount = Object.values(stateWiseRevenueData);
    const backgroundColors = totalAmount.map(element => this.colorService.getRandomColor());
    if (this.stateChart) {
      this.stateChart.destroy();
    }

    const ctx = document.getElementById('stateWiseSalesChart') as HTMLCanvasElement;

    this.stateChart = new Chart(ctx, {
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
  }

  // getDistrictWiseRevenue() {
  //   this.api.getDistrictWiseRevenue().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
  //     this.districtWiseRevenueData = res?.data;
  //     this.loadDistrictWiseSalesChart(this.selectedChartTypeForDistrict, this.districtWiseRevenueData);
  //     this.totalSales = Object.values(this.districtWiseRevenueData).reduce((sum, revenue) => sum + revenue, 0);
  //   })
  // }

  loadDistrictWiseSalesChart(chartType: string, districtWiseRevenueData: RevenueData) {
    const months = Object.keys(districtWiseRevenueData).map(state => state.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
    const totalAmount = Object.values(districtWiseRevenueData);
    const backgroundColors = totalAmount.map(element => this.colorService.getRandomColor());
    if (this.districtChart) {
      this.districtChart.destroy();
    }

    const ctx = document.getElementById('districtWiseSalesChart') as HTMLCanvasElement;

    this.districtChart = new Chart(ctx, {
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
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
