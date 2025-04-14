import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { SharedService } from '../../services/shared.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MenuModule, ButtonModule, MatMenuModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  // menuOpen = false;

  items = [
    {
      // label: 'Options',
      items: [
        {
          label: 'Profile',
          icon: 'pi pi-user'
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out'
        }
      ]
    }
  ];

  // toggleMenu() {
  //   this.menuOpen = !this.menuOpen;
  // }

  constructor(public sharedService: SharedService, private router: Router) { }

  logout() {
    localStorage.setItem("token", "false");
    this.router.navigate(['/login']);
  }
}
