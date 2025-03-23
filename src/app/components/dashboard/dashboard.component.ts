import { LoadingService } from './../../services/loading.service';
import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  constructor(private sharedService: SharedService, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Dashboard';
    this.loadChart();

    // this.loadingService.show();
    // setTimeout(() => {
    //   this.loadingService.hide();
    // }, 5000);
  }

  recentOrders = [
    { id: 'ORD123', customer: 'John Doe', total: 1500, status: 'Shipped' },
    { id: 'ORD124', customer: 'Jane Smith', total: 2000, status: 'Pending' },
    { id: 'ORD125', customer: 'Michael Brown', total: 1200, status: 'Delivered' }
  ];

  loadChart() {
    new Chart("salesChart", {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [{
          label: 'Sales (₹)',
          data: [12000, 19000, 13000, 20000, 15000],
          backgroundColor: '#2c3e50'
        }]
      }
    });
  }
}
