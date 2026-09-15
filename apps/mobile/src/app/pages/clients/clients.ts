import { Component, inject } from '@angular/core';
import { IonTitle, IonHeader, IonToolbar, IonButtons, IonBackButton, IonContent } from "@ionic/angular";
import { IClient } from '@pindder/contracts';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-clients',
  imports: [IonContent, IonBackButton, IonButtons, IonToolbar, IonHeader, IonTitle],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class Clients implements ViewWillEnter{
  private clientService = inject(ClientService);

  clients!: IClient;

  ionViewWillEnter() {
    this.fetchClients();
  }

  fetchClients() {
    this.clientService.fetchClients().subscribe((val) => {
      console.log(val);
      this.clients = val;
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }
}
