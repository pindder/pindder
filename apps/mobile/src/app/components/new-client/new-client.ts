import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonContent, IonLabel, IonButton, IonInput, IonFooter } from "@ionic/angular";
import { IProfile } from '@pindder/contracts';

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
    IonFooter
],
  templateUrl: './new-client.html',
  styleUrl: './new-client.css',
})
export class NewClient implements OnInit{
  profile!: IProfile;

  ngOnInit(): void {
    this.profile = {
      firstname: "",
      lastname: "",
      email: "",
      phoneNo: "",
      address: ""
    }  
  }

  submit() {}
}
