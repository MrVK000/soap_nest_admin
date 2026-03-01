import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  currentPage: String = 'Dashboard';
  private destroy$ = new Subject<void>();
  isCollapsed = false;
  isLoginSuccessfull = false;
  showLayout: boolean = false;

  options = [
    {
      icon: "pi pi-home",
      title: "Dashboard",
      showBadge: false,
      value: null,
      route: "/dashboard"
    },
    {
      icon: "pi pi-box",
      title: "Products",
      showBadge: false,
      value: null,
      route: "/products"
    },
    {
      icon: "pi pi-objects-column",
      title: "Featured Products",
      showBadge: false,
      value: null,
      route: "/feature-products"
    },
    {
      icon: "pi pi-tags",
      title: "Coupons",
      showBadge: false,
      value: null,
      route: "/coupons"
    },
    {
      icon: "pi pi-shopping-bag",
      title: "Orders",
      showBadge: false,
      value: null,
      route: "/orders"
    },
    {
      icon: "pi pi-pencil",
      // icon: "pi pi-twitch",
      // icon: "pi pi-comments",
      // icon: "pi pi-sparkles",
      // icon: "pi pi-star",
      // icon: "pi pi-user-edit",
      title: "Product Reviews",
      showBadge: true,
      value: null,
      route: "/reviews"
    },
    {
      icon: "pi pi-users",
      title: "Customers",
      showBadge: false,
      value: null,
      route: "/customers"
    },
    {
      icon: "pi pi-comment",
      title: "Messages",
      showBadge: true,
      value: null,
      route: "/messages"
    },
    {
      icon: "pi pi-chart-bar",
      title: "Analytics",
      showBadge: false,
      value: null,
      route: "/analytics"
    },

  ];

  constructor(private location: Location, private api: ApiService) {
    setInterval(() => {
      if (this.showLayout) { this.geMessagesCount(); }
    }, 60000);
  }

  geMessagesCount() {
    this.api.geMessagesCount().pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.options.forEach((option) => {
        if (option.title === 'Messages') {
          option.value = res?.data;
        }
      })
    })
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
