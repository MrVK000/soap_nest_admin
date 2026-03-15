import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ApiService } from '../../services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../interfaces/interfaces';
import { ToastService } from '../../services/toast.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-featured-products',
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, ReactiveFormsModule, MatTooltipModule, TableModule, InputTextModule, IconFieldModule, InputIconModule, SelectModule],
  templateUrl: './featured-products.component.html',
  styleUrl: './featured-products.component.scss'
})
export class FeaturedProductsComponent {
  private destroy$ = new Subject<void>();
  searchText: string = '';
  selectedCategory: string = 'All';
  filteredProducts: Product[] = [];
  totalRecords: number = 0;
  rows: number = 10;
  loading: boolean = false;
  categories = [
    { name: 'All', value: 'All' },
    { name: 'Soap', value: 'Soap' },
    { name: 'Shampoo', value: 'Shampoo' }
  ];
  featuredProducts: Product[] = [];
  showProductModal = false;
  selectedFile: File | null = null;
  currentProductId: string | null = null;
  productIdToDelete: number | null = null;
  showRemoveConfirmModal = false;
  productIdToRemove: string | null = null;

  constructor(private router: Router, private sharedService: SharedService, private api: ApiService, private toast: ToastService) { }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Featured Products';
    this.listFeatureProducts(1);
  }

  async listFeatureProducts(page: number = 1) {
    this.loading = true;
    this.api.listFeaturedProducts(page, this.rows).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      const data = res?.data ?? [];
      this.featuredProducts = data;
      this.filteredProducts = data;
      this.totalRecords = res?.total ?? data.length;
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }


  onGlobalFilter(event: Event, table: any) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }

  onCategoryChange() {
    if (this.selectedCategory === 'All') {
      this.filteredProducts = this.featuredProducts;
    } else {
      this.filteredProducts = this.featuredProducts.filter(product => (product.category)?.toLowerCase() === this.selectedCategory?.toLowerCase());
    }
  }

  onPageChange(event: any) {
    this.rows = event.rows ?? this.rows;
    const page = Math.floor(event.first / this.rows) + 1;
    this.listFeatureProducts(page);
  }


  viewProductDetails(productId: string) {
    this.router.navigate(['/product-details', productId]);
  }

  openRemoveConfirmModal(productId: string) {
    this.productIdToRemove = productId;
    this.showRemoveConfirmModal = true;
  }

  confirmRemove() {
    if (!this.productIdToRemove) return;
    this.api.unfeatureProduct(this.productIdToRemove).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.toast.success(res?.message);
      this.showRemoveConfirmModal = false;
      this.productIdToRemove = null;
      this.listFeatureProducts();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
