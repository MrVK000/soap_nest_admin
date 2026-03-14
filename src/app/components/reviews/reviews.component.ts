import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Component } from '@angular/core';
import { Review } from '../../interfaces/interfaces';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, TableModule, InputTextModule, IconFieldModule, InputIconModule, ButtonModule, MatTooltipModule],
  templateUrl: './reviews.component.html',
  standalone: true,
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent {
  private destroy$ = new Subject<void>();
  reviews: Review[] = [];
  currentReviewId: number | null = null;
  showReviewDetailsModal: boolean = false;
  review: Review[] | null = null;
  selectedReview: Review[] = [];
  totalRecords: number = 0;
  rows: number = 10;
  loading: boolean = false;

  constructor(private api: ApiService, private router: Router, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.getReviews(1);
  }

  getReviews(page: number = 1) {
    this.loading = true;
    this.api.listReviews(page, this.rows).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      const data = res?.data ?? [];
      this.reviews = data;
      this.totalRecords = res?.total ?? data.length;
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  viewReview(id: number) {
    this.api.getReview(id).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.review = [res?.data];
      this.showReviewDetailsModal = true;
    })
  }

  closeReviewDetails() {
    this.showReviewDetailsModal = false;
    this.review = null;
  }


  onGlobalFilter(event: Event, table: any) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }

  onPageChange(event: any) {
    this.rows = event.rows ?? this.rows;
    const page = Math.floor(event.first / this.rows) + 1;
    this.getReviews(page);
  }

  viewProduct(productId: string) {
    this.router.navigate(['/product-details', productId]);
  }

  viewReviewer(customerId: string | null) {
    if (customerId) {
      this.router.navigate(['/customer-details', customerId]);
    } else {
      this.snackbar.open(`It's a guest user`, '', { duration: 2000 });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
