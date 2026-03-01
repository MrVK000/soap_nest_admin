import { MatSnackBar } from '@angular/material/snack-bar';
import { Component } from '@angular/core';
import { Review } from '../../interfaces/interfaces';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, TableModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.scss'
})
export class ReviewsComponent {
  private destroy$ = new Subject<void>();
  reviews: Review[] = [];
  currentReviewId: number | null = null;
  showReviewDetailsModal: boolean = false;
  review: Review[] | null = null;
  selectedReview: Review[] = [];


  constructor(private api: ApiService, private router: Router, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    this.getReviews();
  }

  async getReviews() {
    this.api.listReviews().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.reviews = res?.data;
    })
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
