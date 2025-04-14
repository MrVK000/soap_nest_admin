import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  currentPage: String = 'Dashboard';
  isCollapsed = false;
  isLoginSuccessfull = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const adminCredendtials = {
      userName: "admin",
      password: "admin123"
    }

    localStorage.setItem("token", "false");
    localStorage.setItem("loginCredentials", JSON.stringify(adminCredendtials));
    console.log(">>>>> from shared");

    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // this.router.navigate(['/dashboard']);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
