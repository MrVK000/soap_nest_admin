import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Coupon } from '../../interfaces/interfaces';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedService } from '../../services/shared.service';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TableModule } from 'primeng/table';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@Component({
  selector: 'app-coupons',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule, ToggleSwitchModule, DatePickerModule, TableModule, ButtonModule, SelectModule, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: './coupons.component.html',
  standalone: true,
  styleUrl: './coupons.component.scss'
})
export class CouponsComponent {
  private destroy$ = new Subject<void>();
  searchText: string = '';
  selectedCategory: string = '';
  selectedCouponCodeSize = 10;
  couponCodeSizeOptions = [6, 7, 8, 9, 10, 11, 12];
  couponCodeSizeOptionsList = this.couponCodeSizeOptions.map(s => ({ label: s.toString(), value: s }));
  coupons: Coupon[] = [];
  categories = ['Soap', 'Shampoo'];
  categoriesForFilter = [
    { name: 'All Categories', value: '' },
    { name: 'Soap', value: 'Soap' },
    { name: 'Shampoo', value: 'Shampoo' }
  ];
  showCouponModal = false;
  couponForm!: FormGroup;
  currentCouponId: number | null = null;
  showDeleteConfirmModal = false;
  couponIdToDelete: number | null = null;
  minDate: Date = new Date();
  totalRecords: number = 0;
  rows: number = 10;
  loading: boolean = false;
  today: Date = new Date();

  constructor(private sharedService: SharedService, private fb: FormBuilder, private api: ApiService, private toast: ToastService, private datePipe: DatePipe) {
    this.generateNewForm();
  }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Coupons';
    this.listCoupons(1);
  }

  generateNewForm() {
    this.couponForm = this.fb.group({
      code: [null, [Validators.required, Validators.minLength(this.selectedCouponCodeSize), Validators.maxLength(this.selectedCouponCodeSize)]],
      active: [true, Validators.required],
      validTo: [null, Validators.required],
      category: ['Soap', Validators.required],
      discountPercentage: [0, Validators.required],
      allowedToUse: [1, [Validators.required, Validators.min(1)]]
    });
  }

  async listCoupons(page: number = 1) {
    this.loading = true;
    this.api.listCoupons(page, this.rows).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      const data = res.data ?? [];
      this.coupons = data;
      this.totalRecords = res?.total ?? data.length;
      this.loading = false;
    }, () => {
      this.loading = false;
    });
  }

  filteredCoupons(): Coupon[] {
    return this.coupons.filter(coupon => coupon.code.toLowerCase().includes(this.searchText.toLowerCase()) && (this.selectedCategory ? coupon.category === this.selectedCategory : true));
  }

  onPageChange(event: any) {
    this.rows = event.rows ?? this.rows;
    const page = Math.floor(event.first / this.rows) + 1;
    this.listCoupons(page);
  }

  editCoupon(coupon: Coupon) {
    this.currentCouponId = coupon.id;
    this.couponForm.patchValue({
      code: coupon.code,
      active: coupon.active,
      validTo: coupon.validTo,
      category: coupon.category,
      allowedToUse: coupon.allowedToUse,
    });
    this.showCouponModal = true;
  }

  deleteCoupon(id: number) {
    this.currentCouponId = id;
    this.showDeleteConfirmModal = true;
  }

  closeDeleteConfirmModal() {
    this.showDeleteConfirmModal = false;
    this.currentCouponId = null;
  }

  confirmDelete() {
    if (this.currentCouponId) {
      this.api.deleteCoupon(this.currentCouponId).pipe(takeUntil(this.destroy$)).subscribe(async (res: any) => {
        this.toast.success(res?.message);
        await this.listCoupons();
        this.closeDeleteConfirmModal();
      })
    }
  }

  closeEditCouponModal() {
    this.showCouponModal = false;
    this.currentCouponId = null;
    this.couponForm.reset({ allowedToUse: 1, active: true, category: "Soap", discountPercent: 0 });
  }

  openAddCouponModal() {
    this.generateCouponCode();
    this.showCouponModal = true;
  }

  closeAddCouponModal() {
    this.showCouponModal = false;
    this.currentCouponId = null;
    this.couponForm.reset({ allowedToUse: 1, active: true, category: "Soap", discountPercent: 0 });
  }

  generateCouponCode(): void {
    // const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";
    let couponCode = "";
    for (let i = 0; i < this.selectedCouponCodeSize; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      couponCode += characters[randomIndex];
    }
    this.couponForm.get('code')?.setValue(couponCode);
  }

  get getCouponCodeStatus(): string {
    const activeControl = this.couponForm.get('active');
    return activeControl?.value ? "Coupon code is active" : "Coupon code is inactive"
  }

  copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.toast.info('Coupon code copied to clipboard');
    })
  }

  saveCoupon() {
    if (this.couponForm.valid) {
      const couponPayload = {
        code: (this.couponForm.value.code)?.trim(),
        category: (this.couponForm.value.category)?.trim(),
        discountPercentage: (this.couponForm.value.discountPercentage)?.trim(),
        active: this.couponForm.value.active,
        validTo: this.datePipe.transform(this.couponForm.value.validTo, 'yyyy-MM-dd'),
        allowedToUse: isNaN(this.couponForm.value.allowedToUse) ? 1 : parseInt(typeof (this.couponForm.value.allowedToUse) === 'string' ? (this.couponForm.value.allowedToUse).trim() : this.couponForm.value.allowedToUse),
      }
      if (this.currentCouponId) {
        this.api.updateCoupon(couponPayload, this.currentCouponId).pipe(takeUntil(this.destroy$)).subscribe(async (response: { message?: string }) => {
          this.toast.success(response?.message ?? 'Saved');
          await this.listCoupons();
          this.closeEditCouponModal();
        }, (err: { error?: { errors?: { msg?: string }[] } }) => {
          this.toast.error(err?.error?.errors?.[0]?.msg ?? 'Error');
        })
      } else {
        this.api.createCoupon(couponPayload).pipe(takeUntil(this.destroy$)).subscribe(async (response: { message?: string }) => {
          this.toast.success(response?.message ?? 'Saved');
          await this.listCoupons();
          this.closeEditCouponModal();
        }, (err: { error?: { errors?: { msg?: string }[] } }) => {
          this.toast.error(err?.error?.errors?.[0]?.msg ?? 'Error');
        })
      }
    } else {
      this.couponForm.markAllAsTouched();
      this.couponForm.markAsDirty();
      this.toast.error('Please fill out all fields correctly');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

