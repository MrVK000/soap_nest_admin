import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isAuthenticated: boolean = false;

  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
    localStorage.setItem("token", "false");
    this.loginForm = this.fb.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    console.log(">>>>> login >> ", this.loginForm.value);
    const userName = (this.loginForm.value?.userName).trim();
    const password = (this.loginForm.value?.password).trim();
    if (userName === "admin" && password === "admin123") {
      console.log(">>>>> successfull");
      localStorage.setItem("token", "true");
      this.router.navigate(['/dashboard']);
      this.isAuthenticated = false;
    }
    else {
      this.isAuthenticated = true;
      localStorage.setItem("token", "false");
      console.log(">>>>> failed");
      this.loginForm.markAllAsTouched();
      // this.loginForm.markAsDirty();
    }
  }
}
