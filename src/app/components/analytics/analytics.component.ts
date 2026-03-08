import { ColorService } from './../../services/color.service';
import { Chart, ChartTypeRegistry } from 'chart.js/auto';
import { SharedService } from './../../services/shared.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { debounceTime, forkJoin, Subject, switchMap, takeUntil } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RevenueData } from '../../interfaces/interfaces';
import { MatTooltip } from '@angular/material/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-analytics',
  imports: [CommonModule, FormsModule, MatTooltip, DropdownModule, ButtonModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss',
})
export class AnalyticsComponent {
  private destroy$ = new Subject<void>();
  totalSales = 0;
  totalOrders = 0;
  chartTypes: string[] = ['bar', 'pie', 'radar', 'doughnut', 'polarArea'];
  selectedChartTypeForState: string = "bar";
  selectedChartTypeForDistrict: string = "bar";
  stateChart: Chart | undefined;
  stateWiseRevenueData: RevenueData = {};
  districtChart: Chart | undefined;
  districtWiseRevenueData: RevenueData = {};
  years: number[] = [];
  selectedYear: number = new Date().getFullYear();
  hasStateData: boolean = false;
  hasDistrictData: boolean = false;

  @ViewChild('stateChartCanvas') stateChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('districtChartCanvas') districtChartRef!: ElementRef<HTMLCanvasElement>;

  private refreshSubject = new Subject<void>();

  constructor(private sharedService: SharedService, private api: ApiService, private colorService: ColorService) {
    this.generateYears();
    this.refreshSubject.pipe(
      takeUntil(this.destroy$),
      debounceTime(500),
      switchMap(() => {
        return forkJoin({
          stateWiseRevenue: this.api.getStateWiseRevenue(this.selectedYear),
          districtWiseRevenue: this.api.getDistrictWiseRevenue(this.selectedYear),
          ordersCount: this.api.getOrdersCount(),
        })
      })
    ).subscribe(({ stateWiseRevenue, districtWiseRevenue, ordersCount }) => {
      this.stateWiseRevenueData = (stateWiseRevenue as any).data;
      this.districtWiseRevenueData = (districtWiseRevenue as any).data;
      this.totalOrders = (ordersCount as any).data;

      this.hasStateData = Object.keys(this.stateWiseRevenueData).length > 0;
      this.hasDistrictData = Object.keys(this.districtWiseRevenueData).length > 0;

      this.totalSales = Object.values(this.stateWiseRevenueData).reduce((sum, revenue) => sum + revenue, 0);
      if (this.totalSales <= 0) {
        this.totalSales = Object.values(this.districtWiseRevenueData).reduce((sum, revenue) => sum + revenue, 0);
      }

      setTimeout(() => {
        if (this.hasStateData) {
          this.loadStateWiseSalesChart(this.selectedChartTypeForState, this.stateWiseRevenueData);
        }
        if (this.hasDistrictData) {
          this.loadDistrictWiseSalesChart(this.selectedChartTypeForDistrict, this.districtWiseRevenueData);
        }
      }, 100);
    });
  }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Analytics';
    this.onYearChange();
  }

  generateYears() {
    const currentYear = new Date().getFullYear();
    const startYear = 2020;

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
    const ctx = this.stateChartRef?.nativeElement;
    if (!ctx) {
      console.error("Canvas context not found for state chart");
      return;
    }
    const months = Object.keys(stateWiseRevenueData).map(state => state.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
    const totalAmount = Object.values(stateWiseRevenueData);
    const backgroundColors = totalAmount.map(_ => this.colorService.getRandomColor());
    if (this.stateChart) {
      this.stateChart.destroy();
    }

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
    const ctx = this.districtChartRef?.nativeElement;
    if (!ctx) {
      console.error("Canvas context not found for district chart");
      return;
    }
    const months = Object.keys(districtWiseRevenueData).map(state => state.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
    const totalAmount = Object.values(districtWiseRevenueData);
    const backgroundColors = totalAmount.map(_ => this.colorService.getRandomColor());
    if (this.districtChart) {
      this.districtChart.destroy();
    }

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
