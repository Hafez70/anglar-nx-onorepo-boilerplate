import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslatePipe } from '@shared/ui';
import { LoginCredentials } from '../../models/authorization.model';
import { AuthorizationService } from '../../services/authorization.service';

@Component({
  selector: 'login-component',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  private fb = inject(FormBuilder);
  private authService = inject(AuthorizationService);
  private router = inject(Router);

  // Use signals for component state
  loginForm = signal<FormGroup>(this.initForm());
  isLoading = signal<boolean>(false);
  error = signal<string>('');
  isMobile = signal<boolean>(window.innerWidth < 768);

  constructor() {
    // Redirect if already logged in (using takeUntilDestroyed instead of Subject)
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }
    
    // Listen for window resize events to adjust UI for mobile
    window.addEventListener('resize', this.checkViewportSize.bind(this));
  }
  ngOnDestroy(): void {
    window.removeEventListener('resize', this.checkViewportSize.bind(this));
  }

  private checkViewportSize(): void {
    this.isMobile.set(window.innerWidth < 768);
  }

  private initForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    const form = this.loginForm();
    if (form.invalid) {
      // Touch all fields to trigger validation visuals
      Object.keys(form.controls).forEach(key => {
        const control = form.get(key);
        control?.markAsTouched();
      });
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    const credentials: LoginCredentials = form.value;
    
    this.authService.login(credentials)
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.isLoading.set(false);
          this.error.set(err.message || 'An error occurred during login. Please try again.');
        }
      });
  }
}