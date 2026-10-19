import { DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, 
  IonButton, IonCardContent, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonIcon,
  ViewWillEnter,
  AlertController
} from '@ionic/angular';
import { SubscriptionService } from '../../services/subscription.service';
import { IPayment, IPlan, IResponse } from '@pindder/contracts';
import { HttpErrorResponse } from '@angular/common/http';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-premium',
  imports: [IonHeader, 
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonButton, IonCardContent, DecimalPipe, IonIcon, 
  ],
  templateUrl: './premium.html',
  styleUrl: './premium.css',
})
export class Premium implements ViewWillEnter{
  private subscriptionService = inject(SubscriptionService);
  private cdr = inject(ChangeDetectorRef);
  private alertController = inject(AlertController);

  packages: IPlan[] = [];
  selectedPackage!: IPlan;

  ionViewWillEnter(): void {
    this.fetchPlans();
  }

  async presentPaymentAlert(authorizationUrl: string) {
    const alert = await this.alertController.create({
      header: 'Proceed to Payment',
      message: 'You are about to be redirected to Paystack to complete your secure payment for.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Proceed',
          handler: async () => {
            // Open Paystack external checkout page safely inside the app/device browser
            await Browser.open({ url: authorizationUrl });
          },
        },
      ],
    });

    await alert.present();
    this.cdr.markForCheck();
  }

  fetchPlans() {
    this.subscriptionService.fetchPlans().subscribe({
      next: (response: IResponse<any>) => {
        //console.log(response);
        this.packages = response.data;
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }

  fetchCurrentPlan() {
    return;
  }

  onSelectPlan(pkg: IPlan) {
    this.selectedPackage = pkg;
    const paymentObj: IPayment = {
      plan_id: pkg.plan_id,
      callbackUrl: 'https://evident-floors-lcd-medium.trycloudflare.com/app/dashboard'
      
    };

    this.subscriptionService.subscribe(paymentObj).subscribe({
      next: (response: IResponse<any>) => {
        console.log(response.data);
        this.presentPaymentAlert(response.data.authorization_url);
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    })
  }
}
