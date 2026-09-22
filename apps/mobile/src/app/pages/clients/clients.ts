import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { IonTitle, IonHeader, IonToolbar, IonButtons, IonBackButton, IonList, IonContent,
  IonButton, IonIcon,
  ModalController
} from "@ionic/angular";
import { DataTypes, IClient } from '@pindder/contracts';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ViewWillEnter } from '@ionic/angular';
import { ListCard } from '../../components/list-card/list-card';
import { NewClient } from '../../components/new-client/new-client';

@Component({
  selector: 'app-clients',
  imports: [
    IonIcon,
    IonButton, 
    IonList, 
    IonContent, 
    IonBackButton, 
    IonButtons, 
    IonToolbar, 
    IonHeader, 
    IonTitle, 
    ListCard, 
    IonList,
  ],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements ViewWillEnter{
  private clientService = inject(ClientService);
  private cdr = inject(ChangeDetectorRef);
  private modalCtrl = inject(ModalController);

  clients: IClient[] =  [];
  dataTypes = DataTypes;

  ionViewWillEnter() {
    this.fetchClients();
  }

  fetchClients() {
    this.clientService.fetchClients().subscribe({
      next: (data) => {
        console.log(data),
        this.clients = data;
        this.cdr.markForCheck();
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
      }
    });
  }

  updateClientsList(client: IClient) {
    const index = this.clients.findIndex(cl => cl._id === client._id);
    this.clients.splice(index, 1);
  }

  async openNewClientModal() {
    const modal = await this.modalCtrl.create({
      component: NewClient, // Standalone modal component for searching clients
      componentProps: {
        origin: DataTypes.CLIENT
      }
    });

    await modal.present();

    //Listen for the selected client payload when dismissed
    const { data, role } = await modal.onWillDismiss();
    if (role === 'selected' && data) {
      this.clients.push(data);
      this.cdr.markForCheck();
    }
  }
}
