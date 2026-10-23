import { Component, inject, signal } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ILogin, IResponse } from '@pindder/contracts';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginData: ILogin = {
    email: '',
    password: '',
    rememberMe: false
  };

  isDarkMode = signal<boolean>(true);
  authMode = signal<'login' | 'register'>('login');
  showPassword = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);

  toggleTheme() {
    this.isDarkMode.update((val) => !val);
  }

  setAuthMode(mode: 'login' | 'register') {
    this.authMode.set(mode);
    this.errorMessage.set(null);
  }

  togglePasswordVisibility() {
    this.showPassword.update((val) => !val);
  }

  handleLogin(event: Event) {
    event.preventDefault();
    this.errorMessage.set(null);
    this.isLoading.set(true);

    // setTimeout(() => {
    //   this.isLoading.set(false);
    //   if (this.loginPassword.length < 6) {
    //     this.errorMessage.set('Invalid credentials provided. Please check your password.');
    //   } else {
    //     alert('Signed in successfully!');
    //   }
    // }, 1200);

    this.authService.login(this.loginData).subscribe({
      next: (response: IResponse<any>) => {
        if(response.data) {
          console.log(response.data);
          this.isLoading.set(false);
          sessionStorage.setItem('token', response.data.token);
          sessionStorage.setItem('user', JSON.stringify(response.data));
          sessionStorage.setItem('isLoggedIn', JSON.stringify(true));
          this.router.navigate(['app/dashboard']);
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.isLoading.set(false);
      },
      complete: () => {
        console.log();
      }
    })
  }
}
