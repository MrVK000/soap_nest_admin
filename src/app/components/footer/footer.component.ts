import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  copyrightText: string = `Copyright© ${new Date().getFullYear()} Green Glow - All Rights Reserved.`;
}
