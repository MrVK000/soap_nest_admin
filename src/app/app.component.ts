import { Component } from '@angular/core';
import { Router, NavigationEnd, NavigationCancel, NavigationError, NavigationStart, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { HeaderComponent } from "./components/header/header.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { FooterComponent } from './components/footer/footer.component';
import { LoadingService } from './services/loading.service';
import { SharedService } from './services/shared.service';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, LoaderComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'soapNestAdmin';

  constructor(private router: Router, public sharedService: SharedService) {
    // Determine whether to show the layout (hide for login)
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const authRoutes = 'login';
        this.sharedService.showLayout = !event.urlAfterRedirects.includes(authRoutes);
      });
  }
}
