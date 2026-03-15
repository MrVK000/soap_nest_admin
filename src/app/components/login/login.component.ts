import { AuthService } from './../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ApiService } from '../../services/api.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule, ToggleSwitchModule, MatSlideToggleModule, MatTooltipModule, InputTextModule, PasswordModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private destroy$: Subject<void> = new Subject<void>();
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private api: ApiService, private authService: AuthService, private toast: ToastService) {
    this.loginForm = this.fb.group({
      credential: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.valid) {
      const loginFormPayload = {
        credential: (this.loginForm.value?.credential).trim(),
        password: (this.loginForm.value?.password).trim(),
      }

      this.api.loginAdmin(loginFormPayload).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        this.authService.setToken(res.token);
        this.toast.success(`Welcome back ${res?.user?.userName ? res.user.userName : ''}, logged in successful`);
        this.router.navigate(['/dashboard']);
      }, (error) => {
        if (error.error.message)
          this.toast.error(error?.error?.message);
        else if (error.error.error)
          this.toast.error(error?.error?.error);
      })
    }
    else {
      this.loginForm.markAllAsTouched();
    }
  }
}
