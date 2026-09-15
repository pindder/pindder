import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonButton, IonInput, IonSelectOption, ViewWillEnter, IonSelect } from "@ionic/angular";
import { Gender, IClient } from '@pindder/contracts';
import { ClientService } from '../../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-new-client',
  imports: [
    IonInput,
    IonButton,
    IonSelect,
    IonContent,
    FormsModule,
    IonSelectOption
],
  templateUrl: './new-client.html',
  styleUrl: './new-client.css',
})
export class NewClient implements ViewWillEnter{
  private clientService = inject(ClientService);

  client: IClient = {
    firstname: '',
    lastname: '',
    email: '',
    phoneNo: '',
    referee: '',
    gender: '',
    address: '',
  };
  genders: string[] = Object.keys(Gender);
  
  ionViewWillEnter(): void { }

  submit() {
    this.clientService.createClient(this.client).subscribe((val) => {
      console.log(val);
    }, (error: HttpErrorResponse) => {
      console.log(error);
    })
  }
}
