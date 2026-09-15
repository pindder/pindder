import { Component, inject } from '@angular/core';
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

  clients: IClient[] =  [];
  dataTypes = DataTypes;

  ionViewWillEnter() {
    this.fetchClients();
  }

  ngOnInit(): void {
    console.log(this.clients);
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
