import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { Review } from '../../interfaces/interfaces';
import { CommonModule } from '@angular/common';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
  private destroy$ = new Subject<void>();
  productId: string;
  productKeys: string[] = [];
  productValues: string[] = [];
  reviews: Review[] = [];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private api: ApiService, public sharedService: SharedService) {
    if (!(this.activatedRoute?.snapshot?.paramMap?.get('id'))) this.router.navigate(['/products']);
    this.productId = (this.activatedRoute?.snapshot?.paramMap?.get('id')) as string;
  }

  ngOnInit(): void {
    this.getProduct();
  }

  getProduct() {
    this.api.getProduct(this.productId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      const { reviews: reviews, ...productWithOutResult } = res?.data;
      this.reviews = reviews;
      this.extractProductDetails(productWithOutResult);
    })
  }

  extractProductDetails(productWithOutResult: any) {
    this.productKeys = Object.keys(productWithOutResult);
    this.productValues = Object.values(productWithOutResult);
  }

  isValidDate(valueString: string): boolean {
    if (Number(valueString)) return false;
    const parsedDate = Date.parse(valueString);
    return !isNaN(parsedDate);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
