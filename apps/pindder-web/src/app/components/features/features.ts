import { Component, OnInit } from '@angular/core';
import { IonIcon, IonButton } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';

export interface IFeatures {
  id: string;
  title: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-features',
  imports: [IonButton, IonIcon],
  templateUrl: './features.html',
  styleUrl: './features.css',
})
export class Features implements OnInit{
  features: IFeatures[] = [];
  platform = Capacitor.getPlatform();; 
  url!: string;

  ngOnInit(): void {
    this.features = [
      { 
        id: '1', 
        title: 'Streamline Orders', 
        icon: 'color-filter', 
        description: 'Simplify your order process – easily organize and manage your fashion orders hassle-free with our user-friendly system.' 
      },
      { 
        id: '2', 
        title: 'Effortless Order Collection', 
        icon: 'bag-handle', 
        description: 'Seamlessly gather and receive orders from clients with our user-friendly system, making order collections a breeze for fashion designers.' 
      },
      { 
        id: '3', 
        title: 'Robust data management', 
        icon: 'server', 
        description: 'Easily keep track of your client details and preferences with our powerful customer data management system.'
      }
    ]

    if (this.platform === 'ios') {
      this.url = 'https://apps.apple.com/us/app/pindder/id6797538451'; 
    } else if(this.platform === 'android') {
      this.url = 'https://play.google.com/store/apps/details?id=com.pindder.app&hl=en';
    } else if(this.platform === 'web') {
      // Running in a browser: check device OS for store routing
      const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
      if (/iPhone|iPad|iPod/i.test(ua)) {
        this.url = 'https://apps.apple.com/us/app/pindder/id6797538451'; 
      }
      if (/Android/i.test(ua)) {
        this.url = 'https://play.google.com/store/apps/details?id=com.pindder.app&hl=en'; 
      }
      console.log(ua);
    };
    // console.log(this.url);
  }

  launchStore() {
    Browser.open({
      url: this.url,
      presentationStyle: 'fullscreen',
    });
  }
}
