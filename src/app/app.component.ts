import { SharedService } from './services/shared.service';
import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { HeaderComponent } from "./components/header/header.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { LoadingService } from './services/loading.service';
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, LoaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'soapNestAdmin';
  showLayout = false;

  constructor(private router: Router, public sharedService: SharedService, private loadingService: LoadingService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loadingService.hide();
      }
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Add all the routes you want to exclude layout on
        const authRoutes = 'login';
        this.showLayout = !event.urlAfterRedirects.includes(authRoutes);
        // this.showLayout = !authRoutes.includes(event.urlAfterRedirects);
      });
  }

  ngOnInit(): void {
    document.documentElement.style.setProperty('--light-green', '#4CAF50');
    document.documentElement.style.setProperty('--red', '#ff0000');
    document.documentElement.style.setProperty('--black', '#000000');
    document.documentElement.style.setProperty('--grey', '#808080');
    document.documentElement.style.setProperty('--light-blue', '#34495e');
    document.documentElement.style.setProperty('--blue', '#2c3e50');
    document.documentElement.style.setProperty('--white', '#FFFFFF');
    document.documentElement.style.setProperty('--light-white', '#f8f8f8');
    document.documentElement.style.setProperty('--logo-white', '#fbfbfb');
  }

}
