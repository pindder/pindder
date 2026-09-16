import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { IonTitle, IonHeader, IonToolbar, IonButtons, IonBackButton, IonList, IonContent } from "@ionic/angular";
import { DataTypes, IClient } from '@pindder/contracts';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ViewWillEnter } from '@ionic/angular';
import { ListCard } from '../../components/list-card/list-card';

@Component({
  selector: 'app-clients',
  imports: [IonList, IonContent, IonBackButton, IonButtons, IonToolbar, IonHeader, IonTitle, ListCard, IonList],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements ViewWillEnter{
  private clientService = inject(ClientService);
  private cdr = inject(ChangeDetectorRef);

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
}
