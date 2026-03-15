import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-settings',
  imports: [FormsModule, ButtonModule, InputTextModule, ToggleSwitchModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.currentPage = 'Settings';
  }

  admin = { name: 'Admin', email: 'admin@example.com' };
  settings = { emailAlerts: true, whatsappAlerts: false };

  updateProfile() {
    alert('Profile updated successfully!');
  }

  updateNotifications() {
    alert('Notification settings updated!');
  }

  enable2FA() {
    alert('2FA enabled!');
  }
}
