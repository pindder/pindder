import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton, IonContent, IonIcon } from '@ionic/angular';

@Component({
  selector: 'app-onboarding',
  imports: [IonContent, IonIcon, IonButton],
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.css',
})
export class Onboarding {
  private router = inject(Router);

  finishOnboarding() {
    // Save state so it doesn't show again on next app open
    localStorage.setItem('onboarded', 'true');
    
    // Navigate to your login, dashboard, or home route
    this.router.navigateByUrl('auth/login', { replaceUrl: true });
  }
}
