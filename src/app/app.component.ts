import { Component } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { HeaderComponent } from "./components/header/header.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'soapNestAdmin';

  constructor(private router: Router, private loadingService: LoadingService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.loadingService.show();
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.loadingService.hide();
      }
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
    document.documentElement.style.setProperty('--light-white', '#FAFAF5');
  }

}
