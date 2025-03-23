import { Component } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
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
