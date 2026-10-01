import { ChangeDetectorRef, Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonContent, IonList, IonItem, IonInput, 
  ViewWillEnter, IonButton, IonSelect, IonSelectOption, IonButtons, 
  IonTitle, IonBackButton, IonSpinner, IonIcon, IonActionSheet, 
  IonLabel, 
  ModalController
} from '@ionic/angular';
import { Gender, IClient, IResponse } from '@pindder/contracts';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Measurement } from '../../components/measurement/measurement';
import { PrimaryButton } from '../../components/primary-button/primary-button';
import { ClientOrders } from '../../components/client-orders/client-orders';

@Component({
  imports: [
    IonActionSheet, IonIcon, IonSpinner, IonButtons, 
    IonBackButton, IonTitle,
    IonContent, IonHeader, IonToolbar,
    IonList, IonItem, IonInput, FormsModule,
    IonButton, IonSelect, IonSelectOption,
    IonSpinner, IonIcon, Measurement,
    IonIcon, IonLabel, PrimaryButton
  ],
  templateUrl: './client-view.html',
  styleUrl: './client-view.css',
})
export class ClientView implements ViewWillEnter, OnInit{
  private ar = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private clientService = inject(ClientService);
  private router = inject(Router);
  private modalCtrl = inject(ModalController);

  client!: IClient;
  client_id!: string;
  genders: string[] = Object.keys(Gender);
  canDismiss = signal<boolean>(false);
  presentingElement!: HTMLElement | null;
  measurements: any;
  isActionSheetOpen = signal<boolean>(false);
  modalContent = signal<string>("");
  actionSheetButtons = [
    {
      text: 'Create Measurement',
      icon: 'add-outline',
      handler: () => {
        this.openMeasurementModal();
      },
    },
    {
      text: 'Create Order',
      icon: 'bag-add-outline',
      handler: () => {
        this.router.navigate(['app/orders'], {
          queryParams: {
            client: this.client_id
          }
        })
      },
    },
    {
      text: 'Delete Client',
      icon: 'trash-outline',
      // role: 'destructive',
      handler: () => {
    
      },
    },
  ];

  ionViewWillEnter(): void {
    this.presentingElement = document.querySelector('.ion-page');
    this.client_id = this.ar.snapshot.params['id'];
    this.fetchClient();
  }

  ngOnInit(): void {
    
  }

  fetchClient() {
    this.clientService.fetchClient(this.client_id).subscribe({
      next: (res: IResponse<any>) => {
        this.client = res.data;
        this.measurements = res.data.measurements;
        //console.log(res.data);
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error)
      }
    });
  }

  async openActionSheet() {
    this.isActionSheetOpen.set(true);
  }

  async openMeasurementModal() {
    const modal = await this.modalCtrl.create({
      component: Measurement,
      componentProps: {
        client_id: this.client_id,
        client_gender: this.client.gender
      }
    });

    await modal.present();
  }

  async openOrdersModal() {
    const modal = await this.modalCtrl.create({
      component: ClientOrders,
      componentProps: {
        client_id: this.client_id
      }
    });

    await modal.present();

    //Listen for the dismiss 
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.router.navigate(['app/orders/'], {
        queryParams: {
          client: data
        }
      });
    }

    this.cdr.markForCheck();
  }

  submit() {
    this.clientService.updateClient(this.client._id!, this.client).subscribe({
      next: (res: IResponse<any>) => {
        this.client = res.data;
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }
}
