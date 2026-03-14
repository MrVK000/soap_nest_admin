import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { Review } from '../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';
import { CarouselModule } from 'primeng/carousel';
import { TagModule } from 'primeng/tag';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, CarouselModule, TagModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  private destroy$ = new Subject<void>();
  productId: string;
  product: any = null;
  reviews: Review[] = [];
  reviewsPage = 1;
  reviewsTotalPages = 1;
  reviewsLoading = false;
  baseUrl = environment.apiBaseUrl.replace('/api/v1/', '');

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private api: ApiService, public sharedService: SharedService) {
    if (!this.activatedRoute?.snapshot?.paramMap?.get('id')) this.router.navigate(['/products']);
    this.productId = this.activatedRoute?.snapshot?.paramMap?.get('id') as string;
  }

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {
    this.api.getProduct(this.productId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.product = res?.data;
      this.loadReviews();
    });
  }

  loadReviews() {
    if (this.reviewsLoading || this.reviewsPage > this.reviewsTotalPages) return;
    this.reviewsLoading = true;
    this.api.getReviewsByProduct(this.productId, this.reviewsPage).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.reviews = [...this.reviews, ...res.data];
      this.reviewsTotalPages = res.totalPages;
      this.reviewsPage++;
      this.reviewsLoading = false;
    }, () => { this.reviewsLoading = false; });
  }

  onReviewsScroll(event: Event) {
    const el = event.target as HTMLElement;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 10) {
      this.loadReviews();
    }
  }

  getImageUrl(path: string): string {
    return this.baseUrl + path;
  }

  openImage(path: string): void {
    window.open(this.getImageUrl(path), '_blank');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
