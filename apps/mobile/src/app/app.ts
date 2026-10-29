import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
// import { NxWelcome } from './nx-welcome';
import { IonRouterOutlet, IonApp } from "@ionic/angular";
import { SplashScreen } from '@capacitor/splash-screen';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  imports: [IonApp, RouterModule, IonRouterOutlet],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit{
  protected title = 'mobile';
  private router = inject(Router);

  async ngOnInit() {
    await SplashScreen.hide();

    // 1. Request notification permission from the user
    const permission = await LocalNotifications.requestPermissions();
    if (permission.display !== 'granted') {
      console.warn('User denied notification permissions!');
    }

    // 2. Listen for when the user TAPS the notification banner
    LocalNotifications.addListener('localNotificationActionPerformed', (event) => {
      const route = event.notification.extra?.route;
      
      if (route) {
        // Automatically route the user inside the app!
        this.router.navigateByUrl(route);
      }
    });
  }
}
