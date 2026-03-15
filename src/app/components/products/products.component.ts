import { Router } from '@angular/router';
import { Component, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { TextareaModule } from 'primeng/textarea';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, ReactiveFormsModule, MatTooltipModule, TableModule, InputTextModule, IconFieldModule, InputIconModule, SelectModule, TextareaModule, FileUploadModule, MenuModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private destroy$ = new Subject<void>();
  bulkMenuItems: MenuItem[] = [
    { label: 'Add to Featured', icon: 'pi pi-star', command: () => this.addToFeatures() },
    { label: 'Remove from Featured', icon: 'pi pi-star-fill', command: () => this.openRemoveConfirmModal() }
  ];
  showRemoveConfirmModal = false;
  products: Product[] = [];
  selectedProducts: Product[] = [];
  selectedCategory: string = 'all';
  filteredProducts: Product[] = [];
  totalRecords: number = 0;
  rows: number = 10;
  loading: boolean = false;
  categories = [
    { name: 'Soap', value: 'soap' },
    { name: 'Shampoo', value: 'shampoo' }
  ];
  categoriesForDisplay = [
    { name: 'All', value: 'all' },
    { name: 'Soap', value: 'soap' },
    { name: 'Shampoo', value: 'shampoo' }
  ];
  baseUrl = 'http://localhost:5000';
  showProductModal = false;
  productForm: FormGroup;
  formSubmitted = false;
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  selectedFiles: File[] = [];
  existingImages: string[] = [];
  currentProductId: string | null = null;
  showDeleteConfirmModal = false;

  constructor(private router: Router, private sharedService: SharedService, private fb: FormBuilder, private api: ApiService, private toast: ToastService) {
    this.productForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      category: [null, Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      offer: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      stock: [null, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Products';
    this.listProducts(1);
  }

  async listProducts(page: number = 1) {
    this.loading = true;
    this.api.listProducts(page, this.rows).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      const data = res?.data ?? [];
      this.products = data;
      this.filteredProducts = data;
      this.totalRecords = res?.total ?? data.length;
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  onNumericKeydown(event: KeyboardEvent) {
    const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    if (!allowed.includes(event.key) && !/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onGlobalFilter(event: Event, table: any) {
    const input = event.target as HTMLInputElement;
    table.filterGlobal(input.value, 'contains');
  }

  onCategoryChange() {
    if (this.selectedCategory?.toLowerCase() === 'all') {
      this.filteredProducts = this.products;
    } else {
      this.filteredProducts = this.products.filter(product => product.category?.toLowerCase() === this.selectedCategory?.toLowerCase());
    }
  }

  onPageChange(event: any) {
    this.rows = event.rows ?? this.rows;
    const page = Math.floor(event.first / this.rows) + 1;
    this.listProducts(page);
  }

  addToFeatures() {
    const productIds = this.selectedProducts.map(product => product.productId);
    this.api.bulkSaveFeatureProduct(productIds).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.toast.success(res?.message);
    });
  }

  removeFromFeatures() {
    const productIds = this.selectedProducts.map(product => product.productId);
    this.api.bulkSaveUnfeatureProduct(productIds).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.toast.success(res?.message);
    });
  }

  openRemoveConfirmModal() {
    setTimeout(() => this.showRemoveConfirmModal = true);
  }

  confirmRemoveFromFeatures() {
    this.showRemoveConfirmModal = false;
    this.removeFromFeatures();
  }

  viewProductDetails(productId: string) {
    this.router.navigate(['/product-details', productId]);
  }

  editProduct(product: any) {
    this.currentProductId = product.productId;
    this.existingImages = product.images ?? [];
    this.productForm.patchValue({
      name: product.name,
      category: product.category,
      price: product.price,
      offer: product.offer,
      stock: product.stock,
      description: product.description,
    });
    this.showProductModal = true;
  }

  deleteProduct(productId: string) {
    this.currentProductId = productId;
    this.showDeleteConfirmModal = true;
  }

  removeExistingImage(index: number) {
    this.existingImages = this.existingImages.filter((_, i) => i !== index);
  }

  closeDeleteConfirmModal() {
    this.showDeleteConfirmModal = false;
    this.currentProductId = null;
  }

  confirmDelete() {
    if (this.currentProductId) {
      this.api.deleteProduct(this.currentProductId).pipe(takeUntil(this.destroy$)).subscribe(async (res: any) => {
        this.toast.success(res?.message);
        await this.listProducts();
        this.closeDeleteConfirmModal();
      });
    }
  }

  closeEditProductModal() {
    this.showProductModal = false;
    this.productForm.reset();
    this.selectedFiles = [];
    this.existingImages = [];
    this.fileUpload?.clear();
    this.formSubmitted = false;
    this.currentProductId = null;
  }

  onFileSelect(event: any) {
    this.selectedFiles = Array.from(event.files);
  }

  openAddProductModal() {
    this.showProductModal = true;
  }

  closeAddProductModal() {
    this.currentProductId = null;
    this.showProductModal = false;
    this.productForm.reset();
    this.selectedFiles = [];
    this.existingImages = [];
    this.fileUpload?.clear();
    this.formSubmitted = false;
  }

  saveProduct() {
    if (this.productForm.valid) {
      if (!this.currentProductId && this.selectedFiles.length === 0) {
        this.formSubmitted = true;
        this.toast.error('Please select at least one product image');
        return;
      }
      const formData = new FormData();
      formData.append('name', this.productForm.value.name.trim());
      formData.append('category', this.productForm.value.category.trim());
      formData.append('description', this.productForm.value.description.trim());
      formData.append('price', this.productForm.value.price);
      formData.append('offer', this.productForm.value.offer);
      formData.append('stock', this.productForm.value.stock);
      formData.append('existingImages', JSON.stringify(this.existingImages));
      this.selectedFiles.forEach(file => formData.append('images', file));

      if (this.currentProductId) {
        this.api.updateProduct(formData, this.currentProductId).pipe(takeUntil(this.destroy$)).subscribe(async (res: { message?: string }) => {
          this.toast.success(res?.message ?? 'Saved');
          await this.listProducts();
          this.closeEditProductModal();
        }, (error: { error?: { errors?: { msg?: string }[] } }) => {
          this.toast.error(error?.error?.errors?.[0]?.msg ?? 'Error');
        });
      } else {
        this.api.createProduct(formData).pipe(takeUntil(this.destroy$)).subscribe(async (res: { message?: string }) => {
          this.toast.success(res?.message ?? 'Saved');
          await this.listProducts();
          this.closeEditProductModal();
        }, (error: { error?: { errors?: { msg?: string }[] } }) => {
          this.toast.error(error?.error?.errors?.[0]?.msg ?? 'Error');
        });
      }
    } else {
      this.productForm.markAllAsTouched();
      this.productForm.markAsDirty();
      this.formSubmitted = true;
      this.toast.error('Please fill out all fields correctly');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
