import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, 
  ViewWillEnter, AlertController
} from '@ionic/angular';
import { SubscriptionService } from '../../services/subscription.service';
import { DataTypes, IPayment, IPlan, IResponse } from '@pindder/contracts';
import { HttpErrorResponse } from '@angular/common/http';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { AppService } from '../../services/app.service';
import { TokenService } from '../../services/token.service';
import { PricingCard } from '@pindder/shared-ui';

@Component({
  selector: 'app-premium',
  imports: [IonHeader, 
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent, PricingCard
  ],
  templateUrl: './premium.html',
  styleUrl: './premium.css',
})
export class Premium implements ViewWillEnter{
  private appService = inject(AppService);
  private tokenService = inject(TokenService);
  private subscriptionService = inject(SubscriptionService);
  private cdr = inject(ChangeDetectorRef);
  private alertController = inject(AlertController);

  packages: IPlan[] = [];
  selectedPackage!: IPlan;
  isAuthenticated!: boolean;
  isNative!: boolean;

  async ionViewWillEnter() {
    this.fetchPlans();
    this.isAuthenticated = await this.tokenService.isAuthenticated();
    this.isNative = Capacitor.isNativePlatform();
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

  async initSub(plan_id: string) {
    console.log("This is native platform:::", Capacitor.isNativePlatform());
    if(Capacitor.isNativePlatform()) {
      return;
    } else {
      this.createCheckoutSession(plan_id);
    }
  }

  async createCheckoutSession(plan_id: string) {
    const res: any = await this.appService.stripeCheckoutSession(DataTypes.SUBSCRIPTION, plan_id);

    // console.log(res);
    if (res && res.url) {
      console.log(res)
      window.location.href = res.url;
    }
  }
}
