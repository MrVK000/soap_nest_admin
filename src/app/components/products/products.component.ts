import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, ReactiveFormsModule, MatMenuModule, MatIconModule, MatTooltipModule, TableModule, InputTextModule, IconFieldModule, InputIconModule, SelectModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private destroy$ = new Subject<void>();
  products: Product[] = [];
  selectedProducts: Product[] = [];
  selectedCategory: string = 'All';
  filteredProducts: Product[] = [];
  categories = [
    { name: 'All', value: 'All' },
    { name: 'Soap', value: 'Soap' },
    { name: 'Shampoo', value: 'Shampoo' }
  ];
  showProductModal = false;
  productForm: FormGroup;
  selectedFile: File | null = null;
  currentProductId: string | null = null;
  showDeleteConfirmModal = false;
  productIdToDelete: number | null = null;

  constructor(private router: Router, private sharedService: SharedService, private fb: FormBuilder, private api: ApiService, private snackBar: MatSnackBar) {
    this.productForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      category: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      discountPrice: [{ value: null, disabled: true }, [Validators.required, Validators.min(1)]],
      offer: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      stock: [null, [Validators.required, Validators.min(0)]],
      image: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Products';
    this.listProducts();
  }

  async listProducts() {
    this.api.listProducts().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.products = res.data;
      this.filteredProducts = res.data;
    })
  }

  onGlobalFilter(event: Event, table: any) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }

  onCategoryChange() {
    if (this.selectedCategory === 'All') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product => (product.category)?.toLowerCase() === this.selectedCategory?.toLowerCase());
    }
  }

  addToFeatures() {
    const productIds = this.selectedProducts.map(product => product.productId);
    this.api.bulkSaveFeatureProduct(productIds).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.snackBar.open(res?.message, 'Close', { duration: 3000 });
    })
  }

  removeFromFeatures() {
    const productIds = this.selectedProducts.map(product => product.productId);
    this.api.bulkSaveUnfeatureProduct(productIds).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.snackBar.open(res?.message, 'Close', { duration: 3000 });
    })
  }

  viewProductDetails(productId: string) {
    this.router.navigate(['/product-details', productId]);
  }

  editProduct(product: any) {
    this.currentProductId = product.productId;
    this.productForm.patchValue({
      name: product.name,
      category: product.category,
      price: product.price,
      offer: product.offer,
      image: product.image,
      discountPrice: product.discountPrice,
      stock: product.stock,
      description: product.description,
    });
    this.showProductModal = true;
  }

  deleteProduct(productId: string) {
    this.currentProductId = productId;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal() {
    this.showDeleteConfirmModal = false;
    this.currentProductId = null;
  }

  confirmDelete() {
    if (this.currentProductId) {
      this.api.deleteProduct(this.currentProductId).pipe(takeUntil(this.destroy$)).subscribe(async (res: any) => {
        this.snackBar.open(res?.message, 'Close', { duration: 3000 });
        await this.listProducts();
        this.closeDeleteConfirmModal();
      })
    }
  }

  closeEditProductModal() {
    this.showProductModal = false;
    this.productForm.reset();
    this.currentProductId = null;
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.productForm.patchValue({ image: file });
    }
  }

  openAddProductModal() {
    this.showProductModal = true;
  }

  closeAddProductModal() {
    this.currentProductId = null;
    this.showProductModal = false;
    this.productForm.reset();
  }

  saveProduct() {
    if (this.productForm.valid) {
      const productPayload = {
        productId: this.currentProductId,
        name: (this.productForm.value.name).trim(),
        category: (this.productForm.value.category).trim(),
        price: isNaN(this.productForm.value.price) ? parseInt((this.productForm.value.price).trim()) : (this.productForm.value.price),
        offer: isNaN(this.productForm.value.offer) ? parseInt((this.productForm.value.offer).trim()) : (this.productForm.value.offer),
        image: (this.productForm.value.image).trim(),
        stock: isNaN(this.productForm.value.stock) ? parseInt((this.productForm.value.stock).trim()) : (this.productForm.value.stock),
        description: (this.productForm.value.description).trim()
      }
      if (this.currentProductId) {
        this.api.updateProduct(productPayload, this.currentProductId).pipe(takeUntil(this.destroy$)).subscribe(async (res: any) => {
          this.snackBar.open(res?.message, 'Close', { duration: 5000 });
          await this.listProducts();
          this.closeEditProductModal();
        }, (error) => {
          this.snackBar.open(error?.error?.errors[0]?.msg, 'Close', { duration: 5000 });
        })
      } else {
        this.api.createProduct(productPayload).pipe(takeUntil(this.destroy$)).subscribe(async (res: any) => {
          this.snackBar.open(res?.message, 'Close', { duration: 5000 });
          await this.listProducts();
          this.closeEditProductModal();
        }, (error) => {
          this.snackBar.open(error?.error?.errors[0]?.msg, 'Close', { duration: 5000 });
        })
      }
    } else {
      this.productForm.markAllAsTouched();
      this.productForm.markAsDirty();
      this.snackBar.open(`Please fill out all fields correctly`, 'Close', { duration: 2000 });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
