import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonIcon } from '@ionic/angular';
import { AccountTypes } from '@pindder/contracts';
//import { AppButton } from '@pindder/shared-ui';

@Component({
  selector: 'app-hero',
  imports: [IonIcon, /* RouterLink, AppButton*/ ],
  templateUrl: './hero.html',
  styleUrl: './hero.css',
})
export class Hero {
  private router = inject(Router);

  images = ['images/frame_1.png', 'images/frame_2.png', 'images/frame_4.png', 'images/frame_3.png'];

  gotoSignIn() {
    this.router.navigate([`auth/login`], {
      queryParams: {
        type: AccountTypes.USER
      }
    });
  }
}
