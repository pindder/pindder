import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonButton, IonInput, IonFooter, IonSelectOption } from "@ionic/angular";
import { IClient } from '@pindder/contracts';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-client',
  imports: [
    IonInput,
    IonButton,
    // IonList,
    // IonAvatar,
    // IonItem,
    IonLabel,
    IonContent,
    FormsModule,
    IonFooter,
    IonSelectOption
],
  templateUrl: './new-client.html',
  styleUrl: './new-client.css',
})
export class NewClient implements OnInit{
  private clientService = inject(ClientService);

  client!: IClient;

  ngOnInit(): void {
    this.client = {
      firstname: "",
      lastname: "",
      email: "",
      phoneNo: "",
      address: "",
      gender: ""
    };  
  }

  submit() {
    this.clientService.createClient(this.client).subscribe((val) => {
      console.log(val);
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }
}
