import { ChangeDetectorRef, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IonHeader, IonToolbar, IonContent, IonList, IonItem, IonInput, ViewWillEnter, 
  IonButton, IonSelect, IonSelectOption, IonButtons, IonTitle, IonBackButton, IonModal, 
  IonSpinner, IonIcon, IonActionSheet,
} from '@ionic/angular';
import { Gender, IClient } from '@pindder/contracts';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Measurement } from '../../components/measurement/measurement';

@Component({
  imports: [IonActionSheet, IonIcon, IonSpinner, IonButtons, IonBackButton, IonTitle,
    IonContent, IonHeader, IonToolbar,
    IonList, IonItem, IonInput, FormsModule,
    IonButton, IonSelect, IonSelectOption,
    IonModal, IonSpinner, IonIcon,
    IonModal, IonIcon, Measurement
  ],
  templateUrl: './client-view.html',
  styleUrl: './client-view.css',
})
export class ClientView implements ViewWillEnter, OnInit{
  @ViewChild('modal') modal!: IonModal;

  private ar = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  private clientService = inject(ClientService);
  private router = inject(Router);

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
        this.modal.present();
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
      text: 'Remove Client',
      icon: 'trash-outline',
      role: 'destructive',
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
      next: (res) => {
        this.client = res.client;
        this.measurements = res.measurements;
        console.log(res);
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

  submit() {

  }
}
