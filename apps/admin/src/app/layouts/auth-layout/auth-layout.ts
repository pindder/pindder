import { Component, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterModule],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {
  isDarkMode = signal<boolean>(true);
  authMode = signal<'login' | 'register'>('login');
  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  // Form Fields
  loginEmail = '';
  loginPassword = '';
  rememberMe = false;

  regFullName = '';
  regEmail = '';
  regPassword = '';
  agreeTerms = false;

  toggleTheme() {
    this.isDarkMode.update((val) => !val);
  }

  setAuthMode(mode: 'login' | 'register') {
    this.authMode.set(mode);
    this.errorMessage.set(null);
  }
}
