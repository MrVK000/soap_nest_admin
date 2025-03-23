import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  searchText: string = '';
  selectedCategory: string = '';

  products = [
    { id: 1, name: 'Neem Soap', category: 'Soap', price: 329, offer: 10, inStock: true },
    { id: 2, name: 'Lemon Soap', category: 'Soap', price: 549, offer: 14, inStock: false },
    { id: 3, name: 'Aloe Vera Shampoo', category: 'Shampoo', price: 699, offer: 8, inStock: true }
  ];

  categories = ['Soap', 'Shampoo'];

  showProductModal = false;
  productForm: FormGroup;
  selectedFile: File | null = null;
  currentProductId: string | null = null;
  showDeleteConfirmModal = false;
  productIdToDelete: number | null = null;

  constructor(private sharedService: SharedService, private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      offer: [null, [Validators.min(0), Validators.max(100)]],
      inStock: [true],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Products';
  }

  filteredProducts() {
    return this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchText.toLowerCase()) &&
      (this.selectedCategory ? product.category === this.selectedCategory : true)
    );
  }

  editProduct(product: any) {
    console.log('Edit:', product);
    this.currentProductId = product.id;
    this.productForm.patchValue({
      name: product.name,
      category: product.category,
      price: product.price,
      offer: product.offer,
      inStock: product.inStock,
      image: product.image
    });
    this.showProductModal = true;
  }

  // deleteProduct(id: number) {
  //   this.products = this.products.filter(p => p.id !== id);
  // }

  deleteProduct(productId: number) {
    this.productIdToDelete = productId;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal() {
    this.showDeleteConfirmModal = false;
    this.productIdToDelete = null;
  }

  confirmDelete() {
    if (this.productIdToDelete) {
      this.products = this.products.filter(product => product.id !== this.productIdToDelete);
      console.log(`Product ${this.productIdToDelete} deleted.`);
      this.closeDeleteConfirmModal();
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

  updateProduct() {
    if (this.productForm.valid && this.currentProductId) {
      console.log("Updated Product Data:", {
        id: this.currentProductId,
        ...this.productForm.value
      });
      // Here, we will call the API to update the product later
      this.closeEditProductModal();
    }
  }


  openAddProductModal() {
    this.showProductModal = true;
  }

  closeAddProductModal() {
    this.showProductModal = false;
    this.productForm.reset();
  }

  saveProduct() {
    if (this.productForm.valid) {
      console.log("Product Data:", this.productForm.value);
      // Here, we will call the API to save the product later
      this.closeAddProductModal();
    }
  }
}
