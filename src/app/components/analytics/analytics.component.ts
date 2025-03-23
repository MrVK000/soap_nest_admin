import Chart from 'chart.js/auto';
import { SharedService } from './../../services/shared.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics',
  imports: [],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.scss'
})
export class AnalyticsComponent {

  totalSales = 0;
  totalOrders = 0;
  salesData = [
    { district: 'Delhi', sales: 50000 },
    { district: 'Mumbai', sales: 42000 },
    { district: 'Bangalore', sales: 38000 },
    { district: 'Chennai', sales: 36000 }
  ];

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Analytics';
    this.calculateTotals();
  }

  ngAfterViewInit() {
    this.renderChart();
  }

  calculateTotals() {
    this.totalSales = this.salesData.reduce((sum, data) => sum + data.sales, 0);
    this.totalOrders = this.salesData.length * 10; // Example logic
  }

  renderChart() {
    new Chart('salesChart', {
      type: 'bar',
      data: {
        labels: this.salesData.map(data => data.district),
        datasets: [{
          label: 'Sales (₹)',
          data: this.salesData.map(data => data.sales),
          backgroundColor: ['#4CAF50', '#FF9800', '#2196F3', '#E91E63']
        }]
      }
    });
  }
}
