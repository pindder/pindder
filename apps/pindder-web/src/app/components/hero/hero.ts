import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { AccountTypes } from '@pindder/contracts';
import { AppButton } from '@pindder/shared-ui';

@Component({
  selector: 'app-hero',
  imports: [IonIcon, RouterLink, AppButton],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  private router = inject(Router);

  gotoSignIn() {
    this.router.navigate([`auth/login`], {
      queryParams: {
        type: AccountTypes.USER
      }
    });
  }
}
