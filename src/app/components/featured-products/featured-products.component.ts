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
import { MatSnackBar } from '@angular/material/snack-bar';
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

  constructor(private router: Router, private sharedService: SharedService, private api: ApiService, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Featured Products';
    this.listFeatureProducts();
  }

  async listFeatureProducts() {
    this.api.listFeaturedProducts().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.featuredProducts = res.data;
      this.filteredProducts = res.data;
    })
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


  viewProductDetails(productId: string) {
    this.router.navigate(['/product-details', productId]);
  }

  removeProduct(productId: string) {
    this.api.unfeatureProduct(productId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.snackBar.open(res?.message, 'Close', { duration: 3000 });
      this.listFeatureProducts();
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
