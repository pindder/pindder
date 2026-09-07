import { DragDropModule } from '@angular/cdk/drag-drop';
import { Component, EnvironmentInjector, inject, signal } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar,
  IonFabButton, IonFab, IonIcon, IonButton, IonModal,
  IonItem, IonList, IonButtons, IonAvatar, IonLabel, IonActionSheet
} from "@ionic/angular";

@Component({
  selector: 'app-dashboard',
  imports: [IonActionSheet, IonLabel, IonAvatar, IonModal, IonButton, IonButtons, IonList, IonItem, 
    IonIcon, 
    IonFab, 
    IonFabButton, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    DragDropModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  public environmentInjector = inject(EnvironmentInjector);

  presentingElement!: HTMLElement | null;
  public isActionSheetOpen = signal<boolean>(false);
  public isModalOpen = signal<boolean>(false);
  public actionSheetButtons = [
    {
      text: 'New Client',
      icon: 'clipboard-outline',
      handler: () => {

      },
      // role: 'destructive',
      data: {
        action: 'create',
      },
    },
    {
      text: 'New Style',
      icon: 'color-palette-outline',
      handler: () => {
        this.isModalOpen.set(true);
      },
    },
    {
      text: 'New Order',
      icon: 'cart-outline',
      handler: () => {

      },
    },
    // {
    //   text: 'Cancel',
    //   role: 'cancel',
    //   data: {
    //     action: 'cancel',
    //   },
    // },
  ];

  ngOnInit(): void {
    this.presentingElement = document.querySelector('.ion-page');
  }

  async openActionSheet() {
    this.isActionSheetOpen.set(true);
  }
}
